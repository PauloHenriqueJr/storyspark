import { supabase } from "@/lib/supabase";

export interface CopyRecord {
  id: string;
  created_at: string;
  user_id: string;
  workspace_id: string;
  title: string | null;
  content: string;
  platform: string | null;
  copy_type: string | null;
  persona_id?: string | null;
  brand_voice_id?: string | null;
  campaign_id?: string | null;
  model?: string | null;
  temperature?: number | null;
  tokens_input?: number | null;
  tokens_output?: number | null;
  cost_usd?: number | null;
  metadata?: Record<string, any>;
}

export interface CreateCopyInput {
  title?: string;
  content: string;
  platform?: string;
  copy_type?: string;
  persona_id?: string | null;
  brand_voice_id?: string | null;
  campaign_id?: string | null;
  model?: string;
  temperature?: number;
  tokens_input?: number;
  tokens_output?: number;
  cost_usd?: number;
  metadata?: Record<string, any>;
}

class CopiesService {
  async create(
    userId: string,
    workspaceId: string,
    data: CreateCopyInput
  ): Promise<CopyRecord> {
    const payload = {
      user_id: userId,
      workspace_id: workspaceId,
      ...data,
    };

    const { data: inserted, error } = await supabase
      .from("copies")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;
    return inserted as CopyRecord;
  }

  async list(
    params: {
      page?: number;
      pageSize?: number;
      platform?: string;
      copy_type?: string;
      q?: string; // full-text search
    } = {}
  ): Promise<{ items: CopyRecord[]; total: number }> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("copies")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (params.platform) query = query.eq("platform", params.platform);
    if (params.copy_type) query = query.eq("copy_type", params.copy_type);
    if (params.q) {
      // simple ILIKE; if using FTS, replace with to_tsvector query via RPC or text search
      query = query.or(`title.ilike.%${params.q}%,content.ilike.%${params.q}%`);
    }

    const { data, error, count, status } = await query.range(from, to);
    if (error) {
      // Se a tabela não existir ainda (404), retornar vazio para não quebrar a UI
      if ((error as any).code === "PGRST116" || status === 404) {
        return { items: [], total: 0 };
      }
      throw error;
    }
    return { items: (data as CopyRecord[]) || [], total: count || 0 };
  }
}

export const copiesService = new CopiesService();
