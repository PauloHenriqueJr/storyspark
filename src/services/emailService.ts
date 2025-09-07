import { supabase } from "@/lib/supabase";

// Para operações que precisam de service role, use sempre o cliente normal por enquanto
// Até termos a service role key configurada adequadamente no ambiente
function getServiceRoleClient() {
  // Sempre retornar o cliente singleton normal para evitar múltiplas instâncias
  return supabase;
}
import {
  EmailTemplate,
  TemplateVariables,
  ProcessedTemplate,
  emailTemplatesService,
} from "./emailTemplatesService";

// Importações de fallback para compatibilidade durante migração
import {
  processTemplate as processHardcodedTemplate,
  getTemplate as getHardcodedTemplate,
  validateTemplateVariables as validateHardcodedVariables,
} from "./emailTemplates";

// Interface para a resposta da API do Mailtrap
interface MailtrapResponse {
  success: boolean;
  message_ids?: string[];
  errors?: string[];
}

// Tipos para o serviço de e-mail
export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  to: EmailRecipient[];
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  variables?: TemplateVariables;
  category?: string;
}

export interface WaitlistInviteData {
  email: string;
  name?: string;
  inviteCode: string;
  expiresAt: string;
}

export interface WaitlistConfirmationData {
  email: string;
  name?: string;
  selectedIdeas?: string[];
  waitlistPosition: number;
}

class EmailService {
  private isInitialized = false;
  private readonly baseUrl = "https://send.api.mailtrap.io/api/send";

  private config = {
    token: "",
    senderEmail: "suporte@storyspark.com.br",
    senderName: "StorySpark",
    accountId: "2428199",
    emailMode: "development" as "development" | "production",
  };

  constructor() {
    this.initializeFromEnv();
  }

  private initializeFromEnv() {
    // Configuração para usar Resend em vez de Mailtrap
    const resendToken = import.meta.env.VITE_RESEND_API_KEY || "";
    const emailMode = import.meta.env.VITE_EMAIL_MODE || "development";
    const fromEmail = import.meta.env.VITE_EMAIL_FROM || "suporte@storyspark.com.br";
    const fromName = import.meta.env.VITE_EMAIL_FROM_NAME || "StorySpark";

    if (resendToken) {
      this.config.token = resendToken;
      this.config.senderEmail = fromEmail;
      this.config.senderName = fromName;
      this.config.emailMode = emailMode;
      this.initialize();
      
      // Log modo de operação
      console.log(`📧 EmailService inicializado em modo: ${emailMode}`);
      if (emailMode === "development") {
        console.log("⚠️ Modo desenvolvimento: emails serão redirecionados para o email de teste");
      }
    } else {
      console.warn("⚠️ VITE_RESEND_API_KEY não configurado. Emails não serão enviados.");
    }
  }

  private initialize() {
    try {
      // Validar se o token está presente
      if (!this.config.token) {
        throw new Error("Token da API do Mailtrap não configurado");
      }
      this.isInitialized = true;
      console.log("✅ EmailService inicializado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar EmailService:", error);
      this.isInitialized = false;
    }
  }

  // Configurar o serviço com novas credenciais
  public configure(config: Partial<typeof this.config>) {
    this.config = { ...this.config, ...config };
    if (this.config.token) {
      this.initialize();
    }
  }

  // Método privado para fazer requisições via Edge Function
  private async makeRequest(payload: any): Promise<MailtrapResponse> {
    // Usar Edge Function como proxy para evitar problemas de CORS
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error("URL do Supabase não configurada");
    }

    // Obter token de sessão do usuário autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Erro no proxy de e-mail: ${response.status} - ${JSON.stringify(
          errorData
        )}`
      );
    }

    return await response.json();
  }

  // Verificar se o serviço está configurado
  public isConfigured(): boolean {
    return this.isInitialized;
  }

  // Enviar e-mail genérico
  public async sendEmail(options: SendEmailOptions): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    warning?: string;
  }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error:
          "EmailService não está configurado. Verifique as credenciais do Mailtrap.",
      };
    }

    try {
      console.log("📧 Enviando e-mail via Edge Function...");

      let htmlContent = options.html;
      let textContent = options.text;

      // Se um template foi especificado, processar o template
      if (options.template && options.variables) {
        const template = await emailTemplatesService.getTemplateWithFallback(
          options.template
        );
        if (!template) {
          return {
            success: false,
            error: `Template '${options.template}' não encontrado`,
          };
        }

        // Validar variáveis do template
        const validation = emailTemplatesService.validateTemplateVariables(
          template,
          options.variables
        );
        if (!validation.isValid) {
          return {
            success: false,
            error: `Variáveis do template inválidas: ${validation.missingVariables?.join(
              ", "
            )}`,
          };
        }

        const processedTemplate = emailTemplatesService.processTemplate(
          template,
          options.variables
        );
        htmlContent = processedTemplate.html;
        textContent = processedTemplate.text;
      }

      const payload = {
        from: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: options.to,
        subject: options.subject,
        html: htmlContent,
        text: textContent,
        category: options.category || "general",
      };

      // Registrar log inicial
      const logId = await this.createEmailLog({
        recipient_email: options.to[0].email,
        recipient_name: options.to[0].name,
        sender_email: this.config.senderEmail,
        sender_name: this.config.senderName,
        subject: options.subject,
        email_type: options.category || "general",
        status: "pending",
      });

      try {
        const response = await this.makeRequest(payload);

        // A resposta do Mailtrap contém message_ids (array) em vez de message_id
        const messageId = response.message_ids?.[0] || "unknown";

        // Atualizar log com sucesso
        if (logId) {
          const metadata = { response };
          // Verificação de testMode removida - não mais necessária
          if (response.originalRecipient) {
            metadata.originalRecipient = response.originalRecipient;
          }

          await this.updateEmailLog(logId, {
            status: "sent",
            provider_message_id: messageId,
            sent_at: new Date().toISOString(),
            metadata,
          });
        }

        // Lógica de modo de teste removida - não mais necessária

        console.log("✅ E-mail enviado com sucesso:", response);
        return {
          success: true,
          messageId: messageId,
        };
      } catch (sendError: any) {
        // Atualizar log com erro
        if (logId) {
          await this.updateEmailLog(logId, {
            status: "failed",
            error_message: sendError.message,
            metadata: { error: sendError.message },
          });
        }
        throw sendError;
      }
    } catch (error: any) {
      console.error("❌ Erro ao enviar e-mail:", error);

      return {
        success: false,
        error: error.message || "Erro desconhecido ao enviar e-mail",
      };
    }
  }

  // Enviar convite da waitlist usando template
  public async sendWaitlistInvite(data: WaitlistInviteData): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    warning?: string;
  }> {
    try {
      const template = await emailTemplatesService.getTemplateWithFallback(
        "waitlist-invite"
      );
      if (!template) {
        return {
          success: false,
          error: "Template de convite da waitlist não encontrado",
        };
      }

      const loginUrl = `https://storyspark.com/auth?invite=${data.inviteCode}`;
      const variables: TemplateVariables = {
        userName: data.name || "Usuário",
        inviteCode: data.inviteCode,
        loginUrl,
        supportEmail: "suporte@storyspark.com.br",
        expiresAt: data.expiresAt,
      };

      // Validar variáveis obrigatórias
      const validation = emailTemplatesService.validateTemplateVariables(
        template,
        variables
      );
      if (!validation.isValid) {
        return {
          success: false,
          error: `Variáveis obrigatórias ausentes: ${validation.missingVariables.join(
            ", "
          )}`,
        };
      }

      const processedTemplate = emailTemplatesService.processTemplate(
        template,
        variables
      );

      return this.sendEmail({
        to: [{ email: data.email, name: data.name }],
        subject: processedTemplate.subject,
        html: processedTemplate.html,
        text: processedTemplate.text,
        category: "waitlist_invite",
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erro ao processar template de convite",
      };
    }
  }

  // Enviar confirmação da waitlist usando template
  public async sendWaitlistConfirmation(
    data: WaitlistConfirmationData
  ): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    warning?: string;
  }> {
    try {
      // Buscar template APENAS do banco de dados pelo nome exato
      const template = await emailTemplatesService.getTemplateByName(
        "Confirmação da Waitlist"
      );
      
      if (!template) {
        console.error("Template 'Confirmação da Waitlist' não encontrado no banco de dados");
        return {
          success: false,
          error: "Template 'Confirmação da Waitlist' não encontrado no banco de dados. Por favor, verifique se o template existe.",
        };
      }

      // Formatar ideias selecionadas para o template
      let selectedIdeasHtml = "";
      let selectedIdeasText = "";
      let hasSelectedIdeas = false;

      if (data.selectedIdeas && data.selectedIdeas.length > 0) {
        hasSelectedIdeas = true;
        selectedIdeasHtml = data.selectedIdeas
          .map((idea) => `<div style="margin: 8px 0; padding: 8px 12px; background: #f1f5f9; border-radius: 6px; color: #475569;">• ${idea}</div>`)
          .join("");
        selectedIdeasText = data.selectedIdeas
          .map((idea) => `- ${idea}`)
          .join("\n");
      }

      // Variáveis compatíveis com o template que usa {name} e {position}
      const variables: TemplateVariables = {
        name: data.name || "Usuário", // Nome do usuário
        email: data.email,
        userEmail: data.email, // Adicionar userEmail para compatibilidade
        selectedIdeas: hasSelectedIdeas ? selectedIdeasHtml : '', // Passa string vazia se não houver ideias
        position: data.waitlistPosition.toString(), // Usar 'position' em vez de 'waitlistPosition'
        waitlistPosition: data.waitlistPosition.toString(), // Manter ambos para compatibilidade
        supportEmail: "suporte@storyspark.com.br",
        website_url: "https://storyspark.com.br",
        unsubscribe_url: "https://storyspark.com.br/unsubscribe",
        currentYear: new Date().getFullYear().toString(),
      };

      // Validar variáveis obrigatórias
      const validation = emailTemplatesService.validateTemplateVariables(
        template,
        variables
      );
      if (!validation.isValid) {
        return {
          success: false,
          error: `Variáveis obrigatórias ausentes: ${validation.missingVariables.join(
            ", "
          )}`,
        };
      }

      const processedTemplate = emailTemplatesService.processTemplate(
        template,
        variables
      );

      // O processamento já deve ter sido feito pelo processTemplate, não precisa substituir novamente
      let finalText = processedTemplate.text;

      return this.sendEmail({
        to: [{ email: data.email }],
        subject: processedTemplate.subject,
        html: processedTemplate.html,
        text: finalText,
        category: "waitlist_confirmation",
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erro ao processar template de confirmação",
      };
    }
  }

  // Enviar e-mail de boas-vindas usando template
  public async sendWelcomeEmail(
    email: string,
    name?: string
  ): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    warning?: string;
  }> {
    try {
      const template = await emailTemplatesService.getTemplateWithFallback(
        "welcome"
      );
      if (!template) {
        return {
          success: false,
          error: "Template de boas-vindas não encontrado",
        };
      }

      const dashboardUrl = "https://storyspark.com/dashboard";
      const tutorialUrl = "https://storyspark.com/tutorial";
      const variables: TemplateVariables = {
        userName: name || "Usuário",
        dashboardUrl,
        tutorialUrl,
        supportEmail: "suporte@storyspark.com.br",
      };

      // Validar variáveis obrigatórias
      const validation = emailTemplatesService.validateTemplateVariables(
        template,
        variables
      );
      if (!validation.isValid) {
        return {
          success: false,
          error: `Variáveis obrigatórias ausentes: ${validation.missingVariables.join(
            ", "
          )}`,
        };
      }

      const processedTemplate = emailTemplatesService.processTemplate(
        template,
        variables
      );

      return this.sendEmail({
        to: [{ email, name }],
        subject: processedTemplate.subject,
        html: processedTemplate.html,
        text: processedTemplate.text,
        category: "welcome",
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erro ao processar template de boas-vindas",
      };
    }
  }

  // Enviar e-mail de teste para verificar configuração
  public async sendTestEmail(email: string): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    warning?: string;
  }> {
    try {
      const template = await emailTemplatesService.getTemplateWithFallback(
        "test"
      );
      if (!template) {
        return {
          success: false,
          error: "Template de teste não encontrado",
        };
      }

      const variables: TemplateVariables = {
        testDate: new Date().toLocaleString("pt-BR"),
        configStatus: "Funcionando corretamente",
      };

      const processedTemplate = emailTemplatesService.processTemplate(
        template,
        variables
      );

      return this.sendEmail({
        to: [{ email, name: "Administrador" }],
        subject: processedTemplate.subject,
        html: processedTemplate.html,
        text: processedTemplate.text,
        category: "test",
      });
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erro ao enviar e-mail de teste",
      };
    }
  }

  // Enviar e-mail usando template personalizado
  public async sendTemplateEmail(
    templateId: string,
    recipients: EmailRecipient[],
    variables: TemplateVariables,
    options?: Partial<SendEmailOptions>
  ): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    warning?: string;
  }> {
    try {
      // Buscar template do banco de dados com fallback
      const template = await emailTemplatesService.getTemplateWithFallback(
        templateId
      );
      if (!template) {
        return {
          success: false,
          error: `Template '${templateId}' não encontrado`,
        };
      }

      // Validar variáveis obrigatórias
      const validation = emailTemplatesService.validateTemplateVariables(
        template,
        variables
      );
      if (!validation.isValid) {
        return {
          success: false,
          error: `Variáveis obrigatórias ausentes: ${validation.missingVariables.join(
            ", "
          )}`,
        };
      }

      const processedTemplate = emailTemplatesService.processTemplate(
        template,
        variables
      );

      const emailOptions: SendEmailOptions = {
        to: recipients,
        subject: processedTemplate.subject,
        html: processedTemplate.html,
        text: processedTemplate.text,
        category: templateId,
        ...options,
      };

      return await this.sendEmail(emailOptions);
    } catch (error: any) {
      return {
        success: false,
        error:
          error.message || `Erro ao enviar e-mail com template '${templateId}'`,
      };
    }
  }

  // Listar todos os templates disponíveis
  public async getAvailableTemplates(): Promise<EmailTemplate[]> {
    try {
      return await emailTemplatesService.getAllTemplatesWithFallback();
    } catch (error) {
      console.error("Erro ao buscar templates disponíveis:", error);
      return [];
    }
  }

  // Criar log inicial de e-mail
  private async createEmailLog(data: {
    recipient_email: string;
    recipient_name?: string;
    sender_email: string;
    sender_name: string;
    subject: string;
    email_type: string;
    status: "pending" | "sent" | "failed";
    workspace_id?: string;
    user_id?: string;
  }): Promise<string | null> {
    try {
      // Obter usuário atual
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Se não há usuário autenticado, não criar log (modo desenvolvimento)
      if (!user) {
        console.warn("Usuário não autenticado - log de e-mail não será criado");
        return null;
      }

      // Obter workspace_id do usuário se não fornecido
      let workspaceId = data.workspace_id;
      if (!workspaceId) {
        const { data: memberData } = await getServiceRoleClient()
          .from("workspace_members")
          .select("workspace_id")
          .eq("user_id", user.id)
          .single();

        workspaceId = memberData?.workspace_id;
      }

      // Se ainda não há workspace_id, não criar log
      if (!workspaceId) {
        console.warn(
          "Workspace não encontrado - log de e-mail não será criado"
        );
        return null;
      }

      const { data: logData, error } = await getServiceRoleClient()
        .from("email_logs")
        .insert({
          workspace_id: workspaceId,
          user_id: data.user_id || user.id,
          recipient_email: data.recipient_email,
          recipient_name: data.recipient_name,
          sender_email: data.sender_email,
          sender_name: data.sender_name,
          subject: data.subject,
          email_type: data.email_type,
          status: data.status,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (error) throw error;
      return logData.id;
    } catch (error) {
      console.error("Erro ao criar log de e-mail:", error);
      return null;
    }
  }

  // Atualizar log de e-mail
  private async updateEmailLog(
    logId: string,
    updates: {
      status?: "pending" | "sent" | "failed";
      provider_message_id?: string;
      sent_at?: string;
      error_message?: string;
      metadata?: any;
    }
  ) {
    try {
      const { error } = await getServiceRoleClient()
        .from("email_logs")
        .update(updates)
        .eq("id", logId);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao atualizar log de e-mail:", error);
    }
  }

  // Obter estatísticas de e-mail
  public async getEmailStats(emailType?: string) {
    try {
      let query = supabase
        .from("email_logs")
        .select("status, email_type, sent_at, created_at");

      if (emailType) {
        query = query.eq("email_type", emailType);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stats = {
        total: data.length,
        sent: data.filter((log) => log.status === "sent").length,
        failed: data.filter((log) => log.status === "failed").length,
        pending: data.filter((log) => log.status === "pending").length,
        byType: {} as Record<string, number>,
      };

      data.forEach((log) => {
        stats.byType[log.email_type] = (stats.byType[log.email_type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Erro ao obter estatísticas de e-mail:", error);
      return null;
    }
  }

  // Obter logs de e-mail com filtros
  public async getEmailLogs(filters?: {
    status?: "pending" | "sent" | "failed";
    email_type?: string;
    recipient_email?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from("email_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.email_type) {
        query = query.eq("email_type", filters.email_type);
      }

      if (filters?.recipient_email) {
        query = query.eq("recipient_email", filters.recipient_email);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 50) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao obter logs de e-mail:", error);
      return null;
    }
  }
}

// Instância singleton do serviço
export const emailService = new EmailService();

// Exportar classe para testes
export { EmailService };
