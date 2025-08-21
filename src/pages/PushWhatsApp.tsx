import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MessageSquare, Send, Users, Clock, Smartphone, Bell } from 'lucide-react';

const PushWhatsApp = () => {
  const [campaigns] = useState([
    {
      id: 1,
      name: 'Promoção Black Friday',
      type: 'whatsapp',
      message: 'Últimas horas! 50% OFF em todos os cursos 🔥',
      status: 'enviada',
      sent: 5420,
      delivered: 5180,
      read: 3245,
      replied: 234,
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Lembrete Webinar',
      type: 'push',
      message: 'Seu webinar começa em 1 hora! Não perca.',
      status: 'agendada',
      recipients: 1200,
      scheduledFor: '2024-01-20T19:00:00'
    },
    {
      id: 3,
      name: 'Novo Artigo Blog',
      type: 'whatsapp',
      message: 'Confira nosso novo artigo sobre Copy que Converte!',
      status: 'rascunho',
      recipients: 890
    },
  ]);

  const getTypeIcon = (type: string) => {
    return type === 'whatsapp' ? <MessageSquare className="h-4 w-4" /> : <Bell className="h-4 w-4" />;
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Push / WhatsApp</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Envie notificações push e mensagens WhatsApp para seus usuários
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Campanha</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,420</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Entrega</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.6%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Leitura</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62.7%</div>
            <p className="text-xs text-muted-foreground">
              +5.3% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3%</div>
            <p className="text-xs text-muted-foreground">
              +0.8% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <div className="p-1 bg-muted rounded">
                          {getTypeIcon(campaign.type)}
                        </div>
                      </div>
                      <CardDescription>{campaign.message}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    {campaign.status === 'enviada' ? (
                      <>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Enviadas</p>
                          <p className="text-lg font-semibold">{campaign.sent?.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Entregues</p>
                          <p className="text-lg font-semibold">{campaign.delivered?.toLocaleString()}</p>
                          <p className="text-xs text-green-600">
                            {((campaign.delivered! / campaign.sent!) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Lidas</p>
                          <p className="text-lg font-semibold">{campaign.read?.toLocaleString()}</p>
                          <p className="text-xs text-blue-600">
                            {((campaign.read! / campaign.sent!) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Respostas</p>
                          <p className="text-lg font-semibold">{campaign.replied?.toLocaleString()}</p>
                          <p className="text-xs text-purple-600">
                            {((campaign.replied! / campaign.sent!) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Destinatários</p>
                          <p className="text-lg font-semibold">{campaign.recipients?.toLocaleString()}</p>
                        </div>
                        {campaign.scheduledFor && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Agendado para</p>
                            <p className="text-sm">{new Date(campaign.scheduledFor).toLocaleString('pt-BR')}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Em breve
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      {campaign.status === 'rascunho' ? 'Editar' : 'Ver Detalhes'}
                    </Button>
                    {campaign.status === 'enviada' && (
                      <Button variant="outline" size="sm">
                        Ver Relatório
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Templates WhatsApp</CardTitle>
                <CardDescription>
                  Templates pré-aprovados para campanhas WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Promoção',
                    'Lembrete',
                    'Boas-vindas',
                    'Carrinho Abandonado',
                    'Confirmação',
                    'Suporte'
                  ].map((template) => (
                    <div key={template} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>{template}</span>
                      </div>
                      <Button variant="outline" size="sm">Usar</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Templates Push</CardTitle>
                <CardDescription>
                  Templates para notificações push
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Novo Conteúdo',
                    'Lembrete Evento',
                    'Oferta Especial',
                    'Atualização App',
                    'Engajamento',
                    'Personalizada'
                  ].map((template) => (
                    <div key={template} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span>{template}</span>
                      </div>
                      <Button variant="outline" size="sm">Usar</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Contatos</CardTitle>
              <CardDescription>
                Gerencie suas listas de contatos e segmentações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-medium">Listas WhatsApp</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Clientes Ativos</p>
                        <p className="text-sm text-muted-foreground">2,543 contatos</p>
                      </div>
                      <Button variant="outline" size="sm">Gerenciar</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Leads Qualificados</p>
                        <p className="text-sm text-muted-foreground">1,234 contatos</p>
                      </div>
                      <Button variant="outline" size="sm">Gerenciar</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium">Dispositivos Push</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">App Mobile</p>
                        <p className="text-sm text-muted-foreground">8,765 dispositivos</p>
                      </div>
                      <Button variant="outline" size="sm">Gerenciar</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Web Push</p>
                        <p className="text-sm text-muted-foreground">3,421 inscritos</p>
                      </div>
                      <Button variant="outline" size="sm">Gerenciar</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Configurações WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Status da API</label>
                    <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20 mt-1">
                      <p className="text-sm text-green-700 dark:text-green-400">✓ Conectado</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Número Verificado</label>
                    <div className="p-3 border rounded-lg bg-muted/5 mt-1">
                      <p className="text-sm">+55 11 99999-9999</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Limite Diário</label>
                    <div className="p-3 border rounded-lg bg-muted/5 mt-1">
                      <p className="text-sm">1.000 mensagens/dia</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Configurações Push</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Firebase Config</label>
                    <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20 mt-1">
                      <p className="text-sm text-green-700 dark:text-green-400">✓ Configurado</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Certificados iOS</label>
                    <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20 mt-1">
                      <p className="text-sm text-green-700 dark:text-green-400">✓ Válidos</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Service Worker</label>
                    <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20 mt-1">
                      <p className="text-sm text-green-700 dark:text-green-400">✓ Ativo</p>
                    </div>
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

export default PushWhatsApp;