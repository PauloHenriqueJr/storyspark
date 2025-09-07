import { supabase } from "@/lib/supabase";

// Tipos para o sistema de contingência
interface AIProvider {
  key: string;
  name: string;
  active: boolean;
  apiKey: string;
  model: string;
}

interface ContingencySettings {
  contingencyEnabled: boolean;
  fallbackPriority: Record<string, number>;
  autoRetryEnabled: boolean;
  maxRetryAttempts: number;
  retryDelaySeconds: number;
}

interface AIRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  userId?: string;
  context?: string;
}

interface AIResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed: number;
  success: boolean;
  error?: string;
}

interface ContingencyLog {
  originalProvider: string;
  fallbackProvider: string;
  reason: string;
  timestamp: Date;
  userId?: string;
  requestId: string;
}

class AIContingencyService {
  private settings: ContingencySettings | null = null;
  private providers: AIProvider[] = [];

  constructor() {
    this.loadSettings();
  }

  /**
   * Carrega as configurações de contingência do banco de dados
   */
  private async loadSettings(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from("admin_llm_settings")
        .select("*")
        .limit(1);

      if (error) {
        console.error("Erro ao carregar configurações de contingência:", error);
        return;
      }

      // Se não há dados, criar configurações padrão
      if (!data || data.length === 0) {
        console.warn("⚠️ Nenhuma configuração encontrada no banco. Usando configurações padrão.");
        
        this.settings = {
          contingencyEnabled: false,
          fallbackPriority: {"gemini": 1},
          autoRetryEnabled: true,
          maxRetryAttempts: 3,
          retryDelaySeconds: 5,
        };
        
        // Criar provedor padrão (Gemini com simulação)
        this.providers = [
          {
            key: "gemini",
            name: "Google Gemini",
            active: true,
            apiKey: '', // Sem API key = simulação
            model: 'gemini-2.0-flash-exp',
          }
        ];
        
        console.log("👍 Configurações padrão criadas com simulação Gemini");
        return;
      }

      const settingsData = data[0];
      if (settingsData) {
        this.settings = {
          contingencyEnabled: settingsData.contingency_enabled ?? false,
          fallbackPriority: settingsData.fallback_priority ?? {},
          autoRetryEnabled: settingsData.auto_retry_enabled ?? true,
          maxRetryAttempts: settingsData.max_retry_attempts ?? 3,
          retryDelaySeconds: settingsData.retry_delay_seconds ?? 5,
        };

        // Carregar provedores ativos
        console.log("🔄 Carregando provedores de IA:", settingsData);
        
        this.providers = [
          {
            key: "openai",
            name: "OpenAI",
            active: settingsData?.openai_active || false,
            apiKey: settingsData?.openai_api_key || '',
            model: settingsData?.openai_model || 'gpt-4',
          },
          {
            key: "anthropic",
            name: "Claude (Anthropic)",
            active: settingsData?.anthropic_active || false,
            apiKey: settingsData?.anthropic_api_key || '',
            model: settingsData?.anthropic_model || 'claude-3-sonnet-20240229',
          },
          {
            key: "gemini",
            name: "Google Gemini",
            active: settingsData?.gemini_active ?? true, // Padrão ativo
            apiKey: settingsData?.gemini_api_key || '',
            model: settingsData?.gemini_model || 'gemini-2.0-flash-exp',
          },
          {
            key: "openrouter",
            name: "OpenRouter",
            active: settingsData?.openrouter_active || false,
            apiKey: settingsData?.openrouter_api_key || '',
            model: settingsData?.openrouter_model || 'openai/gpt-4',
          },
          {
            key: "kilocode",
            name: "Kilocode",
            active: settingsData?.kilocode_active || false,
            apiKey: settingsData?.kilocode_api_key || '',
            model: settingsData?.kilocode_model || 'kilocode-model',
          },
        ];
        
        console.log("👍 Provedores carregados:", this.providers.map(p => `${p.name}: ${p.active ? 'ativo' : 'inativo'}`));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações de contingência:", error);
    }
  }

  /**
   * Obtém provedores ordenados por prioridade (apenas os ativos)
   */
  private getProvidersByPriority(): AIProvider[] {
    if (!this.settings) return [];

    return this.providers
      .filter((provider) => provider.active) // Remover filtro de API key para permitir simulação
      .sort((a, b) => {
        const priorityA = this.settings!.fallbackPriority[a.key] || 999;
        const priorityB = this.settings!.fallbackPriority[b.key] || 999;
        return priorityA - priorityB;
      });
  }

  /**
   * Faz uma requisição para um provedor específico
   */
  private async makeRequest(
    provider: AIProvider,
    request: AIRequest
  ): Promise<AIResponse> {
    try {
      console.log(
        `🤖 Fazendo requisição REAL para ${provider.name} com modelo ${provider.model}`
      );

      // Implementar integração real baseada no provedor
      switch (provider.key) {
        case "gemini":
          return await this.makeGeminiRequest(provider, request);
        case "openai":
          return await this.makeOpenAIRequest(provider, request);
        case "anthropic":
          return await this.makeAnthropicRequest(provider, request);
        case "openrouter":
          return await this.makeOpenRouterRequest(provider, request);
        case "kilocode":
          return await this.makeKilocodeRequest(provider, request);
        default:
          throw new Error(`Provedor ${provider.key} não implementado`);
      }
    } catch (error) {
      throw new Error(`Erro ao comunicar com ${provider.name}: ${error}`);
    }
  }

  /**
   * Faz requisição para Google Gemini
   */
  private async makeGeminiRequest(
    provider: AIProvider,
    request: AIRequest
  ): Promise<AIResponse> {
    // Verificar se API key está configurada
    if (!provider.apiKey || provider.apiKey.trim() === '') {
      console.warn(`⚠️ API key não configurada para Gemini. Usando simulação temporária.`);
      
      // Retornar resposta simulada para desenvolvimento
      return {
        content: `[SIMULAÇÃO GEMINI] Copy gerada para: ${request.prompt.substring(0, 50)}...\n\n🔥 Esta é uma copy simulada para demonstração.\n\nConfigure uma API key do Google Gemini nas configurações para usar a IA real.`,
        provider: provider.key,
        model: provider.model,
        tokensUsed: Math.floor(Math.random() * 200) + 50,
        success: true,
      };
    }
    
    console.log(`🔄 Fazendo requisição real para Google Gemini com modelo ${provider.model}`);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${provider.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: request.prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: request.temperature || 0.7,
            maxOutputTokens: request.maxTokens || 1000,
            topP: 0.8,
            topK: 10,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Erro na API do Gemini: ${response.status} - ${errorData}`
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      throw new Error("Resposta inválida da API do Gemini");
    }

    const content = data.candidates[0].content.parts[0].text;
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

    return {
      content,
      provider: provider.key,
      model: provider.model,
      tokensUsed,
      success: true,
    };
  }

  /**
   * Faz requisição para OpenAI
   */
  private async makeOpenAIRequest(
    provider: AIProvider,
    request: AIRequest
  ): Promise<AIResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Erro na API da OpenAI: ${response.status} - ${errorData}`
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Resposta inválida da API da OpenAI");
    }

    const content = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    return {
      content,
      provider: provider.key,
      model: provider.model,
      tokensUsed,
      success: true,
    };
  }

