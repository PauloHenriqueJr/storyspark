import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TestTube, BarChart3, Users, TrendingUp, Target, Clock, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Variant {
  name: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  isControl: boolean;
}

interface Test {
  id: number;
  name: string;
  status: 'executando' | 'finalizado' | 'configuracao' | 'pausado';
  type: 'landing-page' | 'email' | 'elemento';
  startDate: string | null;
  endDate: string | null;
  confidence: number;
  winner: string | null;
  variants: Variant[];
}

const ABTests = () => {
  const [tests, setTests] = useState<Test[]>([
    {
      id: 1,
      name: 'Headline da Landing Page',
      status: 'executando',
      type: 'landing-page',
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      confidence: 95,
      winner: null,
      variants: [
        { 
          name: 'Original', 
          visitors: 5420, 
          conversions: 432, 
          conversionRate: 7.97,
          isControl: true 
        },
        { 
          name: 'Variação A', 
          visitors: 5380, 
          conversions: 485, 
          conversionRate: 9.01,
          isControl: false 
        }
      ]
    },
    {
      id: 2,
      name: 'CTA Button Color',
      status: 'finalizado',
      type: 'elemento',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
      confidence: 98,
      winner: 'Variação B',
      variants: [
        { 
          name: 'Azul (Original)', 
          visitors: 8750, 
          conversions: 525, 
          conversionRate: 6.0,
          isControl: true 
        },
        { 
          name: 'Variação A (Verde)', 
          visitors: 8680, 
          conversions: 538, 
          conversionRate: 6.2,
          isControl: false 
        },
        { 
          name: 'Variação B (Laranja)', 
          visitors: 8690, 
          conversions: 695, 
          conversionRate: 8.0,
          isControl: false 
        }
      ]
    },
    {
      id: 3,
      name: 'Email Subject Line',
      status: 'configuracao',
      type: 'email',
      startDate: null,
      endDate: null,
      confidence: 0,
      winner: null,
      variants: [
        { 
          name: 'Original', 
          visitors: 0, 
          conversions: 0, 
          conversionRate: 0,
          isControl: true 
        },
        { 
          name: 'Variação A', 
          visitors: 0, 
          conversions: 0, 
          conversionRate: 0,
          isControl: false 
        }
      ]
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const { toast } = useToast();

  const handleCreateTest = () => {
    setShowCreateModal(true);
  };

  const handleViewDetails = (test: Test) => {
    setSelectedTest(test);
    setShowDetailsModal(true);
  };

  const handlePauseTest = (testId: number) => {
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: 'pausado' }
        : test
    ));
    toast({
      title: "Teste pausado",
      description: "O teste A/B foi pausado com sucesso.",
    });
  };

  const handleUseTemplate = (templateName: string) => {
    toast({
      title: "Template selecionado",
      description: `Criando novo teste com template: ${templateName}`,
    });
    setShowCreateModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executando': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'finalizado': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'configuracao': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      case 'pausado': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'landing-page': return <Target className="h-4 w-4" />;
      case 'email': return <Users className="h-4 w-4" />;
      case 'elemento': return <TestTube className="h-4 w-4" />;
      default: return <TestTube className="h-4 w-4" />;
    }
  };

  const getBestVariant = (variants: Variant[]) => {
    return variants.reduce((best, current) => 
      current.conversionRate > best.conversionRate ? current : best
    );
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Testes A/B</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Otimize suas conversões com testes A/B científicos
          </p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={handleCreateTest}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Teste A/B</span>
          <span className="sm:hidden">Novo Teste</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testes Ativos</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              2 finalizados este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uplift Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+13.2%</div>
            <p className="text-xs text-muted-foreground">
              Nos últimos 6 meses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">
              Testes com resultado positivo
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Adicional</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 15.4K</div>
            <p className="text-xs text-muted-foreground">
              Gerada pelos testes este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Meus Testes</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <div className="grid gap-4">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{test.name}</CardTitle>
                        <div className="p-1 bg-muted rounded">
                          {getTypeIcon(test.type)}
                        </div>
                      </div>
                      <CardDescription>
                        {test.startDate && test.endDate ? (
                          <>
                            {new Date(test.startDate).toLocaleDateString('pt-BR')} - {new Date(test.endDate).toLocaleDateString('pt-BR')}
                          </>
                        ) : (
                          'Teste não iniciado'
                        )}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {test.status !== 'configuracao' && (
                    <div className="space-y-4">
                      {/* Variants Comparison */}
                      <div className="grid gap-3">
                        {test.variants.map((variant, index) => {
                          const bestVariant = getBestVariant(test.variants);
                          const isBest = variant.conversionRate === bestVariant.conversionRate && variant.conversionRate > 0;
                          
                          return (
                            <div key={variant.name} className={`p-4 border rounded-lg ${isBest && test.status === 'executando' ? 'border-green-500/50 bg-green-50 dark:bg-green-950/20' : ''}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{variant.name}</h4>
                                  {variant.isControl && (
                                    <Badge variant="outline" className="text-xs">Controle</Badge>
                                  )}
                                  {isBest && test.status === 'executando' && (
                                    <Badge className="text-xs bg-green-500/10 text-green-700 dark:text-green-400">
                                      Liderando
                                    </Badge>
                                  )}
                                  {test.winner === variant.name && (
                                    <Badge className="text-xs bg-green-500 text-white">
                                      <Trophy className="h-3 w-3 mr-1" />
                                      Vencedor
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-lg">{variant.conversionRate.toFixed(2)}%</div>
                                  {!variant.isControl && variant.conversionRate > 0 && (
                                    <div className={`text-xs ${
                                      variant.conversionRate > test.variants[0].conversionRate 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                    }`}>
                                      {variant.conversionRate > test.variants[0].conversionRate ? '+' : ''}
                                      {((variant.conversionRate - test.variants[0].conversionRate) / test.variants[0].conversionRate * 100).toFixed(1)}%
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div>
                                  <span>Visitantes: </span>
                                  <span className="font-medium">{variant.visitors.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span>Conversões: </span>
                                  <span className="font-medium">{variant.conversions.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Test Stats */}
                      {test.status === 'executando' && (
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {Math.ceil((new Date(test.endDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias restantes
                            </span>
                          </div>
                          <div>
                            Confiança estatística: {test.confidence}%
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(test)}>
                      {test.status === 'configuracao' ? 'Configurar' : 'Ver Detalhes'}
                    </Button>
                    {test.status === 'executando' && (
                      <Button variant="outline" size="sm" onClick={() => handlePauseTest(test.id)}>
                        Pausar Teste
                      </Button>
                    )}
                    {test.status === 'finalizado' && (
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(test)}>
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Relatório Completo
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
                name: 'Headline Test',
                description: 'Teste diferentes títulos principais',
                elements: ['H1', 'Subtítulo', 'Descrição'],
                category: 'Landing Page'
              },
              {
                name: 'CTA Button',
                description: 'Otimize cor, texto e posição',
                elements: ['Cor', 'Texto', 'Tamanho', 'Posição'],
                category: 'Conversão'
              },
              {
                name: 'Email Subject',
                description: 'Teste assuntos de email',
                elements: ['Assunto', 'Preview Text', 'Remetente'],
                category: 'Email'
              },
              {
                name: 'Pricing Table',
                description: 'Otimize tabela de preços',
                elements: ['Layout', 'Destaque', 'Preços'],
                category: 'Produto'
              },
              {
                name: 'Form Fields',
                description: 'Reduza fricção em formulários',
                elements: ['Campos', 'Labels', 'Validação'],
                category: 'Lead Generation'
              },
              {
                name: 'Social Proof',
                description: 'Teste diferentes provas sociais',
                elements: ['Depoimentos', 'Logos', 'Números'],
                category: 'Confiança'
              }
            ].map((template) => (
              <Card key={template.name} className="hover:border-primary/50 cursor-pointer transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Elementos testáveis:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.elements.map((element) => (
                        <Badge key={element} variant="secondary" className="text-xs">
                          {element}
                        </Badge>
                      ))}
                    </div>
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
                <CardTitle>Performance dos Testes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tests.filter(t => t.status === 'finalizado').map((test) => {
                    const bestVariant = getBestVariant(test.variants);
                    const controlVariant = test.variants.find(v => v.isControl);
                    const uplift = controlVariant ? 
                      ((bestVariant.conversionRate - controlVariant.conversionRate) / controlVariant.conversionRate * 100) : 0;
                    
                    return (
                      <div key={test.id} className="flex items-center justify-between">
                        <span className="text-sm">{test.name}</span>
                        <div className="text-right">
                          <div className="font-medium text-green-600">+{uplift.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">
                            {bestVariant.conversionRate.toFixed(2)}% conversão
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Teste Mais Eficazes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Headlines</span>
                    <span className="font-medium">+15.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CTAs</span>
                    <span className="font-medium">+12.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Formulários</span>
                    <span className="font-medium">+9.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pricing</span>
                    <span className="font-medium">+7.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Social Proof</span>
                    <span className="font-medium">+4.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Timeline de Testes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/5">
                <p className="text-muted-foreground">Gráfico timeline será implementado</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights e Recomendações</CardTitle>
              <CardDescription>
                Padrões identificados nos seus testes A/B
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h4 className="font-medium">Padrão Identificado</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    CTAs com cores contrastantes (laranja/verde) performam 33% melhor que cores tradicionais (azul).
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h4 className="font-medium">Oportunidade de Teste</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sua página de checkout ainda não foi testada. Recomendamos testar diferentes layouts de formulário.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Criar Teste
                  </Button>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <h4 className="font-medium">Teste Recomendado</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Baseado na performance atual, teste uma versão mais direta do seu headline principal.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Configurar Teste
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Test Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Teste A/B</DialogTitle>
            <DialogDescription>
              Configure um novo teste para otimizar suas conversões
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testName">Nome do Teste</Label>
              <Input id="testName" placeholder="Ex: Headline da Landing Page" />
            </div>
            <div>
              <Label htmlFor="testType">Tipo de Teste</Label>
              <select className="w-full p-2 border rounded">
                <option value="landing-page">Landing Page</option>
                <option value="email">Email</option>
                <option value="elemento">Elemento</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                setShowCreateModal(false);
                toast({
                  title: "Teste criado!",
                  description: "Seu novo teste A/B foi configurado com sucesso.",
                });
              }}>
                Criar Teste
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTest?.name}</DialogTitle>
            <DialogDescription>
              Detalhes completos do teste A/B
            </DialogDescription>
          </DialogHeader>
          {selectedTest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedTest.status)}>
                    {selectedTest.status}
                  </Badge>
                </div>
                <div>
                  <Label>Confiança Estatística</Label>
                  <p className="font-medium">{selectedTest.confidence}%</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Variações do Teste</h4>
                <div className="space-y-2">
                  {selectedTest.variants.map((variant: Variant) => (
                    <div key={variant.name} className="p-3 border rounded">
                      <div className="flex justify-between">
                        <span>{variant.name}</span>
                        <span className="font-medium">{variant.conversionRate.toFixed(2)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={() => setShowDetailsModal(false)}>
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ABTests;