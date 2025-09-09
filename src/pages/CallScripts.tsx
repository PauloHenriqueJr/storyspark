import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Phone, Play, Pause, BarChart3, Clock, Users, Target, Mic } from 'lucide-react';
import CreateScriptModal from '@/components/modals/CreateScriptModal';

const CallScripts = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scripts] = useState([
    {
      id: 1,
      name: 'Prospecção Cold Call - SaaS',
      category: 'prospeccao',
      status: 'ativo',
      calls: 156,
      appointments: 23,
      conversionRate: 14.7,
      avgDuration: '4:32',
      created: '2024-01-10',
      lastUsed: '2024-01-19'
    },
    {
      id: 2,
      name: 'Follow-up Reunião',
      category: 'follow-up',
      status: 'ativo',
      calls: 89,
      appointments: 34,
      conversionRate: 38.2,
      avgDuration: '3:45',
      created: '2024-01-05',
      lastUsed: '2024-01-18'
    },
    {
      id: 3,
      name: 'Objeções - Preço Alto',
      category: 'objecoes',
      status: 'pausado',
      calls: 67,
      appointments: 12,
      conversionRate: 17.9,
      avgDuration: '6:12',
      created: '2024-01-08',
      lastUsed: '2024-01-15'
    },
    {
      id: 4,
      name: 'Fechamento Consultoria',
      category: 'fechamento',
      status: 'rascunho',
      calls: 0,
      appointments: 0,
      conversionRate: 0,
      avgDuration: '0:00',
      created: '2024-01-18',
      lastUsed: null
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pausado': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'rascunho': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prospeccao': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'follow-up': return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'objecoes': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'fechamento': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Call Scripts</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Scripts inteligentes para maximizar suas conversões em ligações
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Script</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ligações</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">312</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">69</div>
            <p className="text-xs text-muted-foreground">
              +18% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22.1%</div>
            <p className="text-xs text-muted-foreground">
              +3.2% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4:52</div>
            <p className="text-xs text-muted-foreground">
              +0:23 vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="scripts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scripts">Meus Scripts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="training">Treinamento</TabsTrigger>
        </TabsList>

        <TabsContent value="scripts" className="space-y-4">
          <div className="grid gap-4">
            {scripts.map((script) => (
              <Card key={script.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{script.name}</CardTitle>
                        <Badge className={getCategoryColor(script.category)}>
                          {script.category}
                        </Badge>
                      </div>
                      <CardDescription>
                        Criado em {new Date(script.created).toLocaleDateString('pt-BR')} • 
                        {script.lastUsed ? ` Último uso: ${new Date(script.lastUsed).toLocaleDateString('pt-BR')}` : ' Nunca usado'}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(script.status)}>
                      {script.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Ligações</p>
                      <p className="text-lg font-semibold">{script.calls}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Agendamentos</p>
                      <p className="text-lg font-semibold">{script.appointments}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Conversão</p>
                      <p className="text-lg font-semibold">{script.conversionRate}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Duração Média</p>
                      <p className="text-lg font-semibold">{script.avgDuration}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      {script.status === 'rascunho' ? 'Editar' : 'Ver Script'}
                    </Button>
                    {script.status === 'ativo' && (
                      <>
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Usar Agora
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      </>
                    )}
                    {script.status === 'pausado' && (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Reativar
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
                name: 'Cold Call B2B',
                category: 'prospeccao',
                description: 'Script para primeira ligação B2B',
                elements: ['Quebra-gelo', 'Valor', 'Descoberta', 'Agendamento']
              },
              {
                name: 'Follow-up Qualificado',
                category: 'follow-up',
                description: 'Para leads já qualificados',
                elements: ['Recap', 'Aprofundamento', 'Próximos passos']
              },
              {
                name: 'Tratamento de Objeções',
                category: 'objecoes',
                description: 'Respostas para objeções comuns',
                elements: ['Escuta ativa', 'Empatia', 'Solução', 'Fechamento']
              },
              {
                name: 'Fechamento de Vendas',
                category: 'fechamento',
                description: 'Para finalizar a venda',
                elements: ['Resumo', 'Urgência', 'Facilitação', 'Fechamento']
              },
              {
                name: 'Reativação de Leads',
                category: 'reativacao',
                description: 'Para leads frios',
                elements: ['Contextualização', 'Novidade', 'Interesse', 'Ação']
              },
              {
                name: 'Upsell/Cross-sell',
                category: 'upsell',
                description: 'Para clientes existentes',
                elements: ['Relacionamento', 'Necessidade', 'Oferta', 'Benefícios']
              }
            ].map((template) => (
              <Card key={template.name} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Elementos inclusos:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.elements.map((element) => (
                        <Badge key={element} variant="secondary" className="text-xs">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">
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
                <CardTitle>Performance por Script</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scripts.filter(s => s.status !== 'rascunho').map((script) => (
                    <div key={script.id} className="flex items-center justify-between">
                      <span className="text-sm">{script.name.split(' - ')[0]}</span>
                      <div className="text-right">
                        <div className="font-medium">{script.conversionRate}%</div>
                        <div className="text-xs text-muted-foreground">
                          {script.appointments} agendamentos
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <span>09:00 - 11:00</span>
                    <span className="font-medium">28.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>14:00 - 16:00</span>
                    <span className="font-medium">24.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>16:00 - 18:00</span>
                    <span className="font-medium">19.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>11:00 - 13:00</span>
                    <span className="font-medium">15.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>08:00 - 09:00</span>
                    <span className="font-medium">12.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Evolução das Conversões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/5">
                <p className="text-muted-foreground">Gráfico de evolução será implementado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Módulos de Treinamento</CardTitle>
              <CardDescription>
                Aprimore suas habilidades de vendas por telefone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: 'Técnicas de Abertura',
                    description: 'Como iniciar uma ligação de forma eficaz',
                    duration: '15 min',
                    completed: true
                  },
                  {
                    title: 'Tratamento de Objeções',
                    description: 'Estratégias para superar resistências',
                    duration: '22 min',
                    completed: true
                  },
                  {
                    title: 'Técnicas de Fechamento',
                    description: 'Como finalizar com sucesso',
                    duration: '18 min',
                    completed: false
                  },
                  {
                    title: 'Escuta Ativa',
                    description: 'Como ouvir e entender melhor o cliente',
                    duration: '12 min',
                    completed: false
                  }
                ].map((module) => (
                  <div key={module.title} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{module.title}</h3>
                      {module.completed ? (
                        <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                          Concluído
                        </Badge>
                      ) : (
                        <Badge variant="outline">{module.duration}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {module.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      {module.completed ? 'Revisar' : 'Iniciar'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Simulador de Ligações</CardTitle>
              <CardDescription>
                Pratique suas habilidades com IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mic className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Pratique com IA</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Simule ligações de vendas e receba feedback em tempo real
                  </p>
                  <Button>
                    Iniciar Simulação
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CreateScriptModal 
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
};

export { CallScripts as Component };