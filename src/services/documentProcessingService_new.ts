import { supabase } from "@/lib/supabase";
import { AIContingencyService } from "./aiContingencyService";

// Definir o tipo AIRequest local
interface AIRequest {
  prompt: string;
  type: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  userId?: string;
  context?: string;
}

export interface DocumentProcessingJob {
  id: string;
  fileName: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  extractedData?: {
    brandVoices?: Array<{
      name: string;
      tone: string;
      style: string;
      description: string;
    }>;
    personas?: Array<{
      name: string;
      description: string;
      age_range?: string;
      occupation?: string;
    }>;
    campaigns?: Array<{
      name: string;
      description: string;
      target_audience?: string;
    }>;
  };
  error?: string;
}

export class DocumentProcessingService {
  private aiService: AIContingencyService;

  constructor() {
    this.aiService = new AIContingencyService();
  }

  private async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const content = e.target?.result as string;

        try {
          if (file.type === "application/pdf") {
            // Para PDF, precisaríamos de uma lib como pdf-parse
            // Por ora, vamos simular a extração
            resolve(content);
          } else if (file.type.includes("word")) {
            // Para DOCX, precisaríamos de uma lib como mammoth
            // Por ora, vamos simular a extração
            resolve(content);
          } else if (file.type === "text/plain") {
            resolve(content);
          } else {
            reject(new Error("Tipo de arquivo não suportado"));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));

      if (file.type === "text/plain") {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }

  private async analyzeWithAI(text: string): Promise<any> {
    const prompt = `
Analise o seguinte documento e extraia informações estruturadas sobre:

1. Brand Voices (vozes de marca):
   - Nome da voz
   - Tom (formal, casual, amigável, etc.)
   - Estilo de escrita
   - Descrição

2. Personas (públicos-alvo):
   - Nome da persona
   - Descrição
   - Faixa etária
   - Ocupação
   - Interesses

3. Campanhas:
   - Nome da campanha
   - Descrição
   - Público-alvo

Documento:
${text}

Por favor, retorne um JSON válido com a estrutura:
{
  "brandVoices": [{"name": "", "tone": "", "style": "", "description": ""}],
  "personas": [{"name": "", "description": "", "age_range": "", "occupation": ""}],
  "campaigns": [{"name": "", "description": "", "target_audience": ""}]
}
    `;

    try {
      const request: AIRequest = {
        prompt,
        type: "document_analysis",
      };

      const result = await this.aiService.executeRequest(request);

      // Parse do resultado da IA
      let parsedResult;
      const resultText =
        typeof result === "string"
          ? result
          : result.content || JSON.stringify(result);

      try {
        // Tentar fazer parse direto
        parsedResult = JSON.parse(resultText);
      } catch {
        // Se falhar, tentar extrair JSON do texto
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error(
            "Não foi possível extrair JSON válido da resposta da IA"
          );
        }
      }

      return parsedResult;
    } catch (error) {
      console.error("Erro na análise com IA:", error);
      throw error;
    }
  }

  async processDocument(file: File, workspaceId?: string): Promise<string> {
    try {
      // Obter usuário atual
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Usuário não autenticado");
      }

      // Criar job no banco
      const { data: job, error: jobError } = await supabase
        .from("document_processing_jobs")
        .insert({
          user_id: user.id,
          workspace_id: workspaceId || null,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          status: "pending",
        })
        .select()
        .single();

      if (jobError || !job) {
        throw new Error("Erro ao criar job de processamento");
      }

      // Processar em background
      this.processInBackground(job.id, file);

      return job.id;
    } catch (error) {
      console.error("Erro ao processar documento:", error);
      throw error;
    }
  }

  private async processInBackground(jobId: string, file: File) {
    try {
      // Atualizar status para processando
      await supabase
        .from("document_processing_jobs")
        .update({
          status: "processing",
          progress: 10,
          processing_started_at: new Date().toISOString(),
        })
        .eq("id", jobId);

      // Extrair texto
      const text = await this.extractTextFromFile(file);

      await supabase
        .from("document_processing_jobs")
        .update({ progress: 50 })
        .eq("id", jobId);

      // Analisar com IA
      const extractedData = await this.analyzeWithAI(text);

      // Completar job
      await supabase
        .from("document_processing_jobs")
        .update({
          status: "completed",
          progress: 100,
          extracted_data: extractedData,
          processing_completed_at: new Date().toISOString(),
        })
        .eq("id", jobId);
    } catch (error) {
      console.error("Erro no processamento:", error);

      // Marcar como falhou
      await supabase
        .from("document_processing_jobs")
        .update({
          status: "failed",
          error_message:
            error instanceof Error ? error.message : "Erro desconhecido",
        })
        .eq("id", jobId);
    }
  }

  async getJobStatus(jobId: string): Promise<DocumentProcessingJob | null> {
    try {
      const { data, error } = await supabase
        .from("document_processing_jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        fileName: data.file_name,
        status: data.status,
        progress: data.progress,
        extractedData: data.extracted_data,
        error: data.error_message,
      };
    } catch (error) {
      console.error("Erro ao buscar status do job:", error);
      return null;
    }
  }

  // Método para listar jobs do usuário
  async getUserJobs(limit: number = 10): Promise<DocumentProcessingJob[]> {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        return [];
      }

      const { data, error } = await supabase
        .from("document_processing_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Erro ao buscar jobs do usuário:", error);
        return [];
      }

      return data.map((job) => ({
        id: job.id,
        fileName: job.file_name,
        status: job.status,
        progress: job.progress,
        extractedData: job.extracted_data,
        error: job.error_message,
      }));
    } catch (error) {
      console.error("Erro ao buscar jobs do usuário:", error);
      return [];
    }
  }
}

// Export da instância do serviço
export const documentProcessingService = new DocumentProcessingService();
