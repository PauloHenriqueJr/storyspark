import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Mail, Users, Target, Calendar as CalendarIcon, Clock, Send, Eye, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface CreateEmailCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEmailCampaignModal = ({ isOpen, onClose }: CreateEmailCampaignModalProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    preheader: '',
    content: '',
    template: '',
    list: '',
    scheduledDate: undefined as Date | undefined,
    scheduledTime: '09:00',
  });

  const templates = [
    { id: 'newsletter', name: 'Newsletter', description: 'Template para newsletter semanal' },
    { id: 'promotion', name: 'Promoção', description: 'Template para ofertas especiais' },
    { id: 'onboarding', name: 'Onboarding', description: 'Template para novos usuários' },
    { id: 'announcement', name: 'Anúncio', description: 'Template para comunicados' },
  ];

  const lists = [
    { id: 'main', name: 'Lista Principal', count: 12543 },
    { id: 'premium', name: 'Usuários Premium', count: 1543 },
    { id: 'new', name: 'Novos Usuários', count: 234 },
  ];

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
      description: "Sua campanha foi salva como rascunho.",
    });
    onClose();
  };

  const handleSchedule = () => {
    toast({
      title: "Campanha agendada",
      description: "Sua campanha foi agendada com sucesso.",
    });
    onClose();
  };

  const handleSendNow = () => {
    toast({
      title: "Campanha enviada",
      description: "Sua campanha está sendo enviada agora.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Nova Campanha de Email
          </DialogTitle>
          <DialogDescription>
            Crie uma nova campanha de email marketing em 3 passos simples
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
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="campaign-name">Nome da Campanha</Label>
                  <Input
                    id="campaign-name"
                    placeholder="Ex: Newsletter Janeiro 2024"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Assunto do Email</Label>
                  <Input
                    id="subject"
                    placeholder="Ex: Novidades da Semana - StorySpark"
                    value={campaignData.subject}
                    onChange={(e) => setCampaignData({...campaignData, subject: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="preheader">Preheader (Texto de Preview)</Label>
                  <Input
                    id="preheader"
                    placeholder="Texto que aparece antes do email ser aberto"
                    value={campaignData.preheader}
                    onChange={(e) => setCampaignData({...campaignData, preheader: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="list">Lista de Destinatários</Label>
                  <Select value={campaignData.list} onValueChange={(value) => setCampaignData({...campaignData, list: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma lista" />
                    </SelectTrigger>
                    <SelectContent>
                      {lists.map(list => (
                        <SelectItem key={list.id} value={list.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{list.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {list.count.toLocaleString()}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Content */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Conteúdo do Email</h3>
              
              <Tabs defaultValue="template" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="template">Template</TabsTrigger>
                  <TabsTrigger value="custom">Personalizado</TabsTrigger>
                </TabsList>

                <TabsContent value="template" className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    {templates.map(template => (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer transition-all ${
                          campaignData.template === template.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setCampaignData({...campaignData, template: template.id})}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="text-sm">{template.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                  <div>
                    <Label htmlFor="content">Conteúdo do Email</Label>
                    <Textarea
                      id="content"
                      placeholder="Digite o conteúdo do seu email..."
                      rows={10}
                      value={campaignData.content}
                      onChange={(e) => setCampaignData({...campaignData, content: e.target.value})}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Agendamento</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Data de Envio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {campaignData.scheduledDate ? (
                          format(campaignData.scheduledDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={campaignData.scheduledDate}
                        onSelect={(date) => setCampaignData({...campaignData, scheduledDate: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time">Horário</Label>
                  <Select value={campaignData.scheduledTime} onValueChange={(value) => setCampaignData({...campaignData, scheduledTime: value})}>
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
                <h4 className="font-medium mb-2">Resumo da Campanha</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nome:</span>
                    <span>{campaignData.name || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assunto:</span>
                    <span>{campaignData.subject || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lista:</span>
                    <span>{lists.find(l => l.id === campaignData.list)?.name || 'Não selecionada'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destinatários:</span>
                    <span>{lists.find(l => l.id === campaignData.list)?.count.toLocaleString() || '0'}</span>
                  </div>
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
              (currentStep === 1 && (!campaignData.name || !campaignData.subject || !campaignData.list)) ||
              (currentStep === 2 && !campaignData.template && !campaignData.content)
            }>
              Próximo
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSendNow}>
                <Send className="w-4 h-4 mr-2" />
                Enviar Agora
              </Button>
              <Button onClick={handleSchedule} disabled={!campaignData.scheduledDate}>
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

export default CreateEmailCampaignModal;