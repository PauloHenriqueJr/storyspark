import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectIntegrationModal } from '@/components/modals/ConnectIntegrationModal';
import { 
  Puzzle, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Youtube,
  Chrome,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
  status: string;
  accounts?: string[];
  features?: string[];
  workflows?: number;
  properties?: number;
  endpoints?: number;
}

const Integrations = () => {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const socialIntegrations: Integration[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Conecte suas contas do Instagram para publicação automática',
      icon: Instagram,
      connected: true,
      status: 'Ativo',
      accounts: ['@minha_empresa', '@produto_oficial'],
      features: ['Publicação automática', 'Analytics', 'Stories']
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Gerencie páginas e grupos do Facebook',
      icon: Facebook,
      connected: true,
      status: 'Ativo',
      accounts: ['Minha Empresa'],
      features: ['Posts', 'Analytics', 'Agendamento']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Publique conteúdo profissional no LinkedIn',
      icon: Linkedin,
      connected: false,
      status: 'Desconectado',
      accounts: [],
      features: ['Posts', 'Artigos', 'Company Page']
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      description: 'Tweets automáticos e engajamento em tempo real',
      icon: Twitter,
      connected: false,
      status: 'Desconectado',
      accounts: [],
      features: ['Tweets', 'Threads', 'Analytics']
    }
  ];

  const toolIntegrations: Integration[] = [
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automatize workflows com milhares de aplicativos',
      icon: Zap,
      connected: true,
      status: 'Ativo',
      workflows: 5
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Rastreie performance e conversões',
      icon: Chrome,
      connected: true,
      status: 'Ativo',
      properties: 2
    },
    {
      id: 'webhook',
      name: 'Webhooks Personalizados',
      description: 'Integre com suas próprias APIs e sistemas',
      icon: Settings,
      connected: false,
      status: 'Disponível',
      endpoints: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'success';
      case 'Desconectado': return 'destructive';
      case 'Disponível': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo': return <CheckCircle className="w-4 h-4" />;
      case 'Desconectado': return <AlertCircle className="w-4 h-4" />;
      default: return <Plus className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Integrações</h1>
          <p className="text-muted-foreground">
            Conecte suas plataformas favoritas e automatize seu workflow
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conectadas</p>
                <p className="text-2xl font-bold text-foreground">4</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contas Ativas</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Posts Hoje</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Automações</p>
                <p className="text-2xl font-bold text-foreground">7</p>
              </div>
              <Settings className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Tabs */}
      <Tabs defaultValue="social" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
          <TabsTrigger value="api">APIs & Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="mt-6">
          <div className="grid gap-6">
            {socialIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <integration.icon className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{integration.name}</h3>
                          <Badge variant={getStatusColor(integration.status) as "default" | "destructive" | "outline" | "secondary"}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(integration.status)}
                              {integration.status}
                            </div>
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{integration.description}</p>
                        
                        <div className="space-y-3">
                          {integration.connected && integration.accounts.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">
                                Contas conectadas:
                              </p>
                              <div className="flex gap-2">
                                {integration.accounts.map((account, index) => (
                                  <Badge key={index} variant="outline">
                                    {account}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Recursos disponíveis:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {integration.features.map((feature, index) => (
                                <Badge key={index} variant="secondary">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={integration.connected}
                          disabled={!integration.connected}
                        />
                        <span className="text-sm text-muted-foreground">
                          {integration.connected ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      
                      <Button 
                        variant={integration.connected ? 'outline' : 'default'}
                        onClick={() => {
                          setSelectedIntegration(integration);
                          setConnectModalOpen(true);
                        }}
                      >
                        {integration.connected ? 'Configurar' : 'Conectar'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <div className="grid gap-6">
            {toolIntegrations.map((tool) => (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                        <tool.icon className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{tool.name}</h3>
                          <Badge variant={getStatusColor(tool.status) as "default" | "destructive" | "outline" | "secondary"}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(tool.status)}
                              {tool.status}
                            </div>
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{tool.description}</p>
                        
                        {tool.connected && (
                          <div className="text-sm text-muted-foreground">
                            {tool.workflows && `${tool.workflows} workflows ativos`}
                            {tool.properties && `${tool.properties} propriedades conectadas`}
                            {tool.endpoints && `${tool.endpoints} endpoints configurados`}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={tool.connected}
                          disabled={!tool.connected && tool.status === 'Disponível'}
                        />
                        <span className="text-sm text-muted-foreground">
                          {tool.connected ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      
                      <Button 
                        variant={tool.connected ? 'outline' : 'default'}
                        onClick={() => {
                          setSelectedIntegration(tool);
                          setConnectModalOpen(true);
                        }}
                      >
                        {tool.connected ? 'Configurar' : 'Conectar'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <div className="text-center py-12">
            <Puzzle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              APIs & Webhooks Personalizados
            </h3>
            <p className="text-muted-foreground mb-6">
              Configure integrações customizadas com suas próprias APIs
            </p>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Criar Webhook
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <ConnectIntegrationModal 
        open={connectModalOpen}
        onOpenChange={setConnectModalOpen}
        integration={selectedIntegration}
      />
    </div>
  );
};

export { Integrations as Component };