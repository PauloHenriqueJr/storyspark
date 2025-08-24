import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CreateCampaignInput = Database['public']['Tables']['campaigns']['Insert'];
type UpdateCampaignInput = Database['public']['Tables']['campaigns']['Update'];
type CampaignStatus = Database['public']['Enums']['CampaignStatus'];

export interface CampaignWithStats extends Campaign {
  spent?: number;
  impressions?: string;
  clicks?: number;
  ctr?: string;
  conversions?: number;
  progress?: number;
  statusColor?: string;
  platform?: string;
}

export const campaignsService = {
  // Buscar todas as campanhas do workspace (com estatísticas reais)
  async getAll(workspaceId: string): Promise<CampaignWithStats[]> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          campaign_stats(spent, impressions, clicks, ctr, conversions, progress)
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((campaign: any) => {
        const stats = campaign?.campaign_stats?.[0] || {};
        const impressionsNum = Number(stats.impressions || 0);
        const ctrNum = Number(stats.ctr || 0);

        // Derivar plataforma a partir do metadata (quando existir)
        let platform = 'Facebook Ads';
        try {
          const platforms = campaign?.metadata?.platforms;
          if (Array.isArray(platforms) && platforms.length > 0) {
            platform = platforms.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' + ');
          } else if (campaign?.metadata?.platform) {
            platform = String(campaign.metadata.platform);
          }
        } catch {
          // noop
        }

        return {
          ...campaign,
          spent: Number(stats.spent || 0),
          impressions: impressionsNum.toLocaleString('pt-BR'),
          clicks: Number(stats.clicks || 0),
          ctr: `${ctrNum.toFixed(2)}%`,
          conversions: Number(stats.conversions || 0),
          progress: Number(stats.progress || 0),
          statusColor:
            campaign.status === 'ACTIVE'
              ? 'bg-emerald-500'
              : campaign.status === 'PAUSED'
              ? 'bg-yellow-500'
              : 'bg-gray-500',
          platform,
        } as CampaignWithStats;
      });
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      throw error;
    }
  },

  // Criar nova campanha
  async create(input: Omit<CreateCampaignInput, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          ...input,
          status: (input as any).status || 'DRAFT',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  },

  // Atualizar campanha
  async update(id: string, updates: UpdateCampaignInput): Promise<Campaign> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
      throw error;
    }
  },

  // Deletar campanha
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar campanha:', error);
      throw error;
    }
  },

  // Buscar campanha por ID
  async getById(id: string): Promise<Campaign | null> {
    try {
      const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();

      if (error) {
        const code = (error as any)?.code;
        if (code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar campanha:', error);
      throw error;
    }
  },

  // Atualizar status da campanha
  async updateStatus(id: string, status: CampaignStatus): Promise<Campaign> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar status da campanha:', error);
      throw error;
    }
  },

  // Buscar campanhas por status (com estatísticas reais)
  async getByStatus(workspaceId: string, status: CampaignStatus): Promise<CampaignWithStats[]> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          campaign_stats(spent, impressions, clicks, ctr, conversions, progress)
        `)
        .eq('workspace_id', workspaceId)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((campaign: any) => {
        const stats = campaign?.campaign_stats?.[0] || {};
        const impressionsNum = Number(stats.impressions || 0);
        const ctrNum = Number(stats.ctr || 0);

        let platform = 'Facebook Ads';
        try {
          const platforms = campaign?.metadata?.platforms;
          if (Array.isArray(platforms) && platforms.length > 0) {
            platform = platforms.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' + ');
          } else if (campaign?.metadata?.platform) {
            platform = String(campaign.metadata.platform);
          }
        } catch {
          // noop
        }

        return {
          ...campaign,
          spent: Number(stats.spent || 0),
          impressions: impressionsNum.toLocaleString('pt-BR'),
          clicks: Number(stats.clicks || 0),
          ctr: `${ctrNum.toFixed(2)}%`,
          conversions: Number(stats.conversions || 0),
          progress: Number(stats.progress || 0),
          statusColor:
            campaign.status === 'ACTIVE'
              ? 'bg-emerald-500'
              : campaign.status === 'PAUSED'
              ? 'bg-yellow-500'
              : 'bg-gray-500',
          platform,
        } as CampaignWithStats;
      });
    } catch (error) {
      console.error('Erro ao buscar campanhas por status:', error);
      throw error;
    }
  },

  // Obter estatísticas agregadas das campanhas (reais)
  async getStats(workspaceId: string) {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, status, budget')
        .eq('workspace_id', workspaceId);

      if (error) throw error;

      const totalCampaigns = data?.length || 0;
      const activeCampaigns = (data || []).filter((c) => c.status === 'ACTIVE').length;
      const totalBudget = (data || []).reduce((acc, c) => acc + (Number(c.budget) || 0), 0);

      let impressionsSum = 0;
      let clicksSum = 0;
      let conversionsSum = 0;

      const ids = (data || []).map((c) => c.id);
      if (ids.length > 0) {
        const { data: statsData } = await supabase
          .from('campaign_stats')
          .select('impressions, clicks, conversions')
          .in('campaign_id', ids);

        if (statsData && statsData.length > 0) {
          impressionsSum = statsData.reduce((acc: number, s: any) => acc + Number(s.impressions || 0), 0);
          clicksSum = statsData.reduce((acc: number, s: any) => acc + Number(s.clicks || 0), 0);
          conversionsSum = statsData.reduce((acc: number, s: any) => acc + Number(s.conversions || 0), 0);
        }
      }

      const conversionRate = clicksSum > 0 ? `${((conversionsSum / clicksSum) * 100).toFixed(1)}%` : '0.0%';

      return {
        activeCampaigns,
        totalBudget,
        totalCampaigns,
        impressions: impressionsSum.toLocaleString('pt-BR'),
        conversionRate,
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas das campanhas:', error);
      throw error;
    }
  },

  // Integração Facebook Ads - salvar credenciais do usuário/workspace
  async linkFacebookAccount(
    workspaceId: string,
    userId: string,
    params: { accessToken: string; adAccountId: string; businessId?: string; fbUserId?: string; tokenExpiresAt?: string }
  ) {
    const { accessToken, adAccountId, businessId, fbUserId, tokenExpiresAt } = params;

    const { data, error } = await supabase
      .from('facebook_ad_accounts')
      .upsert(
        {
          user_id: userId,
          workspace_id: workspaceId,
          access_token: accessToken,
          ad_account_id: adAccountId,
          business_id: businessId || null,
          fb_user_id: fbUserId || null,
          token_expires_at: tokenExpiresAt || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,workspace_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Disparar sincronização com Facebook (Edge Function)
  async syncFromFacebook(workspaceId: string) {
    const { data, error } = await (supabase as any).functions.invoke('facebook_sync', {
      body: { workspace_id: workspaceId },
    });
    if (error) throw error;
    return data;
  },
};