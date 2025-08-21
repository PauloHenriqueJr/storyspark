import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Lightbulb, Sparkles, TrendingUp, Target, Clock, Zap, Brain, BookOpen } from 'lucide-react';
import GenerateIdeasModal from '@/components/modals/GenerateIdeasModal';

const AIIdeas = () => {
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [ideas] = useState([
    {
      id: 1,
      title: '5 Headlines para Landing Page de Curso',
      category: 'headlines',
      type: 'sugestao',
      confidence: 92,
      trends: ['educacao-online', 'ia', 'marketing'],
      generated: '2024-01-19T10:30:00',
      used: false,
      content: [
        'Domine Copy com IA em 30 Dias (Garantido)',
        'O Curso que 2.000+ Marketers Usam para Vender Mais',
        'De Zero a Copy Expert: Seu Primeiro Cliente em 15 Dias',
        'Copy + IA = Resultados 10x Maiores (Prova Real)',
        'Pare de Quebrar a Cabeça: Copy que Converte no Automático'
      ]
    },
    {
      id: 2,
      title: 'Sequência de Email para Black Friday',
      category: 'email-sequence',
      type: 'campanha',
      confidence: 88,
      trends: ['black-friday', 'urgencia', 'desconto'],
      generated: '2024-01-18T14:15:00',
      used: true,
      content: [
        'Email 1: Prévia Exclusiva - Black Friday Chegando',
        'Email 2: AGORA! 50% OFF Por Tempo Limitado',
        'Email 3: Últimas 6 Horas - Não Perca',
        'Email 4: ACABOU! Obrigado + Próximas Oportunidades'
      ]
    },
    {
      id: 3,
      title: 'Posts Virais para LinkedIn B2B',
      category: 'social-media',
      type: 'conteudo',
      confidence: 85,
      trends: ['linkedin', 'b2b', 'storytelling'],
      generated: '2024-01-17T09:45:00',
      used: false,
      content: [
        'A reunião que mudou minha carreira...',
        'CEO me demitiu. Melhor coisa que aconteceu.',
        '3 erros que custaram R$100k (e como evitá-los)',
        'Li 47 livros de negócios. Estes 3 mudaram tudo.'
      ]
    },
    {
      id: 4,
      title: 'Scripts de Vendas por WhatsApp',
      category: 'sales-script',
      type: 'conversao',
      confidence: 90,
      trends: ['whatsapp', 'vendas', 'conversational'],
      generated: '2024-01-16T16:20:00',
      used: false,
      content: [
        'Abordagem: Oi [Nome], vi seu interesse no [produto]...',
        'Qualificação: Me conta, qual seu maior desafio com [problema]?',
        'Apresentação: Deixa eu te mostrar como resolvi isso para +200 clientes',
        'Fechamento: Que tal agendar 15min para ver se faz sentido?'
      ]
    },
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'headlines': return <Target className="h-4 w-4" />;
      case 'email-sequence': return <Zap className="h-4 w-4" />;
      case 'social-media': return <TrendingUp className="h-4 w-4" />;
      case 'sales-script': return <Brain className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'headlines': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'email-sequence': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'social-media': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'sales-script': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sugestao': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'campanha': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'conteudo': return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400';
      case 'conversao': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ideias IA</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Ideias inteligentes baseadas em tendências e dados de mercado
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setGenerateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Gerar Novas Ideias</span>
          <span className="sm:hidden">Gerar</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ideias Geradas</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +23 esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ideias Utilizadas</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              Taxa de uso: 27%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confiança Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">
              +2% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendências Ativas</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Sendo monitoradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="trending">Em Alta</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4">
            {ideas.map((idea) => (
              <Card key={idea.id} className={`hover:border-primary/50 transition-colors ${idea.used ? 'bg-muted/20' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{idea.title}</CardTitle>
                        {idea.used && (
                          <Badge variant="outline" className="text-xs">
                            Usado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(idea.category)}>
                          {getCategoryIcon(idea.category)}
                          <span className="ml-1">{idea.category}</span>
                        </Badge>
                        <Badge className={getTypeColor(idea.type)}>
                          {idea.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(idea.generated).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <CardDescription>
                        Confiança: {idea.confidence}% • Baseado em: {idea.trends.join(', ')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Content Preview */}
                    <div className="space-y-2">
                      {idea.content.slice(0, 3).map((item, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm">{item}</p>
                        </div>
                      ))}
                      {idea.content.length > 3 && (
                        <div className="text-center">
                          <Button variant="ghost" size="sm">
                            Ver todas as {idea.content.length} ideias
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Trending Tags */}
                    <div className="flex flex-wrap gap-1">
                      {idea.trends.map((trend) => (
                        <Badge key={trend} variant="secondary" className="text-xs">
                          #{trend}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Completo
                      </Button>
                      {!idea.used && (
                        <>
                          <Button size="sm">
                            Usar Agora
                          </Button>
                          <Button variant="outline" size="sm">
                            Salvar
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        Gerar Variações
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                trend: 'IA para Pequenas Empresas',
                growth: '+340%',
                content: '23 ideias',
                confidence: 94
              },
              {
                trend: 'Marketing Conversacional',
                growth: '+280%',
                content: '18 ideias',
                confidence: 89
              },
              {
                trend: 'Automação para Creators',
                growth: '+245%',
                content: '15 ideias',
                confidence: 87
              },
              {
                trend: 'Vídeo Marketing B2B',
                growth: '+210%',
                content: '21 ideias',
                confidence: 85
              },
              {
                trend: 'Copy Emocional',
                growth: '+195%',
                content: '31 ideias',
                confidence: 92
              },
              {
                trend: 'Neuromarketing Digital',
                growth: '+175%',
                content: '12 ideias',
                confidence: 88
              }
            ].map((trend) => (
              <Card key={trend.trend} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{trend.trend}</CardTitle>
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                      {trend.growth}
                    </Badge>
                  </div>
                  <CardDescription>
                    {trend.content} • {trend.confidence}% confiança
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Ideias
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Headlines & Títulos',
                icon: Target,
                count: 34,
                description: 'Títulos que capturam atenção'
              },
              {
                name: 'Email Marketing',
                icon: Zap,
                count: 28,
                description: 'Sequências e campanhas'
              },
              {
                name: 'Social Media',
                icon: TrendingUp,
                count: 45,
                description: 'Posts que geram engajamento'
              },
              {
                name: 'Scripts de Vendas',
                icon: Brain,
                count: 19,
                description: 'Conversões por telefone/chat'
              },
              {
                name: 'Landing Pages',
                icon: Target,
                count: 22,
                description: 'Páginas de alta conversão'
              },
              {
                name: 'Anúncios Pagos',
                icon: TrendingUp,
                count: 31,
                description: 'Ads para Facebook/Google'
              }
            ].map((category) => (
              <Card key={category.name} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{category.count}</span>
                    <Button variant="outline">Ver Ideias</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Padrões de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Headlines com números</span>
                    <span className="font-medium text-green-600">+42% CTR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Copy emocional</span>
                    <span className="font-medium text-green-600">+38% conversão</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Urgência + escassez</span>
                    <span className="font-medium text-green-600">+29% vendas</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Social proof</span>
                    <span className="font-medium text-green-600">+25% confiança</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storytelling</span>
                    <span className="font-medium text-green-600">+31% engajamento</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recomendações IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h4 className="font-medium">Oportunidade Detectada</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Headlines com "IA" no título estão performando 67% melhor. 
                      Considere incluir em suas próximas campanhas.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h4 className="font-medium">Tendência Emergente</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Marketing Conversacional" está em alta. Gere ideias sobre 
                      chatbots e WhatsApp marketing.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Gerar Ideias
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Forecast de Tendências</CardTitle>
              <CardDescription>
                Tendências previstas para os próximos 3 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Tendências Emergentes</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                        <span className="text-sm">IA Conversacional</span>
                        <Badge variant="secondary">+85%</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                        <span className="text-sm">Marketing Sustentável</span>
                        <Badge variant="secondary">+72%</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                        <span className="text-sm">Personalização Ultra</span>
                        <Badge variant="secondary">+68%</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/20">
                        <span className="text-sm">Micro-Influenciadores</span>
                        <Badge variant="secondary">+61%</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Previsões por Mês</h4>
                    <div className="space-y-2">
                      <div className="p-2 rounded bg-gradient-to-r from-primary/10 to-primary/5">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Janeiro 2025</span>
                          <span className="text-xs text-muted-foreground">Alto Potencial</span>
                        </div>
                        <p className="text-xs mt-1">Foco em resoluções de ano novo e transformação pessoal</p>
                      </div>
                      <div className="p-2 rounded bg-gradient-to-r from-blue-100/50 to-blue-50/50">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Fevereiro 2025</span>
                          <span className="text-xs text-muted-foreground">Médio Potencial</span>
                        </div>
                        <p className="text-xs mt-1">Marketing romântico e conexões emocionais</p>
                      </div>
                      <div className="p-2 rounded bg-gradient-to-r from-green-100/50 to-green-50/50">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Março 2025</span>
                          <span className="text-xs text-muted-foreground">Alto Potencial</span>
                        </div>
                        <p className="text-xs mt-1">Renovação, crescimento e primavera dos negócios</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <GenerateIdeasModal 
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
      />
    </div>
  );
};

export default AIIdeas;