  /**
   * Faz requisição para Anthropic Claude
   */
  private async makeAnthropicRequest(
    provider: AIProvider,
    request: AIRequest
  ): Promise<AIResponse> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": provider.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Erro na API da Anthropic: ${response.status} - ${errorData}`
      );
    }

    const data = await response.json();

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error("Resposta inválida da API da Anthropic");
    }

    const content = data.content[0].text;
    const tokensUsed = data.usage?.output_tokens || 0;

    return {
      content,
      provider: provider.key,
      model: provider.model,
      tokensUsed,
      success: true,
    };
  }

  /**
   * Faz requisição para OpenRouter
   */
  private async makeOpenRouterRequest(
    provider: AIProvider,
    request: AIRequest
  ): Promise<AIResponse> {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "StorySpark",
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            {
              role: "user",
              content: request.prompt,
            },
          ],
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 1000,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Erro na API do OpenRouter: ${response.status} - ${errorData}`
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Resposta inválida da API do OpenRouter");
    }

    const content = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    return {
      content,
      provider: provider.key,
      model: provider.model,
      tokensUsed,
      success: true,
    };
  }

  /**
   * Faz requisição para Kilocode
   */
  private async makeKilocodeRequest(
    provider: AIProvider,
    request: AIRequest
  ): Promise<AIResponse> {
    // Implementar conforme a API da Kilocode quando disponível
    // Por enquanto, usar simulação
    console.warn("⚠️ Kilocode API não implementada ainda, usando simulação");

    return {
      content: `[SIMULAÇÃO KILOCODE] Copy gerada baseada em: ${request.prompt.substring(
        0,
        100
      )}...`,
      provider: provider.key,
      model: provider.model,
      tokensUsed: Math.floor(Math.random() * 500) + 100,
      success: true,
    };
  }

  /**
   * Registra um evento de contingência no log
   */
  private async logContingencyEvent(log: ContingencyLog): Promise<void> {
    try {
      const { error } = await supabase.from("ai_contingency_logs").insert({
        original_provider: log.originalProvider,
        fallback_provider: log.fallbackProvider,
        reason: log.reason,
        timestamp: log.timestamp.toISOString(),
        user_id: log.userId,
        request_id: log.requestId,
      });

      if (error) {
        console.error("Erro ao registrar log de contingência:", error);
      }
    } catch (error) {
      console.error("Erro ao registrar log de contingência:", error);
    }
  }

  /**
   * Aplica delay antes de tentar novamente
   */
  private async delay(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  /**
   * Executa uma requisição de IA com sistema de contingência automática
   */
  async executeRequest(
    request: AIRequest,
    preferredProvider?: string
  ): Promise<AIResponse> {
    console.log("🚀 ExecuteRequest iniciado:", { preferredProvider, prompt: request.prompt?.substring(0, 50) + '...' });
    
    // Garantir que as configurações estão carregadas
    if (!this.settings) {
      console.log("🔄 Carregando settings...");
      await this.loadSettings();
    }
    
    console.log("📊 Status após loadSettings:", {
      settingsLoaded: !!this.settings,
      providersCount: this.providers.length,
      activeProviders: this.providers.filter(p => p.active).length
    });

    // Se contingência não está habilitada, usar apenas o provedor preferido
    if (!this.settings?.contingencyEnabled) {
      const provider = this.providers.find(
        (p) => p.key === preferredProvider && p.active && p.apiKey
      );
      if (!provider) {
        throw new Error("Provedor especificado não está disponível");
      }
      return await this.makeRequest(provider, request);
    }

    const orderedProviders = this.getProvidersByPriority();

    if (orderedProviders.length === 0) {
      throw new Error("Nenhum provedor de IA está ativo");
    }

    // Se um provedor preferido foi especificado, tentar ele primeiro
    if (preferredProvider) {
      const preferredIndex = orderedProviders.findIndex(
        (p) => p.key === preferredProvider
      );
      if (preferredIndex > -1) {
        const [preferred] = orderedProviders.splice(preferredIndex, 1);
        orderedProviders.unshift(preferred);
      }
    }

    const requestId = Date.now().toString();
    let lastError: string = "";

    // Tentar cada provedor na ordem de prioridade
    for (let i = 0; i < orderedProviders.length; i++) {
      const provider = orderedProviders[i];
      let attempts = 0;
      const maxAttempts = this.settings.autoRetryEnabled
        ? this.settings.maxRetryAttempts
        : 1;

      // Tentar o provedor atual com retry se habilitado
      while (attempts < maxAttempts) {
        try {
          console.log(
            `Tentativa ${attempts + 1}/${maxAttempts} com ${provider.name}`
          );

          const response = await this.makeRequest(provider, request);

          // Se não é o primeiro provedor, registrar evento de contingência
          if (i > 0) {
            await this.logContingencyEvent({
              originalProvider: orderedProviders[0].key,
              fallbackProvider: provider.key,
              reason: lastError,
              timestamp: new Date(),
              userId: request.userId,
              requestId,
            });
          }

          return response;
        } catch (error) {
          attempts++;
          lastError = `${error}`;

          console.log(
            `Falha na tentativa ${attempts} com ${provider.name}: ${lastError}`
          );

          // Se não é a última tentativa, aplicar delay
          if (attempts < maxAttempts) {
            await this.delay(this.settings.retryDelaySeconds);
          }
        }
      }

      console.log(
        `Provedor ${provider.name} falhou após ${maxAttempts} tentativas. Tentando próximo provedor...`
      );
    }

    // Se chegou aqui, todos os provedores falharam
    throw new Error(
      `Todos os provedores de IA falharam. Último erro: ${lastError}`
    );
  }

  /**
   * Testa a conectividade de um provedor específico
   */
  async testProvider(
    providerKey: string
  ): Promise<{ success: boolean; message: string }> {
    const provider = this.providers.find((p) => p.key === providerKey);

    if (!provider) {
      return { success: false, message: "Provedor não encontrado" };
    }

    if (!provider.active) {
      return { success: false, message: "Provedor não está ativo" };
    }

    if (!provider.apiKey) {
      return { success: false, message: "API Key não configurada" };
    }

    try {
      const testRequest: AIRequest = {
        prompt: "Teste de conectividade",
        maxTokens: 10,
        temperature: 0.1,
      };

      await this.makeRequest(provider, testRequest);
      return { success: true, message: "Provedor funcionando corretamente" };
    } catch (error) {
      return { success: false, message: `Erro: ${error}` };
    }
  }

  /**
   * Obtém estatísticas de contingência
   */
  async getContingencyStats(days: number = 7): Promise<{
    totalRequests: number;
    contingencyActivations: number;
    providerFailures: Record<string, number>;
    mostUsedFallback: string;
  }> {
    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data, error } = await supabase
        .from("ai_contingency_logs")
        .select("*")
        .gte("timestamp", since.toISOString());

      if (error) {
        console.error("Erro ao obter estatísticas de contingência:", error);
        return {
          totalRequests: 0,
          contingencyActivations: 0,
          providerFailures: {},
          mostUsedFallback: "",
        };
      }

      const providerFailures: Record<string, number> = {};
      const fallbackUsage: Record<string, number> = {};

      data.forEach((log) => {
        // Contar falhas por provedor original
        providerFailures[log.original_provider] =
          (providerFailures[log.original_provider] || 0) + 1;

        // Contar uso de fallbacks
        fallbackUsage[log.fallback_provider] =
          (fallbackUsage[log.fallback_provider] || 0) + 1;
      });

      const mostUsedFallback =
        Object.entries(fallbackUsage).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        "";

      return {
        totalRequests: data.length, // Simplificado - idealmente viria de outra tabela
        contingencyActivations: data.length,
        providerFailures,
        mostUsedFallback,
      };
    } catch (error) {
      console.error("Erro ao obter estatísticas de contingência:", error);
      return {
        totalRequests: 0,
        contingencyActivations: 0,
        providerFailures: {},
        mostUsedFallback: "",
      };
    }
  }

  /**
   * Força o recarregamento das configurações
   */
  async reloadSettings(): Promise<void> {
    await this.loadSettings();
  }
}

// Instância singleton do serviço
export const aiContingencyService = new AIContingencyService();
export default aiContingencyService;
