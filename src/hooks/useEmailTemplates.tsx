import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_variables: string[];
  variables: string[]; // Campo adicional para compatibilidade
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  workspace_id?: string;
  usage_count?: number; // Campo usado no componente
  metadata?: {
    email_template_id?: string;
    migrated_from_code?: boolean;
    migration_date?: string;
    subject?: string;
    html_content?: string;
    text_content?: string;
    [key: string]: any;
  };
}

export interface CreateEmailTemplateInput {
  name: string;
  description?: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_variables?: string[];
  category?: string;
  is_active?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateEmailTemplateInput extends Partial<CreateEmailTemplateInput> {
  id: string;
}

export const useEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar templates do banco de dados
  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('templates')
        .select('*')
        .eq('type', 'EMAIL')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      // Mapear dados do banco para o formato do hook
      const mappedTemplates: EmailTemplate[] = (data || []).map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        subject: template.metadata?.subject || template.metadata?.subject_line || template.name,
        html_content: template.metadata?.html_content || template.content || '',
        text_content: template.metadata?.text_content || template.content || '',
        template_variables: template.variables || [],
        variables: template.variables || [], // Adicionar campo variables para compatibilidade
        category: template.category,
        is_active: template.is_public !== false, // Mapear is_public para is_active
        usage_count: template.usage_count || 0, // Adicionar campo usage_count
        created_at: template.created_at,
        updated_at: template.updated_at,
        workspace_id: template.workspace_id,
        metadata: {
          ...template.metadata,
          subject: template.metadata?.subject || template.metadata?.subject_line || template.name,
          html_content: template.metadata?.html_content || template.content || '',
          text_content: template.metadata?.text_content || template.content || ''
        }
      }));

      setTemplates(mappedTemplates);
    } catch (err) {
      console.error('Erro ao carregar templates:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast.error('Erro ao carregar templates de email');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo template
  const createTemplate = async (input: CreateEmailTemplateInput): Promise<EmailTemplate | null> => {
    try {
      // Detectar variáveis automaticamente do conteúdo HTML
      const detectedVariables = detectTemplateVariables(input.html_content);
      const allVariables = [...new Set([...(input.template_variables || []), ...detectedVariables])];

      const templateData = {
        name: input.name,
        description: input.description,
        category: input.category || 'custom',
        content: input.html_content, // Usar 'content' ao invés de 'html_content'
        type: 'EMAIL',
        variables: allVariables,
        is_public: input.is_active ?? true, // Usar 'is_public' ao invés de 'is_active'
        metadata: {
          subject: input.subject,
          html_content: input.html_content,
          text_content: input.text_content,
          ...(input.metadata || {})
        }
      };

      const { data, error: supabaseError } = await supabase
        .from('templates')
        .insert([templateData])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      const newTemplate: EmailTemplate = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        subject: data.metadata?.subject || data.name,
        html_content: data.metadata?.html_content || data.content || '',
        text_content: data.metadata?.text_content || data.content || '',
        template_variables: data.variables || [],
        category: data.category,
        is_active: data.is_public !== false,
        created_at: data.created_at,
        updated_at: data.updated_at,
        workspace_id: data.workspace_id,
        metadata: data.metadata
      };

      setTemplates(prev => [newTemplate, ...prev]);
      toast.success('Template criado com sucesso!');
      return newTemplate;
    } catch (err) {
      console.error('Erro ao criar template:', err);
      toast.error('Erro ao criar template');
      return null;
    }
  };

  // Atualizar template existente
  const updateTemplate = async (input: UpdateEmailTemplateInput): Promise<boolean> => {
    try {
      const currentTemplate = templates.find(t => t.id === input.id);
      if (!currentTemplate) {
        throw new Error('Template não encontrado');
      }

      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.html_content !== undefined) updateData.content = input.html_content; // Usar 'content'
      if (input.is_active !== undefined) updateData.is_public = input.is_active; // Usar 'is_public'

      // Detectar e atualizar variáveis se o conteúdo HTML foi alterado
      if (input.html_content !== undefined) {
        const detectedVariables = detectTemplateVariables(input.html_content);
        const existingVariables = input.template_variables || [];
        updateData.variables = [...new Set([...existingVariables, ...detectedVariables])];
      } else if (input.template_variables !== undefined) {
        updateData.variables = input.template_variables;
      }

      // Atualizar metadata
      const updatedMetadata = {
        ...currentTemplate.metadata,
        ...(input.metadata || {})
      };

      if (input.subject !== undefined) updatedMetadata.subject = input.subject;
      if (input.html_content !== undefined) updatedMetadata.html_content = input.html_content;
      if (input.text_content !== undefined) updatedMetadata.text_content = input.text_content;

      updateData.metadata = updatedMetadata;

      const { error: supabaseError } = await supabase
        .from('templates')
        .update(updateData)
        .eq('id', input.id);

      if (supabaseError) {
        throw supabaseError;
      }

      // Atualizar estado local
      setTemplates(prev => prev.map(template => {
        if (template.id === input.id) {
          return {
            ...template,
            name: updateData.name || template.name,
            description: updateData.description || template.description,
            category: updateData.category || template.category,
            subject: updatedMetadata.subject || template.subject,
            html_content: updatedMetadata.html_content || template.html_content,
            text_content: updatedMetadata.text_content || template.text_content,
            template_variables: updateData.variables || template.template_variables,
            is_active: updateData.is_public !== undefined ? updateData.is_public : template.is_active,
            updated_at: updateData.updated_at,
            metadata: updatedMetadata
          };
        }
        return template;
      }));

      toast.success('Template atualizado com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar template:', err);
      toast.error('Erro ao atualizar template');
      return false;
    }
  };

  // Excluir template
  const deleteTemplate = async (id: string): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      setTemplates(prev => prev.filter(template => template.id !== id));
      toast.success('Template excluído com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao excluir template:', err);
      toast.error('Erro ao excluir template');
      return false;
    }
  };

  // Duplicar template
  const duplicateTemplate = async (id: string): Promise<EmailTemplate | null> => {
    try {
      const originalTemplate = templates.find(t => t.id === id);
      if (!originalTemplate) {
        throw new Error('Template não encontrado');
      }

      const duplicatedTemplate: CreateEmailTemplateInput = {
        name: `${originalTemplate.name} (Cópia)`,
        description: originalTemplate.description,
        subject: originalTemplate.subject,
        html_content: originalTemplate.html_content,
        text_content: originalTemplate.text_content,
        template_variables: originalTemplate.template_variables,
        category: originalTemplate.category,
        is_active: false, // Duplicatas começam inativas
        metadata: {
          ...originalTemplate.metadata,
          duplicated_from: id,
          duplicated_at: new Date().toISOString()
        }
      };

      return await createTemplate(duplicatedTemplate);
    } catch (err) {
      console.error('Erro ao duplicar template:', err);
      toast.error('Erro ao duplicar template');
      return null;
    }
  };

  // Função utilitária para detectar variáveis no template
  const detectTemplateVariables = (htmlContent: string): string[] => {
    const variableRegex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(htmlContent)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  };

  // Obter template por ID
  const getTemplateById = (id: string): EmailTemplate | undefined => {
    return templates.find(template => template.id === id);
  };

  // Filtrar templates por categoria
  const getTemplatesByCategory = (category: string): EmailTemplate[] => {
    return templates.filter(template => template.category === category);
  };

  // Obter templates ativos
  const getActiveTemplates = (): EmailTemplate[] => {
    return templates.filter(template => template.is_active);
  };

  // Estatísticas dos templates
  const getStats = () => {
    const total = templates.length;
    const active = templates.filter(t => t.is_active).length;
    const inactive = total - active;
    const categories = [...new Set(templates.map(t => t.category).filter(Boolean))];
    const migrated = templates.filter(t => t.metadata?.migrated_from_code).length;

    return {
      total,
      active,
      inactive,
      categories: categories.length,
      migrated
    };
  };

  // Carregar templates na inicialização
  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    stats: getStats(),
    loadTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    getTemplateById,
    getTemplatesByCategory,
    getActiveTemplates,
    detectTemplateVariables
  };
};

export default useEmailTemplates;