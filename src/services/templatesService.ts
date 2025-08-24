import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

type Template = Database['public']['Tables']['templates']['Row'];
type CreateTemplateInput = Database['public']['Tables']['templates']['Insert'];
type UpdateTemplateInput = Database['public']['Tables']['templates']['Update'];
type TemplateType = Database['public']['Enums']['TemplateType'];

export interface TemplateWithStats extends Template {
  performance?: string;
  likes?: number;
  lastUsed?: string;
  platform?: string;
}

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
};

const setCachedData = <T>(key: string, data: T, ttl: number = CACHE_TTL): void => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

const invalidateCache = (pattern?: string): void => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

export const templatesService = {
  // Buscar todos os templates do workspace
  async getAll(workspaceId: string): Promise<TemplateWithStats[]> {
    const cacheKey = `templates_${workspaceId}`;
    const cached = getCachedData<TemplateWithStats[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*, template_stats(performance_rate,total_likes,last_used_date,monthly_usage,engagement_rate,conversion_rate)')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enriquecer com estatísticas reais quando disponíveis
      const result = (data || []).map((template: any) => ({
        ...template,
        performance: template?.template_stats?.[0]?.performance_rate !== undefined
          ? `${Number(template.template_stats[0].performance_rate).toFixed(1)}%`
          : undefined,
        likes: template?.template_stats?.[0]?.total_likes ?? 0,
        lastUsed: template?.template_stats?.[0]?.last_used_date ?? null,
        platform: template?.metadata?.platform || 'Instagram'
      }));

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      throw error;
    }
  },

  // Buscar templates públicos/globais
  async getPublicTemplates(): Promise<TemplateWithStats[]> {
    const cacheKey = 'public_templates';
    const cached = getCachedData<TemplateWithStats[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*, template_stats(performance_rate,total_likes,last_used_date,monthly_usage,engagement_rate,conversion_rate)')
        .eq('is_public', true)
        .order('usage_count', { ascending: false })
        .limit(50);

      if (error) throw error;

      const result = (data || []).map((template: any) => ({
        ...template,
        performance: template?.template_stats?.[0]?.performance_rate !== undefined
          ? `${Number(template.template_stats[0].performance_rate).toFixed(1)}%`
          : undefined,
        likes: template?.template_stats?.[0]?.total_likes ?? 0,
        lastUsed: template?.template_stats?.[0]?.last_used_date ?? null,
        platform: template?.metadata?.platform || 'Instagram'
      }));

      setCachedData(cacheKey, result, CACHE_TTL * 2); // Cache público por mais tempo
      return result;
    } catch (error) {
      console.error('Erro ao buscar templates públicos:', error);
      throw error;
    }
  },

  // Criar novo template
  async create(input: Omit<CreateTemplateInput, 'id' | 'created_at' | 'updated_at'>): Promise<Template> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert({
          ...input,
          usage_count: 0,
          is_public: input.is_public || false
        })
        .select()
        .single();

      if (error) throw error;
      
      // Invalidar cache relacionado
      invalidateCache('templates');
      
      return data;
    } catch (error) {
      console.error('Erro ao criar template:', error);
      throw error;
    }
  },

  // Atualizar template
  async update(id: string, updates: UpdateTemplateInput): Promise<Template> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Invalidar cache relacionado
      invalidateCache('templates');
      
      return data;
    } catch (error) {
      console.error('Erro ao atualizar template:', error);
      throw error;
    }
  },

  // Deletar template
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar template:', error);
      throw error;
    }
  },

  // Buscar template por ID
  async getById(id: string): Promise<Template | null> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar template:', error);
      throw error;
    }
  },

  // Incrementar usage count
  async incrementUsage(id: string): Promise<void> {
    try {
      // Buscar uso atual e incrementar localmente (sem RPC)
      const { data: current, error: fetchError } = await supabase
        .from('templates')
        .select('usage_count')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const next = ((current?.usage_count as number | null) || 0) + 1;

      const { error } = await supabase
        .from('templates')
        .update({ usage_count: next, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao incrementar usage count:', error);
      // Não fazer throw aqui para não quebrar o fluxo principal
    }
  },

  // Buscar templates por categoria
  async getByCategory(workspaceId: string, category: string): Promise<TemplateWithStats[]> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*, template_stats(performance_rate,total_likes,last_used_date,monthly_usage,engagement_rate,conversion_rate)')
        .eq('workspace_id', workspaceId)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((template: any) => ({
        ...template,
        performance: template?.template_stats?.[0]?.performance_rate !== undefined
          ? `${Number(template.template_stats[0].performance_rate).toFixed(1)}%`
          : undefined,
        likes: template?.template_stats?.[0]?.total_likes ?? 0,
        lastUsed: template?.template_stats?.[0]?.last_used_date ?? null,
        platform: template?.metadata?.platform || 'Instagram'
      }));
    } catch (error) {
      console.error('Erro ao buscar templates por categoria:', error);
      throw error;
    }
  },

  // Buscar templates por tipo
  async getByType(workspaceId: string, type: TemplateType): Promise<TemplateWithStats[]> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*, template_stats(performance_rate,total_likes,last_used_date,monthly_usage,engagement_rate,conversion_rate)')
        .eq('workspace_id', workspaceId)
        .eq('type', type)
        .order('usage_count', { ascending: false });

      if (error) throw error;

      return (data || []).map((template: any) => ({
        ...template,
        performance: template?.template_stats?.[0]?.performance_rate !== undefined
          ? `${Number(template.template_stats[0].performance_rate).toFixed(1)}%`
          : undefined,
        likes: template?.template_stats?.[0]?.total_likes ?? 0,
        lastUsed: template?.template_stats?.[0]?.last_used_date ?? null,
        platform: template?.metadata?.platform || 'Instagram'
      }));
    } catch (error) {
      console.error('Erro ao buscar templates por tipo:', error);
      throw error;
    }
  },

  // Duplicar template
  async duplicate(id: string, workspaceId: string, userId: string): Promise<Template> {
    try {
      // Buscar template original
      const original = await this.getById(id);
      if (!original) throw new Error('Template não encontrado');

      // Criar cópia
      const { data, error } = await supabase
        .from('templates')
        .insert({
          name: `${original.name} (Cópia)`,
          description: original.description,
          content: original.content,
          type: original.type,
          category: original.category,
          tags: original.tags,
          variables: original.variables,
          metadata: original.metadata,
          workspace_id: workspaceId,
          user_id: userId,
          is_public: false,
          usage_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao duplicar template:', error);
      throw error;
    }
  },

  // Obter estatísticas dos templates (dados reais via template_stats)
  async getStats(workspaceId: string) {
    const cacheKey = `template_stats_${workspaceId}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Buscar templates do workspace (para ids, categorias e uso)
      const { data, error } = await supabase
        .from('templates')
        .select('id, category, usage_count, type')
        .eq('workspace_id', workspaceId);

      if (error) throw error;

      const totalTemplates = data?.length || 0;
      const totalUsage = (data || []).reduce((acc, t) => acc + (t.usage_count || 0), 0);
      const categories = [...new Set((data || []).map(t => t.category).filter(Boolean))].length;

      // Agregar estatísticas reais
      let averageLikes = 0;
      let averagePerformance = '0.0%';

      const ids = (data || []).map(t => t.id);
      if (ids.length > 0) {
        const { data: statsData, error: statsError } = await supabase
          .from('template_stats')
          .select('template_id, total_likes, performance_rate')
          .in('template_id', ids);

        if (statsError) {
          // Não quebrar a página por falha secundária
          console.warn('Aviso: falha ao buscar template_stats:', statsError);
        } else if (statsData && statsData.length > 0) {
          const sumLikes = statsData.reduce((acc: number, s: any) => acc + (s.total_likes || 0), 0);
          const sumPerf = statsData.reduce((acc: number, s: any) => acc + (Number(s.performance_rate) || 0), 0);
          averageLikes = Math.round(sumLikes / statsData.length);
          averagePerformance = `${(sumPerf / statsData.length).toFixed(1)}%`;
        }
      }

      const result = {
        totalTemplates,
        totalUsage,
        categories,
        averageUsage: totalTemplates > 0 ? Math.round(totalUsage / totalTemplates) : 0,
        averageLikes,
        averagePerformance
      };

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos templates:', error);
      throw error;
    }
  },

  // Favoritos (persistente)
  async toggleFavorite(templateId: string, userId: string): Promise<boolean> {
    // retorna true se favoritou, false se removeu
    const { data: exists } = await supabase
      .from('template_favorites')
      .select('template_id')
      .eq('template_id', templateId)
      .eq('user_id', userId)
      .maybeSingle();

    if (exists) {
      const { error } = await supabase
        .from('template_favorites')
        .delete()
        .eq('template_id', templateId)
        .eq('user_id', userId);
      if (error) throw error;
      return false;
    }

    const { error } = await supabase
      .from('template_favorites')
      .insert({ template_id: templateId, user_id: userId });
    if (error) throw error;
    return true;
  },

  async getFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('template_favorites')
      .select('template_id')
      .eq('user_id', userId);

    if (error) throw error;
    return (data || []).map((r: any) => r.template_id as string);
  },

  async share(templateId: string, isPublic: boolean = true) {
    const { data, error } = await supabase
      .from('templates')
      .update({ is_public: isPublic, updated_at: new Date().toISOString() })
      .eq('id', templateId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Limpar cache (útil para debugging)
  clearCache(): void {
    invalidateCache();
  }
};