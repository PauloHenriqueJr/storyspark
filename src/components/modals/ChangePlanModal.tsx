import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  Crown, 
  Star, 
  ArrowRight,
  Calculator,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  copies: number;
  integrations: number;
  users: number;
}

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onConfirmChange: (planName: string) => void;
}

const ChangePlanModal: React.FC<ChangePlanModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onConfirmChange
}) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  const plans: Plan[] = [
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
      copies: 10000,
      integrations: 3,
      users: 1
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
      popular: true,
      copies: 50000,
      integrations: 10,
      users: 5
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
      copies: 999999,
      integrations: 999,
      users: 999
    }
  ];

  const handleSelectPlan = (plan: Plan) => {
    if (plan.name === currentPlan) return;
    setSelectedPlan(plan);
    setStep('confirm');
  };

  const handleConfirmChange = () => {
    if (selectedPlan) {
      onConfirmChange(selectedPlan.name);
      onClose();
      setStep('select');
      setSelectedPlan(null);
    }
  };

  const handleBack = () => {
    setStep('select');
    setSelectedPlan(null);
  };

  const calculatePriceDifference = (newPlan: Plan) => {
    const currentPlanData = plans.find(p => p.name === currentPlan);
    if (!currentPlanData) return 0;
    
    const currentPrice = parseInt(currentPlanData.price.replace('R$ ', ''));
    const newPrice = parseInt(newPlan.price.replace('R$ ', ''));
    
    return newPrice - currentPrice;
  };

  const isUpgrade = (planName: string) => {
    const planOrder = { 'Starter': 1, 'Pro': 2, 'Enterprise': 3 };
    const currentOrder = planOrder[currentPlan as keyof typeof planOrder] || 0;
    const newOrder = planOrder[planName as keyof typeof planOrder] || 0;
    return newOrder > currentOrder;
  };

  if (step === 'confirm' && selectedPlan) {
    const priceDiff = calculatePriceDifference(selectedPlan);
    const upgrade = isUpgrade(selectedPlan.name);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Confirmar Mudança de Plano
            </DialogTitle>
            <DialogDescription>
              Revise as alterações antes de confirmar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current vs New Plan */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Plano Atual</span>
                <Badge variant="outline">{currentPlan}</Badge>
              </div>
              
              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-sm font-medium">Novo Plano</span>
                <Badge className="bg-gradient-primary text-white">
                  {selectedPlan.name}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Price Changes */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Alterações de Cobrança</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor do novo plano:</span>
                  <span className="font-medium">{selectedPlan.price}/mês</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {upgrade ? 'Cobrança adicional:' : 'Crédito a receber:'}
                  </span>
                  <span className={`font-medium ${priceDiff > 0 ? 'text-primary' : 'text-success'}`}>
                    {priceDiff > 0 ? '+' : ''}R$ {Math.abs(priceDiff)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* New Features */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">O que muda:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Copies IA/mês:</span>
                  <span className="font-medium">
                    {selectedPlan.copies === 999999 ? 'Ilimitadas' : selectedPlan.copies.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Integrações:</span>
                  <span className="font-medium">
                    {selectedPlan.integrations === 999 ? 'Ilimitadas' : selectedPlan.integrations}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Usuários:</span>
                  <span className="font-medium">
                    {selectedPlan.users === 999 ? 'Ilimitados' : selectedPlan.users}
                  </span>
                </div>
              </div>
            </div>

            {upgrade && priceDiff > 0 && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">Cobrança Proporcional</p>
                  <p>Você será cobrado proporcionalmente pela diferença até o próximo ciclo de faturamento.</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleBack}>
              Voltar
            </Button>
            <Button onClick={handleConfirmChange} className="bg-gradient-primary hover:opacity-90">
              <CreditCard className="w-4 h-4 mr-2" />
              Confirmar Mudança
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Alterar Plano
          </DialogTitle>
          <DialogDescription>
            Escolha o plano ideal para suas necessidades. Você pode alterar a qualquer momento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative cursor-pointer transition-all hover:shadow-md ${
                plan.name === currentPlan 
                  ? 'border-success bg-success/5' 
                  : plan.popular 
                    ? 'border-primary shadow-lg' 
                    : 'hover:border-primary/50'
              }`}
              onClick={() => handleSelectPlan(plan)}
            >
              {plan.popular && plan.name !== currentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              {plan.name === currentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-success text-white px-3 py-1">
                    <Check className="w-3 h-3 mr-1" />
                    Atual
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="text-2xl font-bold text-foreground mt-2">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-success flex-shrink-0" />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <div className="text-xs text-muted-foreground">
                      +{plan.features.length - 4} recursos adicionais
                    </div>
                  )}
                </div>

                <Button 
                  className={`w-full text-sm ${
                    plan.name === currentPlan 
                      ? 'bg-success hover:bg-success/90' 
                      : plan.popular 
                        ? 'bg-gradient-primary hover:opacity-90' 
                        : ''
                  }`}
                  variant={plan.name === currentPlan ? 'default' : plan.popular ? 'default' : 'outline'}
                  disabled={plan.name === currentPlan}
                >
                  {plan.name === currentPlan ? 'Plano Atual' : 'Selecionar'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePlanModal;