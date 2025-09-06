import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Lightbulb, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Heart,
  Wand2,
  RefreshCw,
  Copy,
  Save,
  Zap,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  potential: 'low' | 'medium' | 'high';
  tags: string[];
}

interface GerarIdeiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveIdea?: (idea: GeneratedIdea) => void;
}

const categoryOptions = [
  { value: 'campaign', label: 'Campanha de Marketing', icon: Target },
  { value: 'content', label: 'Estratégia de Conteúdo', icon: Lightbulb },
  { value: 'product', label: 'Lançamento de Produto', icon: Wand2 },
  { value: 'engagement', label: 'Engajamento e Retenção', icon: Heart },
  { value: 'growth', label: 'Estratégia de Crescimento', icon: TrendingUp }
];

const industryOptions = [
  'E-commerce', 'SaaS', 'Educação', 'Saúde', 'Finanças', 
  'Beleza', 'Fitness', 'Tecnologia', 'Consultoria', 'Alimentação'
];

const toneOptions = [
  { value: 'casual', label: 'Casual e Amigável' },
  { value: 'professional', label: 'Profissional' },
  { value: 'innovative', label: 'Inovador e Disruptivo' },
  { value: 'urgent', label: 'Urgente e Persuasivo' },
  { value: 'inspirational', label: 'Inspiracional' }
];

export const GerarIdeiaModal = ({ isOpen, onClose, onSaveIdea }: GerarIdeiaModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    industry: '',
    target: '',
    goal: '',
    tone: '',
    context: ''
  });
  const { toast } = useToast();

  const generateIdeas = async () => {
    if (!formData.category || !formData.industry) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione categoria e indústria para gerar ideias.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simular geração de IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const ideas: GeneratedIdea[] = [
        {
          id: `idea-${Date.now()}-1`,
          title: `${formData.category === 'campaign' ? 'Campanha' : 'Estratégia'} de ${formData.industry} Inovadora`,
          description: `Uma ${formData.category === 'campaign' ? 'campanha' : 'estratégia'} focada em ${formData.target || 'seu público-alvo'} que utiliza ${formData.tone || 'uma abordagem personalizada'} para alcançar ${formData.goal || 'resultados excepcionais'}. Esta ideia combina tendências atuais com insights comportamentais para maximizar o engajamento.`,
          category: formData.category,
          difficulty: 'medium',
          potential: 'high',
          tags: [formData.industry.toLowerCase(), formData.tone || 'personalizada', 'inovação']
        },
        {
          id: `idea-${Date.now()}-2`,
          title: `Estratégia de Conteúdo Viral para ${formData.industry}`,
          description: `Desenvolva conteúdos que geram buzz orgânico através de storytelling autêntico e elementos de viralização. Perfeita para ${formData.target || 'audiências engajadas'} que valorizam autenticidade e conexão emocional.`,
          category: 'content',
          difficulty: 'hard',
          potential: 'high',
          tags: ['viral', 'storytelling', 'autenticidade']
        },
        {
          id: `idea-${Date.now()}-3`,
          title: `Micro-Campanha de Conversão Rápida`,
          description: `Uma série de micro-ações estratégicas para gerar resultados imediatos. Foca em pontos de contato de alta conversão com ${formData.target || 'público qualificado'} através de abordagem direta e value-driven.`,
          category: 'campaign',
          difficulty: 'easy',
          potential: 'medium',
          tags: ['conversão', 'micro-campanha', 'resultados-rápidos']
        }
      ];
      
      setGeneratedIdeas(ideas);
      
      toast({
        title: "Ideias geradas!",
        description: `${ideas.length} ideias criativas foram geradas com sucesso.`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyIdea = (idea: GeneratedIdea) => {
    const text = `${idea.title}\n\n${idea.description}\n\nTags: ${idea.tags.join(', ')}`;
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Ideia copiada!",
      description: "Conteúdo copiado para a área de transferência.",
    });
  };

  const saveIdea = (idea: GeneratedIdea) => {
    if (onSaveIdea) {
      onSaveIdea(idea);
      toast({
        title: "Ideia salva!",
        description: "Ideia adicionada à sua biblioteca.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      industry: '',
      target: '',
      goal: '',
      tone: '',
      context: ''
    });
    setGeneratedIdeas([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'hard': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'low': return 'bg-gray-500/10 text-gray-500';
      case 'medium': return 'bg-blue-500/10 text-blue-500';
      case 'high': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Gerador de Ideias IA
          </DialogTitle>
          <DialogDescription>
            Descreva seu contexto e receba ideias criativas personalizadas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Indústria/Nicho *</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({...prev, industry: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a indústria" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Público-alvo</Label>
                <Input
                  placeholder="Ex: Mulheres 25-35, empreendedores"
                  value={formData.target}
                  onChange={(e) => setFormData(prev => ({...prev, target: e.target.value}))}
                />
              </div>

              <div className="space-y-2">
                <Label>Tom de Voz</Label>
                <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({...prev, tone: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tom" />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Objetivo Principal</Label>
              <Input
                placeholder="Ex: Aumentar vendas, engajamento, awareness"
                value={formData.goal}
                onChange={(e) => setFormData(prev => ({...prev, goal: e.target.value}))}
              />
            </div>

            <div className="space-y-2">
              <Label>Contexto Adicional</Label>
              <Textarea
                placeholder="Descreva mais detalhes sobre sua necessidade..."
                value={formData.context}
                onChange={(e) => setFormData(prev => ({...prev, context: e.target.value}))}
                rows={3}
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button 
              onClick={generateIdeas}
              disabled={isGenerating || !formData.category || !formData.industry}
              className="flex-1 gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando Ideias...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Gerar Ideias IA
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={resetForm}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Generated Ideas */}
          {generatedIdeas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ideias Geradas</h3>
              
              {generatedIdeas.map((idea) => (
                <Card key={idea.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-base">{idea.title}</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyIdea(idea)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveIdea(idea)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{idea.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(idea.difficulty)}>
                          {idea.difficulty === 'easy' ? 'Fácil' : 
                           idea.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                        </Badge>
                        <Badge className={getPotentialColor(idea.potential)}>
                          Potencial {idea.potential === 'low' ? 'Baixo' :
                                   idea.potential === 'medium' ? 'Médio' : 'Alto'}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-1">
                        {idea.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};