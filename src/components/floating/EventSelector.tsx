import React from 'react';
import { Calendar, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarEvent {
  id: string;
  title: string;
  platform: string;
  time: string;
  date: Date;
  event_date: string;
  status: 'Agendado' | 'Publicado' | 'Rascunho';
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface EventSelectorProps {
  showEventSelector: boolean;
  setShowEventSelector: (show: boolean) => void;
  selectedEvent: CalendarEvent | null;
  onEventSelect: (event: CalendarEvent) => void;
}

const EventSelector: React.FC<EventSelectorProps> = ({ 
  showEventSelector, 
  setShowEventSelector, 
  selectedEvent, 
  onEventSelect 
}) => {
  // Dados de exemplo para demonstração
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Lançamento do Produto',
      platform: 'Instagram',
      time: '10:00',
      date: new Date(),
      event_date: new Date().toISOString(),
      status: 'Agendado',
      color: 'bg-blue-500',
      icon: Calendar
    },
    {
      id: '2',
      title: 'Webinar de Treinamento',
      platform: 'LinkedIn',
      time: '14:00',
      date: new Date(),
      event_date: new Date().toISOString(),
      status: 'Agendado',
      color: 'bg-green-500',
      icon: Calendar
    }
  ];

  if (!showEventSelector) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
        </div>
        <label className="text-sm font-semibold text-gray-900 dark:text-white">Selecionar Evento Agendado</label>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-3 border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800">
        {events.slice(0, 5).map((event) => (
          <div
            key={event.id}
            onClick={() => onEventSelect(event)}
            className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:border-blue-200 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                {event.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(event.event_date).toLocaleDateString()} • {event.platform}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSelector;