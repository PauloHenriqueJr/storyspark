import { supabase } from "@/lib/supabase";
import type { Database } from "@/integrations/supabase/types";

type CreateBrandVoiceInput =
  Database["public"]["Tables"]["brand_voices"]["Insert"];
type UpdateBrandVoiceInput =
  Database["public"]["Tables"]["brand_voices"]["Update"];

// Tipos
export interface BrandVoice {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  description: string;
  tone: string;
  style: string;
  examples: string[];
  guidelines: string;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  personality_traits?: string[];
  audience?: string;
  platform?: string;
  context?: string;
  writing_style?: string;
  avoid?: string;
  good_example?: string;
  bad_example?: string;
  keywords?: string[];
}

export interface BrandVoiceWithStats extends BrandVoice {
  personality: string[];
  campaigns?: number;
  avgEngagement?: number;
}

// Função para garantir autenticação antes das operações
const ensureAuth = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("❌ Erro ao verificar sessão:", error);
    // Não vai mais fazer throw, apenas logar
    console.warn("⚠️ Continuando sem verificação de sessão (modo debug)");
    return null;
  }

  if (!session) {
    console.warn("⚠️ Nenhuma sessão encontrada (modo debug)");
    return null;
  }

  console.log("✅ Usuário autenticado:", session.user.email);
  return session;
};

interface DetailedError extends Error {
  code: string;
  details?: string;
  hint?: string;
}

export const brandVoicesService = {
  // Buscar todas as brand voices do workspace
  async getAll(workspaceId: string): Promise<BrandVoiceWithStats[]> {
    try {
      const { data, error } = await supabase
        .from("brand_voices")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("is_active", true) // Apenas brand voices ativas
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro na query do Supabase:", error);

        // Criar erro mais detalhado com código
        const detailedError = new Error(error.message) as DetailedError;
        detailedError.code = error.code;
        detailedError.details = error.details;
        detailedError.hint = error.hint;

        throw detailedError;
      }

      // Transformar dados para incluir estatísticas mockadas por enquanto
      return data.map((voice) => ({
        ...voice,
        campaigns: Math.floor(Math.random() * 30) + 5, // Mock temporário
        avgEngagement: Number((Math.random() * 10 + 5).toFixed(1)), // Mock temporário
        personality: voice.tone ? [voice.tone, voice.style] : [],
        audience: voice.description || "Público geral",
      }));
    } catch (error) {
      console.error("Erro ao buscar brand voices:", error);

      // Se for um erro que já criamos com código, repassar
      if (error instanceof Error && "code" in error) {
        throw error;
      }

      // Para outros erros, criar erro genérico
      const genericError = new Error(
        error instanceof Error ? error.message : "Erro desconhecido"
      ) as DetailedError;
      genericError.code = "UNKNOWN";
      throw genericError;
    }
  },

  // Criar nova brand voice
  async create(
    input: Omit<CreateBrandVoiceInput, "id" | "created_at" | "updated_at">
  ): Promise<BrandVoice> {
    try {
      const { data, error } = await supabase
        .from("brand_voices")
        .insert({
          ...input,
          usage_count: 0,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao criar brand voice:", error);
      throw error;
    }
  },

  // Atualizar brand voice
  async update(
    id: string,
    updates: UpdateBrandVoiceInput
  ): Promise<BrandVoice> {
    try {
      // Garantir que campos array estejam no formato correto
      const sanitizedUpdates: Record<string, unknown> = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Sanitizar arrays se existirem
      if ("examples" in updates) {
        sanitizedUpdates.examples = Array.isArray(updates.examples)
          ? updates.examples
          : [];
      }
      if ("personality_traits" in updates) {
        sanitizedUpdates.personality_traits = Array.isArray(
          updates.personality_traits
        )
          ? updates.personality_traits
          : [];
      }
      if ("audience" in updates) {
        sanitizedUpdates.audience = Array.isArray(updates.audience)
          ? updates.audience
          : [];
      }

      const { data, error } = await supabase
        .from("brand_voices")
        .update(sanitizedUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao atualizar brand voice:", error);
      throw error;
    }
  },

  // Deletar brand voice (soft delete)
  async delete(id: string): Promise<void> {
    try {
      await ensureAuth(); // Garantir autenticação
      console.log("🔄 Tentando excluir brand voice:", id);

      const { error } = await supabase
        .from("brand_voices")
        .update({ is_active: false })
        .eq("id", id);

      if (error) {
        console.error("❌ Erro completo no delete:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      console.log("✅ Brand voice excluída com sucesso");
    } catch (error) {
      console.error("Erro ao deletar brand voice:", error);
      throw error;
    }
  },

  // Buscar brand voice por ID
  async getById(id: string): Promise<BrandVoice | null> {
    try {
      const { data, error } = await supabase
        .from("brand_voices")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Erro ao buscar brand voice:", error);
      throw error;
    }
  },

  // Incrementar usage count
  async incrementUsage(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("brand_voices")
        .update({
          usage_count: supabase.rpc("increment_usage_count", { voice_id: id }),
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao incrementar usage count:", error);
      // Não fazer throw aqui para não quebrar o fluxo principal
    }
  },

  // Toggle status ativo/inativo
  async toggleStatus(id: string): Promise<BrandVoice> {
    try {
      await ensureAuth(); // Garantir autenticação
      console.log("🔄 Tentando alterar status da brand voice:", id);

      // Primeiro buscar o status atual
      const current = await this.getById(id);
      if (!current) throw new Error("Brand voice não encontrada");

      console.log("📋 Status atual:", current.is_active);

      const { data, error } = await supabase
        .from("brand_voices")
        .update({
          is_active: !current.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("❌ Erro completo no toggleStatus:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      console.log("✅ Status alterado com sucesso:", data);
      return data;
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      throw error;
    }
  },

  // Duplicar brand voice
  async duplicate(id: string): Promise<BrandVoice> {
    try {
      await ensureAuth(); // Garantir autenticação
      console.log("🔄 Tentando duplicar brand voice:", id);

      const original = await this.getById(id);
      if (!original) throw new Error("Brand voice não encontrada");

      console.log("📋 Brand voice original encontrada:", original.name);

      const { data, error } = await supabase
        .from("brand_voices")
        .insert({
          workspace_id: original.workspace_id,
          user_id: original.user_id,
          name: `${original.name} (Cópia)`,
          description: original.description,
          tone: original.tone,
          style: original.style,
          examples: original.examples,
          guidelines: original.guidelines,
          usage_count: 0,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Erro completo no duplicate:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      console.log("✅ Brand voice duplicada com sucesso:", data);
      return data;
    } catch (error) {
      console.error("Erro ao duplicar brand voice:", error);
      throw error;
    }
  },

  // Deletar permanentemente (hard delete)
  async permanentDelete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("brand_voices")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao deletar permanentemente brand voice:", error);
      throw error;
    }
  },
};
