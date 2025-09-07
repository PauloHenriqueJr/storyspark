import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Zap, 
  Users, 
  Link,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface UsageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CalculatorInputs {
  copies: number;
  integrations: number;
  users: number;
  campaigns: number;
}

interface PlanResult {
  name: string;
  price: number;
  monthly: string;
  annual: string;
  features: string[];
  suitable: boolean;
  savings?: number;
}

const UsageCalculatorModal: React.FC<UsageCalculatorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    copies: 5000,
    integrations: 2,
    users: 1,
    campaigns: 5
  });

  const [results, setResults] = useState<PlanResult[]>([]);

  const plans = [
    {
      name: 'Starter',
      price: 97,
      limits: { copies: 10000, integrations: 3, users: 1 },
      features: ['Analytics básicos', 'Templates básicos', 'Suporte email']
    },
    {
      name: 'Pro',
      price: 297,
      limits: { copies: 50000, integrations: 10, users: 5 },
      features: ['Analytics avançados', 'Templates premium', 'Brand voices', 'Suporte chat']
    },
    {
      name: 'Enterprise',
      price: 697,
      limits: { copies: 999999, integrations: 999, users: 999 },
      features: ['Analytics enterprise', 'API personalizada', 'Suporte prioritário', 'Onboarding']
    }
  ];

  const calculatePlans = () => {
    const calculated = plans.map(plan => {
      const suitable =
        inputs.copies <= plan.limits.copies &&
        inputs.integrations <= plan.limits.integrations &&
        inputs.users <= plan.limits.users;

      const annualPrice = plan.price * 12 * 0.8; // 20% discount
      const savings = plan.price * 12 - annualPrice;

      return {
        name: plan.name,
        price: plan.price,
        monthly: `R$ ${plan.price}`,
        annual: `R$ ${Math.round(annualPrice / 12)}`,
        features: plan.features,
        suitable,
        savings: Math.round(savings)
      };
    });

    setResults(calculated);
  };

  useEffect(() => {
    calculatePlans();
  }, [inputs]);

  const calculateROI = () => {
    const copiesPerMonth = inputs.copies;
    const avgCopywriterCost = 0.5; // R$ 0.50 por copy
    const freelancerCost = copiesPerMonth * avgCopywriterCost;
    
    const recommendedPlan = results.find(p => p.suitable);
    if (!recommendedPlan) return { savings: 0, roi: 0 };

    const platformCost = recommendedPlan.price;
    const monthlySavings = freelancerCost - platformCost;
    const roi = ((monthlySavings / platformCost) * 100);

    return { savings: monthlySavings, roi };
  };

  const { savings: monthlySavings, roi } = calculateROI();

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const recommendedPlan = results.find(p => p.suitable);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Calculadora de Uso
          </DialogTitle>
          <DialogDescription>
            Configure suas necessidades e encontre o plano ideal
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Inputs */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suas Necessidades</CardTitle>
                <CardDescription>
                  Ajuste os valores para calcular o plano ideal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Copies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Copies IA por mês
                    </Label>
                    <Input
                      type="number"
                      value={inputs.copies}
                      onChange={(e) => handleInputChange('copies', parseInt(e.target.value) || 0)}
                      className="w-24 text-right"
                      min="0"
                      max="100000"
                    />
                  </div>
                  <Slider
                    value={[inputs.copies]}
                    onValueChange={(value) => handleInputChange('copies', value[0])}
                    max={100000}
                    step={1000}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Quantidade estimada de copies que você gerará mensalmente
                  </p>
                </div>

                {/* Users */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Usuários da equipe
                    </Label>
                    <Input
                      type="number"
                      value={inputs.users}
                      onChange={(e) => handleInputChange('users', parseInt(e.target.value) || 1)}
                      className="w-24 text-right"
                      min="1"
                      max="50"
                    />
                  </div>
                  <Slider
                    value={[inputs.users]}
                    onValueChange={(value) => handleInputChange('users', value[0])}
                    max={50}
                    step={1}
                    min={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Quantas pessoas da sua equipe usarão a plataforma
                  </p>
                </div>

                {/* Integrations */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      Integrações
                    </Label>
                    <Input
                      type="number"
                      value={inputs.integrations}
                      onChange={(e) => handleInputChange('integrations', parseInt(e.target.value) || 0)}
                      className="w-24 text-right"
                      min="0"
                      max="20"
                    />
                  </div>
                  <Slider
                    value={[inputs.integrations]}
                    onValueChange={(value) => handleInputChange('integrations', value[0])}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Redes sociais e ferramentas que você quer conectar
                  </p>
                </div>

                {/* Campaigns */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Campanhas simultâneas
                    </Label>
                    <Input
                      type="number"
                      value={inputs.campaigns}
                      onChange={(e) => handleInputChange('campaigns', parseInt(e.target.value) || 0)}
                      className="w-24 text-right"
                      min="0"
                      max="50"
                    />
                  </div>
                  <Slider
                    value={[inputs.campaigns]}
                    onValueChange={(value) => handleInputChange('campaigns', value[0])}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Quantas campanhas você gerencia ao mesmo tempo
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ROI Calculation */}
            {monthlySavings > 0 && (
              <Card className="border-success/20 bg-success/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-success">
                    <DollarSign className="w-5 h-5" />
                    Economia Estimada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">
                        R$ {monthlySavings.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Por mês</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">
                        {roi.toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">ROI</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    *Comparado ao custo de freelancers (R$ 0,50 por copy)
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Planos Recomendados</h3>
              <div className="space-y-3">
                {results.map((plan, index) => (
                  <Card 
                    key={plan.name}
                    className={`relative ${
                      plan.suitable 
                        ? index === results.findIndex(p => p.suitable)
                          ? 'border-primary bg-primary/5' 
                          : 'border-success/50' 
                        : 'opacity-60'
                    }`}
                  >
                    {index === results.findIndex(p => p.suitable) && plan.suitable && (
                      <div className="absolute -top-2 left-4">
                        <Badge className="bg-gradient-primary text-white px-2 py-1 text-xs">
                          Recomendado
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {plan.name}
                            {plan.suitable ? (
                              <CheckCircle className="w-4 h-4 text-success" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-destructive" />
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {plan.suitable ? 'Atende suas necessidades' : 'Insuficiente para seu uso'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{plan.monthly}</p>
                          <p className="text-xs text-muted-foreground">mensal</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span className="text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Separator className="mb-3" />

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Anual</p>
                          <p className="font-semibold text-sm">{plan.annual}/mês</p>
                          {plan.savings && (
                            <p className="text-xs text-success">
                              Economize R$ {plan.savings}/ano
                            </p>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          variant={plan.suitable && index === results.findIndex(p => p.suitable) ? "default" : "outline"}
                          className={plan.suitable && index === results.findIndex(p => p.suitable) ? "bg-gradient-primary hover:opacity-90" : ""}
                          disabled={!plan.suitable}
                        >
                          {plan.suitable ? 'Escolher' : 'Insuficiente'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {recommendedPlan && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Recomendação Personalizada
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Com base no seu uso estimado, o <strong>{recommendedPlan.name}</strong> é o plano ideal. 
                  Você terá {inputs.copies <= 10000 ? 'capacity' : 'unlimited'} para crescer e 
                  economizará R$ {monthlySavings > 0 ? monthlySavings.toFixed(0) : '0'} por mês 
                  comparado a freelancers.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsageCalculatorModal;