import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface AdminPlan {
  id: string;
  name: string;
  slug: string;
  price_brl: number;
  monthly_credits: number | null; // null = unlimited
  features: string[];
  description: string;
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PlanFormData {
  name: string;
  slug: string;
  price_brl: number;
  monthly_credits: number | null;
  features: string[];
  description: string;
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
}

// Query Keys para organização
const QUERY_KEYS = {
  adminPlans: ['admin-plans'] as const,
  activePlans: ['admin-plans', 'active'] as const,
};

// Funções de API
const planApiService = {
  // Buscar todos os planos
  fetchAllPlans: async (): Promise<AdminPlan[]> => {
    const { data, error } = await supabase
      .from('admin_plans')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    
    // Parse features from JSON string back to array
    const parsedData = (data || []).map(plan => {
      let features = plan.features;
      if (typeof plan.features === 'string') {
        try {
          features = JSON.parse(plan.features);
        } catch (error) {
          console.warn('Failed to parse features for plan:', plan.name, error);
          features = [];
        }
      }
      return {
        ...plan,
        features: Array.isArray(features) ? features : []
      };
    });
    
    return parsedData;
  },

  // Buscar apenas planos ativos
  fetchActivePlans: async (): Promise<AdminPlan[]> => {
    const { data, error } = await supabase
      .from('admin_plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    
    // Parse features from JSON string back to array
    const parsedData = (data || []).map(plan => {
      let features = plan.features;
      if (typeof plan.features === 'string') {
        try {
          features = JSON.parse(plan.features);
        } catch (error) {
          console.warn('Failed to parse features for plan:', plan.name, error);
          features = [];
        }
      }
      return {
        ...plan,
        features: Array.isArray(features) ? features : []
      };
    });
    
    return parsedData;
  },

  // Criar novo plano
  createPlan: async (planData: PlanFormData): Promise<AdminPlan> => {
    const { data, error } = await supabase
      .from('admin_plans')
      .insert({
        ...planData,
        features: JSON.stringify(planData.features)
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar plano existente
  updatePlan: async ({ id, planData }: { id: string; planData: Partial<PlanFormData> }): Promise<AdminPlan> => {
    const updateData = { ...planData };
    
    // Converter features para JSON se presente
    if (planData.features) {
      updateData.features = JSON.stringify(planData.features) as any;
    }

    const { data, error } = await supabase
      .from('admin_plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deletar plano
  deletePlan: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('admin_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Alternar status ativo/inativo
  togglePlanStatus: async ({ id, is_active }: { id: string; is_active: boolean }): Promise<AdminPlan> => {
    const { data, error } = await supabase
      .from('admin_plans')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Definir plano como popular
  setPopularPlan: async (id: string): Promise<AdminPlan> => {
    // Primeiro remove popular de todos (operação atômica)
    const { error: clearError } = await supabase
      .from('admin_plans')
      .update({ is_popular: false })
      .neq('id', id); // Exclui o que vai ser marcado como popular

    if (clearError) throw clearError;

    // Depois define o selecionado como popular
    const { data, error } = await supabase
      .from('admin_plans')
      .update({ is_popular: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Hook principal com cache inteligente
export const useAdminPlansCache = () => {
  const queryClient = useQueryClient();

  // Query para buscar todos os planos (com cache)
  const {
    data: plans = [],
    isLoading: loading,
    error,
    refetch: fetchPlans,
  } = useQuery({
    queryKey: QUERY_KEYS.adminPlans,
    queryFn: planApiService.fetchAllPlans,
    staleTime: 2 * 60 * 1000, // Cache válido por 2 minutos
    cacheTime: 5 * 60 * 1000, // Manter no cache por 5 minutos
  });

  // Query para planos ativos (usado na landing page)
  const fetchActivePlansQuery = useQuery({
    queryKey: QUERY_KEYS.activePlans,
    queryFn: planApiService.fetchActivePlans,
    staleTime: 5 * 60 * 1000, // Cache mais longo para dados menos dinâmicos
    enabled: false, // Só executa quando chamado explicitamente
  });

  // Mutations com invalidação automática de cache
  const createPlanMutation = useMutation({
    mutationFn: planApiService.createPlan,
    onSuccess: (newPlan) => {
      // Atualiza o cache localmente sem refetch
      queryClient.setQueryData(QUERY_KEYS.adminPlans, (old: AdminPlan[] = []) => {
        return [...old, newPlan].sort((a, b) => a.display_order - b.display_order);
      });
      // Invalida cache de planos ativos para refetch automático
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activePlans });
    },
    onError: (error) => {
      console.error('Error creating plan:', error);
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: planApiService.updatePlan,
    onSuccess: (updatedPlan) => {
      // Atualiza o cache localmente
      queryClient.setQueryData(QUERY_KEYS.adminPlans, (old: AdminPlan[] = []) => {
        return old.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan);
      });
      // Invalida cache de planos ativos
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activePlans });
    },
    onError: (error) => {
      console.error('Error updating plan:', error);
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: planApiService.deletePlan,
    onSuccess: (_, deletedId) => {
      // Remove do cache localmente
      queryClient.setQueryData(QUERY_KEYS.adminPlans, (old: AdminPlan[] = []) => {
        return old.filter(plan => plan.id !== deletedId);
      });
      // Invalida cache de planos ativos
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activePlans });
    },
    onError: (error) => {
      console.error('Error deleting plan:', error);
    },
  });

  const togglePlanStatusMutation = useMutation({
    mutationFn: planApiService.togglePlanStatus,
    onSuccess: (updatedPlan) => {
      // Atualiza o cache localmente
      queryClient.setQueryData(QUERY_KEYS.adminPlans, (old: AdminPlan[] = []) => {
        return old.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan);
      });
      // Invalida cache de planos ativos
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activePlans });
    },
    onError: (error) => {
      console.error('Error toggling plan status:', error);
    },
  });

  const setPopularPlanMutation = useMutation({
    mutationFn: planApiService.setPopularPlan,
    onSuccess: (popularPlan) => {
      // Atualiza o cache: remove popular de todos e marca o novo
      queryClient.setQueryData(QUERY_KEYS.adminPlans, (old: AdminPlan[] = []) => {
        return old.map(plan => ({
          ...plan,
          is_popular: plan.id === popularPlan.id
        }));
      });
      // Invalida cache de planos ativos
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activePlans });
    },
    onError: (error) => {
      console.error('Error setting popular plan:', error);
    },
  });

  // Configurar real-time subscription para invalidação automática
  useEffect(() => {
    const subscription = supabase
      .channel('admin_plans_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'admin_plans' },
        (payload) => {
          console.log('Real-time change detected:', payload.eventType);
          // Invalida todas as queries relacionadas para refetch automático
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPlans });
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activePlans });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);

  // Funções auxiliares
  const getPlanBySlug = (slug: string): AdminPlan | null => {
    return plans.find(plan => plan.slug === slug) || null;
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return 'Gratuito';
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatCredits = (credits: number | null): string => {
    if (credits === null) return 'Ilimitado';
    if (credits === 0) return '0 créditos';
    return `${credits.toLocaleString('pt-BR')} créditos`;
  };

  // Função para buscar planos ativos (com cache)
  const fetchActivePlans = async () => {
    return await fetchActivePlansQuery.refetch().then(result => result.data || []);
  };

  return {
    // Dados
    plans,
    loading,
    error: error?.message || null,
    
    // Queries
    fetchPlans: () => fetchPlans(),
    fetchActivePlans,
    
    // Mutations - agora com loading states individuais
    createPlan: {
      mutateAsync: createPlanMutation.mutateAsync,
      isLoading: createPlanMutation.isLoading,
    },
    updatePlan: {
      mutateAsync: updatePlanMutation.mutateAsync,
      isLoading: updatePlanMutation.isLoading,
    },
    deletePlan: {
      mutateAsync: deletePlanMutation.mutateAsync,
      isLoading: deletePlanMutation.isLoading,
    },
    togglePlanStatus: {
      mutateAsync: togglePlanStatusMutation.mutateAsync,
      isLoading: togglePlanStatusMutation.isLoading,
    },
    setPopularPlan: {
      mutateAsync: setPopularPlanMutation.mutateAsync,
      isLoading: setPopularPlanMutation.isLoading,
    },
    
    // Utilitários
    getPlanBySlug,
    formatPrice,
    formatCredits,
    
    // Getters convenientes (computados do cache)
    activePlans: plans.filter(plan => plan.is_active),
    popularPlan: plans.find(plan => plan.is_popular),
    
    // Estados de loading individuais para UI mais granular
    isCreating: createPlanMutation.isLoading,
    isUpdating: updatePlanMutation.isLoading,
    isDeleting: deletePlanMutation.isLoading,
    isToggling: togglePlanStatusMutation.isLoading,
    isSettingPopular: setPopularPlanMutation.isLoading,
    
    // Função para invalidar cache manualmente se necessário
    invalidateCache: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPlans });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activePlans });
    },
  };
};
