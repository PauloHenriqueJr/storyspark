import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, Plus, Trash2, MoveUp, MoveDown, Play, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Definindo a interface para o template
interface Template {
  name: string;
  category: string;
  blocks: Array<{
    type: ScriptBlock['type'];
    title: string;
    content: string;
    duration: string;
  }>;
}

interface CreateScriptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ScriptBlock {
  id: string;
  type: 'abertura' | 'descoberta' | 'apresentacao' | 'objecao' | 'fechamento';
  title: string;
  content: string;
  duration: string;
}

const CreateScriptModal = ({ open, onOpenChange }: CreateScriptModalProps) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    objective: '',
    audience: '',
    duration: '',
    description: ''
  });
  
  const [scriptBlocks, setScriptBlocks] = useState<ScriptBlock[]>([
    {
      id: '1',
      type: 'abertura',
      title: 'Abertura e Quebra-gelo',
      content: '',
      duration: '30s'
    }
  ]);

  const { toast } = useToast();

  // Função para aplicar um template
  const applyTemplate = (
    template: Template, 
    setFormData: React.Dispatch<React.SetStateAction<typeof formData>>, 
    setScriptBlocks: React.Dispatch<React.SetStateAction<ScriptBlock[]>>, 
    setActiveTab: React.Dispatch<React.SetStateAction<string>>, 
    toast: ReturnType<typeof useToast>['toast']
  ) => {
    setFormData(prev => ({
      ...prev,
      name: template.name,
      category: template.category
    }));
    
    const newBlocks = template.blocks.map((block, index) => ({
      id: (index + 1).toString(),
      type: block.type,
      title: block.title,
      content: block.content,
      duration: block.duration
    }));
    
    setScriptBlocks(newBlocks);
    setActiveTab('builder');
    
    toast({
      title: "Template aplicado!",
      description: `Script base "${template.name}" foi carregado.`,
    });
  };

  const categories = [
    { value: 'prospeccao', label: 'Prospecção Cold Call' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'objecoes', label: 'Tratamento de Objeções' },
    { value: 'fechamento', label: 'Fechamento de Vendas' },
    { value: 'reativacao', label: 'Reativação de Leads' },
    { value: 'upsell', label: 'Upsell/Cross-sell' }
  ];

  const objectives = [
    'Agendar reunião',
    'Qualificar lead',
    'Fechar venda',
    'Reativar interesse',
    'Upgrade de plano',
    'Demo do produto'
  ];

  const blockTypes = [
    { value: 'abertura', label: 'Abertura', description: 'Quebra-gelo e apresentação inicial' },
    { value: 'descoberta', label: 'Descoberta', description: 'Perguntas para entender necessidades' },
    { value: 'apresentacao', label: 'Apresentação', description: 'Apresentar solução/produto' },
    { value: 'objecao', label: 'Tratamento de Objeção', description: 'Responder objeções comuns' },
    { value: 'fechamento', label: 'Fechamento', description: 'Final da ligação e próximos passos' }
  ];

  const templates = [
    {
      name: 'Cold Call B2B Clássico',
      category: 'prospeccao',
      blocks: [
        { type: 'abertura', title: 'Apresentação Inicial', content: 'Olá [Nome], meu nome é [Seu Nome] da [Empresa]. Como vai?\n\nTenho apenas 2 minutos, posso continuar?', duration: '30s' },
        { type: 'descoberta', title: 'Identificação da Dor', content: 'Estou ligando porque ajudo empresas como a [Empresa dele] a [benefício específico].\n\nMe conta, qual o maior desafio que vocês enfrentam com [área de atuação]?', duration: '60s' },
        { type: 'apresentacao', title: 'Proposta de Valor', content: 'Entendi, isso é bem comum. Trabalhamos com mais de [número] empresas similares e conseguimos [resultado específico].\n\nQue tal agendarmos 15 minutos para eu te mostrar exatamente como fazemos isso?', duration: '45s' }
      ]
    },
    {
      name: 'Follow-up Pós-Demo',
      category: 'follow-up',
      blocks: [
        { type: 'abertura', title: 'Recapitulação', content: 'Oi [Nome], tudo bem? É o [Seu Nome] da [Empresa].\n\nEstou ligando para dar seguimento na nossa conversa da semana passada sobre [tópico específico].', duration: '20s' },
        { type: 'descoberta', title: 'Feedback da Demo', content: 'Você teve a chance de conversar com a equipe sobre o que vimos na demonstração?\n\nQual foi a impressão de vocês?', duration: '30s' },
        { type: 'fechamento', title: 'Próximos Passos', content: 'Perfeito! Então vamos avançar. O próximo passo seria [ação específica].\n\nPosso contar com vocês até [prazo]?', duration: '30s' }
      ]
    }
  ];

  const addBlock = () => {
    const newBlock: ScriptBlock = {
      id: Date.now().toString(),
      type: 'descoberta',
      title: 'Novo Bloco',
      content: '',
      duration: '60s'
    };
    setScriptBlocks([...scriptBlocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setScriptBlocks(scriptBlocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = scriptBlocks.findIndex(block => block.id === id);
    if (direction === 'up' && index > 0) {
      const newBlocks = [...scriptBlocks];
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
      setScriptBlocks(newBlocks);
    } else if (direction === 'down' && index < scriptBlocks.length - 1) {
      const newBlocks = [...scriptBlocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      setScriptBlocks(newBlocks);
    }
  };

  const updateBlock = (id: string, field: keyof ScriptBlock, value: string) => {
    setScriptBlocks(scriptBlocks.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || scriptBlocks.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome, categoria e adicione pelo menos um bloco.",
        variant: "destructive"
      });
      return;
    }

    // Simular salvamento
    toast({
      title: "Script criado com sucesso!",
      description: `"${formData.name}" foi salvo na categoria ${formData.category}.`,
    });
    onOpenChange(false);
  };

  const totalDuration = scriptBlocks.reduce((total, block) => {
    const seconds = parseInt(block.duration.replace('s', '')) || 0;
    return total + seconds;
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Criar Novo Script de Ligação
          </DialogTitle>
          <DialogDescription>
            Crie scripts estruturados para maximizar suas conversões em ligações
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="builder">Construtor</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Script *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Cold Call SaaS B2B"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="objective">Objetivo Principal</Label>
                  <Select value={formData.objective} onValueChange={(value) => setFormData(prev => ({ ...prev, objective: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {objectives.map((objective) => (
                        <SelectItem key={objective} value={objective}>
                          {objective}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duração Esperada</Label>
                  <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tempo de ligação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-3min">2-3 minutos</SelectItem>
                      <SelectItem value="3-5min">3-5 minutos</SelectItem>
                      <SelectItem value="5-10min">5-10 minutos</SelectItem>
                      <SelectItem value="10min+">Mais de 10 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="audience">Perfil da Audiência</Label>
                  <Textarea
                    id="audience"
                    placeholder="Ex: CTOs de empresas de 50-200 funcionários..."
                    value={formData.audience}
                    onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição/Notas</Label>
                  <Textarea
                    id="description"
                    placeholder="Contexto adicional, dicas de uso..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Escolha um template para começar:</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {templates.map((template, index) => (
                  <Card key={index} className="hover:border-primary/50 cursor-pointer transition-colors">
                    <CardHeader>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>
                        Categoria: {categories.find(c => c.value === template.category)?.label}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-3">
                        <p className="text-sm font-medium">Blocos inclusos:</p>
                        {template.blocks.map((block, blockIndex) => (
                          <Badge key={blockIndex} variant="secondary" className="text-xs mr-1">
                            {block.title} ({block.duration})
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        onClick={() => applyTemplate(template, setFormData, setScriptBlocks, setActiveTab, toast)}
                        className="w-full"
                      >
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Construtor de Script</h3>
                <p className="text-sm text-muted-foreground">
                  Duração total estimada: {Math.floor(totalDuration / 60)}:{String(totalDuration % 60).padStart(2, '0')}
                </p>
              </div>
              <Button onClick={addBlock} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Bloco
              </Button>
            </div>

            <div className="space-y-4">
              {scriptBlocks.map((block, index) => (
                <Card key={block.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <Select 
                          value={block.type} 
                          onValueChange={(value) => updateBlock(block.id, 'type', value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {blockTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => moveBlock(block.id, 'up')}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => moveBlock(block.id, 'down')}
                          disabled={index === scriptBlocks.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeBlock(block.id)}
                          disabled={scriptBlocks.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-4">
                      <div className="md:col-span-3">
                        <Label>Título do Bloco</Label>
                        <Input
                          value={block.title}
                          onChange={(e) => updateBlock(block.id, 'title', e.target.value)}
                          placeholder="Nome deste bloco..."
                        />
                      </div>
                      <div>
                        <Label>Duração</Label>
                        <Input
                          value={block.duration}
                          onChange={(e) => updateBlock(block.id, 'duration', e.target.value)}
                          placeholder="Ex: 60s"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Conteúdo do Script</Label>
                      <Textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                        placeholder="Digite o texto do script para este bloco..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Play className="h-4 w-4 mr-1" />
              Pré-visualizar
            </Button>
            <Button onClick={handleSave}>
              Salvar Script
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScriptModal;