import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  CalendarIcon,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Hash,
  Plus
} from 'lucide-react';

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  onCreateEvent?: (event: any) => void;
}

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'bg-blue-400' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-500' },
  { id: 'tiktok', name: 'TikTok', icon: Hash, color: 'bg-black' }
];

const contentTypes = [
  'Post Orgânico',
  'Stories',
  'Carrossel',
  'Reel/Vídeo',
  'IGTV',
  'Thread',
  'Anúncio'
];

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  open,
  onOpenChange,
  selectedDate,
  onCreateEvent
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: '',
    contentType: '',
    date: selectedDate || new Date(),
    time: '09:00',
    content: '',
    hashtags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const platform = platforms.find(p => p.id === formData.platform);
    
    const newEvent = {
      ...formData,
      id: Date.now(),
      status: 'Agendado',
      color: platform?.color || 'bg-gray-500',
      icon: platform?.icon || Calendar,
      createdAt: new Date()
    };

    onCreateEvent?.(newEvent);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      platform: '',
      contentType: '',
      date: selectedDate || new Date(),
      time: '09:00',
      content: '',
      hashtags: ''
    });
  };

  const isFormValid = formData.title && 
                     formData.platform && 
                     formData.contentType &&
                     formData.date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Agendar Publicação
          </DialogTitle>
          <DialogDescription>
            Configure os detalhes da sua publicação agendada
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título da Publicação *</Label>
              <Input
                id="title"
                placeholder="Ex: Post Black Friday"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="contentType">Tipo de Conteúdo *</Label>
              <Select value={formData.contentType} onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Plataforma */}
          <div>
            <Label htmlFor="platform">Plataforma *</Label>
            <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha a plataforma" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    <div className="flex items-center gap-2">
                      <platform.icon className="w-4 h-4" />
                      {platform.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data da Publicação *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? formData.date.toLocaleDateString('pt-BR') : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="time">Hora da Publicação *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva brevemente o conteúdo da publicação"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Conteúdo */}
          <div>
            <Label htmlFor="content">Conteúdo da Publicação</Label>
            <Textarea
              id="content"
              placeholder="Escreva o texto que será publicado..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Hashtags */}
          <div>
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              placeholder="#marketing #digitalmarketing #socialmedia"
              value={formData.hashtags}
              onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid}
              className="bg-gradient-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agendar Publicação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;