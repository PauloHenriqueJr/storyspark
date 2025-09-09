import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, MessageSquare, Star, TrendingUp, Users, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const Feedback = () => {
  const [feedbacks] = useState([
    {
      id: 1,
      user: {
        name: 'João Silva',
        email: 'joao@email.com',
        avatar: '/avatars/joao.jpg',
        plan: 'Pro'
      },
      rating: 5,
      category: 'feature',
      status: 'pendente',
      title: 'Integração com WhatsApp Business',
      message: 'Seria incrível poder integrar diretamente com a API do WhatsApp Business para automatizar as mensagens.',
      date: '2024-01-19',
      votes: 23,
      priority: 'alta'
    },
    {
      id: 2,
      user: {
        name: 'Maria Santos',
        email: 'maria@agencia.com',
        avatar: '/avatars/maria.jpg',
        plan: 'Enterprise'
      },
      rating: 4,
      category: 'melhoria',
      status: 'em-andamento',
      title: 'Editor de Templates mais intuitivo',
      message: 'O editor atual é bom, mas poderia ter mais opções de personalização e uma interface mais amigável.',
      date: '2024-01-18',
      votes: 18,
      priority: 'media'
    },
    {
      id: 3,
      user: {
        name: 'Pedro Costa',
        email: 'pedro@startup.com',
        avatar: '/avatars/pedro.jpg',
        plan: 'Starter'
      },
      rating: 5,
      category: 'elogio',
      status: 'concluido',
      title: 'Excelente ferramenta!',
      message: 'A IA realmente ajuda muito na criação de copies. Já consegui aumentar minhas conversões em 40%!',
      date: '2024-01-17',
      votes: 45,
      priority: 'baixa'
    },
    {
      id: 4,
      user: {
        name: 'Ana Oliveira',
        email: 'ana@consultoria.com',
        avatar: '/avatars/ana.jpg',
        plan: 'Pro'
      },
      rating: 3,
      category: 'bug',
      status: 'pendente',
      title: 'Erro ao exportar relatórios',
      message: 'Quando tento exportar relatórios em PDF, o sistema apresenta erro e não gera o arquivo.',
      date: '2024-01-16',
      votes: 8,
      priority: 'alta'
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'em-andamento': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'concluido': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'rejeitado': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'melhoria': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'bug': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'elogio': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'media': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'baixa': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock className="h-4 w-4" />;
      case 'em-andamento': return <AlertCircle className="h-4 w-4" />;
      case 'concluido': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Colete, gerencie e responda aos feedbacks dos seus usuários
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Solicitar Feedback</span>
          <span className="sm:hidden">Solicitar</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Feedbacks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              +23 este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-muted-foreground">
              +0.2 vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              +5 pontos vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="features">Sugestões</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={feedback.user.avatar} />
                        <AvatarFallback>
                          {feedback.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{feedback.title}</CardTitle>
                          <Badge className={getStatusColor(feedback.status)}>
                            {getStatusIcon(feedback.status)}
                            <span className="ml-1">{feedback.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{feedback.user.name}</span>
                          <Badge variant="outline">{feedback.user.plan}</Badge>
                          <Badge className={getCategoryColor(feedback.category)}>
                            {feedback.category}
                          </Badge>
                          <Badge className={getPriorityColor(feedback.priority)}>
                            {feedback.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(feedback.rating)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(feedback.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{feedback.votes} votos</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed">{feedback.message}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Responder
                      </Button>
                      <Button variant="outline" size="sm">
                        Votar
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                      {feedback.status === 'pendente' && (
                        <Button size="sm">
                          Priorizar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {feedbacks.filter(f => f.status === 'pendente').map((feedback) => (
              <Card key={feedback.id} className="border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{feedback.title}</CardTitle>
                      <Badge className={getPriorityColor(feedback.priority)}>
                        {feedback.priority} prioridade
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  <CardDescription>
                    {feedback.user.name} • {feedback.user.plan} • {feedback.votes} votos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{feedback.message}</p>
                    <div className="flex gap-2">
                      <Button size="sm">Aceitar</Button>
                      <Button variant="outline" size="sm">Responder</Button>
                      <Button variant="destructive" size="sm">Rejeitar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4">
            {feedbacks.filter(f => f.category === 'feature' || f.category === 'melhoria').map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{feedback.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(feedback.category)}>
                        {feedback.category}
                      </Badge>
                      <div className="text-sm font-medium">{feedback.votes} votos</div>
                    </div>
                  </div>
                  <CardDescription>
                    Sugerido por {feedback.user.name} • {new Date(feedback.date).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{feedback.message}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Votar
                        </Button>
                        <Button variant="outline" size="sm">
                          Comentar
                        </Button>
                      </div>
                      <Badge className={getStatusColor(feedback.status)}>
                        {feedback.status}
                      </Badge>
                    </div>
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
                <CardTitle>Feedbacks por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Sugestões de Features</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Melhorias</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Elogios</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bugs</span>
                    <span className="font-medium">13%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Satisfação por Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Enterprise</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">4.8</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Pro</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">4.6</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Starter</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">4.4</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tempo de Resposta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Média de resposta</span>
                    <span className="font-medium">2.3 horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bugs críticos</span>
                    <span className="font-medium">45 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sugestões</span>
                    <span className="font-medium">1.2 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Elogios</span>
                    <span className="font-medium">4.5 horas</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Features Solicitadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>WhatsApp Integration</span>
                    <span className="font-medium">47 votos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Advanced Analytics</span>
                    <span className="font-medium">34 votos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile App</span>
                    <span className="font-medium">28 votos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Access</span>
                    <span className="font-medium">23 votos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { Feedback as Component };