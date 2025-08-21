import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Send, Users, BarChart3, Mail, Calendar, Target, Clock } from 'lucide-react';
import CreateEmailCampaignModal from '@/components/modals/CreateEmailCampaignModal';
import { useToast } from '@/hooks/use-toast';

const EmailMarketing = () => {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [campaigns] = useState([
    {
      id: 1,
      name: 'Newsletter Semanal',
      subject: 'Novidades da Semana - StorySpark',
      status: 'enviada',
      sent: 15420,
      opened: 8745,
      clicked: 1234,
      date: '2024-01-15',
      openRate: 56.7,
      clickRate: 8.0,
    },
    {
      id: 2,
      name: 'Promoção Black Friday',
      subject: '50% OFF - Apenas Hoje!',
      status: 'agendada',
      recipients: 23450,
      scheduledDate: '2024-01-20',
      openRate: 0,
      clickRate: 0,
    },
    {
      id: 3,
      name: 'Onboarding Novos Usuários',
      subject: 'Bem-vindo ao StorySpark!',
      status: 'rascunho',
      recipients: 850,
      openRate: 0,
      clickRate: 0,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enviada': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'agendada': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'rascunho': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Email Marketing</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Crie e gerencie campanhas de email marketing eficazes
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Campanha</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enviados</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">39,270</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56.7%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% acima da média
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Clique</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.0%</div>
            <p className="text-xs text-muted-foreground">
              +0.8% acima da média
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">
              +234 novos este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="lists">Listas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription>{campaign.subject}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Recipients</p>
                      <p className="text-lg font-semibold">
                        {campaign.status === 'enviada' ? campaign.sent?.toLocaleString() : campaign.recipients?.toLocaleString()}
                      </p>
                    </div>
                    {campaign.status === 'enviada' && (
                      <>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Abertos</p>
                          <p className="text-lg font-semibold">{campaign.opened?.toLocaleString()}</p>
                          <p className="text-xs text-green-600">{campaign.openRate}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Cliques</p>
                          <p className="text-lg font-semibold">{campaign.clicked?.toLocaleString()}</p>
                          <p className="text-xs text-blue-600">{campaign.clickRate}%</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Enviado em</p>
                          <p className="text-sm">{new Date(campaign.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </>
                    )}
                    {campaign.status === 'agendada' && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Agendado para</p>
                        <p className="text-sm">{new Date(campaign.scheduledDate).toLocaleDateString('pt-BR')}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Em 5 dias
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({
                        title: campaign.status === 'rascunho' ? 'Editando campanha' : 'Visualizando detalhes',
                        description: `Abrindo ${campaign.name}...`,
                      })}
                    >
                      {campaign.status === 'rascunho' ? 'Editar' : 'Ver Detalhes'}
                    </Button>
                    {campaign.status === 'enviada' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({
                          title: 'Analytics',
                          description: `Visualizando analytics da campanha ${campaign.name}`,
                        })}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Listas de Email</CardTitle>
              <CardDescription>
                Gerencie suas listas de contatos e segmentações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Lista Principal</h3>
                    <p className="text-sm text-muted-foreground">12,543 assinantes</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({
                      title: 'Gerenciar lista',
                      description: 'Abrindo gerenciamento da lista principal...',
                    })}
                  >
                    Gerenciar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Novos Usuários</h3>
                    <p className="text-sm text-muted-foreground">234 assinantes</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({
                      title: 'Gerenciar lista',
                      description: 'Abrindo gerenciamento de novos usuários...',
                    })}
                  >
                    Gerenciar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Usuários Premium</h3>
                    <p className="text-sm text-muted-foreground">1,543 assinantes</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({
                      title: 'Gerenciar lista',
                      description: 'Abrindo gerenciamento de usuários premium...',
                    })}
                  >
                    Gerenciar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Email</CardTitle>
              <CardDescription>
                Templates prontos para suas campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {['Newsletter', 'Promoção', 'Onboarding', 'Carrinho Abandonado', 'Feedback', 'Evento'].map((template) => (
                  <div key={template} className="border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-colors">
                    <h3 className="font-medium">{template}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Template otimizado para {template.toLowerCase()}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => toast({
                        title: 'Template selecionado',
                        description: `Usando template ${template}`,
                      })}
                    >
                      Usar Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics de Email</CardTitle>
              <CardDescription>
                Relatórios detalhados de performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">56.7%</div>
                    <p className="text-sm text-muted-foreground">Taxa de Abertura Média</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">8.0%</div>
                    <p className="text-sm text-muted-foreground">Taxa de Clique Média</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2.1%</div>
                    <p className="text-sm text-muted-foreground">Taxa de Descadastro</p>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/5">
                  <p className="text-muted-foreground">Gráfico de performance será implementado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateEmailCampaignModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default EmailMarketing;