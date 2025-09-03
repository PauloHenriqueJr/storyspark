/**
 * Serviço para gerenciamento de templates de email do banco de dados
 * Substitui o uso de templates hardcoded por templates dinâmicos do banco
 */

import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_variables: string[];
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  workspace_id?: string;
  metadata?: {
    email_template_id?: string;
    migrated_from_code?: boolean;
    migration_date?: string;
    subject_line?: string;
    [key: string]: any;
  };
}

export interface TemplateVariables {
  [key: string]: string | number | boolean;
}

export interface ProcessedTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailTemplatesService {
  /**
   * Busca template por ID do banco de dados
   */
  async getTemplate(templateId: string): Promise<EmailTemplate | null> {
    try {
      // Primeiro, tenta buscar por email_template_id no metadata
      const { data: metadataResult, error: metadataError } = await supabase
        .from("templates")
        .select("*")
        .eq("type", "EMAIL")
        .contains("metadata", { email_template_id: templateId })
        .eq("is_public", true)
        .single();

      if (!metadataError && metadataResult) {
        return this.mapDbTemplateToEmailTemplate(metadataResult);
      }

      // Se não encontrou, busca por ID direto
      const { data: directResult, error: directError } = await supabase
        .from("templates")
        .select("*")
        .eq("id", templateId)
        .eq("type", "EMAIL")
        .eq("is_public", true)
        .single();

      if (directError || !directResult) {
        console.warn(
          `Template '${templateId}' não encontrado no banco de dados`
        );
        return null;
      }

      return this.mapDbTemplateToEmailTemplate(directResult);
    } catch (error) {
      console.error("Erro ao buscar template:", error);
      return null;
    }
  }

  /**
   * Busca todos os templates ativos do banco de dados
   */
  async getAllTemplates(): Promise<EmailTemplate[]> {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("type", "EMAIL")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar templates:", error);
        return [];
      }

