import { useState, useEffect } from 'react';
import { useWorkspace } from './useWorkspace';
import { templatesService, type TemplateWithStats } from '@/services/templatesService';
import type { Database } from '@/integrations/supabase/types';

type CreateTemplateInput = Database['public']['Tables']['templates']['Insert'];
type UpdateTemplateInput = Database['public']['Tables']['templates']['Update'];
type TemplateType = Database['public']['Enums']['TemplateType'];

export interface UseTemplatesReturn {
  templates: TemplateWithStats[];
  publicTemplates: TemplateWithStats[];
  loading: boolean;
  error: string | null;
  stats: {
    totalTemplates: number;
    totalUsage: number;
    categories: number;
    averageUsage: number;
    averageLikes: number;
    averagePerformance: string;
  } | null;
  createTemplate: (input: Omit<CreateTemplateInput, 'workspace_id' | 'user_id'>) => Promise<void>;
  updateTemplate: (id: string, updates: UpdateTemplateInput) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (id: string) => Promise<void>;
  getTemplatesByCategory: (category: string) => TemplateWithStats[];
  getTemplatesByType: (type: TemplateType) => TemplateWithStats[];
  incrementUsage: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useTemplates = (): UseTemplatesReturn => {
  const [templates, setTemplates] = useState<TemplateWithStats[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<TemplateWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UseTemplatesReturn['stats']>(null);
  
  const { workspace, user } = useWorkspace();

  const fetchTemplates = async () => {
    if (!workspace?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [templatesData, publicData, statsData] = await Promise.all([
        templatesService.getAll(workspace.id),
        templatesService.getPublicTemplates(),
        templatesService.getStats(workspace.id)
      ]);
      
      setTemplates(templatesData);
      setPublicTemplates(publicData);
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar templates:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (input: Omit<CreateTemplateInput, 'workspace_id' | 'user_id'>) => {
    if (!workspace?.id || !user?.id) {
      throw new Error('Workspace ou usuário não encontrado');
    }

    try {
      await templatesService.create({
        ...input,
        workspace_id: workspace.id,
        user_id: user.id
      });
      
      // Refetch data after creation
      await fetchTemplates();
    } catch (err) {
      console.error('Erro ao criar template:', err);
      throw err;
    }
  };

  const updateTemplate = async (id: string, updates: UpdateTemplateInput) => {
    try {
      await templatesService.update(id, updates);
      
      // Update local state optimistically
      setTemplates(prev => prev.map(template => 
        template.id === id ? { ...template, ...updates } : template
      ));
      
      // Refetch to ensure consistency
      await fetchTemplates();
    } catch (err) {
      console.error('Erro ao atualizar template:', err);
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await templatesService.delete(id);
      
      // Remove from local state optimistically
      setTemplates(prev => prev.filter(template => template.id !== id));
      
      // Update stats
      await fetchTemplates();
    } catch (err) {
      console.error('Erro ao deletar template:', err);
      throw err;
    }
  };

  const duplicateTemplate = async (id: string) => {
    if (!workspace?.id || !user?.id) {
      throw new Error('Workspace ou usuário não encontrado');
    }

    try {
      await templatesService.duplicate(id, workspace.id, user.id);
      
      // Refetch data after duplication
      await fetchTemplates();
    } catch (err) {
      console.error('Erro ao duplicar template:', err);
      throw err;
    }
  };

  const getTemplatesByCategory = (category: string): TemplateWithStats[] => {
    return templates.filter(template => template.category === category);
  };

  const getTemplatesByType = (type: TemplateType): TemplateWithStats[] => {
    return templates.filter(template => template.type === type);
  };

  const incrementUsage = async (id: string) => {
    try {
      await templatesService.incrementUsage(id);
      
      // Update local usage count optimistically
      setTemplates(prev => prev.map(template => 
        template.id === id 
          ? { ...template, usage_count: (template.usage_count || 0) + 1 } 
          : template
      ));
    } catch (err) {
      console.error('Erro ao incrementar uso do template:', err);
      // Não fazer throw aqui para não quebrar o fluxo principal
    }
  };

  const refetch = async () => {
    await fetchTemplates();
  };

  // Load templates when workspace changes
  useEffect(() => {
    fetchTemplates();
  }, [workspace?.id]);

  return {
    templates,
    publicTemplates,
    loading,
    error,
    stats,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    getTemplatesByCategory,
    getTemplatesByType,
    incrementUsage,
    refetch
  };
};