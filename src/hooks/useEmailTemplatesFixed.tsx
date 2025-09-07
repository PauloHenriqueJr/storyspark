import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

// Interface para os templates de email (baseada na estrutura real da tabela)
export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    html_content: string;
    text_content: string;
    template_variables: string[];
    variables: string[];
    category: string;
    is_active: boolean;
    metadata: any;
    created_at: string;
    updated_at: string;
    created_by?: string;

    // Campos adicionais para compatibilidade com componentes existentes
    description?: string; // Calculado a partir do metadata ou nome
    usage_count?: number; // Pode ser calculado se necessário
    workspace_id?: string; // Alias para created_by
}

// Detectar variáveis no template
const detectTemplateVariables = (content: string): string[] => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = content.match(variableRegex) || [];
    return [...new Set(matches.map(match => match.replace(/[{}]/g, '')))];
};

export const useEmailTemplatesFixed = () => {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Carregar templates do banco de dados usando Supabase
    const loadTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Usar type assertion para acessar a tabela email_templates que não está no schema
            const { data: rawData, error: supabaseError } = await supabase
                .from('email_templates' as any)
                .select('*')
                .order('created_at', { ascending: false });

            if (supabaseError) {
                console.error('Erro ao carregar templates:', supabaseError);
                throw supabaseError;
            }

            console.log('Dados brutos do banco:', rawData);

            // Mapear dados do banco para o formato do hook
            const mappedTemplates: EmailTemplate[] = (rawData || []).map((template: any) => {
                const htmlContent = template.html_content || '';
                const templateVariables = detectTemplateVariables(htmlContent);
                const variablesFromDB = Array.isArray(template.variables) ? template.variables : templateVariables;

                console.log('Mapeando template:', template.name, template);

                return {
                    id: template.id,
                    name: template.name,
                    subject: template.subject || template.name,
                    html_content: htmlContent,
                    text_content: template.text_content || '',
                    template_variables: variablesFromDB,
                    variables: variablesFromDB,
                    category: template.category || 'Geral',
                    is_active: template.is_active !== false,
                    metadata: template.metadata || {},
                    created_at: template.created_at || '',
                    updated_at: template.updated_at || '',
                    created_by: template.created_by,

                    // Campos calculados para compatibilidade
                    description: template.metadata?.description || `Template: ${template.name}`,
                    usage_count: template.metadata?.usage_count || 0,
                    workspace_id: template.created_by || 'default'
                };
            });

            setTemplates(mappedTemplates);

            toast({
                title: "Templates carregados",
                description: `${mappedTemplates.length} templates encontrados no banco de dados`,
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar templates';
            setError(errorMessage);
            console.error('Erro ao carregar templates:', err);

            toast({
                title: "Erro",
                description: "Não foi possível carregar os templates",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Criar novo template no banco de dados
    const createTemplate = async (templateData: Partial<EmailTemplate>) => {
        try {
            setLoading(true);

            const templateToInsert = {
                name: templateData.name || 'Novo Template',
                subject: templateData.subject || 'Assunto',
                html_content: templateData.html_content || '',
                text_content: templateData.text_content || '',
                category: templateData.category || 'Geral',
                variables: templateData.variables || [],
                is_active: templateData.is_active !== false,
                metadata: {
                    description: templateData.description || '',
                    ...templateData.metadata
                },
                created_by: 'system'
            };

            const { data, error: supabaseError } = await supabase
                .from('email_templates' as any)
                .insert([templateToInsert])
                .select()
                .single();

            if (supabaseError) {
                throw supabaseError;
            }

            // Mapear o dado retornado para o formato do hook
            const newTemplate: EmailTemplate = {
                id: data.id,
                name: data.name,
                subject: data.subject,
                html_content: data.html_content,
                text_content: data.text_content || '',
                template_variables: data.variables || [],
                variables: data.variables || [],
                category: data.category,
                is_active: data.is_active,
                metadata: data.metadata || {},
                created_at: data.created_at,
                updated_at: data.updated_at || data.created_at,
                created_by: data.created_by,

                // Campos calculados
                description: data.metadata?.description || `Template: ${data.name}`,
                usage_count: 0,
                workspace_id: data.created_by
            };

            // Atualizar a lista local
            setTemplates(prev => [newTemplate, ...prev]);

            toast({
                title: "Template criado",
                description: `Template "${newTemplate.name}" criado com sucesso`,
            });

            return { data: newTemplate, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar template';
            setError(errorMessage);

            toast({
                title: "Erro",
                description: "Não foi possível criar o template",
                variant: "destructive",
            });

            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Atualizar template no banco de dados
    const updateTemplate = async (id: string, templateData: Partial<EmailTemplate>) => {
        try {
            setLoading(true);

            console.log('Atualizando template com dados:', templateData);
            console.log('Template ID:', id);

            // Usar a função RPC que bypassa o RLS
            const { data: updateResult, error: supabaseError } = await supabase
                .rpc('update_email_template', {
                    template_id: id,
                    template_name: templateData.name,
                    template_subject: templateData.subject,
                    template_html_content: templateData.html_content,
                    template_text_content: templateData.text_content,
                    template_category: templateData.category,
                    template_variables: templateData.variables ? JSON.stringify(templateData.variables) : null,
                    template_is_active: templateData.is_active
                });

            if (supabaseError) {
                console.error('Erro do Supabase:', supabaseError);
                throw supabaseError;
            }

            if (!updateResult?.success) {
                throw new Error(updateResult?.error || 'Erro ao atualizar template');
            }

            console.log('Template atualizado com sucesso:', updateResult);

            // Atualizar a lista local
            setTemplates(prev => prev.map(template =>
                template.id === id
                    ? {
                        ...template,
                        ...templateData,
                        updated_at: new Date().toISOString()
                    }
                    : template
            ));

            toast({
                title: "Template atualizado",
                description: "Template atualizado com sucesso",
            });

            return { data: true, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar template';
            setError(errorMessage);

            toast({
                title: "Erro",
                description: "Não foi possível atualizar o template",
                variant: "destructive",
            });

            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Deletar template do banco de dados
    const deleteTemplate = async (id: string) => {
        try {
            setLoading(true);

            const { error: supabaseError } = await supabase
                .from('email_templates' as any)
                .delete()
                .eq('id', id);

            if (supabaseError) {
                throw supabaseError;
            }

            // Remover da lista local
            setTemplates(prev => prev.filter(template => template.id !== id));

            toast({
                title: "Template removido",
                description: "Template removido com sucesso",
            });

            return { data: true, error: null };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar template';
            setError(errorMessage);

            toast({
                title: "Erro",
                description: "Não foi possível remover o template",
                variant: "destructive",
            });

            return { data: null, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Carregar templates na inicialização
    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]);

    return {
        templates,
        loading,
        error,
        loadTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        refreshTemplates: loadTemplates
    };
};

export default useEmailTemplatesFixed;
