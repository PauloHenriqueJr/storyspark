import { Check, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "R$ 97",
    period: "/mês",
    description: "Perfeito para freelancers e pequenas empresas",
    popular: false,
    features: [
      "100 gerações de conteúdo/mês",
      "Posts para redes sociais",
      "E-mails marketing básicos", 
      "1 tom de voz personalizado",
      "Suporte via chat"
    ]
  },
  {
    name: "Pro",
    price: "R$ 297", 
    period: "/mês",
    description: "Ideal para agências e equipes de marketing",
    popular: true,
    features: [
      "500 gerações de conteúdo/mês",
      "Todos os tipos de conteúdo",
      "Colaboração em equipe (5 usuários)",
      "3 tons de voz personalizados",
      "Analytics avançadas",
      "Integração com todas as plataformas",
      "Suporte prioritário"
    ]
  },
  {
    name: "Enterprise",
    price: "Personalizado",
    period: "",
    description: "Soluções sob medida para grandes empresas", 
    popular: false,
    features: [
      "Gerações ilimitadas",
      "Usuários ilimitados",
      "Tons de voz ilimitados",
      "API dedicada",
      "Treinamento personalizado",
      "Suporte dedicado 24/7",
      "SLA garantido"
    ]
  }
];

const Pricing = () => {
  return (
    <section className="py-20" id="precos">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Planos para todos os
            <span className="block text-primary">tamanhos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece grátis e escale conforme sua necessidade
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                plan.popular 
                  ? 'border-primary bg-gradient-primary text-white scale-105 shadow-strong' 
                  : 'border-border/50 card-gradient hover:border-primary/30 interactive-card'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-2 bg-white text-primary rounded-full text-sm font-semibold">
                    <Star className="w-4 h-4 fill-current" />
                    Mais Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-foreground'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
                <div className="flex items-end justify-center gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-foreground'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 ${plan.popular ? 'text-white' : 'text-primary'}`} />
                    <span className={`${plan.popular ? 'text-white/90' : 'text-muted-foreground'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-white text-primary hover:bg-white/90' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {plan.name === 'Enterprise' ? 'Falar com vendas' : 'Entrar na lista'}
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="text-center mt-16 p-6 rounded-xl bg-accent">
          <p className="text-accent-foreground">
            💰 <span className="font-semibold">Garantia de 30 dias</span> - 100% do seu dinheiro de volta se não ficar satisfeito
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;