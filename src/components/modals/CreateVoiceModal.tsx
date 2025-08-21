import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  Brain, 
  Target, 
  MessageSquare, 
  Plus,
  X,
  Wand2,
  Settings,
  TestTube,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateVoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateVoice?: (voice: any) => void;
  editingVoice?: any;
}

const voiceCategories = [
  { id: 'ads', label: 'Anúncios', description: 'Copy persuasiva para campanhas pagas', icon: Target },
  { id: 'sales', label: 'Vendas', description: 'Mensagens de vendas e conversão', icon: MessageSquare },
  { id: 'email', label: 'Email', description: 'Campanhas de email marketing', icon: MessageSquare },
  { id: 'social', label: 'Social', description: 'Posts para redes sociais', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', description: 'Relatórios e análises', icon: Brain },
];

const toneOptions = [
  'Persuasivo',
  'Conversacional',
  'Profissional',
  'Casual',
  'Criativo',
  'Analítico',
  'Amigável',
  'Autoritário',
  'Empático',
  'Técnico'
];

const CreateVoiceModal: React.FC<CreateVoiceModalProps> = ({
  open,
  onOpenChange,
  onCreateVoice,
  editingVoice
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: editingVoice?.name || '',
    description: editingVoice?.description || '',
    category: editingVoice?.category || '',
    specialty: editingVoice?.specialty || '',
    tone: editingVoice?.tone || '',
    personality: editingVoice?.personality || '',
    instructions: editingVoice?.instructions || '',
    examples: editingVoice?.examples || [''],
    tags: editingVoice?.tags || [],
    isPremium: editingVoice?.isPremium || false
  });

  const [currentTag, setCurrentTag] = useState('');
  const [testPrompt, setTestPrompt] = useState('');
  const [testResult, setTestResult] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVoice = {
      ...formData,
      id: editingVoice?.id || Date.now(),
      avatar: formData.name.charAt(0).toUpperCase() + '🤖',
      rating: editingVoice?.rating || 4.5,
      usage: editingVoice?.usage || 0,
      isActive: true,
      createdAt: editingVoice?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onCreateVoice?.(newVoice);
    onOpenChange(false);
    
    toast({
      title: editingVoice ? "Voice Atualizado" : "Voice Criado",
      description: `${formData.name} foi ${editingVoice ? 'atualizado' : 'criado'} com sucesso!`,
    });

    // Reset form if creating new
    if (!editingVoice) {
      setFormData({
        name: '',
        description: '',
        category: '',
        specialty: '',
        tone: '',
        personality: '',
        instructions: '',
        examples: [''],
        tags: [],
        isPremium: false
      });
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, '']
    }));
  };

  const updateExample = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.map((ex, i) => i === index ? value : ex)
    }));
  };

  const removeExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const handleTestVoice = () => {
    if (!testPrompt.trim()) return;
    
    // Simulated AI response based on voice configuration
    const mockResponse = `[${formData.tone} ${formData.category}] ${testPrompt} - Esta é uma resposta simulada baseada no voice configurado. O tom ${formData.tone.toLowerCase()} aplicado para ${formData.specialty}.`;
    
    setTestResult(mockResponse);
    
    toast({
      title: "Teste Executado",
      description: "Voice testado com sucesso!",
    });
  };

  const isFormValid = formData.name && formData.category && formData.tone && formData.description;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            {editingVoice ? 'Editar Voice' : 'Criar Novo Voice'}
          </DialogTitle>
          <DialogDescription>
            Configure um assistente de IA especializado para suas necessidades de conteúdo
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="personality">Personalidade</TabsTrigger>
            <TabsTrigger value="examples">Exemplos</TabsTrigger>
            <TabsTrigger value="test">Teste</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Voice *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Sofia - Copy Persuasiva"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {voiceCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o propósito e especialidade deste voice..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input
                    id="specialty"
                    placeholder="Ex: Facebook/Instagram Ads"
                    value={formData.specialty}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tone">Tom de Voz *</Label>
                  <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tom" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Adicionar tag..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personality" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="personality">Personalidade</Label>
                <Textarea
                  id="personality"
                  placeholder="Descreva a personalidade do voice: como ele se comunica, que linguagem usa, se é mais formal ou informal..."
                  value={formData.personality}
                  onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="instructions">Instruções Específicas</Label>
                <Textarea
                  id="instructions"
                  placeholder="Instruções específicas sobre como o voice deve se comportar, que regras seguir, que evitar..."
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4 mt-6">
              <div>
                <Label>Exemplos de Saída</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Adicione exemplos de como o voice deve responder para treinar melhor o comportamento
                </p>
                
                {formData.examples.map((example, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Textarea
                      placeholder={`Exemplo ${index + 1}...`}
                      value={example}
                      onChange={(e) => updateExample(index, e.target.value)}
                      rows={2}
                    />
                    {formData.examples.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeExample(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button type="button" variant="outline" onClick={addExample}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Exemplo
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="testPrompt">Testar Voice</Label>
                <Textarea
                  id="testPrompt"
                  placeholder="Digite um prompt para testar como o voice responderá..."
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  rows={3}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mt-2"
                  onClick={handleTestVoice}
                  disabled={!testPrompt.trim()}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Executar Teste
                </Button>
              </div>

              {testResult && (
                <Card>
                  <CardContent className="p-4">
                    <Label>Resultado do Teste:</Label>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-sm">{testResult}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={!isFormValid}
                className="bg-gradient-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingVoice ? 'Atualizar' : 'Criar'} Voice
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVoiceModal;