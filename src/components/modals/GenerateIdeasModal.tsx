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
import { Sparkles, Target, Zap, TrendingUp, Brain, Loader2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GenerateIdeasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GenerateIdeasModal = ({ open, onOpenChange }: GenerateIdeasModalProps) => {
  const [activeTab, setActiveTab] = useState('quick');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    topic: '',
    audience: '',
    goal: '',
    tone: '',
    platform: '',
    context: '',
    keywords: [] as string[],
    trends: [] as string[]
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [newTrend, setNewTrend] = useState('');
  const { toast } = useToast();

  const categories = [
    { value: 'headlines', label: 'Headlines & Títulos', icon: Target, color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
    { value: 'email-sequence', label: 'Email Marketing', icon: Zap, color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400' },
    { value: 'social-media', label: 'Social Media', icon: TrendingUp, color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
    { value: 'sales-script', label: 'Scripts de Vendas', icon: Brain, color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400' }
  ];

  const tones = [
    'Profissional', 'Casual', 'Urgente', 'Emocional', 'Educativo', 
    'Divertido', 'Inspirador', 'Convincente', 'Confiável', 'Inovador'
  ];

  const platforms = [
    'Email', 'LinkedIn', 'Facebook', 'Instagram', 'Twitter', 
    'WhatsApp', 'Landing Page', 'Blog', 'YouTube', 'TikTok'
  ];

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const handleAddTrend = () => {
    if (newTrend.trim() && !formData.trends.includes(newTrend.trim())) {
      setFormData(prev => ({
        ...prev,
        trends: [...prev.trends, newTrend.trim()]
      }));
      setNewTrend('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleRemoveTrend = (trend: string) => {
    setFormData(prev => ({
      ...prev,
      trends: prev.trends.filter(t => t !== trend)
    }));
  };

  const handleQuickGenerate = async (category: string) => {
    setIsGenerating(true);
    
    // Simular geração de ideias
    setTimeout(() => {
      const mockIdeas = [
        {
          id: Date.now(),
          category,
          confidence: Math.floor(Math.random() * 20) + 80,
          content: [
            'Exemplo de ideia gerada 1',
            'Exemplo de ideia gerada 2',
            'Exemplo de ideia gerada 3',
            'Exemplo de ideia gerada 4',
            'Exemplo de ideia gerada 5'
          ]
        }
      ];
      
      setGeneratedIdeas(mockIdeas);
      setIsGenerating(false);
      
      toast({
        title: "Ideias geradas com sucesso!",
        description: `${mockIdeas[0].content.length} ideias criadas para ${category}`,
      });
    }, 2000);
  };

  const handleAdvancedGenerate = async () => {
    if (!formData.topic || !formData.audience || !formData.goal) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o tópico, audiência e objetivo.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simular geração avançada
    setTimeout(() => {
      const mockIdeas = [
        {
          id: Date.now(),
          category: 'custom',
          confidence: Math.floor(Math.random() * 15) + 85,
          topic: formData.topic,
          audience: formData.audience,
          content: [
            `Ideia personalizada baseada em "${formData.topic}" para ${formData.audience}`,
            `Segunda ideia considerando ${formData.goal}`,
            `Terceira ideia com tom ${formData.tone}`,
            `Quarta ideia para ${formData.platform}`,
            `Quinta ideia única e personalizada`
          ],
          keywords: formData.keywords,
          trends: formData.trends
        }
      ];
      
      setGeneratedIdeas(mockIdeas);
      setIsGenerating(false);
      
      toast({
        title: "Ideias personalizadas geradas!",
        description: `${mockIdeas[0].content.length} ideias criadas com base nos seus critérios`,
      });
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Gerar Novas Ideias com IA
          </DialogTitle>
          <DialogDescription>
            Use nossa IA avançada para gerar ideias de copy baseadas em tendências e dados de mercado
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Geração Rápida</TabsTrigger>
            <TabsTrigger value="advanced">Geração Avançada</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Escolha uma categoria para gerar ideias instantâneas:</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {categories.map((category) => (
                  <Card 
                    key={category.value} 
                    className="hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => handleQuickGenerate(category.value)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <category.icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{category.label}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" disabled={isGenerating}>
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Gerar Ideias
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic">Tópico Principal *</Label>
                  <Input
                    id="topic"
                    placeholder="Ex: Curso de copy, venda de software..."
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="audience">Audiência *</Label>
                  <Input
                    id="audience"
                    placeholder="Ex: Empreendedores, freelancers..."
                    value={formData.audience}
                    onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="goal">Objetivo *</Label>
                  <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venda">Venda Direta</SelectItem>
                      <SelectItem value="lead">Geração de Leads</SelectItem>
                      <SelectItem value="engajamento">Engajamento</SelectItem>
                      <SelectItem value="trafego">Tráfego</SelectItem>
                      <SelectItem value="reconhecimento">Reconhecimento de Marca</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tone">Tom de Voz</Label>
                  <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tom" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone} value={tone.toLowerCase()}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform} value={platform.toLowerCase()}>{platform}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="context">Contexto Adicional</Label>
                  <Textarea
                    id="context"
                    placeholder="Informações extras sobre o produto, situação, etc..."
                    value={formData.context}
                    onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Palavras-chave</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Adicionar palavra-chave"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddKeyword}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => handleRemoveKeyword(keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleAdvancedGenerate}
              className="w-full"
              disabled={isGenerating || !formData.topic || !formData.audience || !formData.goal}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando Ideias Personalizadas...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Gerar Ideias Personalizadas
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Generated Ideas Display */}
        {generatedIdeas.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Ideias Geradas:</h3>
            {generatedIdeas.map((idea) => (
              <Card key={idea.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Suas Novas Ideias</CardTitle>
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                      {idea.confidence}% confiança
                    </Badge>
                  </div>
                  {idea.topic && (
                    <CardDescription>
                      {idea.topic} • {idea.audience}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {idea.content.map((item: string, index: number) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                  {idea.keywords && idea.keywords.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Palavras-chave usadas:</p>
                      <div className="flex flex-wrap gap-1">
                        {idea.keywords.map((keyword: string) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            #{keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {generatedIdeas.length > 0 ? 'Fechar' : 'Cancelar'}
          </Button>
          {generatedIdeas.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline">
                Salvar Todas
              </Button>
              <Button>
                Usar no Composer
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateIdeasModal;