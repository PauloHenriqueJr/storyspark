import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, TrendingUp, Copy, Search, Star, Eye, Calendar, Zap, Target, Heart } from 'lucide-react';

const TrendingHooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hooks] = useState([
    {
      id: 1,
      hook: 'Eu sempre achei que [crença antiga] até que descobri [nova verdade]',
      category: 'transformacao',
      platform: 'linkedin',
      engagement: 4.8,
      uses: 234,
      trend: 'crescendo',
      examples: [
        'Eu sempre achei que vendas era sobre insistir até que descobri que é sobre servir',
        'Eu sempre achei que produtividade era sobre fazer mais até que descobri que é sobre fazer o certo'
      ],
      performance: {
        clicks: 15420,
        shares: 892,
        comments: 456
      }
    },
    {
      id: 2,
      hook: 'Todo mundo fala sobre [tópico comum], mas ninguém fala sobre [verdade oculta]',
      category: 'contraste',
      platform: 'instagram',
      engagement: 6.2,
      uses: 189,
      trend: 'em-alta',
      examples: [
        'Todo mundo fala sobre trabalhar duro, mas ninguém fala sobre trabalhar com propósito',
        'Todo mundo fala sobre marketing digital, mas ninguém fala sobre marketing humano'
      ],
      performance: {
        clicks: 22340,
        shares: 1234,
        comments: 789
      }
    },
    {
      id: 3,
      hook: '[Número] coisas que eu gostaria de ter sabido aos [idade] anos',
      category: 'experiencia',
      platform: 'tiktok',
      engagement: 8.7,
      uses: 456,
      trend: 'viral',
      examples: [
        '7 coisas que eu gostaria de ter sabido aos 20 anos sobre dinheiro',
        '5 coisas que eu gostaria de ter sabido aos 25 sobre carreira'
      ],
      performance: {
        clicks: 45600,
        shares: 2890,
        comments: 1567
      }
    },
    {
      id: 4,
      hook: 'Se você não tem tempo para [atividade], você tem que fazer [atividade]',
      category: 'paradoxo',
      platform: 'twitter',
      engagement: 5.4,
      uses: 145,
      trend: 'estavel',
      examples: [
        'Se você não tem tempo para planejar, você tem que planejar',
        'Se você não tem tempo para descansar, você tem que descansar'
      ],
      performance: {
        clicks: 12890,
        shares: 567,
        comments: 234
      }
    },
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'viral': return <Zap className="h-4 w-4" />;
      case 'em-alta': return <TrendingUp className="h-4 w-4" />;
      case 'crescendo': return <Target className="h-4 w-4" />;
      case 'estavel': return <Heart className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'viral': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'em-alta': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'crescendo': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'estavel': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transformacao': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'contraste': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'experiencia': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'paradoxo': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const filteredHooks = hooks.filter(hook =>
    hook.hook.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hook.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Trending Hooks</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Ganchos virais e fórmulas de alta performance para suas campanhas
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Sugerir Hook</span>
          <span className="sm:hidden">Sugerir</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar hooks, categorias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hooks Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +12 esta semana
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engajamento Médio</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.2%</div>
            <p className="text-xs text-muted-foreground">
              +1.3% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usos Totais</CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,024</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hooks Virais</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              +3 esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trending">Em Alta</TabsTrigger>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="platforms">Por Plataforma</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid gap-4">
            {filteredHooks.sort((a, b) => b.engagement - a.engagement).map((hook) => (
              <Card key={hook.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getTrendColor(hook.trend)}>
                          {getTrendIcon(hook.trend)}
                          <span className="ml-1">{hook.trend}</span>
                        </Badge>
                        <Badge className={getCategoryColor(hook.category)}>
                          {hook.category}
                        </Badge>
                        <Badge variant="outline">{hook.platform}</Badge>
                      </div>
                      <CardTitle className="text-lg leading-relaxed">
                        {hook.hook}
                      </CardTitle>
                      <CardDescription>
                        {hook.engagement}% engajamento médio • {hook.uses} usos
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Examples */}
                    <div>
                      <h4 className="font-medium mb-2">Exemplos de uso:</h4>
                      <div className="space-y-2">
                        {hook.examples.map((example, index) => (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">{example}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 border rounded-lg">
                        <div className="font-medium">{hook.performance.clicks.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Cliques</div>
                      </div>
                      <div className="p-2 border rounded-lg">
                        <div className="font-medium">{hook.performance.shares.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Compartilhamentos</div>
                      </div>
                      <div className="p-2 border rounded-lg">
                        <div className="font-medium">{hook.performance.comments.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Comentários</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Copy className="h-4 w-4 mr-1" />
                        Usar Hook
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4 mr-1" />
                        Favoritar
                      </Button>
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

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Transformação',
                count: 23,
                description: 'Mudança de perspectiva',
                avgEngagement: 6.4,
                color: 'purple'
              },
              {
                name: 'Contraste',
                count: 18,
                description: 'Oposições e comparações',
                avgEngagement: 5.8,
                color: 'orange'
              },
              {
                name: 'Experiência',
                count: 31,
                description: 'Lições aprendidas',
                avgEngagement: 7.2,
                color: 'blue'
              },
              {
                name: 'Paradoxo',
                count: 12,
                description: 'Contradições aparentes',
                avgEngagement: 5.1,
                color: 'green'
              },
              {
                name: 'Pergunta',
                count: 25,
                description: 'Hooks interrogativos',
                avgEngagement: 4.9,
                color: 'red'
              },
              {
                name: 'Lista',
                count: 34,
                description: 'Enumerações e rankings',
                avgEngagement: 6.8,
                color: 'indigo'
              }
            ].map((category) => (
              <Card key={category.name} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{category.avgEngagement}%</div>
                      <div className="text-xs text-muted-foreground">Engajamento médio</div>
                    </div>
                    <Button variant="outline">Ver Hooks</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                platform: 'LinkedIn',
                hooks: 28,
                avgEngagement: 5.4,
                bestTime: '09:00-11:00',
                topCategory: 'Experiência'
              },
              {
                platform: 'Instagram',
                hooks: 35,
                avgEngagement: 6.8,
                bestTime: '18:00-21:00',
                topCategory: 'Lista'
              },
              {
                platform: 'TikTok',
                hooks: 19,
                avgEngagement: 8.2,
                bestTime: '19:00-22:00',
                topCategory: 'Transformação'
              },
              {
                platform: 'Twitter',
                hooks: 22,
                avgEngagement: 4.1,
                bestTime: '12:00-14:00',
                topCategory: 'Pergunta'
              }
            ].map((platform) => (
              <Card key={platform.platform}>
                <CardHeader>
                  <CardTitle className="text-lg">{platform.platform}</CardTitle>
                  <CardDescription>{platform.hooks} hooks disponíveis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Engajamento</span>
                      <span className="font-medium">{platform.avgEngagement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Melhor horário</span>
                      <span className="font-medium">{platform.bestTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Top categoria</span>
                      <span className="font-medium">{platform.topCategory}</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Ver Hooks
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Experiência</span>
                    <span className="font-medium">7.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lista</span>
                    <span className="font-medium">6.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transformação</span>
                    <span className="font-medium">6.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contraste</span>
                    <span className="font-medium">5.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paradoxo</span>
                    <span className="font-medium">5.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Hooks Mais Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hooks.sort((a, b) => b.uses - a.uses).slice(0, 5).map((hook, index) => (
                    <div key={hook.id} className="flex items-center justify-between">
                      <span className="text-sm line-clamp-1">{hook.hook.substring(0, 40)}...</span>
                      <div className="text-right">
                        <div className="font-medium">{hook.uses}</div>
                        <div className="text-xs text-muted-foreground">usos</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Engajamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/5">
                <p className="text-muted-foreground">Gráfico de evolução será implementado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrendingHooks;