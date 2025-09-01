import { Bot, Users, Palette, Zap, MessageCircle, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Bot className="w-8 h-8" />,
    title: "Button Flutuante IA",
    description: "Assistente inteligente sempre disponível em todo dashboard para ajudar com copy, sugestões e otimizações em tempo real.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Templates Inteligentes",
    description: "Biblioteca com milhares de templates de copy testados e aprovados, organizados por nicho e plataforma.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Comunidade Ativa",
    description: "Troque templates, estratégias e resultados com outros copywriters e marqueteiros em nossa comunidade exclusiva.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Integração Tráfego Pago",
    description: "Conecte direto com Google Ads e Facebook Ads para testar copies e medir performance em tempo real.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Agentes Especializados",
    description: "IA treinada específicamente para diferentes nichos: e-commerce, infoprodutos, SaaS, consultoria e muito mais.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Brand Voice & Personas",
    description: "Crie vozes de marca únicas e personas detalhadas para copy personalizada que converte mais.",
    gradient: "from-yellow-500 to-orange-500"
  }
];

const AdvancedFeatures = () => {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Funcionalidades
              <span className="block text-primary">Avançadas</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Um ecossistema completo de ferramentas IA para revolucionar sua criação de conteúdo e copy de alta conversão
            </p>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative card-gradient rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-soft"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${feature.gradient}`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect indicator */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Bottom highlight */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full">
              <Zap className="w-5 h-5" />
              <span className="font-medium">E muito mais funcionalidades em desenvolvimento</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeatures;