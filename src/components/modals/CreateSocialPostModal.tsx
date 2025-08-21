import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Instagram, Facebook, Twitter, Linkedin, Calendar as CalendarIcon, Clock, Image, Save, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface CreateSocialPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSocialPostModal = ({ isOpen, onClose }: CreateSocialPostModalProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [postData, setPostData] = useState({
    content: '',
    platforms: [] as string[],
    scheduledDate: undefined as Date | undefined,
    scheduledTime: '09:00',
    hashtags: '',
    media: [] as string[],
  });

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, limit: 2200 },
    { id: 'facebook', name: 'Facebook', icon: Facebook, limit: 63206 },
    { id: 'twitter', name: 'Twitter', icon: Twitter, limit: 280 },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, limit: 3000 },
  ];

  const bestTimes = {
    instagram: ['14:00', '15:00', '16:00'],
    facebook: ['10:00', '14:00', '15:00'],
    twitter: ['09:00', '12:00', '17:00'],
    linkedin: ['08:00', '12:00', '17:00'],
  };

  const handlePlatformToggle = (platformId: string) => {
    const newPlatforms = postData.platforms.includes(platformId)
      ? postData.platforms.filter(p => p !== platformId)
      : [...postData.platforms, platformId];
    
    setPostData({...postData, platforms: newPlatforms});
  };

  const getCharacterLimit = () => {
    if (postData.platforms.length === 0) return null;
    
    const limits = postData.platforms.map(p => platforms.find(pl => pl.id === p)?.limit || 0);
    return Math.min(...limits);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Rascunho salvo",
      description: "Seu post foi salvo como rascunho.",
    });
    onClose();
  };

  const handleSchedule = () => {
    toast({
      title: "Post agendado",
      description: `Post agendado para ${postData.platforms.length} plataforma(s).`,
    });
    onClose();
  };

  const handlePublishNow = () => {
    toast({
      title: "Post publicado",
      description: `Post enviado para ${postData.platforms.length} plataforma(s).`,
    });
    onClose();
  };

  const characterLimit = getCharacterLimit();
  const characterCount = postData.content.length;
  const isOverLimit = characterLimit ? characterCount > characterLimit : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Novo Post Social
          </DialogTitle>
          <DialogDescription>
            Crie e agende posts para suas redes sociais
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Platforms */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Selecione as Plataformas</h3>
              
              <div className="grid gap-3 md:grid-cols-2">
                {platforms.map(platform => {
                  const Icon = platform.icon;
                  const isSelected = postData.platforms.includes(platform.id);
                  
                  return (
                    <Card 
                      key={platform.id} 
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handlePlatformToggle(platform.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5" />
                            <CardTitle className="text-base">{platform.name}</CardTitle>
                          </div>
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => handlePlatformToggle(platform.id)}
                          />
                        </div>
                        <CardDescription className="text-sm">
                          Limite: {platform.limit.toLocaleString()} caracteres
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>

              {postData.platforms.length > 0 && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Melhores Horários</h4>
                  <div className="space-y-2">
                    {postData.platforms.map(platformId => {
                      const platform = platforms.find(p => p.id === platformId);
                      const times = bestTimes[platformId as keyof typeof bestTimes] || [];
                      
                      return (
                        <div key={platformId} className="flex items-center justify-between">
                          <span className="text-sm">{platform?.name}:</span>
                          <div className="flex gap-1">
                            {times.map(time => (
                              <Badge key={time} variant="secondary" className="text-xs">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Content */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Conteúdo do Post</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="content">Texto do Post</Label>
                  <Textarea
                    id="content"
                    placeholder="Escreva o conteúdo do seu post..."
                    rows={6}
                    value={postData.content}
                    onChange={(e) => setPostData({...postData, content: e.target.value})}
                    className={isOverLimit ? 'border-destructive' : ''}
                  />
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className={isOverLimit ? 'text-destructive' : 'text-muted-foreground'}>
                      {characterCount}{characterLimit && ` / ${characterLimit}`} caracteres
                    </span>
                    {isOverLimit && (
                      <span className="text-destructive">
                        Excede o limite para as plataformas selecionadas
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Textarea
                    id="hashtags"
                    placeholder="#marketing #digitalmarketing #storyspark"
                    rows={2}
                    value={postData.hashtags}
                    onChange={(e) => setPostData({...postData, hashtags: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Mídia</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Arraste imagens ou vídeos aqui, ou clique para selecionar
                    </p>
                    <Button variant="outline" className="mt-2" size="sm">
                      Selecionar Arquivos
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Agendamento</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Data de Publicação</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {postData.scheduledDate ? (
                          format(postData.scheduledDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={postData.scheduledDate}
                        onSelect={(date) => setPostData({...postData, scheduledDate: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time">Horário</Label>
                  <Select value={postData.scheduledTime} onValueChange={(value) => setPostData({...postData, scheduledTime: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {`${i.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Preview do Post</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {postData.platforms.map(platformId => {
                      const platform = platforms.find(p => p.id === platformId);
                      const Icon = platform?.icon;
                      return Icon && (
                        <div key={platformId} className="p-1 bg-background rounded">
                          <Icon className="w-4 h-4" />
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-sm bg-background p-3 rounded border">
                    {postData.content || 'Conteúdo do post aparecerá aqui...'}
                  </div>
                  {postData.hashtags && (
                    <div className="text-sm text-primary">
                      {postData.hashtags}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
          
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              Anterior
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button onClick={handleNext} disabled={
              (currentStep === 1 && postData.platforms.length === 0) ||
              (currentStep === 2 && (!postData.content.trim() || isOverLimit))
            }>
              Próximo
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePublishNow}>
                <Send className="w-4 h-4 mr-2" />
                Publicar Agora
              </Button>
              <Button onClick={handleSchedule} disabled={!postData.scheduledDate}>
                <Clock className="w-4 h-4 mr-2" />
                Agendar
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSocialPostModal;