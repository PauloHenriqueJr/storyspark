import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, Users, Target, BarChart3, ArrowRight, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Funnel {
  id: string;
  name: string;
  created: string;
  status: string;
  visitors: number;
  leads: number;
  customers: number;
  revenue: number;
  conversionRate: number;
  steps: Array<{
    name: string;
    visitors: number;
    conversion: number;
  }>;
}

const Funnels = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('funnels');
  
  const [funnels] = useState<Funnel[]>([
    {
      id: '1',
      name: 'Funil SaaS B2B',
      created: '2024-01-15',
      status: 'ativo',
      visitors: 2450,
      leads: 320,
      customers: 42,
      revenue: 28500,
      conversionRate: 1.7,
      steps: [
        { name: 'Visitas', visitors: 2450, conversion: 13.1 },
        { name: 'Leads Qualificados', visitors: 320, conversion: 13.1 },
        { name: 'Demo Agendada', visitors: 180, conversion: 23.3 },
        { name: 'Proposta Enviada', visitors: 85, conversion: 49.4 },
        { name: 'Clientes', visitors: 42, conversion: 100 }
      ]
    },
    {
      id: '2',
      name: 'Funil E-commerce',
      created: '2024-01-10',
      status: 'ativo',
      visitors: 15230,
      leads: 2100,
      customers: 280,
      revenue: 43800,
      conversionRate: 1.8,
      steps: [
        { name: 'Visitas', visitors: 15230, conversion: 13.8 },
        { name: 'Carrinhos', visitors: 2100, conversion: 13.3 },
        { name: 'Checkout', visitors: 850, conversion: 32.9 },
        { name: 'Clientes', visitors: 280, conversion: 100 }
      ]
    },
    {
      id: '3',
      name: 'Funil Consultoria',
      created: '2024-01-05',
      status: 'pausado',
      visitors: 890,
      leads: 120,
      customers: 18,
      revenue: 54000,
      conversionRate: 2.0,
      steps: [
        { name: 'Visitas', visitors: 890, conversion: 13.5 },
        { name: 'Contatos', visitors: 120, conversion: 15.0 },
        { name: 'Consultas', visitors: 65, conversion: 27.7 },
        { name: 'Clientes', visitors: 18, conversion: 100 }
      ]
    }
  ]);

  const handleCreateFunnel = () => {
    toast({
      title: "Criando novo funil",
      description: "Abrindo constructor de funil...",
    });
  };

  const handleViewDetails = (funnel: Funnel) => {
    toast({
      title: "Detalhes do funil",
      description: `Visualizando ${funnel.name}`,
    });
  };

  const handleOptimize = (funnel: Funnel) => {
    toast({
      title: "Otimização IA",
      description: `Analisando ${funnel.name} para sugestões de melhoria`,
    });
  };

  const handleUseTemplate = (templateName: string) => {
    toast({
      title: "Template selecionado",
      description: `Criando funil com template: ${templateName}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pausado': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'rascunho': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Funis de Vendas</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Crie e otimize funis de conversão para maximizar suas vendas
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={handleCreateFunnel}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Funil</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 72.300</div>
            <p className="text-xs text-muted-foreground">
              +23% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">323</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.3%</div>
            <p className="text-xs text-muted-foreground">
              +0.2% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.170</div>
            <p className="text-xs text-muted-foreground">
              +18% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="funnels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnels">Funis</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="optimization">Otimização</TabsTrigger>
        </TabsList>

        <TabsContent value="funnels" className="space-y-4">
          <div className="grid gap-4">
            {funnels.map((funnel) => (
              <Card key={funnel.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{funnel.name}</CardTitle>
                      <CardDescription>
                        Criado em {new Date(funnel.created).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(funnel.status)}>
                      {funnel.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-5">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Visitantes</p>
                      <p className="text-lg font-semibold">{funnel.visitors.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Leads</p>
                      <p className="text-lg font-semibold">{funnel.leads.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Clientes</p>
                      <p className="text-lg font-semibold">{funnel.customers.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Receita</p>
                      <p className="text-lg font-semibold">R$ {funnel.revenue.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Conversão</p>
                      <p className="text-lg font-semibold">{funnel.conversionRate}%</p>
                    </div>
                  </div>
                  
                  {/* Funnel Steps Visualization */}
                  {funnel.steps.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Fluxo do Funil</h4>
                      <div className="flex items-center gap-4 overflow-x-auto">
                        {funnel.steps.map((step, index) => (
                          <React.Fragment key={step.name}>
                            <div className="flex flex-col items-center min-w-[120px]">
                              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                                <span className="text-2xl font-bold text-primary">
                                  {step.visitors.toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm font-medium mt-2 text-center">{step.name}</p>
                              {index < funnel.steps.length - 1 && (
                                <p className="text-xs text-muted-foreground">
                                  {step.conversion}% converteu
                                </p>
                              )}
                            </div>
                            {index < funnel.steps.length - 1 && (
                              <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(funnel)}>
                      {funnel.status === 'rascunho' ? 'Configurar' : 'Ver Detalhes'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(funnel)}>
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                    {funnel.status === 'ativo' && (
                      <Button variant="outline" size="sm" onClick={() => handleOptimize(funnel)}>
                        Otimizar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Produto Digital',
                description: 'Funil para cursos e ebooks',
                steps: ['Landing Page', 'Lead Magnet', 'Pitch', 'Checkout']
              },
              {
                name: 'Serviços',
                description: 'Funil para consultoria e serviços',
                steps: ['Captura', 'Qualificação', 'Agendamento', 'Proposta']
              },
              {
                name: 'E-commerce',
                description: 'Funil para produtos físicos',
                steps: ['Produto', 'Carrinho', 'Checkout', 'Upsell']
              },
              {
                name: 'Webinar',
                description: 'Funil para eventos online',
                steps: ['Inscrição', 'Confirmação', 'Evento', 'Oferta']
              },
              {
                name: 'App/SaaS',
                description: 'Funil para aplicativos',
                steps: ['Landing', 'Trial', 'Onboarding', 'Conversão']
              },
              {
                name: 'Tripwire',
                description: 'Oferta de baixo valor',
                steps: ['Lead Magnet', 'Tripwire', 'Core Offer', 'Upsell']
              }
            ].map((template) => (
              <Card key={template.name} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {template.steps.map((step, index) => (
                      <div key={step} className="flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                        {index < template.steps.length - 1 && (
                          <ArrowDown className="h-3 w-3 text-muted-foreground ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" onClick={() => handleUseTemplate(template.name)}>
                    Usar Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Funil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {funnels.filter(f => f.status === 'ativo').map((funnel) => (
                    <div key={funnel.id} className="flex items-center justify-between">
                      <span className="text-sm">{funnel.name.split(' - ')[0]}</span>
                      <div className="text-right">
                        <div className="font-medium">{funnel.conversionRate}%</div>
                        <div className="text-xs text-muted-foreground">
                          R$ {funnel.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Métricas Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Ticket Médio</span>
                    <span className="font-medium">R$ 224</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custo por Lead</span>
                    <span className="font-medium">R$ 12.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CAC (Custo Aquisição)</span>
                    <span className="font-medium">R$ 87</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LTV (Lifetime Value)</span>
                    <span className="font-medium">R$ 680</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI</span>
                    <span className="font-medium text-green-600">680%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Gráfico de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/5">
                <p className="text-muted-foreground">Gráfico de funil será implementado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendações de Otimização</CardTitle>
              <CardDescription>
                Sugestões baseadas na performance dos seus funis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h4 className="font-medium">Curso Copy IA - Funil Principal</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A conversão da Landing Page para Lead Magnet está 3% abaixo da média. 
                    Considere testar novos headlines ou ofertas.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Ver Sugestões
                  </Button>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <h4 className="font-medium">Consultoria Marketing</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    O funil está pausado há 10 dias. Considere reativar ou criar nova campanha.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Reativar Funil
                  </Button>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h4 className="font-medium">Oportunidade Identificada</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Você pode aumentar a receita em 25% criando um upsell após o checkout.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Criar Upsell
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { Funnels as Component };