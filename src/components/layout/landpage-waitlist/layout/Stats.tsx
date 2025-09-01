const stats = [
  {
    number: "15x",
    label: "Mais rápido que criação manual",
    description: "O que levava 3 horas, agora leva 15 minutos",
    highlight: true
  },
  {
    number: "340%",
    label: "ROI médio no primeiro mês",
    description: "Baseado em estudos de produtividade de IA",
    highlight: true
  },
  {
    number: "500%",
    label: "Aumento na produção de conteúdo",
    description: "Escale sem contratar mais redatores",
    highlight: false
  },
  {
    number: "98%",
    label: "Dos usuários recomendam",
    description: "Aprovação em testes com early adopters",
    highlight: false
  }
];

const Stats = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Resultados que
            <span className="block gradient-text">falam por si</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Projeções baseadas em estudos de produtividade com IA generativa e feedback dos nossos early adopters
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 bg-card/90 border-border/30 hover:bg-card interactive-card"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                {stat.number}
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                {stat.label}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom highlight */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-gradient-primary text-primary-foreground orange-glow">
          <h3 className="text-2xl font-bold mb-4">
            ⚡ Transforme sua produtividade hoje mesmo
          </h3>
          <p className="text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
            Junte-se aos profissionais de marketing que já estão economizando horas de trabalho e 
            multiplicando seus resultados com inteligência artificial de última geração.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
