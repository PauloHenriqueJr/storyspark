import { useState, useCallback } from "react";
import { aiContingencyService } from "@/services/aiContingencyService";

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

interface UseAIContingencyReturn {
  loading: boolean;
  error: string | null;
  response: AIResponse | null;
  executeRequest: (
    request: AIRequest,
    preferredProvider?: string
  ) => Promise<AIResponse | null>;
  testProvider: (
    providerKey: string
  ) => Promise<{ success: boolean; message: string }>;
  getStats: (days?: number) => Promise<{
    totalRequests: number;
    contingencyActivations: number;
    providerFailures: Record<string, number>;
    mostUsedFallback: string;
  }>;
  clearError: () => void;
  clearResponse: () => void;
}

/**
 * Hook personalizado para usar o serviço de contingência de IA
 */
export const useAIContingency = (): UseAIContingencyReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AIResponse | null>(null);

  /**
   * Executa uma requisição de IA com contingência automática
   */
  const executeRequest = useCallback(
    async (
      request: AIRequest,
      preferredProvider?: string
    ): Promise<AIResponse | null> => {
      setLoading(true);
      setError(null);
      setResponse(null);

      try {
        const result = await aiContingencyService.executeRequest(
          request,
          preferredProvider
        );
        setResponse(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        console.error("Erro na requisição de IA:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Testa a conectividade de um provedor específico
   */
  const testProvider = useCallback(
    async (
      providerKey: string
    ): Promise<{ success: boolean; message: string }> => {
      try {
        return await aiContingencyService.testProvider(providerKey);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        return { success: false, message: errorMessage };
      }
    },
    []
  );

  /**
   * Obtém estatísticas de contingência
   */
  const getStats = useCallback(async (days: number = 7) => {
    try {
      return await aiContingencyService.getContingencyStats(days);
    } catch (err) {
      console.error("Erro ao obter estatísticas:", err);
      return {
        totalRequests: 0,
        contingencyActivations: 0,
        providerFailures: {},
        mostUsedFallback: "",
      };
    }
  }, []);

  /**
   * Limpa erro atual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpa resposta atual
   */
  const clearResponse = useCallback(() => {
    setResponse(null);
  }, []);

  return {
    loading,
    error,
    response,
    executeRequest,
    testProvider,
    getStats,
    clearError,
    clearResponse,
  };
};

export default useAIContingency;
