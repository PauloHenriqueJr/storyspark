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
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateEventModal from '@/components/modals/CreateEventModal';
import DraggableCalendar from '@/components/calendar/DraggableCalendar';
import { CalendarEvent } from '@/types/calendar';

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Eventos do calendário
const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Post Black Friday',
    platform: 'Instagram',
    time: '09:00',
    date: new Date(2024, 10, 20),
    status: 'Agendado' as const,
    color: 'bg-pink-500',
    icon: Instagram
  },
  {
    id: '2',
    title: 'Stories Produto X',
    platform: 'Instagram',
    time: '14:30',
    date: new Date(2024, 10, 20),
    status: 'Agendado' as const,
    color: 'bg-pink-500',
    icon: Instagram
  },
  {
    id: '3',
    title: 'Campanha B2B',
    platform: 'LinkedIn',
    time: '10:00',
    date: new Date(2024, 10, 22),
    status: 'Publicado' as const,
    color: 'bg-blue-700',
    icon: Linkedin
  },
  {
    id: '4',
    title: 'Thread Educativa',
    platform: 'Twitter',
    time: '16:00',
    date: new Date(2024, 10, 23),
    status: 'Rascunho' as const,
    color: 'bg-blue-400',
    icon: Twitter
  },
  {
    id: '5',
    title: 'Vídeo Tutorial',
    platform: 'YouTube',
    time: '12:00',
    date: new Date(2024, 10, 25),
    status: 'Agendado' as const,
    color: 'bg-red-500',
    icon: Youtube
  }
];

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentDate, setCurrentDate] = useState(new Date(currentYear, currentMonth, 1));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventsList, setEventsList] = useState<CalendarEvent[]>(events);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const handleCreateEvent = (newEvent: any) => {
    setEventsList(prev => [...prev, newEvent]);
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
    return eventsList.filter(event => {
      const matchesDate = event.date.toDateString() === date.toDateString();
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
      'Agendado': 'default',
      'Publicado': 'secondary',
      'Rascunho': 'outline'
    };
    return variants[status] || 'outline';
  };

  const selectedDateEvents = eventsList.filter(event => {
    const matchesDate = event.date.toDateString() === selectedDate.toDateString();
    const matchesPlatform = filterPlatform === 'all' || event.platform.toLowerCase() === filterPlatform;
    return matchesDate && matchesPlatform;
  });

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
            events={eventsList}
            onEventsChange={setEventsList}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            filterPlatform={filterPlatform}
            viewMode={viewMode}
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
              {eventsList.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <event.icon className={`w-6 h-6 text-white p-1 rounded ${event.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString('pt-BR')} às {event.time}
                    </p>
                  </div>
                  <Badge variant={getStatusBadge(event.status)} className="text-xs">
                    {event.status}
                  </Badge>
                </div>
              ))}
              {eventsList.length === 0 && (
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
                  {eventsList.filter(e => e.status === 'Agendado').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Posts Publicados</span>
                <Badge variant="secondary">
                  {eventsList.filter(e => e.status === 'Publicado').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rascunhos</span>
                <Badge variant="outline">
                  {eventsList.filter(e => e.status === 'Rascunho').length}
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