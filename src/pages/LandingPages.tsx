import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Globe, Eye, MousePointer, BarChart3, Palette, Smartphone, Monitor } from 'lucide-react';

const LandingPages = () => {
  const [pages] = useState([
    {
      id: 1,
      name: 'Curso de Copy IA',
      url: 'curso-copy-ia',
      status: 'publicada',
      visits: 15420,
      conversions: 1234,
      conversionRate: 8.0,
      created: '2024-01-10',
      template: 'Curso Online'
    },
    {
      id: 2,
      name: 'Consultoria StorySpark',
      url: 'consultoria-marketing',
      status: 'rascunho',
      visits: 0,
      conversions: 0,
      conversionRate: 0,
      created: '2024-01-15',
      template: 'Serviços'
    },
    {
      id: 3,
      name: 'Ebook Gratuito',
      url: 'ebook-copy-gratuito',
      status: 'pausada',
      visits: 8750,
      conversions: 525,
      conversionRate: 6.0,
      created: '2024-01-08',
      template: 'Lead Magnet'
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publicada': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pausada': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'rascunho': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Landing Pages</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Crie páginas de alta conversão para seus produtos e serviços
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Landing Page</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,170</div>
            <p className="text-xs text-muted-foreground">
              +18% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,759</div>
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
            <div className="text-2xl font-bold">7.3%</div>
            <p className="text-xs text-muted-foreground">
              -0.5% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Páginas Ativas</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              2 em rascunho
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="grid gap-4">
            {pages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{page.name}</CardTitle>
                      <CardDescription>
                        storyspark.com/{page.url} • {page.template}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(page.status)}>
                      {page.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Visitas</p>
                      <p className="text-lg font-semibold">{page.visits.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Conversões</p>
                      <p className="text-lg font-semibold">{page.conversions.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                      <p className="text-lg font-semibold">{page.conversionRate}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Criada em</p>
                      <p className="text-sm">{new Date(page.created).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      {page.status === 'rascunho' ? 'Editar' : 'Ver Página'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Palette className="h-4 w-4 mr-1" />
                      Personalizar
                    </Button>
                    {page.status === 'publicada' && (
                      <Button variant="outline" size="sm">
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

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              'Curso Online',
              'Ebook Gratuito',
              'Webinar',
              'Consultoria',
              'Produto Digital',
              'Evento',
              'Newsletter',
              'App Download',
              'Serviços'
            ].map((template) => (
              <Card key={template} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Preview {template}</span>
                  </div>
                  <CardTitle className="text-lg">{template}</CardTitle>
                  <CardDescription>
                    Template otimizado para {template.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button size="sm">
                      Usar Template
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
                <CardTitle>Performance por Página</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pages.filter(p => p.status === 'publicada' || p.status === 'pausada').map((page) => (
                    <div key={page.id} className="flex items-center justify-between">
                      <span className="text-sm">{page.name}</span>
                      <div className="text-right">
                        <div className="font-medium">{page.conversionRate}%</div>
                        <div className="text-xs text-muted-foreground">{page.conversions} conversões</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fontes de Tráfego</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Busca Orgânica</span>
                    <span className="font-medium">45.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Redes Sociais</span>
                    <span className="font-medium">28.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tráfego Direto</span>
                    <span className="font-medium">16.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Anúncios Pagos</span>
                    <span className="font-medium">9.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/5">
                <p className="text-muted-foreground">Gráfico de funil será implementado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <CardDescription>
                Configure domínio, analytics e integrações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Domínio Personalizado</label>
                    <div className="p-3 border rounded-lg bg-muted/5">
                      <p className="text-sm">pages.meudominio.com</p>
                      <p className="text-xs text-muted-foreground">Configure seu domínio personalizado</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Google Analytics</label>
                    <div className="p-3 border rounded-lg bg-muted/5">
                      <p className="text-sm">GA4 Conectado</p>
                      <p className="text-xs text-muted-foreground">Rastreamento configurado</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pixel Facebook</label>
                    <div className="p-3 border rounded-lg bg-muted/5">
                      <p className="text-sm">Pixel Ativo</p>
                      <p className="text-xs text-muted-foreground">Conversões sendo rastreadas</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Integração CRM</label>
                    <div className="p-3 border rounded-lg bg-muted/5">
                      <p className="text-sm">HubSpot Conectado</p>
                      <p className="text-xs text-muted-foreground">Leads enviados automaticamente</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LandingPages;