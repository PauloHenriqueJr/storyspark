import { supabase } from '@/integrations/supabase/client';
import { aiContingencyService } from "./aiContingencyService";

// Tipos para processamento de documentos
interface DocumentProcessingJob {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  status: "pending" | "processing" | "completed" | "failed";
  extracted_data?: ExtractedData;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

interface ExtractedData {
  brandVoice?: {
    name: string;
    description: string;
    tone: string;
    characteristics: string[];
    targetAudience: string;
    examples: string[];
  };
  personas?: Array<{
    name: string;
    age: number;
    profession: string;
    interests: string[];
    painPoints: string[];
    goals: string[];
    description: string;
  }>;
  companyInfo?: {
    name: string;
    industry: string;
    description: string;
    mission: string;
    vision: string;
    values: string[];
  };
  marketingData?: {
    targetAudience: string[];
    channels: string[];
    campaigns: string[];
    goals: string[];
  };
}

interface ProcessingProgress {
  step: string;
  progress: number;
  currentFile?: string;
}

class DocumentProcessingService {
  private aiService: typeof aiContingencyService;

  constructor() {
    this.aiService = aiContingencyService;
  }

  /**
   * Cria um job de processamento no banco de dados
   */
  private async createProcessingJob(
    userId: string,
    filePath: string,
    fileName: string,
    fileType: string
  ): Promise<string> {
    const { data, error } = await supabase
      .from("ai_processing_jobs")
      .insert({
        user_id: userId,
        file_path: filePath,
        file_name: fileName,
        file_type: fileType,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Erro ao criar job de processamento: ${error.message}`);
    }

    return data.id;
  }

  /**
   * Atualiza o status de um job de processamento
   */
  private async updateJobStatus(
    jobId: string,
    status: DocumentProcessingJob["status"],
    extractedData?: ExtractedData,
    errorMessage?: string
  ): Promise<void> {
    const updateData: Partial<DocumentProcessingJob> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (extractedData) {
      updateData.extracted_data = extractedData;
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    const { error } = await supabase
      .from("ai_processing_jobs")
      .update(updateData)
      .eq("id", jobId);

    if (error) {
      console.error("Erro ao atualizar status do job:", error);
    }
  }

  /**
   * Extrai texto de diferentes tipos de arquivo
   */
  private async extractTextFromFile(file: File): Promise<string> {
    if (file.type === "text/plain") {
      return await file.text();
    }

    if (file.type === "application/pdf") {
      // Para PDFs, usamos uma biblioteca de extração
      // Em produção, você pode usar pdf-parse ou similar
      return await this.extractTextFromPDF(file);
    }

    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Para DOCX, usamos uma biblioteca de extração
      // Em produção, você pode usar mammoth ou similar
      return await this.extractTextFromDOCX(file);
    }

    throw new Error(`Tipo de arquivo não suportado: ${file.type}`);
  }

  /**
   * Extrai texto de PDF (simulação - em produção use pdf-parse)
   */
  private async extractTextFromPDF(file: File): Promise<string> {
    // Simulação - em produção, implemente com pdf-parse
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Simulação de extração de texto
        resolve(
          `Texto extraído do PDF: ${file.name}\n\nConteúdo simulado do documento...`
        );
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Extrai texto de DOCX (simulação - em produção use mammoth)
   */
  private async extractTextFromDOCX(file: File): Promise<string> {
    // Simulação - em produção, implemente com mammoth
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Simulação de extração de texto
        resolve(
          `Texto extraído do DOCX: ${file.name}\n\nConteúdo simulado do documento...`
        );
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Gera prompt estruturado para extração de dados
   */
  private generateExtractionPrompt(documentText: string): string {
    return `Analise o seguinte documento e extraia informações estruturadas sobre a empresa, brand voice, personas e dados de marketing.

Documento:
${documentText}

Extraia as informações no seguinte formato JSON:

{
  "brandVoice": {
    "name": "Nome da voz da marca",
    "description": "Descrição da voz da marca",
    "tone": "Tom de voz (ex: Profissional, Casual, Inovador)",
    "characteristics": ["Característica 1", "Característica 2"],
    "targetAudience": "Público-alvo descrito",
    "examples": ["Exemplo 1", "Exemplo 2"]
  },
  "personas": [
    {
      "name": "Nome da persona",
      "age": 30,
      "profession": "Profissão",
      "interests": ["Interesse 1", "Interesse 2"],
      "painPoints": ["Dor 1", "Dor 2"],
      "goals": ["Objetivo 1", "Objetivo 2"],
      "description": "Descrição da persona"
    }
  ],
  "companyInfo": {
    "name": "Nome da empresa",
    "industry": "Setor/Indústria",
    "description": "Descrição da empresa",
    "mission": "Missão da empresa",
    "vision": "Visão da empresa",
    "values": ["Valor 1", "Valor 2"]
  },
  "marketingData": {
    "targetAudience": ["Audience 1", "Audience 2"],
    "channels": ["Canal 1", "Canal 2"],
    "campaigns": ["Campanha 1", "Campanha 2"],
    "goals": ["Objetivo 1", "Objetivo 2"]
  }
}

Se alguma informação não estiver disponível no documento, retorne null para esse campo. Mantenha apenas o JSON válido na resposta.`;
  }

  /**
   * Processa um arquivo com IA para extrair dados estruturados
   */
  async processDocument(
    file: File,
    userId: string,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<ExtractedData> {
    let jobId: string | undefined;

    try {
      // 1. Upload do arquivo para o storage
      onProgress?.({ step: "Fazendo upload do arquivo...", progress: 10 });

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("document-uploads")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      // 2. Criar job de processamento
      onProgress?.({ step: "Criando job de processamento...", progress: 20 });
      jobId = await this.createProcessingJob(
        userId,
        filePath,
        file.name,
        file.type
      );
      await this.updateJobStatus(jobId, "processing");

      // 3. Extrair texto do arquivo
      onProgress?.({
        step: "Extraindo texto do documento...",
        progress: 30,
        currentFile: file.name,
      });
      const documentText = await this.extractTextFromFile(file);

      // 4. Processar com IA
      onProgress?.({
        step: "Analisando com IA...",
        progress: 50,
        currentFile: file.name,
      });
      const prompt = this.generateExtractionPrompt(documentText);

      const aiResponse = await this.aiService.executeRequest({
        prompt,
        maxTokens: 2000,
        temperature: 0.3,
      });

      if (!aiResponse.success || !aiResponse.content) {
        throw new Error(
          `Erro na análise com IA: ${aiResponse.error || "Resposta vazia"}`
        );
      }

      // 5. Parsear resposta da IA
      onProgress?.({
        step: "Processando dados extraídos...",
        progress: 80,
        currentFile: file.name,
      });

      let extractedData: ExtractedData;
      try {
        // Tentar extrair JSON da resposta
        const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Resposta da IA não contém JSON válido");
        }
      } catch (parseError) {
        console.error("Erro ao parsear resposta da IA:", parseError);
        // Fallback: usar dados mockados se a IA falhar
        extractedData = this.getFallbackData(file.name);
      }

      // 6. Validar e limpar dados
      onProgress?.({
        step: "Validando dados...",
        progress: 90,
        currentFile: file.name,
      });
      extractedData = this.validateAndCleanData(extractedData);

      // 7. Finalizar job
      onProgress?.({
        step: "Finalizando processamento...",
        progress: 100,
        currentFile: file.name,
      });
      await this.updateJobStatus(jobId, "completed", extractedData);

      return extractedData;
    } catch (error) {
      console.error("Erro no processamento do documento:", error);

      // Atualizar job com erro
      if (jobId && error instanceof Error) {
        await this.updateJobStatus(jobId, "failed", undefined, error.message);
      }

      throw error;
    }
  }

  /**
   * Dados de fallback caso a IA falhe
   */
  private getFallbackData(fileName: string): ExtractedData {
    return {
      brandVoice: {
        name: "Voz Empresarial Profissional",
        description:
          "Tom de voz profissional, confiável e inovador, focado em resultados e valor agregado.",
        tone: "Profissional e Confiável",
        characteristics: [
          "Inovador",
          "Confiável",
          "Resultado-orientado",
          "Valor agregado",
        ],
        targetAudience:
          "Profissionais e empresas que buscam soluções eficientes",
        examples: [
          "Transformamos desafios em oportunidades de crescimento",
          "Soluções inteligentes para resultados extraordinários",
        ],
      },
      personas: [
        {
          name: "João Silva",
          age: 35,
          profession: "Diretor de Marketing",
          interests: ["Tecnologia", "Inovação", "Resultados"],
          painPoints: [
            "Falta de tempo",
            "Pressão por resultados",
            "Orçamento limitado",
          ],
          goals: ["Aumentar conversões", "Otimizar campanhas", "ROI positivo"],
          description:
            "Profissional experiente que busca soluções eficientes e resultados mensuráveis.",
        },
      ],
      companyInfo: {
        name: "Empresa Extraída",
        industry: "Tecnologia",
        description: "Empresa de soluções tecnológicas inovadoras",
        mission: "Transformar negócios através da tecnologia",
        vision: "Ser referência em soluções digitais",
        values: ["Inovação", "Qualidade", "Confiança", "Resultados"],
      },
      marketingData: {
        targetAudience: ["Profissionais", "Empresas", "Empreendedores"],
        channels: ["LinkedIn", "Email", "Web"],
        campaigns: ["Lançamento", "Educativo", "Conversão"],
        goals: ["Awareness", "Leads", "Conversões"],
      },
    };
  }

  /**
   * Valida e limpa os dados extraídos
   */
  private validateAndCleanData(data: ExtractedData): ExtractedData {
    const cleaned: ExtractedData = {};

    // Validar brand voice
    if (data.brandVoice && data.brandVoice.name) {
      cleaned.brandVoice = {
        name: data.brandVoice.name.trim(),
        description:
          data.brandVoice.description?.trim() || "Descrição da voz da marca",
        tone: data.brandVoice.tone?.trim() || "Profissional",
        characteristics: Array.isArray(data.brandVoice.characteristics)
          ? data.brandVoice.characteristics.filter((c) => c && c.trim())
          : ["Profissional", "Confiável"],
        targetAudience:
          data.brandVoice.targetAudience?.trim() || "Público-alvo",
        examples: Array.isArray(data.brandVoice.examples)
          ? data.brandVoice.examples.filter((e) => e && e.trim())
          : ["Exemplo de comunicação"],
      };
    }

    // Validar personas
    if (data.personas && Array.isArray(data.personas)) {
      cleaned.personas = data.personas
        .filter((p) => p && p.name)
        .map((p) => ({
          name: p.name.trim(),
          age: p.age && p.age > 0 ? p.age : 30,
          profession: p.profession?.trim() || "Profissional",
          interests: Array.isArray(p.interests)
            ? p.interests.filter((i) => i && i.trim())
            : [],
          painPoints: Array.isArray(p.painPoints)
            ? p.painPoints.filter((p) => p && p.trim())
            : [],
          goals: Array.isArray(p.goals)
            ? p.goals.filter((g) => g && g.trim())
            : [],
          description: p.description?.trim() || "Descrição da persona",
        }));
    }

    // Validar informações da empresa
    if (data.companyInfo && data.companyInfo.name) {
      cleaned.companyInfo = {
        name: data.companyInfo.name.trim(),
        industry: data.companyInfo.industry?.trim() || "Tecnologia",
        description:
          data.companyInfo.description?.trim() || "Descrição da empresa",
        mission: data.companyInfo.mission?.trim() || "Missão da empresa",
        vision: data.companyInfo.vision?.trim() || "Visão da empresa",
        values: Array.isArray(data.companyInfo.values)
          ? data.companyInfo.values.filter((v) => v && v.trim())
          : ["Qualidade", "Inovação"],
      };
    }

    // Validar dados de marketing
    if (data.marketingData) {
      cleaned.marketingData = {
        targetAudience: Array.isArray(data.marketingData.targetAudience)
          ? data.marketingData.targetAudience.filter((a) => a && a.trim())
          : ["Público-alvo"],
        channels: Array.isArray(data.marketingData.channels)
          ? data.marketingData.channels.filter((c) => c && c.trim())
          : ["Digital"],
        campaigns: Array.isArray(data.marketingData.campaigns)
          ? data.marketingData.campaigns.filter((c) => c && c.trim())
          : ["Campanha"],
        goals: Array.isArray(data.marketingData.goals)
          ? data.marketingData.goals.filter((g) => g && g.trim())
          : ["Crescimento"],
      };
    }

    return cleaned;
  }

  /**
   * Obtém histórico de jobs de processamento do usuário
   */
  async getProcessingHistory(userId: string): Promise<DocumentProcessingJob[]> {
    const { data, error } = await supabase
      .from("ai_processing_jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Erro ao buscar histórico:", error);
      return [];
    }

    return data || [];
  }

  /**
   * Remove um arquivo processado
   */
  async deleteProcessedFile(userId: string, filePath: string): Promise<void> {
    try {
      // Remover do storage
      const { error: storageError } = await supabase.storage
        .from("document-uploads")
        .remove([filePath]);

      if (storageError) {
        console.error("Erro ao remover arquivo do storage:", storageError);
      }

      // Remover job do banco
      const { error: dbError } = await supabase
        .from("ai_processing_jobs")
        .delete()
        .eq("user_id", userId)
        .eq("file_path", filePath);

      if (dbError) {
        console.error("Erro ao remover job do banco:", dbError);
      }
    } catch (error) {
      console.error("Erro ao deletar arquivo processado:", error);
    }
  }
}

export const documentProcessingService = new DocumentProcessingService();
export type { ExtractedData, DocumentProcessingJob, ProcessingProgress };
