import { useState, useEffect } from 'react';
import { useWorkspace } from './useWorkspace';
import { useNotifications } from './useNotifications';
import { campaignsService, type CampaignWithStats } from '@/services/campaignsService';
import type { Database } from '@/integrations/supabase/types';

type CreateCampaignInput = Database['public']['Tables']['campaigns']['Insert'];
type UpdateCampaignInput = Database['public']['Tables']['campaigns']['Update'];
type CampaignStatus = Database['public']['Enums']['CampaignStatus'];

export interface UseCampaignsReturn {
  campaigns: CampaignWithStats[];
  loading: boolean;
  error: string | null;
  stats: {
    activeCampaigns: number;
    totalBudget: number;
    totalCampaigns: number;
    impressions: string;
    conversionRate: string;
  } | null;
  createCampaign: (input: Omit<CreateCampaignInput, 'workspace_id' | 'user_id'>) => Promise<void>;
  updateCampaign: (id: string, updates: UpdateCampaignInput) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  updateCampaignStatus: (id: string, status: CampaignStatus) => Promise<void>;
  getCampaignsByStatus: (status: CampaignStatus) => CampaignWithStats[];
  refetch: () => Promise<void>;
}

export const useCampaigns = (): UseCampaignsReturn => {
  const [campaigns, setCampaigns] = useState<CampaignWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UseCampaignsReturn['stats']>(null);
  
  const { workspace, user } = useWorkspace();
  const { addNotification } = useNotifications();

  const fetchCampaigns = async () => {
    if (!workspace?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [campaignsData, statsData] = await Promise.all([
        campaignsService.getAll(workspace.id),
        campaignsService.getStats(workspace.id)
      ]);
      
      setCampaigns(campaignsData);
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar campanhas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (input: Omit<CreateCampaignInput, 'workspace_id' | 'user_id'>) => {
    if (!workspace?.id || !user?.id) {
      throw new Error('Workspace ou usuário não encontrado');
    }

    try {
      const newCampaign = await campaignsService.create({
        ...input,
        workspace_id: workspace.id,
        user_id: user.id
      });
      
      // Notificação de sucesso
      addNotification({
        title: 'Campanha criada com sucesso!',
        message: `A campanha "${input.name}" foi criada e está pronta para ser configurada.`,
        type: 'success',
        action: {
          label: 'Ver campanha',
          onClick: () => console.log('Navegar para campanha:', newCampaign.id)
        }
      });
      
      // Refetch data after creation
      await fetchCampaigns();
    } catch (err) {
      console.error('Erro ao criar campanha:', err);
      
      // Notificação de erro
      addNotification({
        title: 'Erro ao criar campanha',
        message: err instanceof Error ? err.message : 'Ocorreu um erro inesperado ao criar a campanha.',
        type: 'error',
        action: {
          label: 'Tentar novamente',
          onClick: () => console.log('Tentar criar campanha novamente')
        }
      });
      
      throw err;
    }
  };

  const updateCampaign = async (id: string, updates: UpdateCampaignInput) => {
    try {
      const updatedCampaign = await campaignsService.update(id, updates);
      
      // Update local state optimistically
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === id ? { ...campaign, ...updates } : campaign
      ));
      
      // Notificação de sucesso
      addNotification({
        title: 'Campanha atualizada',
        message: `As alterações na campanha "${updatedCampaign.name}" foram salvas com sucesso.`,
        type: 'success'
      });
      
      // Refetch to ensure consistency
      await fetchCampaigns();
    } catch (err) {
      console.error('Erro ao atualizar campanha:', err);
      
      // Notificação de erro
      addNotification({
        title: 'Erro ao atualizar campanha',
        message: 'Não foi possível salvar as alterações. Tente novamente.',
        type: 'error'
      });
      
      throw err;
    }
  };

  const deleteCampaign = async (id: string) => {
    const campaignToDelete = campaigns.find(c => c.id === id);
    
    try {
      await campaignsService.delete(id);
      
      // Remove from local state optimistically
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      
      // Notificação de sucesso
      addNotification({
        title: 'Campanha removida',
        message: `A campanha "${campaignToDelete?.name || 'Campanha'}" foi removida com sucesso.`,
        type: 'success'
      });
      
      // Update stats
      await fetchCampaigns();
    } catch (err) {
      console.error('Erro ao deletar campanha:', err);
      
      // Notificação de erro
      addNotification({
        title: 'Erro ao remover campanha',
        message: 'Não foi possível remover a campanha. Tente novamente.',
        type: 'error'
      });
      
      throw err;
    }
  };

  const updateCampaignStatus = async (id: string, status: CampaignStatus) => {
    const campaign = campaigns.find(c => c.id === id);
    const statusLabels = {
      'ACTIVE': 'ativada',
      'PAUSED': 'pausada',
      'COMPLETED': 'finalizada',
      'DRAFT': 'movida para rascunhos'
    };
    
    try {
      const updatedCampaign = await campaignsService.updateStatus(id, status);
      
      // Update local state
      setCampaigns(prev => prev.map(c => 
        c.id === id ? { ...c, status: updatedCampaign.status } : c
      ));
      
      // Notificação de sucesso com base no status
      const statusLabel = statusLabels[status] || 'atualizada';
      const notificationType = status === 'ACTIVE' ? 'success' : 
                              status === 'PAUSED' ? 'warning' : 'info';
      
      addNotification({
        title: `Campanha ${statusLabel}`,
        message: `A campanha "${campaign?.name || 'Campanha'}" foi ${statusLabel} com sucesso.`,
        type: notificationType,
        action: status === 'ACTIVE' ? {
          label: 'Ver métricas',
          onClick: () => console.log('Navegar para analytics da campanha:', id)
        } : undefined
      });
      
      // Update stats
      await fetchCampaigns();
    } catch (err) {
      console.error('Erro ao alterar status da campanha:', err);
      
      // Notificação de erro
      addNotification({
        title: 'Erro ao alterar status',
        message: 'Não foi possível alterar o status da campanha. Tente novamente.',
        type: 'error'
      });
      
      throw err;
    }
  };

  const getCampaignsByStatus = (status: CampaignStatus): CampaignWithStats[] => {
    return campaigns.filter(campaign => campaign.status === status);
  };

  const refetch = async () => {
    await fetchCampaigns();
  };

  // Load campaigns when workspace changes
  useEffect(() => {
    fetchCampaigns();
  }, [workspace?.id]);

  return {
    campaigns,
    loading,
    error,
    stats,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    updateCampaignStatus,
    getCampaignsByStatus,
    refetch
  };
};