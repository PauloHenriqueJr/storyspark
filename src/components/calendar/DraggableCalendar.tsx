import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CalendarEvent } from '@/types/calendar';

interface DraggableCalendarProps {
  events: CalendarEvent[];
  onEventsChange: (events: CalendarEvent[]) => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  filterPlatform: string;
  viewMode: 'month' | 'week' | 'list';
  onCreateEvent: (date: Date) => void;
  currentDate?: Date; // Nova prop para sincronizar com a página principal
  onDateChange?: (date: Date) => void; // Callback para mudanças de mês
}

const DraggableCalendar: React.FC<DraggableCalendarProps> = ({
  events,
  onEventsChange,
  selectedDate,
  onDateSelect,
  filterPlatform,
  viewMode,
  onCreateEvent,
  currentDate: propCurrentDate,
  onDateChange
}) => {
  const [currentDate, setCurrentDate] = useState(propCurrentDate || new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dayEventsOpen, setDayEventsOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);
  const [weekStartDate, setWeekStartDate] = useState(new Date()); // Estado para navegação semanal
  const { toast } = useToast();

  // Sincronizar com a prop currentDate quando ela mudar
  React.useEffect(() => {
    if (propCurrentDate) {
      setCurrentDate(propCurrentDate);
    }
  }, [propCurrentDate]);

  // Inicializar semana baseada na data selecionada
  React.useEffect(() => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    setWeekStartDate(startOfWeek);
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDaysArray = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Dias vazios do início
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return events.filter(event => {
      // Comparar usando o formato de data do evento (pode ser Date object ou string)
      let eventDateString: string;
      if (event.date instanceof Date) {
        eventDateString = event.date.toISOString().split('T')[0];
      } else {
        // Se for string, assumir que já está no formato correto
        eventDateString = String(event.date).split('T')[0];
      }
      
      const matchesDate = eventDateString === dateString;
      const matchesPlatform = filterPlatform === 'all' || event.platform.toLowerCase() === filterPlatform;
      return matchesDate && matchesPlatform;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    
    // Notificar a página principal sobre a mudança
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(weekStartDate);
    if (direction === 'prev') {
      newWeekStart.setDate(weekStartDate.getDate() - 7);
    } else {
      newWeekStart.setDate(weekStartDate.getDate() + 7);
    }
    setWeekStartDate(newWeekStart);
    
    // Atualizar também a data selecionada para o primeiro dia da nova semana
    onDateSelect(newWeekStart);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetDay: number) => {
    e.preventDefault();
    if (draggedEvent) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), targetDay);
      const updatedEvents = events.map(event => 
        event.id === draggedEvent.id 
          ? { ...event, date: newDate }
          : event
      );
      onEventsChange(updatedEvents);
      setDraggedEvent(null);
      toast({
        title: "Evento movido",
        description: `${draggedEvent.title} reagendado para ${newDate.toLocaleDateString('pt-BR')}`,
      });
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
  };

  const getStatusBadge = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'Agendado': 'default',
      'Publicado': 'secondary',
      'Rascunho': 'outline'
    };
    return variants[status] || 'outline';
  };

  const today = new Date();

  // Render different views based on viewMode
  const renderMonthView = () => (
    <div>
      {/* Week Headers */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {getDaysArray().map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="p-2 min-h-[80px]" />;
          }

          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const dayEvents = getEventsForDate(day);

          return (
            <motion.div
              key={`day-${day}`}
              className={`
                min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all duration-200 relative group
                ${isToday ? 'border-primary bg-primary/5' : 'border-border/40'}
                ${isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}
              `}
              onClick={() => {
                onDateSelect(date);
                // Se o dia tem eventos, mostrar lista de eventos
                if (dayEvents.length > 0) {
                  setSelectedDayEvents(dayEvents);
                  setSelectedDayDate(date);
                  setDayEventsOpen(true);
                } else {
                  // Se não tem eventos, abrir modal de criar
                  onCreateEvent(date);
                }
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
            >
              <div className={`
                text-sm font-medium mb-2
                ${isToday ? 'text-primary' : 'text-foreground'}
              `}>
                {day}
              </div>
              
              {/* Event indicators - agora com ícones das redes sociais */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <div
                    key={`event-${day}-${event.id}-${eventIndex}`}
                    className="flex items-center gap-1 p-1 rounded cursor-pointer hover:bg-muted/50 transition-all"
                    title={`${event.title} - ${event.time} (${event.platform})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    <event.icon 
                      className="w-3 h-3 text-white p-0.5 rounded" 
                      style={{ backgroundColor: event.color || '#8B5CF6' }}
                    />
                    <div className="text-xs truncate flex-1">{event.title}</div>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center mt-1">
                    +{dayEvents.length - 3} mais
                  </div>
                )}
              </div>

              {/* Add button - appears on hover only when no events */}
              {dayEvents.length === 0 && (
                <button
                  className="absolute inset-0 flex items-center justify-center bg-muted/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateEvent(date);
                  }}
                >
                  <Plus className="w-6 h-6 text-primary" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderWeekView = () => {
    // Usar weekStartDate para navegação independente
    const startOfWeek = new Date(weekStartDate);
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div>
        {/* Navegação da semana */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Semana de {startOfWeek.toLocaleDateString('pt-BR', { 
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayEvents = events.filter(event => {
              const dayString = day.toISOString().split('T')[0];
              
              // Comparar usando o formato de data do evento
              let eventDateString: string;
              if (event.date instanceof Date) {
                eventDateString = event.date.toISOString().split('T')[0];
              } else {
                eventDateString = String(event.date).split('T')[0];
              }
              
              const matchesDate = eventDateString === dayString;
              const matchesPlatform = filterPlatform === 'all' || event.platform.toLowerCase() === filterPlatform;
              return matchesDate && matchesPlatform;
            });
            
            const isToday = day.toDateString() === today.toDateString();
            const isSelected = day.toDateString() === selectedDate.toDateString();

            return (
              <div key={index} className="space-y-2">
                <div className={`text-center p-2 rounded-lg cursor-pointer ${
                  isToday ? 'bg-primary text-primary-foreground' : 
                  isSelected ? 'bg-primary/10 border border-primary' : 'hover:bg-muted'
                }`}
                onClick={() => onDateSelect(day)}
                >
                  <div className="text-xs text-muted-foreground">
                    {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-semibold">
                    {day.getDate()}
                  </div>
                </div>
                
                <div className="space-y-1 min-h-[200px]">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-2 rounded bg-primary/10 border-l-2 border-primary cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <event.icon className={`w-3 h-3 text-white p-0.5 rounded`} style={{ backgroundColor: event.color }} />
                        <span className="text-xs font-medium">{event.time}</span>
                      </div>
                      <div className="text-xs truncate">{event.title}</div>
                    </div>
                  ))}
                  
                  <button
                    className="w-full p-2 border-2 border-dashed border-muted-foreground/20 rounded hover:border-primary/50 transition-colors flex items-center justify-center"
                    onClick={() => onCreateEvent(day)}
                  >
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const filteredEvents = events.filter(event => {
      const matchesPlatform = filterPlatform === 'all' || event.platform.toLowerCase() === filterPlatform;
      return matchesPlatform;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => handleEventClick(event)}
          >
            <event.icon className={`w-8 h-8 text-white p-2 rounded ${event.color}`} />
            <div className="flex-1">
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {event.platform} • {event.date.toLocaleDateString('pt-BR')} às {event.time}
              </p>
            </div>
            <Badge variant={getStatusBadge(event.status)}>
              {event.status}
            </Badge>
          </div>
        ))}
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              Nenhum evento encontrado
            </p>
            <Button onClick={() => onCreateEvent(new Date())}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Evento
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {viewMode === 'month' && currentDate.toLocaleDateString('pt-BR', { 
              month: 'long', 
              year: 'numeric' 
            })}
            {viewMode === 'week' && 'Visualização Semanal'}
            {viewMode === 'list' && 'Lista de Eventos'}
          </CardTitle>
          {/* Navegação apenas para o modo mês */}
          {viewMode === 'month' && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'list' && renderListView()}
      </CardContent>

      {/* Day Events Modal */}
      <Dialog open={dayEventsOpen} onOpenChange={setDayEventsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Eventos de {selectedDayDate?.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </DialogTitle>
            <DialogDescription>
              Selecione um evento para ver os detalhes ou adicione um novo evento para este dia.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedDayEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedEvent(event);
                  setDetailsOpen(true);
                  setDayEventsOpen(false);
                }}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color || '#8B5CF6' }}></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.time} • {event.platform}
                  </p>
                </div>
                <Badge variant={getStatusBadge(event.status)} className="text-xs">
                  {event.status}
                </Badge>
              </div>
            ))}
            
            <div className="pt-2 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setDayEventsOpen(false);
                  if (selectedDayDate) {
                    onCreateEvent(selectedDayDate);
                  }
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Novo Evento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Evento</DialogTitle>
            <DialogDescription>
              Visualize, edite ou remova este evento do seu calendário.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <selectedEvent.icon className={`w-8 h-8 text-white p-2 rounded ${selectedEvent.color}`} />
                <div>
                  <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.date.toLocaleDateString('pt-BR')} às {selectedEvent.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Plataforma: {selectedEvent.platform}
                  </p>
                </div>
                <Badge variant={getStatusBadge(selectedEvent.status)} className="ml-auto">
                  {selectedEvent.status}
                </Badge>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Preview do Conteúdo</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    Este é um preview de como o post apareceria no {selectedEvent.platform}.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Conteúdo: {selectedEvent.title}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Estatísticas Previstas</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1.2k</div>
                    <div className="text-xs text-muted-foreground">Visualizações</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">89</div>
                    <div className="text-xs text-muted-foreground">Curtidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-xs text-muted-foreground">Comentários</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Evento
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    const newEvent = { ...selectedEvent, id: Date.now().toString() };
                    onEventsChange([...events, newEvent]);
                    setDetailsOpen(false);
                    toast({ title: "Evento duplicado com sucesso!" });
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicar
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => {
                    const updatedEvents = events.filter(e => e.id !== selectedEvent.id);
                    onEventsChange(updatedEvents);
                    setDetailsOpen(false);
                    toast({ title: "Evento removido com sucesso!" });
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DraggableCalendar;