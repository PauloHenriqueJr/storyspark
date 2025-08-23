import { useState, useEffect } from 'react';
import { useWorkspace } from './useWorkspace';
import { calendarService, type CalendarEventWithStats } from '@/services/calendarService';
import type { Database } from '@/integrations/supabase/types';

type CreateEventInput = Database['public']['Tables']['calendar_events']['Insert'];
type UpdateEventInput = Database['public']['Tables']['calendar_events']['Update'];
type EventStatus = 'SCHEDULED' | 'PUBLISHED' | 'DRAFT' | 'CANCELLED';

export interface UseCalendarReturn {
  events: CalendarEventWithStats[];
  loading: boolean;
  error: string | null;
  stats: {
    totalEvents: number;
    scheduledEvents: number;
    publishedEvents: number;
    draftEvents: number;
    platformStats: Record<string, number>;
  } | null;
  createEvent: (input: Omit<CreateEventInput, 'workspace_id' | 'user_id'>) => Promise<void>;
  updateEvent: (id: string, updates: UpdateEventInput) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateEventStatus: (id: string, status: EventStatus) => Promise<void>;
  getEventsByDate: (date: string) => CalendarEventWithStats[];
  getEventsByStatus: (status: EventStatus) => CalendarEventWithStats[];
  getEventsByDateRange: (startDate: string, endDate: string) => Promise<CalendarEventWithStats[]>;
  refetch: () => Promise<void>;
}

export const useCalendar = (): UseCalendarReturn => {
  const [events, setEvents] = useState<CalendarEventWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UseCalendarReturn['stats']>(null);
  
  const { workspace, user } = useWorkspace();

  const fetchEvents = async () => {
    if (!workspace?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [eventsData, statsData] = await Promise.all([
        calendarService.getAll(workspace.id),
        calendarService.getStats(workspace.id)
      ]);
      
      setEvents(eventsData);
      setStats(statsData);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (input: Omit<CreateEventInput, 'workspace_id' | 'user_id'>) => {
    if (!workspace?.id || !user?.id) {
      throw new Error('Workspace ou usuário não encontrado');
    }

    try {
      await calendarService.create({
        ...input,
        workspace_id: workspace.id,
        user_id: user.id
      });
      
      // Refetch data after creation
      await fetchEvents();
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: UpdateEventInput) => {
    try {
      await calendarService.update(id, updates);
      
      // Update local state optimistically
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...updates } : event
      ));
      
      // Refetch to ensure consistency
      await fetchEvents();
    } catch (err) {
      console.error('Erro ao atualizar evento:', err);
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await calendarService.delete(id);
      
      // Remove from local state optimistically
      setEvents(prev => prev.filter(event => event.id !== id));
      
      // Update stats
      await fetchEvents();
    } catch (err) {
      console.error('Erro ao deletar evento:', err);
      throw err;
    }
  };

  const updateEventStatus = async (id: string, status: EventStatus) => {
    try {
      const updatedEvent = await calendarService.updateStatus(id, status);
      
      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, status: updatedEvent.status } : event
      ));
      
      // Update stats
      await fetchEvents();
    } catch (err) {
      console.error('Erro ao alterar status do evento:', err);
      throw err;
    }
  };

  const getEventsByDate = (date: string): CalendarEventWithStats[] => {
    return events.filter(event => event.event_date === date);
  };

  const getEventsByStatus = (status: EventStatus): CalendarEventWithStats[] => {
    return events.filter(event => event.status === status);
  };

  const getEventsByDateRange = async (startDate: string, endDate: string): Promise<CalendarEventWithStats[]> => {
    if (!workspace?.id) return [];
    
    try {
      return await calendarService.getByDateRange(workspace.id, startDate, endDate);
    } catch (err) {
      console.error('Erro ao buscar eventos por período:', err);
      throw err;
    }
  };

  const refetch = async () => {
    await fetchEvents();
  };

  // Load events when workspace changes
  useEffect(() => {
    fetchEvents();
  }, [workspace?.id]);

  return {
    events,
    loading,
    error,
    stats,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    getEventsByDate,
    getEventsByStatus,
    getEventsByDateRange,
    refetch
  };
};