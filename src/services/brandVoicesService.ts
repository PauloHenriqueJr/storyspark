import { supabase } from "@/lib/supabase";
import type { Database } from "@/integrations/supabase/types";

type BrandVoice = Database["public"]["Tables"]["brand_voices"]["Row"];
type CreateBrandVoiceInput =
  Database["public"]["Tables"]["brand_voices"]["Insert"];
type UpdateBrandVoiceInput =
  Database["public"]["Tables"]["brand_voices"]["Update"];

export interface BrandVoiceWithStats extends BrandVoice {
  campaigns?: number;
  avgEngagement?: number;
  personality?: string[];
  audience?: string;
}

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
        .eq("is_active", true)
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
      const { data, error } = await supabase
        .from("brand_voices")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
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
      const { error } = await supabase
        .from("brand_voices")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
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
        .eq("is_active", true)
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
      // Primeiro buscar o status atual
      const current = await this.getById(id);
      if (!current) throw new Error("Brand voice não encontrada");

      const { data, error } = await supabase
        .from("brand_voices")
        .update({
          is_active: !current.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      throw error;
    }
  },
};
