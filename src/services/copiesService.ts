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
    copyData: CreateCopyInput
  ): Promise<CopyRecord> {
    const payload = {
      user_id: userId,
      workspace_id: workspaceId,
      ...copyData,
    };

    const { data: inserted, error } = await supabase
      .from("copies")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    // Deduzir crédito após inserção bem-sucedida
    try {
      // Calcular créditos baseado no tipo de geração
      const creditsToDeduct = copyData.metadata?.isVariation ? 0.5 : 1;
      
      await supabase.rpc("deduct_user_credits", {
        p_user_id: userId,
        p_workspace_id: workspaceId,
        p_credits: creditsToDeduct,
      });
      
      // Atualização de créditos do workspace deve acontecer via função RPC segura no backend.
      // Mantemos essa responsabilidade no servidor para respeitar RLS e evitar 403 no cliente.
        
    } catch (deductErr) {
      if (import.meta.env.DEV) {
        console.warn("Falha ao deduzir créditos, continuando:", deductErr);
      }
      // Não falha a criação da copy por erro de crédito
    }

    return inserted as CopyRecord;
  }

  async list(
    params: {
      workspace_id: string;
      page?: number;
      pageSize?: number;
      platform?: string;
      copy_type?: string;
      q?: string;
    } = {} as any
  ): Promise<{ items: CopyRecord[]; total: number }> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const from = (page - 1) * pageSize;
    const workspace_id = params.workspace_id;

    // Tenta usar RPC FTS quando há busca
    if (params.q && params.q.trim().length > 0) {
      try {
        const { data, error } = await supabase.rpc("search_copies_fts", {
          p_query: params.q,
          p_workspace_id: workspace_id,
          p_page: page,
          p_page_size: pageSize,
        });
        if (error) throw error;
        const rows = (data as any[] | null) ?? [];
        const total = rows.length > 0 ? Number(rows[0]?.total_count ?? 0) : 0;
        const items = rows.map(
          ({ total_count, ...rest }) => rest
        ) as CopyRecord[];
        return { items, total };
      } catch (e: any) {
        if (import.meta.env.DEV) {
          console.warn(
            "FTS RPC falhou, usando fallback ILIKE:",
            e?.message || e
          );
        }
        // segue para fallback
      }
    }

    // Fallback/sem busca: tabela direta com filtros e ILIKE opcional
    let query = supabase
      .from("copies")
      .select("*", { count: "exact" })
      .eq("workspace_id", workspace_id)
      .order("created_at", { ascending: false });

    if (params.platform) query = query.eq("platform", params.platform);
    if (params.copy_type) query = query.eq("copy_type", params.copy_type);
    if (params.q) {
      query = query.or(`title.ilike.%${params.q}%,content.ilike.%${params.q}%`);
    }

    // Limite histórico para plano FREE (50 entradas)
    let finalQuery;
    const mockPlan = "FREE"; // Simular plano via join se necessário
    if (mockPlan === "FREE") {
      finalQuery = query.limit(50);
    } else {
      finalQuery = query;
    }

    const { data, error, count, status } = await finalQuery.range(
      from,
      from + pageSize - 1
    );
    if (error) {
      if ((error as any).code === "PGRST116" || status === 404) {
        return { items: [], total: 0 };
      }
      throw error;
    }
    return { items: (data as CopyRecord[]) || [], total: count || 0 };
  }
}

export const copiesService = new CopiesService();
