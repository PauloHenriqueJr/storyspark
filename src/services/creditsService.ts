import { supabase } from "@/integrations/supabase/client";

export interface CreditUsageResult {
  success: boolean;
  error?: string;
  remainingCredits?: number;
  hasExceededLimit?: boolean;
}

export class CreditsService {
  /**
   * Consome 1 crédito do usuário quando gera uma copy
   */
  static async consumeCredit(
    userId: string,
    tokensUsedForLogging: number = 0
  ): Promise<CreditUsageResult> {
    try {
      // Buscar o perfil atual do usuário
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("credits, role, plan, monthly_tokens_used, total_tokens_used")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Erro ao buscar perfil:", fetchError);
        return { success: false, error: "Erro ao buscar perfil do usuário" };
      }

      if (!profile) {
        return { success: false, error: "Usuário não encontrado" };
      }

      const currentCredits = profile.credits || 0;

      // Verificar se usuário tem créditos disponíveis (admin tem ilimitado)
      if (currentCredits <= 0 && profile.role !== "admin") {
        return {
          success: false,
          error: "Créditos insuficientes",
          hasExceededLimit: true,
          remainingCredits: 0,
        };
      }

      // Preparar a atualização
      const updates: any = {
        updated_at: new Date().toISOString(),
      };

      // Admin não gasta créditos (ou gasta de um pool maior)
      if (profile.role !== "admin") {
        updates.credits = currentCredits - 1;
      }

      // Sempre atualizar logs de tokens (para debugging/analytics)
      if (tokensUsedForLogging > 0) {
        updates.monthly_tokens_used =
          (profile.monthly_tokens_used || 0) + tokensUsedForLogging;
        updates.total_tokens_used =
          (profile.total_tokens_used || 0) + tokensUsedForLogging;
      }

      // Atualizar no banco
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (updateError) {
        console.error("Erro ao atualizar créditos:", updateError);
        return { success: false, error: "Erro ao consumir crédito" };
      }

      const remainingCredits =
        profile.role === "admin" ? 999999 : currentCredits - 1;

      console.log(
        `✅ 1 crédito consumido. Restantes: ${
          remainingCredits === 999999 ? "Ilimitado" : remainingCredits
        }`
      );
      if (tokensUsedForLogging > 0) {
        console.log(
          `📊 Tokens registrados para analytics: ${tokensUsedForLogging}`
        );
      }

      return {
        success: true,
        remainingCredits,
      };
    } catch (error) {
      console.error("Erro no consumo de crédito:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Verifica se o usuário tem créditos disponíveis
   */
  static async checkCreditsAvailable(
    userId: string
  ): Promise<CreditUsageResult> {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("credits, role")
        .eq("id", userId)
        .single();

      if (error || !profile) {
        return { success: false, error: "Usuário não encontrado" };
      }

      const currentCredits = profile.credits || 0;

      // Admin tem créditos ilimitados
      if (profile.role === "admin") {
        return { success: true, remainingCredits: 999999 };
      }

      const hasCredits = currentCredits > 0;

      return {
        success: hasCredits,
        remainingCredits: currentCredits,
        hasExceededLimit: !hasCredits,
        error: !hasCredits ? "Créditos insuficientes" : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Erro ao verificar créditos",
      };
    }
  }

  /**
   * Obtém informações sobre créditos do usuário
   */
  static async getCreditsInfo(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("credits, role, plan, monthly_tokens_used, total_tokens_used")
        .eq("id", userId)
        .single();

      if (error || !profile) {
        throw new Error("Usuário não encontrado");
      }

      const currentCredits = profile.credits || 0;
      const isAdmin = profile.role === "admin";

      return {
        currentCredits: isAdmin ? 999999 : currentCredits,
        isUnlimited: isAdmin,
        plan: profile.plan,
        role: profile.role,
        // Analytics data (tokens são apenas para logs)
        monthlyTokensUsed: profile.monthly_tokens_used || 0,
        totalTokensUsed: profile.total_tokens_used || 0,
      };
    } catch (error) {
      console.error("Erro ao obter informações de créditos:", error);
      throw error;
    }
  }

  /**
   * Adiciona créditos ao usuário (para compras/promoções)
   */
  static async addCredits(
    userId: string,
    creditsToAdd: number,
    reason: string = "Manual"
  ): Promise<CreditUsageResult> {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("credits, role")
        .eq("id", userId)
        .single();

      if (fetchError || !profile) {
        return { success: false, error: "Usuário não encontrado" };
      }

      const currentCredits = profile.credits || 0;
      const newCredits = currentCredits + creditsToAdd;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          credits: newCredits,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        return { success: false, error: "Erro ao adicionar créditos" };
      }

      console.log(
        `✅ ${creditsToAdd} créditos adicionados (${reason}). Total: ${newCredits}`
      );

      return {
        success: true,
        remainingCredits: newCredits,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  /**
   * Reset créditos mensais baseado no plano (para cron job mensal)
   */
  static async resetMonthlyCredits() {
    try {
      // Atualizar créditos baseado no plano usando a tabela admin_plans
      const { error } = await supabase.rpc("reset_monthly_credits_by_plan");

      if (error) {
        console.error("Erro ao resetar créditos mensais:", error);
        throw error;
      }

      console.log("✅ Créditos mensais resetados baseado nos planos");
      return { success: true };
    } catch (error) {
      console.error("Erro no reset de créditos:", error);
      throw error;
    }
  }
}
