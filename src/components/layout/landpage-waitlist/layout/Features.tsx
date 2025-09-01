import { Brain, Zap, Users, BarChart3, Mic, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA de Última Geração",
    description: "Algoritmos treinados especificamente para marketing. Entende contexto, tom, emoção e objetivos de conversão como um especialista sênior.",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: Zap,
    title: "Velocidade Absurda", 
    description: "De briefing à copy finalizada em menos de 60 segundos. Multiplique sua produção por 15x sem sacrificar qualidade.",
    color: "from-yellow-500 to-orange-600"
  },
  {
    icon: Users,
    title: "Colaboração Inteligente",
    description: "Equipe unificada, workflows otimizados. Aprove, edite e publique em time real. Produtividade em escala empresarial.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: BarChart3,
    title: "Analytics Preditivos",
    description: "Métricas que preveem performance antes da publicação. Otimize ROI com dados, não intuição.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Mic,
    title: "Brand Voice 2.0",
    description: "Sua marca fala consistente em 50+ canais simultaneamente. DNA da marca preservado em escala industrial.",
    color: "from-red-500 to-pink-600"
  },
  {
    icon: Globe,
    title: "Omnichannel Real",
    description: "Uma campanha, 12 adaptações automáticas. Instagram, LinkedIn, Facebook, TikTok, e-mail. Tudo otimizado para cada plataforma.",
    color: "from-indigo-500 to-purple-600"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-muted/20" id="recursos">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Por que a StorySpark é
            <span className="block gradient-text">diferente de tudo?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Não é apenas mais uma ferramenta de IA. É o sistema completo que transforma 
            profissionais de marketing em máquinas de conversão.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative p-8 rounded-2xl card-gradient border border-border/50 interactive-card overflow-hidden"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-gradient-primary text-primary-foreground orange-glow">
          <h3 className="text-2xl font-bold mb-4">
            🎯 Pare de competir no hard mode
          </h3>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Enquanto seus concorrentes gastam horas criando conteúdo, você já estará 
            analisando resultados e planejando a próxima campanha vencedora.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;