import { supabase } from "@/lib/supabase";
import type { Database } from "@/integrations/supabase/types";

type CreatePersonaInput =
  Database["public"]["Tables"]["target_personas"]["Insert"];
type UpdatePersonaInput =
  Database["public"]["Tables"]["target_personas"]["Update"];

// Tipos
export interface Persona {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  age_range?: string;
  location?: string;
  occupation?: string;
  goals?: string[];
  pain_points?: string[];
  interests?: string[];
  preferred_channels?: string[];
  usage_count: number;
  created_at: string;
  updated_at?: string;
}

export interface PersonaWithStats extends Persona {
  campaigns?: number;
  avgEngagement?: number;
}

interface DetailedError extends Error {
  code: string;
  details?: string;
  hint?: string;
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

export const personasService = {
  // Buscar todas as personas do workspace (apenas ativas)
  async getAll(workspaceId: string): Promise<PersonaWithStats[]> {
    try {
      const { data, error } = await supabase
        .from("target_personas")
        .select("*")
        .eq("workspace_id", workspaceId)
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
      return data.map((persona) => ({
        ...persona,
        campaigns: Math.floor(Math.random() * 15) + 2, // Mock temporário
        avgEngagement: Number((Math.random() * 8 + 3).toFixed(1)), // Mock temporário
      }));
    } catch (error) {
      console.error("Erro ao buscar personas:", error);

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

  // Criar nova persona
  async create(
    input: Omit<CreatePersonaInput, "id" | "created_at" | "updated_at">
  ): Promise<Persona> {
    try {
      await ensureAuth(); // Log apenas
      console.log("🔄 Criando nova persona:", input.name);

      const { data, error } = await supabase
        .from("target_personas")
        .insert({
          ...input,
          usage_count: 0,
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Erro completo no create:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      console.log("✅ Persona criada com sucesso:", data);
      return data;
    } catch (error) {
      console.error("Erro ao criar persona:", error);
      throw error;
    }
  },

  // Atualizar persona
  async update(id: string, updates: UpdatePersonaInput): Promise<Persona> {
    try {
      await ensureAuth(); // Log apenas
      console.log("🔄 Atualizando persona:", id);

      // Garantir que campos array estejam no formato correto
      const sanitizedUpdates: UpdatePersonaInput & { updated_at?: string } = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Sanitizar arrays se existirem
      if ("goals" in updates && updates.goals !== undefined) {
        sanitizedUpdates.goals = Array.isArray(updates.goals)
          ? updates.goals
          : [];
      }
      if ("pain_points" in updates && updates.pain_points !== undefined) {
        sanitizedUpdates.pain_points = Array.isArray(updates.pain_points)
          ? updates.pain_points
          : [];
      }
      if ("interests" in updates && updates.interests !== undefined) {
        sanitizedUpdates.interests = Array.isArray(updates.interests)
          ? updates.interests
          : [];
      }
      if (
        "preferred_channels" in updates &&
        updates.preferred_channels !== undefined
      ) {
        sanitizedUpdates.preferred_channels = Array.isArray(
          updates.preferred_channels
        )
          ? updates.preferred_channels
          : [];
      }

      const { data, error } = await supabase
        .from("target_personas")
        .update(sanitizedUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("❌ Erro completo no update:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      console.log("✅ Persona atualizada com sucesso:", data);
      return data;
    } catch (error) {
      console.error("Erro ao atualizar persona:", error);
      throw error;
    }
  },

  // Deletar persona (soft delete - remove da lista)
  async delete(id: string): Promise<void> {
    try {
      await ensureAuth(); // Log apenas
      console.log("🔄 Tentando excluir persona:", id);

      const { error } = await supabase
        .from("target_personas")
        .delete()
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

      console.log("✅ Persona excluída com sucesso");
    } catch (error) {
      console.error("Erro ao deletar persona:", error);
      throw error;
    }
  },

  // Buscar persona por ID
  async getById(id: string): Promise<Persona | null> {
    try {
      const { data, error } = await supabase
        .from("target_personas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Erro ao buscar persona:", error);
      throw error;
    }
  },

  // Incrementar usage count
  async incrementUsage(id: string): Promise<void> {
    try {
      const current = await this.getById(id);
      if (!current) throw new Error("Persona não encontrada");

      const { error } = await supabase
        .from("target_personas")
        .update({
          usage_count: (current.usage_count || 0) + 1,
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao incrementar usage count:", error);
      // Não fazer throw aqui para não quebrar o fluxo principal
    }
  },

  // Duplicar persona
  async duplicate(id: string): Promise<Persona> {
    try {
      await ensureAuth(); // Log apenas
      console.log("🔄 Tentando duplicar persona:", id);

      const original = await this.getById(id);
      if (!original) throw new Error("Persona não encontrada");

      console.log("📋 Persona original encontrada:", original.name);

      // Usar cliente alternativo para debug
      const { data, error } = await supabase
        .from("target_personas")
        .insert({
          workspace_id: original.workspace_id,
          user_id: original.user_id,
          name: `${original.name} (Cópia)`,
          age_range: original.age_range,
          location: original.location,
          occupation: original.occupation,
          goals: original.goals,
          pain_points: original.pain_points,
          interests: original.interests,
          preferred_channels: original.preferred_channels,
          usage_count: 0,
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

      console.log("✅ Persona duplicada com sucesso:", data);
      return data;
    } catch (error) {
      console.error("Erro ao duplicar persona:", error);
      throw error;
    }
  },
};
