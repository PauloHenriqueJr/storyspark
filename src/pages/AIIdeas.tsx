import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GerarIdeiaModal } from "@/components/modals/GerarIdeiaModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  Sparkles, 
  TrendingUp, 
  Target,
  Wand2,
  RefreshCw,
  Save,
  Share,
  Heart,
  Brain,
  Zap,
  Search,
  Loader2,
  Plus
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useNavigate } from "react-router-dom";
import { aiIdeasService, type IdeaPayload } from "@/services/aiIdeasService";

interface Idea {
  id: string | number;
  title: string;
  description: string;
  category: 'campaign' | 'content' | 'strategy' | 'product' | 'engagement';
  industry: string;
  difficulty: 'easy' | 'medium' | 'hard';
  potential: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: Date;
  isFavorite: boolean;
  isGenerated: boolean;
}

const categoryIcons = {
  campaign: Target,
  content: Lightbulb,
  strategy: TrendingUp,
  product: Wand2,
  engagement: Heart
};

const difficultyColors = {
  easy: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  hard: 'bg-red-500/10 text-red-500'
};

const potentialColors = {
  low: 'bg-gray-500/10 text-gray-500',
  medium: 'bg-blue-500/10 text-blue-500',
  high: 'bg-purple-500/10 text-purple-500'
};

const AIIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const { toast } = useToast();
  const { workspace, user } = useWorkspace();
  const navigate = useNavigate();
  
  // Generation form
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generationContext, setGenerationContext] = useState({
    industry: '',
    target: '',
    goal: '',
    style: ''
  });

  // Load ideas on component mount
  useEffect(() => {
    loadIdeas();
  }, [workspace?.id]);

  const loadIdeas = async () => {
    if (!workspace?.id) return;
    
    try {
      setLoading(true);
      const data = await aiIdeasService.fetchIdeas(workspace.id, 50);
      
      // Map the fetched data to the new Idea structure
      const mappedIdeas: Idea[] = data.map((item: any) => ({
        id: item.id,
        title: item.title || "Ideia sem título",
        description: item.content?.[0] || "Descrição não disponível",
        category: mapCategory(item.category),
        industry: item.audience || "Geral",
        difficulty: 'medium',
        potential: mapPotential(item.confidence),
        tags: [...(item.keywords || []), ...(item.trends || [])],
        createdAt: new Date(item.generated || new Date()),
        isFavorite: false,
        isGenerated: true
      }));
      
      setIdeas(mappedIdeas);
    } catch (error) {
      toast({
        title: "Erro ao carregar ideias",
        description: "Não foi possível carregar as ideias salvas.",
        variant: "destructive"
      });
      console.error("Error loading ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const mapCategory = (category: string): 'campaign' | 'content' | 'strategy' | 'product' | 'engagement' => {
    switch (category) {
      case 'headlines':
        return 'content';
      case 'email-sequence':
        return 'campaign';
      case 'social-media':
        return 'content';
      case 'sales-script':
        return 'engagement';
      default:
        return 'strategy';
    }
  };

  const mapPotential = (confidence?: number): 'low' | 'medium' | 'high' => {
    if (!confidence) return 'medium';
    if (confidence >= 80) return 'high';
    if (confidence >= 60) return 'medium';
    return 'low';
  };

  const handleGenerateIdeas = async () => {
    if (!generationPrompt.trim()) return;
    
    setLoading(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newIdeas: Idea[] = [
        {
          id: Date.now().toString(),
          title: `Campanha Inovadora: ${generationPrompt}`,
          description: `Ideia gerada com base no contexto: ${generationPrompt}. Esta campanha foca em conectar emocionalmente com o público através de storytelling autêntico e call-to-actions irresistíveis.`,
          category: 'campaign',
          industry: generationContext.industry || 'Geral',
          difficulty: 'medium',
          potential: 'high',
          tags: ['gerado-ia', 'campanha', 'inovação'],
          createdAt: new Date(),
          isFavorite: false,
          isGenerated: true
        },
        {
          id: (Date.now() + 1).toString(),
          title: 'Estratégia de Conteúdo Viral',
          description: 'Estratégia baseada em tendências atuais e comportamento do público. Combina elementos de urgência, exclusividade e valor social.',
          category: 'strategy',
          industry: generationContext.industry || 'Geral',
          difficulty: 'hard',
          potential: 'high',
          tags: ['viral', 'tendências', 'estratégia'],
          createdAt: new Date(),
          isFavorite: false,
          isGenerated: true
        }
      ];
      
      setIdeas(prev => [...newIdeas, ...prev]);
      
      toast({
        title: "Ideias geradas!",
        description: "2 ideias criativas foram geradas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar as ideias. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setGenerationPrompt('');
    }
  };

  const toggleFavorite = (ideaId: string | number) => {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === ideaId ? { ...idea, isFavorite: !idea.isFavorite } : idea
      )
    );
  };

  const handleUseIdea = (idea: Idea) => {
    navigate('/composer', {
      state: {
        initialContent: idea.description,
        meta: {
          category: idea.category,
          topic: idea.title,
          industry: idea.industry,
        },
      },
    });
  };

  const handleSaveIdea = async (idea: Idea) => {
    if (!workspace?.id || !user?.id) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para salvar ideias.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const payload: IdeaPayload = {
        category: idea.category,
        confidence: idea.potential === 'high' ? 90 : idea.potential === 'medium' ? 70 : 50,
        content: [idea.description],
        topic: idea.title,
        audience: idea.industry,
        keywords: idea.tags,
        trends: []
      };
      
      await aiIdeasService.saveIdeas(workspace.id, user.id, [payload]);
      
      toast({
        title: "Ideia salva!",
        description: "A ideia foi adicionada à sua biblioteca."
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a ideia.",
        variant: "destructive"
      });
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
    const matchesIndustry = selectedIndustry === 'all' || idea.industry === selectedIndustry;
    return matchesCategory && matchesIndustry;
  });

  const favoriteIdeas = ideas.filter(idea => idea.isFavorite);

  if (loading && ideas.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando ideias...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Ideias IA</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerador automático de ideias criativas para campanhas e estratégias
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Salvar Sessão</span>
            <span className="sm:hidden">Salvar</span>
          </Button>
          <Button className="gap-2" onClick={() => setIsGeneratorModalOpen(true)}>
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Gerador IA</span>
            <span className="sm:hidden">Gerar</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Gerador</span>
          </TabsTrigger>
          <TabsTrigger value="ideas" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Todas</span>
            <span>({filteredIdeas.length})</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Favoritas</span>
            <span>({favoriteIdeas.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Gerador de Ideias IA
              </CardTitle>
              <CardDescription>
                Descreva seu contexto e deixe a IA gerar ideias criativas para você
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Indústria/Nicho (ex: E-commerce, SaaS)"
                  value={generationContext.industry}
                  onChange={(e) =>
                    setGenerationContext(prev => ({ ...prev, industry: e.target.value }))
                  }
                />
                <Input
                  placeholder="Público-alvo (ex: Mulheres 25-35)"
                  value={generationContext.target}
                  onChange={(e) =>
                    setGenerationContext(prev => ({ ...prev, target: e.target.value }))
                  }
                />
                <Input
                  placeholder="Objetivo (ex: Aumentar vendas, Engajamento)"
                  value={generationContext.goal}
                  onChange={(e) =>
                    setGenerationContext(prev => ({ ...prev, goal: e.target.value }))
                  }
                />
                <Input
                  placeholder="Estilo (ex: Descontraído, Profissional)"
                  value={generationContext.style}
                  onChange={(e) =>
                    setGenerationContext(prev => ({ ...prev, style: e.target.value }))
                  }
                />
              </div>

              <Textarea
                placeholder="Descreva o que você precisa... Ex: 'Quero criar uma campanha viral para lançamento de produto, focada em sustentabilidade'"
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                rows={3}
              />

              <Button 
                onClick={handleGenerateIdeas}
                disabled={loading || !generationPrompt.trim()}
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    Gerando Ideias...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Gerar Ideias IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Ideas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setGenerationPrompt('Campanha de lançamento de produto inovador')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Lançamento de Produto</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Estratégias para criar buzz e gerar vendas no lançamento
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setGenerationPrompt('Conteúdo viral para redes sociais')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Conteúdo Viral</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ideias para criar conteúdo que engaja e viraliza
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setGenerationPrompt('Estratégia de retenção de clientes')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="font-medium">Retenção de Clientes</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Campanhas para manter clientes engajados e fiéis
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Ideas Tab */}
        <TabsContent value="ideas" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="campaign">Campanhas</SelectItem>
                <SelectItem value="content">Conteúdo</SelectItem>
                <SelectItem value="strategy">Estratégias</SelectItem>
                <SelectItem value="product">Produtos</SelectItem>
                <SelectItem value="engagement">Engajamento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Indústria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Indústrias</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="Beleza">Beleza</SelectItem>
                <SelectItem value="Geral">Geral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ideas List */}
          <div className="grid gap-4">
            {filteredIdeas.map((idea) => {
              const CategoryIcon = categoryIcons[idea.category];
              
              return (
                <Card key={idea.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4" />
                          <CardTitle className="text-base">{idea.title}</CardTitle>
                          {idea.isGenerated && (
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm">
                          {idea.industry} • {idea.createdAt.toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(idea.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            idea.isFavorite ? 'text-red-500 fill-current' : 'text-muted-foreground'
                          }`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{idea.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={difficultyColors[idea.difficulty]}>
                          {idea.difficulty === 'easy' ? 'Fácil' :
                           idea.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                        </Badge>
                        <Badge className={potentialColors[idea.potential]}>
                          Potencial {idea.potential === 'low' ? 'Baixo' :
                                   idea.potential === 'medium' ? 'Médio' : 'Alto'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {idea.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUseIdea(idea)}>
                        Usar Ideia
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSaveIdea(idea)}>
                        Salvar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsGeneratorModalOpen(true)}>
                        Expandir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-6">
          <div className="grid gap-4">
            {favoriteIdeas.map((idea) => {
              const CategoryIcon = categoryIcons[idea.category];
              
              return (
                <Card key={idea.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4" />
                          <CardTitle className="text-base">{idea.title}</CardTitle>
                          <Heart className="h-4 w-4 text-red-500 fill-current" />
                        </div>
                        <CardDescription>
                          {idea.industry} • {idea.createdAt.toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{idea.description}</p>
                    
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUseIdea(idea)}>
                        Implementar Ideia
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSaveIdea(idea)}>
                        Salvar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Generator Modal */}
      <GerarIdeiaModal
        isOpen={isGeneratorModalOpen}
        onClose={() => setIsGeneratorModalOpen(false)}
        onSaveIdea={(idea) => {
          const newIdea: Idea = {
            ...idea,
            category: idea.category as 'campaign' | 'content' | 'strategy' | 'product' | 'engagement',
            industry: 'Geral',
            createdAt: new Date(),
            isFavorite: false,
            isGenerated: true
          };
          setIdeas(prev => [newIdea, ...prev]);
        }}
      />
    </div>
  );
};

export default AIIdeas;