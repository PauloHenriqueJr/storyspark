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
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformar dados para incluir estatísticas mockadas por enquanto
      const result = data.map(template => ({
        ...template,
        performance: `${(Math.random() * 15 + 5).toFixed(1)}%`,
        likes: Math.floor(Math.random() * 200 + 20),
        lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        platform: template.metadata?.platform || 'Instagram'
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
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false })
        .limit(50);

      if (error) throw error;

      const result = data.map(template => ({
        ...template,
        performance: `${(Math.random() * 15 + 5).toFixed(1)}%`,
        likes: Math.floor(Math.random() * 500 + 100),
        lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        platform: template.metadata?.platform || 'Instagram'
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
      const { error } = await supabase
        .from('templates')
        .update({ 
          usage_count: supabase.rpc('increment', { template_id: id })
        })
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
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(template => ({
        ...template,
        performance: `${(Math.random() * 15 + 5).toFixed(1)}%`,
        likes: Math.floor(Math.random() * 200 + 20),
        lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        platform: template.metadata?.platform || 'Instagram'
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
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('type', type)
        .order('usage_count', { ascending: false });

      if (error) throw error;

      return data.map(template => ({
        ...template,
        performance: `${(Math.random() * 15 + 5).toFixed(1)}%`,
        likes: Math.floor(Math.random() * 200 + 20),
        lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        platform: template.metadata?.platform || 'Instagram'
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

  // Obter estatísticas dos templates
  async getStats(workspaceId: string) {
    const cacheKey = `template_stats_${workspaceId}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const { data, error } = await supabase
        .from('templates')
        .select('category, usage_count, type')
        .eq('workspace_id', workspaceId);

      if (error) throw error;

      const totalTemplates = data.length;
      const totalUsage = data.reduce((acc, t) => acc + (t.usage_count || 0), 0);
      const categories = [...new Set(data.map(t => t.category).filter(Boolean))].length;
      
      const result = {
        totalTemplates,
        totalUsage,
        categories,
        averageUsage: totalTemplates > 0 ? Math.round(totalUsage / totalTemplates) : 0,
        // Mock data para outras métricas
        averageLikes: Math.floor(Math.random() * 100 + 50),
        averagePerformance: `${(Math.random() * 10 + 10).toFixed(1)}%`
      };

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos templates:', error);
      throw error;
    }
  },

  // Limpar cache (útil para debugging)
  clearCache(): void {
    invalidateCache();
  }
};