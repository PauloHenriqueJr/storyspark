import { supabase } from "@/lib/supabase";

export const testUpload = async (userId: string) => {
  try {
    // Criar um arquivo de teste simples
    const testContent =
      "Este é um documento de teste para verificar o upload com IA.\n\n" +
      "Informações da empresa:\n" +
      "Nome: Empresa Teste Ltda\n" +
      "Setor: Tecnologia\n" +
      "Missão: Transformar negócios através de soluções inovadoras\n" +
      "Visão: Ser referência em inovação tecnológica\n\n" +
      "Personas:\n" +
      "1. Persona Principal:\n" +
      "   - Nome: João Silva\n" +
      "   - Idade: 35 anos\n" +
      "   - Profissão: Diretor de Marketing\n" +
      "   - Interesses: Tecnologia, Inovação, Resultados\n" +
      "   - Pontos de dor: Falta de tempo, Pressão por resultados\n" +
      "   - Objetivos: Aumentar conversões, Otimizar campanhas\n\n" +
      "2. Persona Secundária:\n" +
      "   - Nome: Maria Santos\n" +
      "   - Idade: 28 anos\n" +
      "   - Profissão: Gerente de Vendas\n" +
      "   - Interesses: Vendas, Relacionamento com clientes\n" +
      "   - Pontos de dor: Objetivos de vendas, Concorrência\n" +
      "   - Objetivos: Superar metas, Fidelizar clientes\n\n" +
      "Brand Voice:\n" +
      "Tom: Profissional e Confiável\n" +
      "Características: Inovador, Confiável, Resultado-orientado\n" +
      "Público-alvo: Profissionais e empresas que buscam soluções eficientes\n\n" +
      "Marketing:\n" +
      "Canais: LinkedIn, Email, Web\n" +
      "Campanhas: Lançamento, Educativo, Conversão\n" +
      "Objetivos: Awareness, Leads, Conversões";

    const blob = new Blob([testContent], { type: "text/plain" });
    const file = new File([blob], "teste_documento.txt", {
      type: "text/plain",
    });

    // Fazer upload do arquivo
    const fileName = `teste-${Date.now()}.txt`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("document-uploads")
      .upload(filePath, file);

    if (error) {
      console.error("Erro no upload:", error);
      return { success: false, error: error.message };
    }

    console.log("Upload bem-sucedido:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao testar upload:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};
