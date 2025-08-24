import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, Save, Target, Plus, X, MapPin, Briefcase, Calendar, Heart, AlertTriangle, Radio } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

interface CreatePersonaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (persona: Omit<Database['public']['Tables']['target_personas']['Insert'], 'workspace_id' | 'user_id'>) => void;
  initialData?: any;
  mode?: 'create' | 'edit';
}

const CreatePersonaModal: React.FC<CreatePersonaModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    occupation: '',
    age_range: '',
    location: '',
    goals: [] as string[],
    pain_points: [] as string[],
    interests: [] as string[],
    preferred_channels: [] as string[],
  });

  // Temporary input states for arrays
  const [currentGoal, setCurrentGoal] = useState('');
  const [currentPainPoint, setCurrentPainPoint] = useState('');
  const [currentInterest, setCurrentInterest] = useState('');
  const [currentChannel, setCurrentChannel] = useState('');

  const { toast } = useToast();

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        occupation: initialData.occupation || '',
        age_range: initialData.age_range || '',
        location: initialData.location || '',
        goals: initialData.goals || [],
        pain_points: initialData.pain_points || [],
        interests: initialData.interests || [],
        preferred_channels: initialData.preferred_channels || [],
      });
    } else {
      setFormData({
        name: '',
        occupation: '',
        age_range: '',
        location: '',
        goals: [],
        pain_points: [],
        interests: [],
        preferred_channels: [],
      });
    }
    setCurrentGoal('');
    setCurrentPainPoint('');
    setCurrentInterest('');
    setCurrentChannel('');
  }, [initialData, mode, open]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome da persona.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    onOpenChange(false);
  };

  // Array manipulation functions
  const addGoal = () => {
    if (currentGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, currentGoal.trim()]
      }));
      setCurrentGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const addPainPoint = () => {
    if (currentPainPoint.trim()) {
      setFormData(prev => ({
        ...prev,
        pain_points: [...prev.pain_points, currentPainPoint.trim()]
      }));
      setCurrentPainPoint('');
    }
  };

  const removePainPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pain_points: prev.pain_points.filter((_, i) => i !== index)
    }));
  };

  const addInterest = () => {
    if (currentInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, currentInterest.trim()]
      }));
      setCurrentInterest('');
    }
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const addChannel = () => {
    if (currentChannel.trim()) {
      setFormData(prev => ({
        ...prev,
        preferred_channels: [...prev.preferred_channels, currentChannel.trim()]
      }));
      setCurrentChannel('');
    }
  };

  const removeChannel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preferred_channels: prev.preferred_channels.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {mode === 'edit' ? 'Editar Persona' : 'Criar Nova Persona'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="font-medium text-blue-900 mb-2">🎯 O que é uma Persona?</div>
            <div className="text-sm text-blue-800 mb-2">
              Uma persona é um <strong>perfil detalhado do seu cliente ideal</strong>. É uma representação semi-fictícia baseada em dados reais dos seus clientes.
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• <strong>Demografia:</strong> Idade, localização, ocupação...</div>
              <div>• <strong>Psicografia:</strong> Objetivos, dores, interesses...</div>
              <div>• <strong>Comportamento:</strong> Canais preferidos, hábitos de consumo...</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            💡 <strong>Como será usada:</strong> Suas personas ajudarão a IA a criar conteúdos mais direcionados e eficazes para cada tipo de cliente.
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="psychographic">Psicografia</TabsTrigger>
            <TabsTrigger value="behavior">Comportamento</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nome da Persona
                    <span className="text-xs text-muted-foreground ml-2">(Como você identificará este perfil)</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Maria Empreendedora, João Executivo, Ana Estudante..."
                    className="mt-1"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Use um nome que represente o perfil principal desta persona
                  </p>
                </div>

                <div>
                  <Label htmlFor="occupation" className="text-sm font-medium flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Ocupação/Profissão
                    <span className="text-xs text-muted-foreground ml-2">(O que esta pessoa faz)</span>
                  </Label>
                  <Input
                    id="occupation"
                    placeholder="Ex: Empresária, Desenvolvedora, Consultora, Estudante..."
                    className="mt-1"
                    value={formData.occupation}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    📋 A profissão influencia necessidades e linguagem
                  </p>
                </div>

                <div>
                  <Label htmlFor="age_range" className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Faixa Etária
                    <span className="text-xs text-muted-foreground ml-2">(Idade aproximada)</span>
                  </Label>
                  <Input
                    id="age_range"
                    placeholder="Ex: 25-35 anos, 40-50 anos, 18-25 anos..."
                    className="mt-1"
                    value={formData.age_range}
                    onChange={(e) => setFormData(prev => ({ ...prev, age_range: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    🎂 A idade influencia linguagem e canais de comunicação
                  </p>
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Localização
                    <span className="text-xs text-muted-foreground ml-2">(Onde esta pessoa está)</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="Ex: São Paulo-SP, Rio de Janeiro-RJ, Brasil..."
                    className="mt-1"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    📍 Localização pode influenciar horários e regionalismo
                  </p>
                </div>
              </div>

              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Resumo da Persona</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4">
                      <div className="font-medium text-foreground mb-2">
                        {formData.name || 'Nome da Persona'}
                      </div>
                      <div className="text-muted-foreground space-y-1">
                        <div><strong>Profissão:</strong> {formData.occupation || 'Não definida'}</div>
                        <div><strong>Idade:</strong> {formData.age_range || 'Não definida'}</div>
                        <div><strong>Local:</strong> {formData.location || 'Não definido'}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      🔍 Complete as outras abas para criar uma persona completa
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="psychographic" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Goals */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Objetivos e Metas
                    <span className="text-xs text-muted-foreground ml-2">(O que esta pessoa busca)</span>
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={currentGoal}
                      onChange={(e) => setCurrentGoal(e.target.value)}
                      placeholder="Ex: Aumentar vendas, Aprender novas habilidades..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                    />
                    <Button type="button" className="bg-gradient-primary hover:opacity-90" onClick={addGoal}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.goals.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.goals.map((goal, index) => (
                        <Badge key={index} variant="default" className="cursor-pointer bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors" onClick={() => removeGoal(index)}>
                          <Target className="w-3 h-3 mr-1" />
                          {goal}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    🎯 Liste os principais objetivos que motivam esta persona
                  </p>
                </div>

                {/* Pain Points */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Dores e Problemas
                    <span className="text-xs text-muted-foreground ml-2">(O que frustra esta pessoa)</span>
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={currentPainPoint}
                      onChange={(e) => setCurrentPainPoint(e.target.value)}
                      placeholder="Ex: Falta de tempo, Dificuldade com tecnologia..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPainPoint())}
                    />
                    <Button type="button" className="bg-gradient-primary hover:opacity-90" onClick={addPainPoint}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.pain_points.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.pain_points.map((pain, index) => (
                        <Badge key={index} variant="destructive" className="cursor-pointer hover:bg-red-700 transition-colors" onClick={() => removePainPoint(index)}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {pain}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    😤 Identifique os principais problemas que sua solução pode resolver
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Interests */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Interesses e Hobbies
                    <span className="text-xs text-muted-foreground ml-2">(O que esta pessoa gosta)</span>
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={currentInterest}
                      onChange={(e) => setCurrentInterest(e.target.value)}
                      placeholder="Ex: Tecnologia, Esportes, Leitura..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    />
                    <Button type="button" className="bg-gradient-primary hover:opacity-90" onClick={addInterest}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-gray-400 transition-colors" onClick={() => removeInterest(index)}>
                          <Heart className="w-3 h-3 mr-1" />
                          {interest}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    ❤️ Ajuda a entender afinidades e criar conexões emocionais
                  </p>
                </div>

                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">
                      <div className="font-medium mb-2">💡 Dica de Psicografia:</div>
                      <div className="space-y-1 text-xs">
                        <div>• <strong>Objetivos:</strong> O que motiva suas decisões?</div>
                        <div>• <strong>Dores:</strong> O que te impede de alcançar objetivos?</div>
                        <div>• <strong>Interesses:</strong> Como se conectar emocionalmente?</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Preferred Channels */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Radio className="w-3 h-3" />
                    Canais de Comunicação Preferidos
                    <span className="text-xs text-muted-foreground ml-2">(Onde encontrar esta persona)</span>
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={currentChannel}
                      onChange={(e) => setCurrentChannel(e.target.value)}
                      placeholder="Ex: Instagram, LinkedIn, WhatsApp, Email..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChannel())}
                    />
                    <Button type="button" className="bg-gradient-primary hover:opacity-90" onClick={addChannel}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.preferred_channels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.preferred_channels.map((channel, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-200 border-gray-300 transition-colors" onClick={() => removeChannel(index)}>
                          <Radio className="w-3 h-3 mr-1" />
                          {channel}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    📱 Defina onde sua persona está mais ativa para focar seus esforços
                  </p>
                </div>
              </div>

              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-sm">
                    <div className="font-medium mb-3 flex items-center gap-1">
                      <Radio className="w-4 h-4 text-primary" />
                      Sugestões de Canais por Perfil:
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div><strong>Jovens (18-25):</strong> Instagram, TikTok, Discord</div>
                      <div><strong>Profissionais (25-40):</strong> LinkedIn, Email, WhatsApp</div>
                      <div><strong>Empresários (30+):</strong> LinkedIn, Email, Facebook</div>
                      <div><strong>B2B:</strong> LinkedIn, Email, Webinars</div>
                      <div><strong>B2C:</strong> Instagram, Facebook, WhatsApp</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Preview Completo da Persona</h3>
                </div>
                
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                      👤
                    </div>
                    <h4 className="text-xl font-bold text-foreground">{formData.name || 'Nome da Persona'}</h4>
                    <p className="text-muted-foreground">{formData.occupation || 'Ocupação não definida'}</p>
                    {formData.age_range && (
                      <Badge variant="outline" className="mt-1">{formData.age_range}</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-foreground mb-2 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-primary" />
                          Informações Básicas
                        </h5>
                        <div className="space-y-1 text-muted-foreground">
                          <div><strong>Localização:</strong> {formData.location || 'Não definida'}</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-foreground mb-2 flex items-center gap-1">
                          <Target className="w-4 h-4 text-primary" />
                          Objetivos
                        </h5>
                        <div className="space-y-1">
                          {formData.goals.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {formData.goals.map((goal, index) => (
                                <Badge key={index} variant="default" className="text-xs bg-blue-100 text-blue-800">
                                  {goal}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-muted-foreground text-xs">Nenhum objetivo definido</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-foreground mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-primary" />
                          Dores e Problemas
                        </h5>
                        <div className="space-y-1">
                          {formData.pain_points.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {formData.pain_points.map((pain, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {pain}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-muted-foreground text-xs">Nenhuma dor definida</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-foreground mb-2 flex items-center gap-1">
                          <Heart className="w-4 h-4 text-primary" />
                          Interesses
                        </h5>
                        <div className="space-y-1">
                          {formData.interests.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {formData.interests.map((interest, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-muted-foreground text-xs">Nenhum interesse definido</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h5 className="font-semibold text-foreground mb-2 flex items-center gap-1">
                        <Radio className="w-4 h-4 text-primary" />
                        Canais Preferidos
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {formData.preferred_channels.length > 0 ? (
                          formData.preferred_channels.map((channel, index) => (
                            <Badge key={index} variant="outline" className="border-primary/30">
                              {channel}
                            </Badge>
                          ))
                        ) : (
                          <div className="text-muted-foreground text-xs">Nenhum canal definido</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-foreground mb-1">Como usar esta persona:</div>
                      <ul className="space-y-1">
                        <li>• <strong>Composer:</strong> Selecione esta persona para criar conteúdos direcionados</li>
                        <li>• <strong>Campanhas:</strong> Use como público-alvo nas suas campanhas de marketing</li>
                        <li>• <strong>Social Scheduler:</strong> Adapte linguagem e horários conforme o perfil</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-gradient-primary hover:opacity-90"
          >
            <Save className="w-4 h-4 mr-2" />
            {mode === 'edit' ? 'Salvar Alterações' : 'Criar Persona'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePersonaModal;
