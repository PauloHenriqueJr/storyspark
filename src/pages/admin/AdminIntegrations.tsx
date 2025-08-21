import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Settings,
  Check,
  X,
  AlertTriangle,
  Key,
  Globe,
  Shield,
  Activity,
  Zap,
  MoreHorizontal,
  Edit,
  Trash2,
  TestTube
} from 'lucide-react';

const AdminIntegrations = () => {
  const [showApiDialog, setShowApiDialog] = useState(false);

  // Mock data para integrações
  const integrations = [
    {
      id: 1,
      name: 'OpenAI GPT-4',
      category: 'IA',
      status: 'active',
      health: 'healthy',
      lastSync: '2024-01-21 14:30:00',
      usage: '2.4K requests/day',
      limit: '10K requests/day',
      config: {
        apiKey: 'sk-*********************',
        model: 'gpt-4-turbo-preview',
        maxTokens: 4000,
        temperature: 0.7
      },
      webhook: null
    },
    {
      id: 2,
      name: 'Stripe Payments',
      category: 'Pagamento',
      status: 'active',
      health: 'healthy',
      lastSync: '2024-01-21 14:28:00',
      usage: '156 transactions/day',
      limit: 'Unlimited',
      config: {
        publishableKey: 'pk_test_*********************',
        secretKey: 'sk_test_*********************',
        webhookSecret: 'whsec_*********************'
      },
      webhook: 'https://api.storyspark.ai/webhooks/stripe'
    },
    {
      id: 3,
      name: 'SendGrid Email',
      category: 'Email',
      status: 'active',
      health: 'warning',
      lastSync: '2024-01-21 13:45:00',
      usage: '1.2K emails/day',
      limit: '5K emails/day',
      config: {
        apiKey: 'SG.*********************',
        fromEmail: 'noreply@storyspark.ai',
        fromName: 'StorySpark'
      },
      webhook: 'https://api.storyspark.ai/webhooks/sendgrid'
    },
    {
      id: 4,
      name: 'Facebook Graph API',
      category: 'Social',
      status: 'inactive',
      health: 'error',
      lastSync: '2024-01-20 16:22:00',
      usage: '0 requests/day',
      limit: '200 requests/hour',
      config: {
        appId: '1234567890',
        appSecret: '*********************',
        accessToken: 'expired'
      },
      webhook: null
    },
    {
      id: 5,
      name: 'Google Analytics',
      category: 'Analytics',
      status: 'active',
      health: 'healthy',
      lastSync: '2024-01-21 14:25:00',
      usage: '500 queries/day',
      limit: '10K queries/day',
      config: {
        propertyId: 'GA4-123456789',
        serviceAccount: 'analytics@storyspark-ai.iam.gserviceaccount.com'
      },
      webhook: null
    }
  ];

  const webhookLogs = [
    {
      id: 1,
      integration: 'Stripe Payments',
      event: 'payment_intent.succeeded',
      timestamp: '2024-01-21 14:30:15',
      status: 'success',
      response: '200 OK',
      payload: '{"id": "pi_3O...", "amount": 2999}'
    },
    {
      id: 2,
      integration: 'SendGrid Email',
      event: 'delivered',
      timestamp: '2024-01-21 14:28:42',
      status: 'success',
      response: '200 OK',
      payload: '{"email": "user@example.com", "event": "delivered"}'
    },
    {
      id: 3,
      integration: 'Stripe Payments',
      event: 'invoice.payment_failed',
      timestamp: '2024-01-21 14:15:33',
      status: 'error',
      response: '400 Bad Request',
      payload: '{"error": "Invalid webhook signature"}'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <Check className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <X className="w-4 h-4 text-red-600" />;
      default: return <X className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'IA': return Zap;
      case 'Pagamento': return Shield;
      case 'Email': return Globe;
      case 'Social': return Activity;
      case 'Analytics': return Activity;
      default: return Settings;
    }
  };

  const stats = [
    {
      title: 'Integrações Ativas',
      value: '4',
      change: 'de 5 total',
      icon: Check
    },
    {
      title: 'API Calls Hoje',  
      value: '4.3K',
      change: '+15% vs ontem',
      icon: Activity
    },
    {
      title: 'Webhooks OK',
      value: '98.7%',
      change: 'últimas 24h',
      icon: Zap
    },
    {
      title: 'Alertas Ativos',
      value: '2',
      change: 'requerem atenção',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integrações Admin</h1>
          <p className="text-muted-foreground">Configurações de APIs e serviços externos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <TestTube className="w-4 h-4 mr-2" />
            Teste Global
          </Button>
          <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Integração
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Integração</DialogTitle>
                <DialogDescription>
                  Configure uma nova integração de API para o sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome do Serviço</label>
                    <Input placeholder="Ex: OpenAI, Stripe..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <Input placeholder="IA, Pagamento, Email..." />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">API Key</label>
                  <Input type="password" placeholder="Chave da API..." />
                </div>
                <div>
                  <label className="text-sm font-medium">Webhook URL (Opcional)</label>
                  <Input placeholder="https://api.storyspark.ai/webhooks/..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowApiDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setShowApiDialog(false)}>
                    Adicionar Integração
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => {
              const CategoryIcon = getCategoryIcon(integration.category);
              
              return (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CategoryIcon className="w-8 h-8 text-muted-foreground" />
                        
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{integration.name}</h3>
                            <Badge className={getStatusColor(integration.status)}>
                              {integration.status === 'active' ? 'Ativa' : 'Inativa'}
                            </Badge>
                            <Badge variant="outline">{integration.category}</Badge>
                            {getHealthIcon(integration.health)}
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span>Uso: {integration.usage}</span>
                            <span>Limite: {integration.limit}</span>
                            <span>Última sync: {integration.lastSync}</span>
                          </div>
                          
                          {integration.webhook && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                Webhook: {integration.webhook}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={integration.status === 'active'}
                          className="data-[state=checked]:bg-green-600"
                        />
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Configurar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TestTube className="w-4 h-4 mr-2" />
                              Testar Conexão
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="w-4 h-4 mr-2" />
                              Renovar API Key
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Webhooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhookLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge variant="outline">{log.integration}</Badge>
                        <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {log.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{log.event}</p>
                      <p className="text-xs text-muted-foreground">Response: {log.response}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">Rate Limit Global</label>
                  <Input defaultValue="1000" />
                  <p className="text-xs text-muted-foreground mt-1">Requests por minuto</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Timeout Padrão</label>
                  <Input defaultValue="30" />
                  <p className="text-xs text-muted-foreground mt-1">Segundos</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-retry em falhas</p>
                    <p className="text-sm text-muted-foreground">Retentar automaticamente requests falhados</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Logs detalhados</p>
                    <p className="text-sm text-muted-foreground">Salvar payloads completos nos logs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Alertas por email</p>
                    <p className="text-sm text-muted-foreground">Notificar admins sobre falhas críticas</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminIntegrations;