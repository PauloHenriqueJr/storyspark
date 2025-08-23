import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Edit,
  Trash2,
  Copy,
  Filter,
  Grid3X3,
  List,
  Eye,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateEventModal from '@/components/modals/CreateEventModal';
import DraggableCalendar from '@/components/calendar/DraggableCalendar';
import { useCalendar } from '@/hooks/useCalendar';
import { useToast } from '@/hooks/use-toast';
import type { CalendarEventWithStats } from '@/services/calendarService';
import type { CalendarEvent } from '@/types/calendar';

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Função para converter CalendarEventWithStats para CalendarEvent
const transformEventForCalendar = (event: CalendarEventWithStats): CalendarEvent => {
  // Função helper para obter o ícone da plataforma
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram': return Instagram;
      case 'Facebook': return Facebook;
      case 'Twitter': return Twitter;
      case 'LinkedIn': return Linkedin;
      case 'YouTube': return Youtube;
      default: return CalendarIcon;
    }
  };

  // Função helper para mapear status do banco para o formato esperado
  const getStatusLabel = (status: string): 'Agendado' | 'Publicado' | 'Rascunho' => {
    switch (status) {
      case 'SCHEDULED': return 'Agendado';
      case 'PUBLISHED': return 'Publicado';
      case 'DRAFT': return 'Rascunho';
      case 'CANCELLED': return 'Rascunho'; // Tratar cancelado como rascunho para compatibilidade
      default: return 'Rascunho';
    }
  };

  // Função helper para obter cores CSS válidas baseadas na plataforma
  const getPlatformColor = (platform: string): string => {
    switch (platform) {
      case 'Instagram': return '#EC4899'; // pink-500
      case 'Facebook': return '#3B82F6'; // blue-500
      case 'Twitter': return '#60A5FA'; // blue-400
      case 'LinkedIn': return '#2563EB'; // blue-600
      case 'YouTube': return '#DC2626'; // red-600
      default: return '#8B5CF6'; // purple-500
    }
  };

  // Garantir que a data seja um objeto Date válido
  const eventDate = new Date(`${event.event_date}T${event.event_time}`);

  return {
    id: event.id,
    title: event.title,
    platform: event.platform,
    time: event.event_time.slice(0, 5), // HH:MM format
    date: eventDate, // Garantir que seja um Date object
    status: getStatusLabel(event.status),
    color: event.color || getPlatformColor(event.platform), // Usar cor do evento ou cor da plataforma
    icon: getPlatformIcon(event.platform)
  };
};

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(today);
  // Iniciar em novembro de 2024 onde estão os eventos de exemplo
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 1)); // 10 = novembro (0-indexado)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const { events, loading, error, stats, createEvent, deleteEvent, updateEventStatus, refetch } = useCalendar();
  const { toast } = useToast();

  const handleCreateEvent = async (newEvent: Omit<CalendarEventWithStats, 'id' | 'created_at' | 'updated_at' | 'workspace_id' | 'user_id' | 'formattedDate' | 'formattedTime' | 'statusBadge' | 'platformIcon'>) => {
    try {
      await createEvent(newEvent);
      toast({
        title: 'Sucesso!',
        description: 'Novo evento criado com sucesso.',
      });
      setShowCreateModal(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o evento. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast({
        title: 'Evento removido',
        description: 'O evento foi removido com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o evento. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

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
      const matchesDate = event.event_date === dateString;
      const matchesPlatform = filterPlatform === 'all' || event.platform.toLowerCase() === filterPlatform;
      return matchesDate && matchesPlatform;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'SCHEDULED': 'default',
      'PUBLISHED': 'secondary',
      'DRAFT': 'outline',
      'CANCELLED': 'destructive'
    };
    return variants[status] || 'outline';
  };

  const selectedDateEvents = events.filter(event => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const matchesDate = event.event_date === selectedDateString;
    const matchesPlatform = filterPlatform === 'all' || event.platform.toLowerCase() === filterPlatform;
    return matchesDate && matchesPlatform;
  });

  // Transformar eventos do banco para o formato esperado pelo DraggableCalendar
  const transformedEvents = events.map(transformEventForCalendar);

  const handleEventsChange = async (newEvents: CalendarEvent[]) => {
    // Fazer refetch dos dados para garantir sincronização
    try {
      await refetch();
      toast({
        title: 'Eventos atualizados',
        description: 'Os eventos foram sincronizados com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível sincronizar os eventos.',
        variant: 'destructive',
      });
    }
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  // Estados de loading e erro
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando eventos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar eventos</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Calendário
          </h1>
          <p className="text-muted-foreground">
            Planeje e acompanhe suas publicações
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-gradient-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Agendar Post
          </Button>
        </div>
      </motion.div>

      {/* Filter and View Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar por plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as plataformas</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'month' | 'week' | 'list')}>
          <TabsList>
            <TabsTrigger value="month" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Mês
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Semana
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Lista
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <DraggableCalendar
            events={transformedEvents}
            onEventsChange={handleEventsChange}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            filterPlatform={filterPlatform}
            viewMode={viewMode}
            currentDate={currentDate}
            onDateChange={handleDateChange}
            onCreateEvent={(date) => {
              setSelectedDate(date);
              setShowCreateModal(true);
            }}
          />
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Upcoming Posts */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Próximos Posts</CardTitle>
              <CardDescription>Próximos 7 dias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.slice(0, 5).map((event) => {
                const eventDate = new Date(`${event.event_date}T${event.event_time}`);
                
                return (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className={`w-6 h-6 rounded p-1`} style={{ backgroundColor: event.color || '#8B5CF6' }}>
                      <CalendarIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {eventDate.toLocaleDateString('pt-BR')} às {event.event_time.slice(0, 5)}
                      </p>
                    </div>
                    <Badge variant={getStatusBadge(event.status)} className="text-xs">
                      {event.statusBadge || event.status}
                    </Badge>
                  </div>
                );
              })}
              {events.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    Nenhum post agendado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-pink-500/10 hover:border-pink-500/20"
                onClick={() => setShowCreateModal(true)}
              >
                <Instagram className="mr-2 h-4 w-4" />
                Agendar Post Instagram
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-blue-600/10 hover:border-blue-600/20"
                onClick={() => setShowCreateModal(true)}
              >
                <Linkedin className="mr-2 h-4 w-4" />
                Agendar Post LinkedIn
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-blue-400/10 hover:border-blue-400/20"
                onClick={() => setShowCreateModal(true)}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Agendar Post Twitter
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-red-500/10 hover:border-red-500/20"
                onClick={() => setShowCreateModal(true)}
              >
                <Youtube className="mr-2 h-4 w-4" />
                Agendar Vídeo YouTube
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Estatísticas do Mês</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Posts Agendados</span>
                <Badge variant="default" className="bg-primary/10 text-primary">
                  {stats?.scheduledEvents || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Posts Publicados</span>
                <Badge variant="secondary">
                  {stats?.publishedEvents || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rascunhos</span>
                <Badge variant="outline">
                  {stats?.draftEvents || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total de Eventos</span>
                <Badge variant="outline">
                  {stats?.totalEvents || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        selectedDate={selectedDate}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default Calendar;