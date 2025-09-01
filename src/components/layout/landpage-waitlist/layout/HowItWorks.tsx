import { ArrowRight, Settings, Sparkles, Share2 } from "lucide-react";

const steps = [
  {
    icon: Settings,
    number: "01",
    title: "Defina o tom",
    description: "Configure o tom de voz da sua marca em segundos. Formal, descontraído, técnico - você escolhe."
  },
  {
    icon: Sparkles,
    number: "02", 
    title: "IA gera conteúdo",
    description: "Nossa IA avançada cria posts, e-mails, anúncios e landing pages seguindo sua identidade."
  },
  {
    icon: Share2,
    number: "03",
    title: "Publique e analise",
    description: "Publique direto nas plataformas e acompanhe métricas em tempo real."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20" id="how-it-works">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Como funciona a
            <span className="block text-primary">mágica?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Processo simples, resultados extraordinários
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full w-8 h-0.5 bg-gradient-to-r from-primary to-primary/30 z-10">
                    <ArrowRight className="absolute -right-2 -top-2 w-4 h-4 text-primary" />
                  </div>
                )}

                <div className="group text-center p-8 rounded-2xl card-gradient border border-border/50 interactive-card">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground">
            <span className="font-semibold text-primary">Resultado:</span> De horas para minutos. De genérico para personalizado.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
