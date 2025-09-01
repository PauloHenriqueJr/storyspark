import { supabase } from "@/lib/supabase";
import { documentProcessingService } from "@/services/documentProcessingService";

export const testDocumentProcessing = async (userId: string) => {
  try {
    // Criar um documento de teste
    const testContent = `
      Documento de Teste para Processamento com IA
      
      Empresa: Tech Solutions Ltda
      Setor: Tecnologia e Inovação
      Missão: Desenvolver soluções tecnológicas que transformam negócios
      Visão: Ser líder global em soluções de automação empresarial
      
      Persona Principal:
      - Nome: Carlos Mendes
      - Idade: 42 anos
      - Cargo: CTO de startups
      - Interesses: Inteligência Artificial, Automação, Escalabilidade
      - Desafios: Recrutamento de talentos, Gestão de infraestrutura
      - Objetivos: Reduzir custos operacionais, Aumentar eficiência
      
      Brand Voice:
      - Tom: Profissional e Inovador
      - Estilo: Direto e técnico
      - Características: Confiável, Visionário, Pragmático
      - Público-alvo: Executivos de tecnologia e startups
      
      Estratégia de Marketing:
      - Canais: LinkedIn, GitHub, Conferências técnicas
      - Campanhas: Webinars técnicos, Cases de sucesso, Whitepapers
      - Objetivos: Thought leadership, Geração de leads qualificados
    `;

    const blob = new Blob([testContent], { type: "text/plain" });
    const file = new File([blob], "documento_teste.txt", {
      type: "text/plain",
    });

    // Processar o documento com IA
    console.log("Iniciando processamento do documento...");

    const extractedData = await documentProcessingService.processDocument(
      file,
      userId,
      (progress) => {
        console.log(`Progresso: ${progress.progress}% - ${progress.step}`);
      }
    );

    console.log("Documento processado com sucesso!", extractedData);
    return { success: true, data: extractedData };
  } catch (error) {
    console.error("Erro no processamento do documento:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};
