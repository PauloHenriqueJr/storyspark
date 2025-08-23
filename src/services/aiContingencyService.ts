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
        .single();

      if (error) {
        console.error("Erro ao carregar configurações de contingência:", error);
        return;
      }

      if (data) {
        this.settings = {
          contingencyEnabled: data.contingency_enabled ?? false,
          fallbackPriority: data.fallback_priority ?? {},
          autoRetryEnabled: data.auto_retry_enabled ?? true,
          maxRetryAttempts: data.max_retry_attempts ?? 3,
          retryDelaySeconds: data.retry_delay_seconds ?? 5,
        };

        // Carregar provedores ativos
        this.providers = [
          {
            key: "openai",
            name: "OpenAI",
            active: data.openai_active,
            apiKey: data.openai_api_key,
            model: data.openai_model,
          },
          {
            key: "anthropic",
            name: "Claude (Anthropic)",
            active: data.anthropic_active,
            apiKey: data.anthropic_api_key,
            model: data.anthropic_model,
          },
          {
            key: "gemini",
            name: "Google Gemini",
            active: data.gemini_active,
            apiKey: data.gemini_api_key,
            model: data.gemini_model,
          },
          {
            key: "openrouter",
            name: "OpenRouter",
            active: data.openrouter_active,
            apiKey: data.openrouter_api_key,
            model: data.openrouter_model,
          },
          {
            key: "kilocode",
            name: "Kilocode",
            active: data.kilocode_active,
            apiKey: data.kilocode_api_key,
            model: data.kilocode_model,
          },
        ];
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
      .filter((provider) => provider.active && provider.apiKey)
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
      // Simular chamada para o provedor (aqui você implementaria a integração real)
      console.log(
        `Fazendo requisição para ${provider.name} com modelo ${provider.model}`
      );

      // Simular delay de rede
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );

      // Simular falha ocasional para teste (10% de chance)
      if (Math.random() < 0.1) {
        throw new Error(`Falha simulada no provedor ${provider.name}`);
      }

      // Retornar resposta simulada
      return {
        content: `Resposta do ${provider.name} usando ${provider.model}: ${request.prompt}`,
        provider: provider.key,
        model: provider.model,
        tokensUsed: Math.floor(Math.random() * 1000) + 100,
        success: true,
      };
    } catch (error) {
      throw new Error(`Erro ao comunicar com ${provider.name}: ${error}`);
    }
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
    // Garantir que as configurações estão carregadas
    if (!this.settings) {
      await this.loadSettings();
    }

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
