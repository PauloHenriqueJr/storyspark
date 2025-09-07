import { aiContingencyService } from "./aiContingencyService";
import { supabase } from "@/lib/supabase";

interface CopyGenerationRequest {
  briefing: string;
  platform: string;
  copyType: string;
  tone?: string;
  target?: string;
  objective?: string;
  additionalContext?: string;
  userId?: string;
}

interface CopyGenerationResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed: number;
  success: boolean;
  error?: string;
}

interface AISettings {
  defaultProvider: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
}

export class CopyGenerationService {
  private settings: AISettings | null = null;

  /**
   * Carrega as configurações de IA do banco de dados
   */
  private async loadAISettings(): Promise<AISettings> {
    if (this.settings) {
      return this.settings;
    }

    try {
      console.log("🔍 Carregando configurações de IA do banco...");
      
      const { data, error } = await supabase
        .from("admin_llm_settings")
        .select(
          "default_provider, temperature, max_tokens, gemini_model, openai_model, anthropic_model, openrouter_model, kilocode_model"
        )
        .single();

      if (error) {
        console.error("❌ Erro ao carregar configurações de IA:", error);
        
        // Fallback temporário para desenvolvimento
        console.warn("⚠️ Usando configurações padrão de fallback");
        this.settings = {
          defaultProvider: "gemini",
          defaultModel: "gemini-2.0-flash-exp",
          temperature: 0.7,
          maxTokens: 1000,
        };
        return this.settings;
      }
      
      console.log("📋 Dados carregados do banco:", data);
      
      // Verificar se há dados válidos
      if (!data || !data.default_provider) {
        console.warn("⚠️ Dados do banco inválidos, usando configurações padrão");
        this.settings = {
          defaultProvider: "gemini",
          defaultModel: "gemini-2.0-flash-exp",
          temperature: 0.7,
          maxTokens: 1000,
        };
        return this.settings;
      }

      // Mapear o modelo baseado no provedor padrão
      let defaultModel = "";
      let provider = data.default_provider;
      
      console.log(`🎯 Provedor configurado: ${provider}`);

      switch (provider) {
        case "openai":
          defaultModel = data.openai_model;
          break;
        case "anthropic":
          defaultModel = data.anthropic_model;
          break;
        case "gemini":
          defaultModel = data.gemini_model;
          break;
        case "openrouter":
          defaultModel = data.openrouter_model;
          break;
        case "kilocode":
          defaultModel = data.kilocode_model;
          break;
        default:
          console.error(`❌ Provedor padrão '${provider}' não é suportado`);
          // Fallback para Gemini se provedor não é suportado
          defaultModel = "gemini-2.0-flash-exp";
          provider = "gemini";
      }

      if (!defaultModel) {
        console.warn(`⚠️ Modelo não configurado para '${provider}', usando padrão`);
        defaultModel = "gemini-2.0-flash-exp";
      }
      
      console.log(`🤖 Modelo selecionado: ${defaultModel}`);

      this.settings = {
        defaultProvider: provider,
        defaultModel,
        temperature: data.temperature || 0.7,
        maxTokens: data.max_tokens || 1000,
      };

      return this.settings;
    } catch (error) {
      console.error("Erro ao carregar configurações de IA:", error);
      throw error;
    }
  }