      return (data || []).map((template) =>
        this.mapDbTemplateToEmailTemplate(template)
      );
    } catch (error) {
      console.error("Erro ao buscar templates:", error);
      return [];
    }
  }

  /**
   * Busca templates por categoria
   */
  async getTemplatesByCategory(category: string): Promise<EmailTemplate[]> {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("type", "EMAIL")
        .eq("category", category)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar templates por categoria:", error);
        return [];
      }

      return (data || []).map((template) =>
        this.mapDbTemplateToEmailTemplate(template)
      );
    } catch (error) {
      console.error("Erro ao buscar templates por categoria:", error);
      return [];
    }
  }

  /**
   * Processa template substituindo variáveis
   */
  processTemplate(
    template: EmailTemplate,
    variables: TemplateVariables
  ): ProcessedTemplate {
    let processedSubject = template.subject;
    let processedHtml = template.html_content;
    let processedText = template.text_content || "";

    // Substituir variáveis no formato {{variableName}}
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const stringValue = String(value);

      processedSubject = processedSubject.replace(
        new RegExp(placeholder, "g"),
        stringValue
      );
      processedHtml = processedHtml.replace(
        new RegExp(placeholder, "g"),
        stringValue
      );
      processedText = processedText.replace(
        new RegExp(placeholder, "g"),
        stringValue
      );
    });

    return {
      subject: processedSubject,
      html: processedHtml,
      text: processedText,
    };
  }

  /**
   * Valida se todas as variáveis obrigatórias foram fornecidas
   */
  validateTemplateVariables(
    template: EmailTemplate,
    variables: TemplateVariables
  ): {
    isValid: boolean;
    missingVariables: string[];
  } {
    const requiredVariables = template.template_variables || [];
    const providedVariables = Object.keys(variables);
    const missingVariables = requiredVariables.filter(
      (required) =>
        !providedVariables.includes(required) ||
        variables[required] === undefined ||
        variables[required] === null ||
        variables[required] === ""
    );

    return {
      isValid: missingVariables.length === 0,
      missingVariables,
    };
  }

  /**
   * Detecta variáveis em um conteúdo HTML
   */
  detectTemplateVariables(htmlContent: string): string[] {
    const variableRegex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = variableRegex.exec(htmlContent)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }

  /**
   * Mapeia template do banco de dados para o formato EmailTemplate
   */
  private mapDbTemplateToEmailTemplate(dbTemplate: any): EmailTemplate {
    return {
      id: dbTemplate.id,
      name: dbTemplate.name,
      description: dbTemplate.description || "",
      subject:
        dbTemplate.metadata?.subject_line ||
        dbTemplate.metadata?.subject ||
        "Sem assunto",
      html_content: dbTemplate.content || "",
      text_content: dbTemplate.content || "", // Usando content como fallback para text
      template_variables: dbTemplate.variables || [],
      category: dbTemplate.category || "general",
      is_active: dbTemplate.is_public ?? true, // Usando is_public como is_active
      created_at: dbTemplate.created_at,
      updated_at: dbTemplate.updated_at,
      workspace_id: dbTemplate.workspace_id,
      metadata: dbTemplate.metadata || {},
    };
  }

  /**
   * Busca template com fallback para templates hardcoded (compatibilidade)
   * Esta função será removida após migração completa
   */
  async getTemplateWithFallback(
    templateId: string
  ): Promise<EmailTemplate | null> {
    // Primeiro tenta buscar do banco
    const dbTemplate = await this.getTemplate(templateId);
    if (dbTemplate) {
      return dbTemplate;
    }

    // Se não encontrou no banco, tenta fallback para templates hardcoded
    console.warn(
      `Template '${templateId}' não encontrado no banco, usando fallback hardcoded`
    );

    try {
      // Importação dinâmica para evitar dependência circular
      const { getTemplate: getHardcodedTemplate } = await import(
        "./emailTemplates"
      );
      const hardcodedTemplate = getHardcodedTemplate(templateId);

      if (hardcodedTemplate) {
        // Converte template hardcoded para formato do banco
        return {
          id: hardcodedTemplate.id,
          name: hardcodedTemplate.name,
          description: `Template hardcoded: ${hardcodedTemplate.name}`,
          subject: hardcodedTemplate.subject,
          html_content: hardcodedTemplate.html,
          text_content: hardcodedTemplate.text,
          template_variables: Object.keys(hardcodedTemplate.variables),
          category: "Sistema",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {
            email_template_id: hardcodedTemplate.id,
            migrated_from_code: false,
            source: "hardcoded_fallback",
          },
        };
      }
    } catch (error) {
      console.error("Erro ao buscar template hardcoded:", error);
    }

    return null;
  }

  /**
   * Lista templates disponíveis com fallback
   * Esta função será removida após migração completa
   */
  async getAllTemplatesWithFallback(): Promise<EmailTemplate[]> {
    const dbTemplates = await this.getAllTemplates();

    // Se há templates no banco, usa apenas eles
    if (dbTemplates.length > 0) {
      return dbTemplates;
    }

    // Se não há templates no banco, usa fallback hardcoded
    console.warn(
      "Nenhum template encontrado no banco, usando fallback hardcoded"
    );

    try {
      const { getAllTemplates: getAllHardcodedTemplates } = await import(
        "./emailTemplates"
      );
      const hardcodedTemplates = getAllHardcodedTemplates();

      return hardcodedTemplates.map((template) => ({
        id: template.id,
        name: template.name,
        description: `Template hardcoded: ${template.name}`,
        subject: template.subject,
        html_content: template.html,
        text_content: template.text,
        template_variables: Object.keys(template.variables),
        category: "Sistema",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          email_template_id: template.id,
          migrated_from_code: false,
          source: "hardcoded_fallback",
        },
      }));
    } catch (error) {
      console.error("Erro ao buscar templates hardcoded:", error);
      return [];
    }
  }
}

// Instância singleton do serviço
export const emailTemplatesService = new EmailTemplatesService();

// Exportações para compatibilidade
export const getTemplate = (templateId: string) =>
  emailTemplatesService.getTemplateWithFallback(templateId);
export const getAllTemplates = () =>
  emailTemplatesService.getAllTemplatesWithFallback();
export const processTemplate = (
  template: EmailTemplate,
  variables: TemplateVariables
) => emailTemplatesService.processTemplate(template, variables);
export const validateTemplateVariables = (
  template: EmailTemplate,
  variables: TemplateVariables
) => emailTemplatesService.validateTemplateVariables(template, variables);

export default emailTemplatesService;
