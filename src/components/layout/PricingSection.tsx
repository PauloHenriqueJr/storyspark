import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: 'R$ 29',
    period: '/mês',
    description: 'Ideal para criadores individuais',
    features: [
      '1.000 créditos de IA por mês',
      '5 campanhas ativas',
      '2 vozes de marca',
      'Suporte por email',
      'Integrações básicas'
    ],
    popular: false
  },
  {
    name: 'Pro',
    price: 'R$ 89',
    period: '/mês',
    description: 'Para equipes e agências',
    features: [
      '5.000 créditos de IA por mês',
      'Campanhas ilimitadas',
      '10 vozes de marca',
      'Colaboração em equipe',
      'Analytics avançados',
      'Suporte prioritário',
      'Todas as integrações'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Customizado',
    period: '',
    description: 'Para grandes empresas',
    features: [
      'Créditos ilimitados',
      'Workspaces ilimitados',
      'Vozes de marca ilimitadas',
      'SSO e segurança avançada',
      'Suporte dedicado',
      'Integrações customizadas',
      'Treinamento personalizado'
    ],
    popular: false
  }
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Planos e Preços
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Escolha o plano
            <span className="bg-gradient-primary bg-clip-text text-transparent"> perfeito para você</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece grátis e escale conforme sua necessidade. Sem compromisso, cancele quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-1 ${plan.popular ? 'ring-2 ring-primary relative' : ''
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-primary-foreground px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <CardDescription className="text-base mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full ${plan.popular
                      ? 'bg-gradient-primary hover:shadow-glow'
                      : 'variant-outline'
                    }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link to="/register">
                    {plan.name === 'Enterprise' ? 'Falar com Vendas' : 'Começar Agora'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Todos os planos incluem 7 dias de teste grátis
          </p>
          <Button variant="ghost" asChild>
            <Link to="/compare-plans">
              Ver comparação completa de recursos →
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};