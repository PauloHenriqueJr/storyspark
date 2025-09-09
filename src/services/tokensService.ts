import { supabase } from "@/integrations/supabase/client";

export interface TokenUsageResult {
  success: boolean;
  error?: string;
  remainingTokens?: number;
  hasExceededLimit?: boolean;
}

export class TokensService {
  /**
   * Consome tokens do usuário e atualiza os contadores
   */
  static async consumeTokens(
    userId: string,
    tokensUsed: number
  ): Promise<TokenUsageResult> {
    try {
      // Buscar o perfil atual do usuário
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select(
          "monthly_tokens_limit, monthly_tokens_used, total_tokens_used, role"
        )
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Erro ao buscar perfil:", fetchError);
        return { success: false, error: "Erro ao buscar perfil do usuário" };
      }

      if (!profile) {
        return { success: false, error: "Usuário não encontrado" };
      }

      const currentMonthlyUsed = profile.monthly_tokens_used || 0;
      const currentTotalUsed = profile.total_tokens_used || 0;
      const monthlyLimit = profile.monthly_tokens_limit; // null = unlimited for admins

      // Verificar se usuário tem limite e se excedeu
      const newMonthlyUsed = currentMonthlyUsed + tokensUsed;

      if (
        monthlyLimit !== null &&
        newMonthlyUsed > monthlyLimit &&
        profile.role !== "admin"
      ) {
        return {
          success: false,
          error: "Limite mensal de tokens excedido",
          hasExceededLimit: true,
          remainingTokens: Math.max(0, monthlyLimit - currentMonthlyUsed),
        };
      }

      // Atualizar contadores de tokens
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          monthly_tokens_used: newMonthlyUsed,
          total_tokens_used: currentTotalUsed + tokensUsed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Erro ao atualizar tokens:", updateError);
        return {
          success: false,
          error: "Erro ao atualizar contador de tokens",
        };
      }

      const remainingTokens = monthlyLimit
        ? Math.max(0, monthlyLimit - newMonthlyUsed)
        : null;

      console.log(
        `✅ Tokens consumidos: ${tokensUsed}, Total mensal: ${newMonthlyUsed}, Restantes: ${
          remainingTokens || "Ilimitado"
        }`
      );

      return {
        success: true,
        remainingTokens: remainingTokens || 0,
      };
    } catch (error) {
      console.error("Erro no consumo de tokens:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Verifica se o usuário tem tokens disponíveis para consumo
   */
  static async checkTokensAvailable(
    userId: string,
    tokensNeeded: number = 0
  ): Promise<TokenUsageResult> {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("monthly_tokens_limit, monthly_tokens_used, role")
        .eq("id", userId)
        .single();

      if (error || !profile) {
        return { success: false, error: "Usuário não encontrado" };
      }

      const currentUsed = profile.monthly_tokens_used || 0;
      const limit = profile.monthly_tokens_limit;

      // Admin tem tokens ilimitados
      if (profile.role === "admin" || limit === null) {
        return { success: true, remainingTokens: 999999 };
      }

      const remainingTokens = Math.max(0, limit - currentUsed);
      const hasEnoughTokens = remainingTokens >= tokensNeeded;

      return {
        success: hasEnoughTokens,
        remainingTokens,
        hasExceededLimit: !hasEnoughTokens && tokensNeeded > 0,
        error:
          !hasEnoughTokens && tokensNeeded > 0
            ? "Tokens insuficientes"
            : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao verificar tokens",
      };
    }
  }

  /**
   * Obtém informações sobre o uso de tokens do usuário
   */
  static async getTokensUsage(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          "monthly_tokens_limit, monthly_tokens_used, total_tokens_used, role, plan"
        )
        .eq("id", userId)
        .single();

      if (error || !profile) {
        throw new Error("Usuário não encontrado");
      }

      const monthlyUsed = profile.monthly_tokens_used || 0;
      const monthlyLimit = profile.monthly_tokens_limit;
      const totalUsed = profile.total_tokens_used || 0;

      const remainingTokens = monthlyLimit
        ? Math.max(0, monthlyLimit - monthlyUsed)
        : null;
      const usagePercentage = monthlyLimit
        ? Math.round((monthlyUsed / monthlyLimit) * 100)
        : 0;

      return {
        monthlyUsed,
        monthlyLimit,
        totalUsed,
        remainingTokens,
        usagePercentage,
        isUnlimited: monthlyLimit === null || profile.role === "admin",
        plan: profile.plan,
        role: profile.role,
      };
    } catch (error) {
      console.error("Erro ao obter uso de tokens:", error);
      throw error;
    }
  }

  /**
   * Reset tokens mensais (para ser usado em cron job)
   */
  static async resetMonthlyTokens() {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ monthly_tokens_used: 0 })
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Atualizar todos

      if (error) {
        console.error("Erro ao resetar tokens mensais:", error);
        throw error;
      }

      console.log("✅ Tokens mensais resetados para todos os usuários");
      return { success: true };
    } catch (error) {
      console.error("Erro no reset de tokens:", error);
      throw error;
    }
  }

  /**
   * Adiciona créditos avulsos a uma conta específica pelo email
   */
  static async addCreditsByEmail(
    email: string,
    amount: number
  ): Promise<{ success: boolean; error?: string; userId?: string }> {
    try {
      if (amount <= 0) {
        return {
          success: false,
          error: "Quantidade de créditos deve ser maior que zero",
        };
      }

      // Buscar o perfil pelo email (case-insensitive)
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("id, credits, email")
        .ilike("email", email.toLowerCase())
        .single();

      if (fetchError) {
        console.error("Erro ao buscar perfil por email:", fetchError);
        return { success: false, error: "Erro ao buscar usuário" };
      }

      if (!profile) {
        return { success: false, error: "Usuário não encontrado" };
      }

      const currentCredits = profile.credits || 0;
      const newCredits = currentCredits + amount;

      // Atualizar créditos
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          credits: newCredits,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) {
        console.error("Erro ao atualizar créditos:", updateError);
        return { success: false, error: "Erro ao atualizar créditos" };
      }

      console.log(
        `✅ Créditos adicionados: ${amount} para ${email}. Novo saldo: ${newCredits}`
      );
      return { success: true, userId: profile.id };
    } catch (error) {
      console.error("Erro ao adicionar créditos:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Obtém o saldo de créditos de um usuário
   */
  static async getUserCredits(
    userId: string
  ): Promise<{ success: boolean; credits?: number; error?: string }> {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (error || !profile) {
        return { success: false, error: "Usuário não encontrado" };
      }

      return { success: true, credits: profile.credits || 0 };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao buscar créditos",
      };
    }
  }
}
