import MobileMockup from "./MobileMockup";

const TechSection = () => {
  return (
    <section className="py-12 md:py-20 bg-card/50 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - 3D Visualization */}
          <div className="order-2 lg:order-1 flex justify-center animate-fade-in-up">
            <MobileMockup />
          </div>

          {/* Right side - Content */}
          <div className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-primary">Tecnologia Avançada</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              IA que aprende com
              <span className="block text-primary">sua marca</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Nossa <span className="text-primary font-semibold">inteligência artificial neural</span> não apenas gera conteúdo - ela entende
              profundamente o DNA da sua marca e replica seu tom único em cada palavra.
            </p>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4 group interactive-card p-3 md:p-4 rounded-xl hover:bg-card/50 transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform animate-pulse-glow">
                  <span className="text-xl md:text-2xl">🧠</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Deep Learning Avançado</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Redes neurais treinadas com milhões de exemplos de copy de alta performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 group interactive-card p-3 md:p-4 rounded-xl hover:bg-card/50 transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform animate-pulse-glow">
                  <span className="text-xl md:text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Processamento em Tempo Real</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Geramos conteúdo personalizado em segundos, não em horas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 group interactive-card p-3 md:p-4 rounded-xl hover:bg-card/50 transition-all">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform animate-pulse-glow">
                  <span className="text-xl md:text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">Precisão Contextual</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Cada palavra é escolhida estrategicamente para maximizar conversão.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSection;