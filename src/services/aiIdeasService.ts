import { supabase } from "@/lib/supabase";
import type { Database } from "@/integrations/supabase/types";

type GeneratedCopyInsert =
  Database["public"]["Tables"]["generated_copies"]["Insert"];

export interface IdeaPayload {
  id?: number | string;
  category?: string;
  confidence?: number;
  content: string[];
  // Campos avançados (quando geração for custom)
  topic?: string;
  audience?: string;
  goal?: string;
  tone?: string;
  platform?: string;
  keywords?: string[];
  trends?: string[];
}

/**
 * Serviço para persistir ideias geradas (AIIdeas) no Supabase,
 * utilizando a tabela 'generated_copies'.
 */
export const aiIdeasService = {
  /**
   * Salva um conjunto de ideias como múltiplos registros na tabela generated_copies
   * - Cada string de conteúdo vira um registro
   * - Brief recebe um JSON com metadados da ideia
   */
  async saveIdeas(
    workspaceId: string,
    userId: string,
    ideas: IdeaPayload[]
  ): Promise<{ inserted: number }> {
    if (!workspaceId || !userId) {
      throw new Error(
        "WorkspaceId e userId são obrigatórios para salvar ideias."
      );
    }

    // "Achatar" todas as ideias em linhas para insert
    const rows: GeneratedCopyInsert[] = ideas.flatMap((idea) => {
      const {
        category,
        confidence,
        content,
        topic,
        audience,
        goal,
        tone,
        platform,
        keywords,
        trends,
      } = idea;

      const brief = {
        source: "ideas-generator",
        category,
        confidence,
        topic,
        audience,
        goal,
        tone,
        keywords,
        trends,
        generated_at: new Date().toISOString(),
      };

      const channel = (platform || category || "ideas")
        .toString()
        .toLowerCase();

      return (content || []).map((text) => {
        const wordCount = text ? text.trim().split(/\s+/).length : 0;

        const row: GeneratedCopyInsert = {
          ai_model: "ideas-v1",
          ai_provider: "local",
          brief:
            brief as unknown as Database["public"]["Tables"]["generated_copies"]["Insert"]["brief"],
          channel,
          content: text,
          credits_used: 1,
          is_favorite: false,
          status: "draft",
          word_count: wordCount,
          user_id: userId,
          workspace_id: workspaceId,
          // Campos relacionais opcionais mantidos como null
          brand_voice_id: null,
          campaign_id: null,
          persona_id: null,
        };
        return row;
      });
    });

    if (rows.length === 0) {
      return { inserted: 0 };
    }

    const { error } = await supabase.from("generated_copies").insert(rows);

    if (error) {
      // Log detalhado para depuração
      console.error("Erro ao salvar ideias em generated_copies:", {
        message: error.message,
        code: (error as { code?: string }).code,
        details: (error as { details?: string }).details,
        hint: (error as { hint?: string }).hint,
      });
      throw error;
    }

    return { inserted: rows.length };
  },

  async fetchIdeas(workspaceId: string, limit = 50) {
    if (!workspaceId) {
      throw new Error("WorkspaceId é obrigatório para buscar ideias.");
    }

    const { data, error } = await supabase
      .from("generated_copies")
      .select("id, content, brief, created_at, channel")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erro ao buscar ideias em generated_copies:", error);
      throw error;
    }

    // Normaliza dados para consumo no frontend (estrutura próxima ao que AIIdeas usa)
    return (data || []).map((row) => {
      const brief = (row.brief || {}) as Record<string, unknown>;
      const text: string = row.content || "";
      const titleFromText = text
        ? text.slice(0, 60) + (text.length > 60 ? "..." : "")
        : "Ideia";
      return {
        id: row.id,
        title: brief.topic || titleFromText,
        category: brief.category || row.channel || "ideas",
        confidence: brief.confidence,
        trends: brief.trends || [],
        generated: row.created_at,
        used: false,
        content: [text],
        topic: brief.topic,
        audience: brief.audience,
        goal: brief.goal,
        tone: brief.tone,
        platform: row.channel,
        keywords: brief.keywords || [],
      } as unknown as IdeaPayload;
    });
  },
};
