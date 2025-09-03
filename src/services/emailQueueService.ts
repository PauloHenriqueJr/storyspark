import { supabase } from "@/lib/supabase";
import { emailService, WaitlistConfirmationData } from "./emailService";

interface EmailQueueItem {
  id: string;
  email: string;
  email_type: string;
  template_data: any;
  status: "pending" | "processing" | "sent" | "failed";
  attempts: number;
  max_attempts: number;
  error_message?: string;
  scheduled_at: string;
  processed_at?: string;
}

class EmailQueueService {
  private isProcessing = false;
  private processingInterval: NodeJS.Timeout | null = null;

  // Iniciar processamento automático da fila
  public startProcessing(intervalMs: number = 30000) {
    if (this.processingInterval) {
      this.stopProcessing();
    }

    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, intervalMs);

    // Processar imediatamente
    this.processQueue();
  }

  // Parar processamento automático
  public stopProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  // Processar fila de emails
  public async processQueue(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      // Buscar emails pendentes
      const { data: pendingEmails, error } = await supabase
        .from("email_queue")
        .select("*")
        .eq("status", "pending")
        .lte("scheduled_at", new Date().toISOString())
        .order("created_at", { ascending: true })
        .limit(10);

      if (error) {
        console.error("Erro ao buscar emails da fila:", error);
        return;
      }

      if (!pendingEmails || pendingEmails.length === 0) {
        return;
      }

      // Filtrar emails que ainda não excederam o número máximo de tentativas
      const validEmails = pendingEmails.filter(
        (email) => email.attempts < email.max_attempts
      );

      // Processar cada email
      for (const emailItem of validEmails) {
        await this.processEmailItem(emailItem);
      }
    } catch (error) {
      console.error("Erro ao processar fila de emails:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Processar um item específico da fila
  private async processEmailItem(emailItem: EmailQueueItem): Promise<void> {
    try {
      // Marcar como processando
      await this.updateEmailStatus(
        emailItem.id,
        "processing",
        emailItem.attempts + 1
      );

      let result: { success: boolean; messageId?: string; error?: string };

      // Processar baseado no tipo de email
      switch (emailItem.email_type) {
        case "waitlist_confirmation":
          result = await this.sendWaitlistConfirmation(emailItem);
          break;

        case "waitlist_invite":
          // TODO: Implementar quando necessário
          result = {
            success: false,
            error: "Tipo de email não implementado ainda",
          };
          break;

        case "welcome":
          // TODO: Implementar quando necessário
          result = {
            success: false,
            error: "Tipo de email não implementado ainda",
          };
          break;

        default:
          result = {
            success: false,
            error: `Tipo de email desconhecido: ${emailItem.email_type}`,
          };
      }

      // Atualizar status baseado no resultado
      if (result.success) {
        await this.updateEmailStatus(
          emailItem.id,
          "sent",
          emailItem.attempts + 1,
          undefined,
          new Date().toISOString()
        );
        console.log(
          `Email ${emailItem.email_type} enviado com sucesso para ${emailItem.email}`
        );
      } else {
        const newAttempts = emailItem.attempts + 1;
        const status =
          newAttempts >= emailItem.max_attempts ? "failed" : "pending";

        await this.updateEmailStatus(
          emailItem.id,
          status,
          newAttempts,
          result.error
        );

        if (status === "failed") {
          console.error(
            `Email ${emailItem.email_type} falhou definitivamente para ${emailItem.email}: ${result.error}`
          );
        } else {
          console.warn(
            `Email ${emailItem.email_type} falhou (tentativa ${newAttempts}/${emailItem.max_attempts}) para ${emailItem.email}: ${result.error}`
          );
        }
      }
    } catch (error: any) {
      console.error(`Erro ao processar email ${emailItem.id}:`, error);

      // Marcar como falha se excedeu tentativas
      const newAttempts = emailItem.attempts + 1;
      const status =
        newAttempts >= emailItem.max_attempts ? "failed" : "pending";

      await this.updateEmailStatus(
        emailItem.id,
        status,
        newAttempts,
        error.message || "Erro desconhecido"
      );
    }
  }

  // Enviar confirmação da waitlist
  private async sendWaitlistConfirmation(
    emailItem: EmailQueueItem
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const templateData = emailItem.template_data as WaitlistConfirmationData;

    if (!templateData.email || !templateData.waitlistPosition) {
      return {
        success: false,
        error: "Dados do template inválidos para confirmação da waitlist",
      };
    }

    return await emailService.sendWaitlistConfirmation(templateData);
  }

  // Atualizar status do email na fila
  private async updateEmailStatus(
    id: string,
    status: EmailQueueItem["status"],
    attempts: number,
    errorMessage?: string,
    processedAt?: string
  ): Promise<void> {
    const updateData: any = {
      status,
      attempts,
      updated_at: new Date().toISOString(),
    };

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    if (processedAt) {
      updateData.processed_at = processedAt;
    }

    const { error } = await supabase
      .from("email_queue")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error(`Erro ao atualizar status do email ${id}:`, error);
    }
  }

  // Adicionar email à fila manualmente (útil para testes)
  public async addToQueue(
    email: string,
    emailType: string,
    templateData: any,
    scheduledAt?: Date
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("email_queue").insert({
        email,
        email_type: emailType,
        template_data: templateData,
        scheduled_at: scheduledAt?.toISOString() || new Date().toISOString(),
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Obter estatísticas da fila
  public async getQueueStats(): Promise<{
    pending: number;
    processing: number;
    sent: number;
    failed: number;
  }> {
    try {
      const { data, error } = await supabase
        .from("email_queue")
        .select("status")
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        ); // Últimas 24h

      if (error) {
        console.error("Erro ao buscar estatísticas da fila:", error);
        return { pending: 0, processing: 0, sent: 0, failed: 0 };
      }

      const stats = { pending: 0, processing: 0, sent: 0, failed: 0 };

      data?.forEach((item) => {
        if (item.status in stats) {
          stats[item.status as keyof typeof stats]++;
        }
      });

      return stats;
    } catch (error) {
      console.error("Erro ao calcular estatísticas da fila:", error);
      return { pending: 0, processing: 0, sent: 0, failed: 0 };
    }
  }
}

// Instância singleton
export const emailQueueService = new EmailQueueService();

// Iniciar processamento automático quando o serviço for importado
if (typeof window !== "undefined") {
  // Apenas no cliente, iniciar após um pequeno delay
  setTimeout(() => {
    emailQueueService.startProcessing(30000); // Processar a cada 30 segundos
  }, 5000);
}

export default emailQueueService;
export type { EmailQueueItem };
