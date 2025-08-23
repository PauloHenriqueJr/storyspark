import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

type Campaign = Database['public']['Tables']['campaigns']['Row'];
type CreateCampaignInput = Database['public']['Tables']['campaigns']['Insert'];
type UpdateCampaignInput = Database['public']['Tables']['campaigns']['Update'];

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
  // Buscar todas as campanhas do workspace
  async getAll(workspaceId: string): Promise<CampaignWithStats[]> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          generated_copies(count)
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformar dados para incluir estatísticas mockadas por enquanto
      return data.map(campaign => ({
        ...campaign,
        spent: Math.floor(Math.random() * (campaign.budget || 5000) * 0.8),
        impressions: `${(Math.random() * 50 + 10).toFixed(1)}K`,
        clicks: Math.floor(Math.random() * 2000 + 500),
        ctr: `${(Math.random() * 3 + 2).toFixed(2)}%`,
        conversions: Math.floor(Math.random() * 200 + 50),
        progress: Math.floor(Math.random() * 80 + 20),
        statusColor: campaign.status === 'ACTIVE' ? 'bg-emerald-500' : 
                    campaign.status === 'PAUSED' ? 'bg-yellow-500' : 'bg-gray-500',
        platform: campaign.metadata?.platform || 'Instagram + Facebook'
      }));
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
          status: input.status || 'DRAFT'
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
          updated_at: new Date().toISOString()
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
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar campanha:', error);
      throw error;
    }
  },

  // Buscar campanha por ID
  async getById(id: string): Promise<Campaign | null> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar campanha:', error);
      throw error;
    }
  },

  // Atualizar status da campanha
  async updateStatus(id: string, status: Database['public']['Enums']['CampaignStatus']): Promise<Campaign> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update({ 
          status,
          updated_at: new Date().toISOString()
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

  // Buscar campanhas por status
  async getByStatus(workspaceId: string, status: Database['public']['Enums']['CampaignStatus']): Promise<CampaignWithStats[]> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(campaign => ({
        ...campaign,
        spent: Math.floor(Math.random() * (campaign.budget || 5000) * 0.8),
        impressions: `${(Math.random() * 50 + 10).toFixed(1)}K`,
        clicks: Math.floor(Math.random() * 2000 + 500),
        ctr: `${(Math.random() * 3 + 2).toFixed(2)}%`,
        conversions: Math.floor(Math.random() * 200 + 50),
        progress: Math.floor(Math.random() * 80 + 20),
        statusColor: campaign.status === 'ACTIVE' ? 'bg-emerald-500' : 
                    campaign.status === 'PAUSED' ? 'bg-yellow-500' : 'bg-gray-500',
        platform: campaign.metadata?.platform || 'Instagram + Facebook'
      }));
    } catch (error) {
      console.error('Erro ao buscar campanhas por status:', error);
      throw error;
    }
  },

  // Obter estatísticas das campanhas
  async getStats(workspaceId: string) {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('status, budget')
        .eq('workspace_id', workspaceId);

      if (error) throw error;

      const activeCampaigns = data.filter(c => c.status === 'ACTIVE').length;
      const totalBudget = data.reduce((acc, c) => acc + (c.budget || 0), 0);
      
      return {
        activeCampaigns,
        totalBudget,
        totalCampaigns: data.length,
        // Mock data para outras métricas
        impressions: `${(Math.random() * 200 + 50).toFixed(1)}K`,
        conversionRate: `${(Math.random() * 2 + 2).toFixed(1)}%`
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas das campanhas:', error);
      throw error;
    }
  }
};