  /**
   * Gera copy usando IA baseado nos parâmetros fornecidos
   */
  async generateCopy(
    request: CopyGenerationRequest
  ): Promise<CopyGenerationResponse> {
    try {
      console.log("🚀 Iniciando geração de copy...");
      console.log("Briefing:", request.briefing?.substring(0, 100) + "...");
      console.log("Plataforma:", request.platform);
      console.log("Tipo:", request.copyType);
      
      // Carregar configurações de IA dinamicamente
      console.log("🔄 Carregando configurações de IA...");
      const aiSettings = await this.loadAISettings();

      console.log(
        `🤖 Gerando copy usando ${aiSettings.defaultProvider} com modelo ${aiSettings.defaultModel}`
      );

      // Construir prompt estruturado para geração de copy
      console.log("📝 Construindo prompt...");
      const prompt = this.buildPrompt(request);
      
      console.log("Prompt construído (primeiros 200 chars):", prompt.substring(0, 200) + "...");

      // Fazer requisição usando o serviço de contingência de IA
      console.log("🔄 Executando requisição de IA...");
      const response = await aiContingencyService.executeRequest(
        {
          prompt,
          maxTokens: aiSettings.maxTokens,
          temperature: aiSettings.temperature,
          userId: request.userId,
          context: "copy_generation",
        },
        aiSettings.defaultProvider
      ); // Usar o provedor configurado no banco

      console.log(
        `✅ Copy gerada com sucesso! Provedor: ${response.provider}, Modelo: ${response.model}, Tokens: ${response.tokensUsed}`
      );

      return {
        content: response.content,
        provider: response.provider,
        model: response.model,
        tokensUsed: response.tokensUsed,
        success: response.success,
        error: response.error,
      };
    } catch (error) {
      console.error("Erro na geração de copy:", error);
      return {
        content: "",
        provider: "",
        model: "",
        tokensUsed: 0,
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Constrói prompt estruturado para geração de copy
   */
  private buildPrompt(request: CopyGenerationRequest): string {
    let prompt = `Você é um especialista em copywriting e marketing digital. Crie uma copy persuasiva e engajante baseada nas seguintes especificações:

**BRIEFING:**
${request.briefing}

**PLATAFORMA:** ${request.platform}
**TIPO DE COPY:** ${request.copyType}`;

    if (request.tone) {
      prompt += `\n**TOM DE VOZ:** ${request.tone}`;
    }

    if (request.target) {
      prompt += `\n**PÚBLICO-ALVO:** ${request.target}`;
    }

    if (request.objective) {
      prompt += `\n**OBJETIVO:** ${request.objective}`;
    }

    if (request.additionalContext) {
      prompt += `\n**CONTEXTO ADICIONAL:** ${request.additionalContext}`;
    }

    prompt += `

**INSTRUÇÕES:**
1. Crie uma copy otimizada especificamente para ${request.platform}
2. Use um tom ${request.tone || "adequado ao contexto"}
3. Inclua elementos visuais apropriados (emojis, quebras de linha, hashtags quando relevante)
4. Foque na conversão e engajamento
5. Mantenha o comprimento adequado para a plataforma
6. Inclua uma call-to-action clara
7. Use técnicas de copywriting comprovadas

**FORMATO DA RESPOSTA:**
Retorne apenas a copy final, sem explicações adicionais. A copy deve estar pronta para ser publicada diretamente na plataforma especificada.`;

    return prompt;
  }

  /**
   * Gera variações de uma copy existente
   */
  async generateVariations(
    originalCopy: string,
    count: number = 3,
    userId?: string
  ): Promise<CopyGenerationResponse[]> {
    const prompt = `Crie ${count} variações diferentes da seguinte copy, mantendo a essência e objetivo, mas alterando a abordagem, palavras e estrutura:

COPY ORIGINAL:
${originalCopy}

INSTRUÇÕES:
- Mantenha o mesmo objetivo e tom
- Varie a estrutura e palavras
- Mantenha emojis e hashtags relevantes
- Cada variação deve ser única e impactante

Retorne cada variação separada por "---" (três hífens).`;

    try {
      // Carregar configurações de IA dinamicamente
      const aiSettings = await this.loadAISettings();

      const response = await aiContingencyService.executeRequest(
        {
          prompt,
          maxTokens: Math.floor(aiSettings.maxTokens * 1.2), // Um pouco mais para múltiplas variações
          temperature: Math.min(aiSettings.temperature + 0.1, 1.0), // Aumentar criatividade
          userId,
          context: "copy_variations",
        },
        aiSettings.defaultProvider
      ); // Usar o provedor configurado

      // Dividir as variações
      const variations = response.content
        .split("---")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

      return variations.map((content) => ({
        content,
        provider: response.provider,
        model: response.model,
        tokensUsed: Math.floor(response.tokensUsed / variations.length),
        success: true,
      }));
    } catch (error) {
      console.error("Erro na geração de variações:", error);
      return [
        {
          content: "",
          provider: "",
          model: "",
          tokensUsed: 0,
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        },
      ];
    }
  }

  /**
   * Otimiza uma copy existente para melhor performance
   */
  async optimizeCopy(
    copy: string,
    platform: string,
    feedback?: string,
    userId?: string
  ): Promise<CopyGenerationResponse> {
    let prompt = `Otimize a seguinte copy para maximizar engajamento e conversão na plataforma ${platform}:

COPY ATUAL:
${copy}

PLATAFORMA: ${platform}`;

    if (feedback) {
      prompt += `\n\nFEEDBACK/PROBLEMAS IDENTIFICADOS:
${feedback}`;
    }

    prompt += `

INSTRUÇÕES PARA OTIMIZAÇÃO:
1. Melhore o gancho inicial para capturar atenção
2. Fortaleça a proposta de valor
3. Otimize a call-to-action
4. Ajuste para as melhores práticas da plataforma ${platform}
5. Melhore o flow e legibilidade
6. Adicione elementos de urgência/escassez se apropriado
7. Optimize hashtags e emojis

Retorne apenas a copy otimizada, pronta para publicação.`;

    try {
      // Carregar configurações de IA dinamicamente
      const aiSettings = await this.loadAISettings();

      const response = await aiContingencyService.executeRequest(
        {
          prompt,
          maxTokens: aiSettings.maxTokens,
          temperature: Math.max(aiSettings.temperature - 0.1, 0.1), // Reduzir criatividade para otimização
          userId,
          context: "copy_optimization",
        },
        aiSettings.defaultProvider
      ); // Usar o provedor configurado

      return {
        content: response.content,
        provider: response.provider,
        model: response.model,
        tokensUsed: response.tokensUsed,
        success: response.success,
        error: response.error,
      };
    } catch (error) {
      console.error("Erro na otimização de copy:", error);
      return {
        content: "",
        provider: "",
        model: "",
        tokensUsed: 0,
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Força o recarregamento das configurações de IA
   */
  async reloadSettings(): Promise<void> {
    this.settings = null;
  }

  /**
   * Verifica se as configurações de IA estão válidas
   */
  async validateSettings(): Promise<{ valid: boolean; message: string }> {
    try {
      const settings = await this.loadAISettings();
      return {
        valid: true,
        message: `Configurado para usar ${settings.defaultProvider} com modelo ${settings.defaultModel}`,
      };
    } catch (error) {
      return {
        valid: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao validar configurações",
      };
    }
  }
}

// Instância singleton do serviço
export const copyGenerationService = new CopyGenerationService();
export default copyGenerationService;
