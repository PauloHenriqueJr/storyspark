import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useAdminPlans = () => {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os planos
  const fetchPlans = async () => {
    try {
      setLoading(true);
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
      
      setPlans(parsedData);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar apenas planos ativos (para usar na landing page e billing)
  const fetchActivePlans = async () => {
    try {
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
    } catch (err: any) {
      console.error('Error fetching active plans:', err);
      return [];
    }
  };

  // Criar novo plano
  const createPlan = async (planData: PlanFormData): Promise<AdminPlan | null> => {
    try {
      const { data, error } = await supabase
        .from('admin_plans')
        .insert({
          ...planData,
          features: JSON.stringify(planData.features)
        })
        .select()
        .single();

      if (error) throw error;
      
      // Atualizar lista local
      await fetchPlans();
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating plan:', err);
      return null;
    }
  };

  // Atualizar plano existente
  const updatePlan = async (id: string, planData: Partial<PlanFormData>): Promise<AdminPlan | null> => {
    try {
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
      
      // Atualizar lista local
      await fetchPlans();
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating plan:', err);
      return null;
    }
  };

  // Deletar plano
  const deletePlan = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('admin_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar lista local
      await fetchPlans();
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting plan:', err);
      return false;
    }
  };

  // Alternar status ativo/inativo
  const togglePlanStatus = async (id: string, is_active: boolean): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('admin_plans')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar lista local
      await fetchPlans();
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error toggling plan status:', err);
      return false;
    }
  };

  // Definir plano como popular (remove popular de outros)
  const setPopularPlan = async (id: string): Promise<boolean> => {
    try {
      // Primeiro remove popular de todos
      await supabase
        .from('admin_plans')
        .update({ is_popular: false });

      // Depois define o selecionado como popular
      const { error } = await supabase
        .from('admin_plans')
        .update({ is_popular: true })
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar lista local
      await fetchPlans();
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error setting popular plan:', err);
      return false;
    }
  };

  // Buscar plano por slug
  const getPlanBySlug = (slug: string): AdminPlan | null => {
    return plans.find(plan => plan.slug === slug) || null;
  };

  // Formatar preço para exibição
  const formatPrice = (price: number): string => {
    if (price === 0) return 'Gratuito';
    return `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Formatar créditos para exibição
  const formatCredits = (credits: number | null): string => {
    if (credits === null) return 'Ilimitado';
    if (credits === 0) return '0 créditos';
    return `${credits.toLocaleString('pt-BR')} créditos`;
  };

  // Carregar planos na inicialização
  useEffect(() => {
    fetchPlans();

    // Configurar real-time subscription para updates
    const subscription = supabase
      .channel('admin_plans_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'admin_plans' },
        () => {
          fetchPlans(); // Recarregar quando houver mudanças
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    plans,
    loading,
    error,
    fetchPlans,
    fetchActivePlans,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
    setPopularPlan,
    getPlanBySlug,
    formatPrice,
    formatCredits,
    // Getters convenientes
    activePlans: plans.filter(plan => plan.is_active),
    popularPlan: plans.find(plan => plan.is_popular),
  };
};
