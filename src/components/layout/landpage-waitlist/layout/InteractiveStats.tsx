import { useState } from "react";
import { Users, MessageCircle, Heart, Sparkles, Zap } from "lucide-react";

const InteractiveStats = () => {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const statItems = [
    {
      id: "users",
      icon: <Users className="w-6 h-6" />,
      value: "Lista em formação",
      label: "Participe do começo",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      description: "Copywriters e marqueteiros esperando o lançamento"
    },
    {
      id: "ideas",
      icon: <Sparkles className="w-6 h-6" />,
      value: "Envie a sua",
      label: "Ideias da comunidade",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      description: "Funcionalidades sugeridas pela comunidade"
    },
    {
      id: "votes",
      icon: <Heart className="w-6 h-6" />,
      value: "Vote nas prioridades",
      label: "Votos da comunidade",
      color: "text-primary",
      bg: "bg-primary/10",
      description: "Validações das funcionalidades mais desejadas"
    },
    {
      id: "engagement",
      icon: <Zap className="w-6 h-6" />,
      value: "Acompanhe a evolução",
      label: "Engajamento",
      color: "text-green-400",
      bg: "bg-green-500/10",
      description: "Taxa de participação na construção do produto"
    }
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4" />
              Construindo juntos em tempo real
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Você Faz Parte da
              <span className="block text-primary">Criação</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cada voto, cada ideia e cada feedback molda diretamente o futuro da StorySpark. 
              Você não é apenas um usuário - você é co-criador.
            </p>
          </div>

          {/* Interactive stats grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {statItems.map((stat) => (
              <div
                key={stat.id}
                onMouseEnter={() => setHoveredStat(stat.id)}
                onMouseLeave={() => setHoveredStat(null)}
                className={`group glass-effect-dark rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
                  hoveredStat === stat.id
                    ? 'border-primary/50 shadow-glow'
                    : 'border-border/30 hover:border-primary/30'
                }`}
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                
                <div className="text-sm font-medium text-muted-foreground mb-3">
                  {stat.label}
                </div>
                
                {hoveredStat === stat.id && (
                  <div className="text-xs text-muted-foreground animate-fade-in">
                    {stat.description}
                  </div>
                )}
                
                {/* Live update indicator */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Impact showcase */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Sua Voz Importa
              </h3>
              <p className="text-muted-foreground">
                Cada sugestão é analisada e priorizada pela equipe de desenvolvimento. Você influencia diretamente o roadmap.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Ideias Implementadas
              </h3>
              <p className="text-muted-foreground">
                As funcionalidades mais votadas são desenvolvidas primeiro. Sua participação acelera o que você mais precisa.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Comunidade Ativa
              </h3>
              <p className="text-muted-foreground">
                Conecte-se com outros profissionais, troque experiências e construa a melhor ferramenta de copy do mercado.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary-light/10 px-8 py-4 rounded-2xl border border-primary/20">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-primary font-medium">
                Entre na lista e ajude a priorizar o roadmap
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveStats;

