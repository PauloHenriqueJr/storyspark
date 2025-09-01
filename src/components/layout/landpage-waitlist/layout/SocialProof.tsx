import { useState } from "react";
import { TrendingUp, Users, Target, Zap, ArrowRight } from "lucide-react";

const socialProofStats = [
  {
    icon: <Users className="w-6 h-6" />,
    value: "2.800+",
    label: "Profissionais Esperando",
    description: "Copywriters, marqueteiros e empreendedores na lista"
  },
  {
    icon: <Target className="w-6 h-6" />,
    value: "47",
    label: "Funcionalidades Solicitadas",
    description: "Recursos pedidos pela comunidade"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: "94%",
    label: "Taxa de Engajamento",
    description: "Da comunidade participa ativamente do desenvolvimento"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    value: "1.200+",
    label: "Votos em Funcionalidades", 
    description: "Validações das funcionalidades mais desejadas"
  }
];

const painPoints = [
  {
    problem: "Demora horas para criar uma copy que converte",
    solution: "IA especializada gera copies high-converting em minutos"
  },
  {
    problem: "Falta de inspiração e bloqueio criativo constante", 
    solution: "Templates e prompts inteligentes que nunca acabam"
  },
  {
    problem: "Não sabe se a copy vai funcionar antes de testar",
    solution: "Score de conversão preditivo baseado em dados reais"
  },
  {
    problem: "Cada nicho precisa de uma abordagem diferente",
    solution: "Agentes especializados por segmento de mercado"
  }
];

const SocialProof = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              Validado pela comunidade
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">A Revolução que o Mercado</span>
              <span className="block text-primary">Estava Esperando</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Não é apenas mais uma ferramenta de IA. É a solução definitiva para os maiores problemas 
              dos profissionais de marketing de conteúdo no Brasil.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {socialProofStats.map((stat, index) => (
              <div 
                key={index}
                className="card-gradient rounded-2xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 text-center group hover:shadow-soft"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  {stat.icon}
                </div>
                
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                
                <div className="font-medium text-foreground mb-2">
                  {stat.label}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Problem/Solution Showcase */}
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/20 shadow-lg">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Os Maiores Desafios do Marketing de Conteúdo
              </h3>
              <p className="text-muted-foreground">
                Identifique seu problema e descubra nossa solução inteligente
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Problems list */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center text-destructive text-sm">✕</span>
                  Desafios Reais do Mercado
                </h4>
                {painPoints.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                      activeIndex === index 
                        ? 'bg-primary/10 border-primary/40 text-foreground shadow-sm' 
                        : 'bg-card border-border/40 text-muted-foreground hover:bg-muted/20 hover:border-border/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activeIndex === index ? 'bg-primary' : 'bg-muted-foreground/60'
                      }`} />
                      <span className="font-medium text-sm leading-relaxed">{item.problem}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Solution display */}
              <div className="bg-gradient-to-br from-primary/8 to-primary/5 rounded-2xl p-6 border border-primary/30">
                <h4 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm">✓</span>
                  Nossa Solução Inteligente
                </h4>
                
                <div className="bg-card/90 rounded-xl p-6 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium leading-relaxed mb-4">
                        {painPoints[activeIndex].solution}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg">
                        <span>Funcionalidade disponível no lançamento</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community trust */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 bg-card/50 backdrop-blur-sm px-8 py-4 rounded-2xl border border-border/30">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-8 h-8 bg-muted/50 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground">
                  +
                </div>
              </div>
              <span className="text-foreground font-medium">
                Junte-se aos <span className="text-primary font-bold">2.800+ profissionais</span> que estão moldando o futuro do marketing de conteúdo
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;