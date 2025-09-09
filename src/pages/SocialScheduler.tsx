import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, Instagram, Facebook, Twitter, Linkedin, BarChart3 } from 'lucide-react';
import CreateSocialPostModal from '@/components/modals/CreateSocialPostModal';
import { useToast } from '@/hooks/use-toast';

const SocialScheduler = () => {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [posts] = useState([
    {
      id: 1,
      content: 'Descubra como a IA pode revolucionar sua estratégia de conteúdo! 🚀',
      platforms: ['instagram', 'facebook', 'twitter'],
      scheduledFor: '2024-01-20T14:00:00',
      status: 'agendado',
      media: 'image.jpg'
    },
    {
      id: 2,
      content: 'Novo artigo no blog: "10 Dicas para Copy que Converte"',
      platforms: ['linkedin', 'twitter'],
      scheduledFor: '2024-01-19T10:30:00',
      status: 'publicado',
      engagement: { likes: 45, shares: 12, comments: 8 }
    },
    {
      id: 3,
      content: 'Rascunho de conteúdo sobre tendências de marketing digital',
      platforms: ['instagram'],
      status: 'rascunho'
    },
  ]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publicado': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'agendado': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'rascunho': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Social Scheduler</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Agende e gerencie posts para todas suas redes sociais
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Post</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Agendados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Para os próximos 7 dias
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Publicados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engajamento Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">
              +0.8% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alcance Total</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2K</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Biblioteca</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(post.status)}>
                          {post.status}
                        </Badge>
                        <div className="flex gap-1">
                          {post.platforms.map((platform) => (
                            <div key={platform} className="p-1 bg-muted rounded">
                              {getPlatformIcon(platform)}
                            </div>
                          ))}
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {post.content}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {post.scheduledFor && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(post.scheduledFor).toLocaleString('pt-BR')}
                        </div>
                      )}
                      {post.engagement && (
                        <div className="flex gap-3 text-sm text-muted-foreground">
                          <span>❤️ {post.engagement.likes}</span>
                          <span>🔄 {post.engagement.shares}</span>
                          <span>💬 {post.engagement.comments}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({
                          title: post.status === 'rascunho' ? 'Editando post' : 'Visualizando detalhes',
                          description: `Abrindo post: ${post.content.slice(0, 50)}...`,
                        })}
                      >
                        {post.status === 'rascunho' ? 'Editar' : 'Ver Detalhes'}
                      </Button>
                      {post.status === 'publicado' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({
                            title: 'Analytics',
                            description: 'Visualizando analytics do post...',
                          })}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendário Editorial</CardTitle>
              <CardDescription>
                Visualize todos os posts agendados no calendário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center border rounded-lg bg-muted/5">
                <p className="text-muted-foreground">Calendário interativo será implementado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      <span>Instagram</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">4.2%</div>
                      <div className="text-xs text-muted-foreground">engagement</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      <span>Facebook</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">3.8%</div>
                      <div className="text-xs text-muted-foreground">engagement</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      <span>Twitter</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">2.1%</div>
                      <div className="text-xs text-muted-foreground">engagement</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">5.7%</div>
                      <div className="text-xs text-muted-foreground">engagement</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Melhores Horários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Segunda-feira</span>
                    <span className="font-medium">14:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Terça-feira</span>
                    <span className="font-medium">10:00 - 12:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quarta-feira</span>
                    <span className="font-medium">15:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quinta-feira</span>
                    <span className="font-medium">11:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sexta-feira</span>
                    <span className="font-medium">09:00 - 11:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de Conteúdo</CardTitle>
              <CardDescription>
                Imagens, vídeos e assets para seus posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Asset {i + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateSocialPostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export { SocialScheduler as Component };