import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Save, Target } from 'lucide-react';

interface CreatePersonaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePersona: (persona: any) => void;
  editingPersona?: any;
}

const ageRanges = [
  '18-24', '25-34', '35-44', '45-54', '55-64', '65+'
];

const genders = [
  'Masculino', 'Feminino', 'Não-binário', 'Todos'
];

const educationLevels = [
  'Ensino Fundamental', 'Ensino Médio', 'Ensino Superior', 'Pós-graduação', 'Mestrado/Doutorado'
];

const incomeRanges = [
  'Até R$ 2.000', 'R$ 2.000 - R$ 5.000', 'R$ 5.000 - R$ 10.000', 'R$ 10.000 - R$ 20.000', 'Acima de R$ 20.000'
];

const CreatePersonaModal: React.FC<CreatePersonaModalProps> = ({
  open,
  onOpenChange,
  onCreatePersona,
  editingPersona
}) => {
  const [formData, setFormData] = useState({
    name: editingPersona?.name || '',
    description: editingPersona?.description || '',
    ageRange: editingPersona?.ageRange || '',
    gender: editingPersona?.gender || '',
    location: editingPersona?.location || '',
    education: editingPersona?.education || '',
    income: editingPersona?.income || '',
    profession: editingPersona?.profession || '',
    interests: editingPersona?.interests || [],
    painPoints: editingPersona?.painPoints || [],
    goals: editingPersona?.goals || [],
    preferredChannels: editingPersona?.preferredChannels || [],
    communicationStyle: editingPersona?.communicationStyle || '',
    buyingBehavior: editingPersona?.buyingBehavior || '',
    values: editingPersona?.values || [],
  });

  const [newInterest, setNewInterest] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newValue, setNewValue] = useState('');
  const { toast } = useToast();

  const channels = [
    'Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube', 'TikTok', 'WhatsApp', 'Email', 'Blog', 'Podcast'
  ];

  const communicationStyles = [
    'Formal', 'Casual', 'Técnico', 'Emocional', 'Direto', 'Persuasivo', 'Educativo', 'Inspirador'
  ];

  const buyingBehaviors = [
    'Impulsivo', 'Analítico', 'Conservador', 'Inovador', 'Pesquisador', 'Influenciado por outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o nome e descrição da persona.",
        variant: "destructive"
      });
      return;
    }

    const persona = {
      id: editingPersona?.id || Date.now(),
      ...formData,
      createdAt: editingPersona?.createdAt || new Date(),
      updatedAt: new Date(),
      campaignsUsed: editingPersona?.campaignsUsed || 0
    };

    onCreatePersona(persona);
    
    toast({
      title: editingPersona ? "Persona atualizada!" : "Persona criada!",
      description: editingPersona ? "Persona salva com sucesso." : "Nova persona adicionada ao banco.",
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      ageRange: '',
      gender: '',
      location: '',
      education: '',
      income: '',
      profession: '',
      interests: [],
      painPoints: [],
      goals: [],
      preferredChannels: [],
      communicationStyle: '',
      buyingBehavior: '',
      values: [],
    });
    onOpenChange(false);
  };

  const addToArray = (field: string, value: string, setter: (value: string) => void) => {
    if (value.trim() && !formData[field as keyof typeof formData]?.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof typeof prev] as string[]), value.trim()]
      }));
      setter('');
    }
  };

  const removeFromArray = (field: string, valueToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter(item => item !== valueToRemove)
    }));
  };

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      preferredChannels: prev.preferredChannels.includes(channel)
        ? prev.preferredChannels.filter(c => c !== channel)
        : [...prev.preferredChannels, channel]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {editingPersona ? 'Editar Persona' : 'Criar Nova Persona'}
          </DialogTitle>
          <DialogDescription>
            {editingPersona 
              ? 'Edite as informações da persona existente.'
              : 'Defina uma persona detalhada para suas campanhas de marketing.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Persona *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Maria Empreendedora"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profissão</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                placeholder="Ex: Empresária, Consultora"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva brevemente quem é essa persona..."
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageRange">Faixa Etária</Label>
              <Select value={formData.ageRange} onValueChange={(value) => setFormData(prev => ({ ...prev, ageRange: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a idade" />
                </SelectTrigger>
                <SelectContent>
                  {ageRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range} anos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: São Paulo, SP"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="education">Escolaridade</Label>
              <Select value={formData.education} onValueChange={(value) => setFormData(prev => ({ ...prev, education: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Nível de educação" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="income">Renda</Label>
              <Select value={formData.income} onValueChange={(value) => setFormData(prev => ({ ...prev, income: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Faixa de renda" />
                </SelectTrigger>
                <SelectContent>
                  {incomeRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Interesses</Label>
            <div className="flex gap-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Adicionar interesse"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('interests', newInterest, setNewInterest))}
              />
              <Button type="button" variant="outline" onClick={() => addToArray('interests', newInterest, setNewInterest)}>
                Adicionar
              </Button>
            </div>
            {formData.interests.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('interests', interest)}>
                    {interest} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Pain Points */}
          <div className="space-y-2">
            <Label>Dores/Problemas</Label>
            <div className="flex gap-2">
              <Input
                value={newPainPoint}
                onChange={(e) => setNewPainPoint(e.target.value)}
                placeholder="Adicionar dor/problema"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('painPoints', newPainPoint, setNewPainPoint))}
              />
              <Button type="button" variant="outline" onClick={() => addToArray('painPoints', newPainPoint, setNewPainPoint)}>
                Adicionar
              </Button>
            </div>
            {formData.painPoints.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.painPoints.map((pain, index) => (
                  <Badge key={index} variant="destructive" className="cursor-pointer" onClick={() => removeFromArray('painPoints', pain)}>
                    {pain} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <Label>Objetivos</Label>
            <div className="flex gap-2">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Adicionar objetivo"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('goals', newGoal, setNewGoal))}
              />
              <Button type="button" variant="outline" onClick={() => addToArray('goals', newGoal, setNewGoal)}>
                Adicionar
              </Button>
            </div>
            {formData.goals.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.goals.map((goal, index) => (
                  <Badge key={index} variant="default" className="cursor-pointer" onClick={() => removeFromArray('goals', goal)}>
                    <Target className="w-3 h-3 mr-1" />
                    {goal} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Channels */}
          <div className="space-y-2">
            <Label>Canais Preferidos</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {channels.map((channel) => (
                <Badge
                  key={channel}
                  variant={formData.preferredChannels.includes(channel) ? "default" : "outline"}
                  className="cursor-pointer justify-center"
                  onClick={() => toggleChannel(channel)}
                >
                  {channel}
                </Badge>
              ))}
            </div>
          </div>

          {/* Communication & Behavior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="communicationStyle">Estilo de Comunicação</Label>
              <Select value={formData.communicationStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, communicationStyle: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Como ela prefere se comunicar?" />
                </SelectTrigger>
                <SelectContent>
                  {communicationStyles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyingBehavior">Comportamento de Compra</Label>
              <Select value={formData.buyingBehavior} onValueChange={(value) => setFormData(prev => ({ ...prev, buyingBehavior: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Como ela toma decisões?" />
                </SelectTrigger>
                <SelectContent>
                  {buyingBehaviors.map((behavior) => (
                    <SelectItem key={behavior} value={behavior}>
                      {behavior}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-2">
            <Label>Valores</Label>
            <div className="flex gap-2">
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Adicionar valor importante"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('values', newValue, setNewValue))}
              />
              <Button type="button" variant="outline" onClick={() => addToArray('values', newValue, setNewValue)}>
                Adicionar
              </Button>
            </div>
            {formData.values.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.values.map((value, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeFromArray('values', value)}>
                    {value} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              <Save className="w-4 h-4 mr-2" />
              {editingPersona ? 'Salvar Alterações' : 'Criar Persona'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePersonaModal;