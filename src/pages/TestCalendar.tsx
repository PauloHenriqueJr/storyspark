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
import DraggableCalendar from '@/components/calendar/DraggableCalendar';
import type { CalendarEvent } from '@/types/calendar';

// Dados de teste estáticos para simular os eventos
const testEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Post Black Friday',
    platform: 'Instagram',
    time: '09:00',
    date: new Date('2024-11-20T09:00:00'),
    status: 'Agendado',
    color: '#EC4899', // pink-500
    icon: Instagram
  },
  {
    id: '2',
    title: 'Stories Produto X',
    platform: 'Instagram',
    time: '14:30',
    date: new Date('2024-11-20T14:30:00'),
    status: 'Agendado',
    color: '#EC4899', // pink-500
    icon: Instagram
  },
  {
    id: '3',
    title: 'Campanha B2B LinkedIn',
    platform: 'LinkedIn',
    time: '10:00',
    date: new Date('2024-11-22T10:00:00'),
    status: 'Publicado',
    color: '#2563EB', // blue-600
    icon: Linkedin
  },
  {
    id: '4',
    title: 'Thread Educativa',
    platform: 'Twitter',
    time: '16:00',
    date: new Date('2024-11-23T16:00:00'),
    status: 'Rascunho',
    color: '#60A5FA', // blue-400
    icon: Twitter
  },
  {
    id: '5',
    title: 'Vídeo Tutorial',
    platform: 'YouTube',
    time: '12:00',
    date: new Date('2024-11-25T12:00:00'),
    status: 'Agendado',
    color: '#DC2626', // red-600
    icon: Youtube
  }
];

const TestCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Iniciar em novembro de 2024 onde estão os eventos de exemplo
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 1)); // 10 = novembro (0-indexado)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  const handleEventsChange = (newEvents: CalendarEvent[]) => {
    console.log('Eventos alterados:', newEvents);
  };

  const handleDateChange = (newDate: Date) => {
    console.log('Data alterada para:', newDate.toISOString().split('T')[0]);
    setCurrentDate(newDate);
  };

  const getStatusBadge = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    const variants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'Agendado': 'default',
      'Publicado': 'secondary',
      'Rascunho': 'outline'
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-primary" />
              Calendário - Teste
            </h1>
            <p className="text-muted-foreground">
              Teste para verificar eventos no calendário visual
            </p>
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
              events={testEvents}
              onEventsChange={handleEventsChange}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              filterPlatform={filterPlatform}
              viewMode={viewMode}
              currentDate={currentDate}
              onDateChange={handleDateChange}
              onCreateEvent={(date) => {
                console.log('Criar evento em:', date.toISOString().split('T')[0]);
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
                {testEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className={`w-6 h-6 rounded p-1`} style={{ backgroundColor: '#8B5CF6' }}>
                      <CalendarIcon className="w-4 h-4 text-white" />
                    </div>
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
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Debug Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <strong>Current Date:</strong> {currentDate.toLocaleDateString('pt-BR')}
                </div>
                <div className="text-sm">
                  <strong>Selected Date:</strong> {selectedDate.toLocaleDateString('pt-BR')}
                </div>
                <div className="text-sm">
                  <strong>Total Events:</strong> {testEvents.length}
                </div>
                <div className="text-sm">
                  <strong>Filter Platform:</strong> {filterPlatform}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export { TestCalendar as Component };