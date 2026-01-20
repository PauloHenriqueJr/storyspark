import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { useAdminPlansCache } from '@/hooks/useAdminPlansCache';
import { appUrl } from '@/utils/urls';

export const PricingSection = () => {
  const { activePlans, loading, formatPrice } = useAdminPlansCache();

  if (loading) {
    return (
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando planos...</p>
          </div>
        </div>
      </section>
    );
  }

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

        <div className={`grid gap-8 max-w-7xl mx-auto ${
          activePlans.length <= 3 ? 'md:grid-cols-' + activePlans.length : 'md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {activePlans.map((plan) => (
            <Card
              key={plan.id}
              className={`border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-1 ${
                plan.is_popular ? 'ring-2 ring-primary relative' : ''
              }`}
            >
              {plan.is_popular && (
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
                  <span className="text-4xl font-bold">{formatPrice(plan.price_brl)}</span>
                  {plan.price_brl > 0 && <span className="text-muted-foreground ml-1">/mês</span>}
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
                  className={`w-full ${
                    plan.is_popular
                      ? 'bg-gradient-primary hover:shadow-glow'
                      : 'variant-outline'
                  }`}
                  variant={plan.is_popular ? 'default' : 'outline'}
                >
                  <a href={appUrl('/auth')}>
                    {plan.slug === 'enterprise' ? 'Falar com Vendas' : 'Começar Agora'}
                  </a>
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
            <a href={appUrl('/billing')}>
              Ver comparação completa de recursos →
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
