import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Download, 
  Calendar,
  Zap,
  Crown,
  Star,
  Check,
  TrendingUp,
  DollarSign,
  FileText,
  AlertTriangle,
  Calculator,
  Settings
} from 'lucide-react';
import ChangePlanModal from '@/components/modals/ChangePlanModal';
import UsageCalculatorModal from '@/components/modals/UsageCalculatorModal';
import UpdatePaymentModal from '@/components/modals/UpdatePaymentModal';
import { useToast } from '@/hooks/use-toast';

const Billing = () => {
  const { toast } = useToast();
  const [changePlanModal, setChangePlanModal] = useState(false);
  const [calculatorModal, setCalculatorModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const currentPlan = {
    name: 'Plano Pro',
    price: 'R$ 297',
    period: '/mês',
    features: ['50.000 copies IA/mês', '10 integrações', 'Analytics avançados', 'Equipe até 5 membros'],
    usage: {
      copies: { used: 32500, total: 50000 },
      integrations: { used: 7, total: 10 },
      team: { used: 4, total: 5 }
    }
  };

  const plans = [
    {
      name: 'Starter',
      price: 'R$ 97',
      period: '/mês',
      description: 'Perfeito para pequenos negócios',
      features: [
        '10.000 copies IA/mês',
        '3 integrações',
        'Analytics básicos',
        '1 usuário',
        'Templates básicos'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: 'R$ 297',
      period: '/mês',
      description: 'Para equipes em crescimento',
      features: [
        '50.000 copies IA/mês',
        '10 integrações',
        'Analytics avançados',
        'Até 5 usuários',
        'Templates premium',
        'Brand voices ilimitadas'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'R$ 697',
      period: '/mês',
      description: 'Para grandes organizações',
      features: [
        'Copies IA ilimitadas',
        'Integrações ilimitadas',
        'Analytics enterprise',
        'Usuários ilimitados',
        'API personalizada',
        'Suporte prioritário'
      ],
      popular: false
    }
  ];

  const invoices = [
    {
      id: 'INV-001',
      date: '01 Mar 2024',
      amount: 'R$ 297,00',
      status: 'Pago',
      plan: 'Plano Pro',
      period: 'Mar 2024'
    },
    {
      id: 'INV-002',
      date: '01 Fev 2024',
      amount: 'R$ 297,00',
      status: 'Pago',
      plan: 'Plano Pro',
      period: 'Fev 2024'
    },
    {
      id: 'INV-003',
      date: '01 Jan 2024',
      amount: 'R$ 97,00',
      status: 'Pago',
      plan: 'Plano Starter',
      period: 'Jan 2024'
    }
  ];

  const getUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-primary';
  };

  const handlePlanChange = (planName: string) => {
    toast({
      title: "Plano alterado com sucesso!",
      description: `Seu plano foi alterado para ${planName}. As mudanças entrarão em vigor no próximo ciclo.`,
    });
  };

  const showUsageLimitAlert = (item: string, percentage: number) => {
    if (percentage >= 90) {
      toast({
        title: "Limite quase atingido!",
        description: `Você está usando ${percentage}% do seu limite de ${item.toLowerCase()}. Considere fazer upgrade do seu plano.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Faturamento</h1>
          <p className="text-muted-foreground">
            Gerencie seu plano, uso e histórico de pagamentos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setCalculatorModal(true)}
            className="gap-2"
          >
            <Calculator className="w-4 h-4" />
            Calculadora
          </Button>
          <Button 
            className="bg-gradient-primary hover:opacity-90 gap-2"
            onClick={() => setPaymentModal(true)}
          >
            <CreditCard className="w-4 h-4" />
            Atualizar Cartão
          </Button>
        </div>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                {currentPlan.name}
              </CardTitle>
              <Badge className="bg-gradient-primary text-white">
                Ativo
              </Badge>
            </div>
            <CardDescription>
              Próxima cobrança em 15 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-foreground">
              {currentPlan.price}
              <span className="text-base font-normal text-muted-foreground">
                {currentPlan.period}
              </span>
            </div>
            
            <div className="space-y-3">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setChangePlanModal(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Gerenciar Plano
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-xs"
                onClick={() => setCalculatorModal(true)}
              >
                <Calculator className="w-3 h-3 mr-1" />
                Calcular plano ideal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uso do Plano Atual</CardTitle>
            <CardDescription>
              Acompanhe seu consumo mensal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Copies Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Copies IA</span>
                <span className="text-sm text-muted-foreground">
                  {currentPlan.usage.copies.used.toLocaleString()} / {currentPlan.usage.copies.total.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(currentPlan.usage.copies.used, currentPlan.usage.copies.total)} 
                className="h-2"
              />
              <div className="flex items-center gap-1 mt-1">
                {getUsagePercentage(currentPlan.usage.copies.used, currentPlan.usage.copies.total) >= 75 && (
                  <AlertTriangle 
                    className="w-3 h-3 text-warning cursor-pointer" 
                    onClick={() => showUsageLimitAlert('Copies IA', getUsagePercentage(currentPlan.usage.copies.used, currentPlan.usage.copies.total))}
                  />
                )}
                <span className="text-xs text-muted-foreground">
                  {getUsagePercentage(currentPlan.usage.copies.used, currentPlan.usage.copies.total)}% usado
                </span>
                {getUsagePercentage(currentPlan.usage.copies.used, currentPlan.usage.copies.total) >= 85 && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-primary"
                    onClick={() => setChangePlanModal(true)}
                  >
                    Fazer upgrade
                  </Button>
                )}
              </div>
            </div>

            {/* Integrations Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Integrações</span>
                <span className="text-sm text-muted-foreground">
                  {currentPlan.usage.integrations.used} / {currentPlan.usage.integrations.total}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(currentPlan.usage.integrations.used, currentPlan.usage.integrations.total)} 
                className="h-2"
              />
            </div>

            {/* Team Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Membros da Equipe</span>
                <span className="text-sm text-muted-foreground">
                  {currentPlan.usage.team.used} / {currentPlan.usage.team.total}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(currentPlan.usage.team.used, currentPlan.usage.team.total)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Tabs */}
      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="usage">Uso Detalhado</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold text-foreground mt-4">
                    {plan.price}
                    <span className="text-base font-normal text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-success" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${
                      plan.name === 'Pro' ? 'bg-gradient-primary hover:opacity-90' : ''
                    }`}
                    variant={plan.name === 'Pro' ? 'default' : 'outline'}
                    onClick={() => plan.name !== 'Pro' && setChangePlanModal(true)}
                    disabled={plan.name === 'Pro'}
                  >
                    {plan.name === 'Pro' ? 'Plano Atual' : 'Selecionar Plano'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">{invoice.id}</h3>
                          <Badge variant="secondary">{invoice.status}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{invoice.plan}</span>
                          <span>•</span>
                          <span>{invoice.period}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {invoice.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{invoice.amount}</p>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Copies Este Mês</p>
                    <p className="text-2xl font-bold text-foreground">32.5k</p>
                  </div>
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-success">+12%</span>
                  <span className="text-muted-foreground">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Custo por Copy</p>
                    <p className="text-2xl font-bold text-foreground">R$ 0,009</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-success" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">Média do plano</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Economia</p>
                    <p className="text-2xl font-bold text-foreground">R$ 1.2k</p>
                  </div>
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-success rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">vs freelancers</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ROI Médio</p>
                    <p className="text-2xl font-bold text-foreground">340%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">Por campanha</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ChangePlanModal
        isOpen={changePlanModal}
        onClose={() => setChangePlanModal(false)}
        currentPlan="Pro"
        onConfirmChange={handlePlanChange}
      />

      <UsageCalculatorModal
        isOpen={calculatorModal}
        onClose={() => setCalculatorModal(false)}
      />

      <UpdatePaymentModal
        isOpen={paymentModal}
        onClose={() => setPaymentModal(false)}
      />
    </div>
  );
};

export default Billing;