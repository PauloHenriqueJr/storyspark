import { supabase } from "@/lib/supabase";
import type { Database } from "@/integrations/supabase/types";

type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"];
type CreateEventInput =
  Database["public"]["Tables"]["calendar_events"]["Insert"];
type UpdateEventInput =
  Database["public"]["Tables"]["calendar_events"]["Update"];
type EventStatus = "SCHEDULED" | "PUBLISHED" | "DRAFT" | "CANCELLED";

export interface CalendarEventWithStats extends CalendarEvent {
  formattedDate?: string;
  formattedTime?: string;
  statusBadge?: string;
  platformIcon?: string;
}

export const calendarService = {
  // Buscar todos os eventos do workspace
  async getAll(workspaceId: string): Promise<CalendarEventWithStats[]> {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("event_date", { ascending: true });

      if (error) throw error;

      return data.map((event) => ({
        ...event,
        formattedDate: new Date(
          `${event.event_date}T${event.event_time}`
        ).toLocaleDateString("pt-BR"),
        formattedTime: event.event_time.slice(0, 5), // HH:MM format
        statusBadge: this.getStatusBadge(event.status),
        platformIcon: this.getPlatformIcon(event.platform),
      }));
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      throw error;
    }
  },

  // Criar novo evento
  async create(
    input: Omit<CreateEventInput, "id" | "created_at" | "updated_at">
  ): Promise<CalendarEvent> {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .insert({
          ...input,
          status: input.status || "DRAFT",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      throw error;
    }
  },

  // Atualizar evento
  async update(id: string, updates: UpdateEventInput): Promise<CalendarEvent> {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      throw error;
    }
  },

  // Deletar evento
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
      throw error;
    }
  },

  // Buscar eventos por data
  async getByDate(
    workspaceId: string,
    date: string
  ): Promise<CalendarEventWithStats[]> {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("event_date", date)
        .order("event_time", { ascending: true });

      if (error) throw error;

      return data.map((event) => ({
        ...event,
        formattedDate: new Date(
          `${event.event_date}T${event.event_time}`
        ).toLocaleDateString("pt-BR"),
        formattedTime: event.event_time.slice(0, 5),
        statusBadge: this.getStatusBadge(event.status),
        platformIcon: this.getPlatformIcon(event.platform),
      }));
    } catch (error) {
      console.error("Erro ao buscar eventos por data:", error);
      throw error;
    }
  },

  // Buscar eventos por período
  async getByDateRange(
    workspaceId: string,
    startDate: string,
    endDate: string
  ): Promise<CalendarEventWithStats[]> {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("workspace_id", workspaceId)
        .gte("event_date", startDate)
        .lte("event_date", endDate)
        .order("event_date", { ascending: true });

      if (error) throw error;

      return data.map((event) => ({
        ...event,
        formattedDate: new Date(
          `${event.event_date}T${event.event_time}`
        ).toLocaleDateString("pt-BR"),
        formattedTime: event.event_time.slice(0, 5),
        statusBadge: this.getStatusBadge(event.status),
        platformIcon: this.getPlatformIcon(event.platform),
      }));
    } catch (error) {
      console.error("Erro ao buscar eventos por período:", error);
      throw error;
    }
  },

  // Atualizar status do evento
  async updateStatus(id: string, status: EventStatus): Promise<CalendarEvent> {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao atualizar status do evento:", error);
      throw error;
    }
  },

  // Buscar eventos por status
  async getByStatus(
    workspaceId: string,
    status: EventStatus
  ): Promise<CalendarEventWithStats[]> {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("status", status)
        .order("event_date", { ascending: true });

      if (error) throw error;

      return data.map((event) => ({
        ...event,
        formattedDate: new Date(
          `${event.event_date}T${event.event_time}`
        ).toLocaleDateString("pt-BR"),
        formattedTime: event.event_time.slice(0, 5),
        statusBadge: this.getStatusBadge(event.status),
        platformIcon: this.getPlatformIcon(event.platform),
      }));
    } catch (error) {
      console.error("Erro ao buscar eventos por status:", error);
      throw error;
    }
  },

  // Obter estatísticas dos eventos
  async getStats(workspaceId: string) {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("status, platform")
        .eq("workspace_id", workspaceId);

      if (error) throw error;

      const totalEvents = data.length;
      const scheduledEvents = data.filter(
        (e) => e.status === "SCHEDULED"
      ).length;
      const publishedEvents = data.filter(
        (e) => e.status === "PUBLISHED"
      ).length;
      const draftEvents = data.filter((e) => e.status === "DRAFT").length;

      // Contar por plataforma
      const platformStats = data.reduce(
        (acc: Record<string, number>, event) => {
          acc[event.platform] = (acc[event.platform] || 0) + 1;
          return acc;
        },
        {}
      );

      return {
        totalEvents,
        scheduledEvents,
        publishedEvents,
        draftEvents,
        platformStats,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  },

  // Helper methods
  getStatusBadge(status: string): string {
    const badges: Record<string, string> = {
      SCHEDULED: "Agendado",
      PUBLISHED: "Publicado",
      DRAFT: "Rascunho",
      CANCELLED: "Cancelado",
    };
    return badges[status] || status;
  },

  getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      Instagram: "instagram",
      Facebook: "facebook",
      Twitter: "twitter",
      LinkedIn: "linkedin",
      YouTube: "youtube",
      TikTok: "tiktok",
    };
    return icons[platform] || "globe";
  },
};
