import { Clock, Shuffle, MessageCircle, Users } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Tempo é dinheiro perdido",
    description: "Você gasta 3+ horas criando um post que deveria levar minutos. Enquanto isso, seus concorrentes estão na frente."
  },
  {
    icon: Shuffle,
    title: "Ferramentas espalhadas", 
    description: "Saltar entre 5+ plataformas para criar, editar e publicar drena sua energia e produtividade."
  },
  {
    icon: MessageCircle,
    title: "Brand voice inconsistente",
    description: "Sua marca 'fala' diferente em cada canal. Resultado: confusão e perda de autoridade com o público."
  },
  {
    icon: Users,
    title: "Conteúdo genérico",
    description: "Templates vazios que não conectam. Seu público percebe e ignora. Engajamento em queda livre."
  }
];

const Problems = () => {
  return (
    <section className="py-20 bg-muted/30" id="problemas">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Você perde dinheiro com
            <span className="block gradient-text">esses problemas?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cada hora desperdiçada criando conteúdo é uma oportunidade de venda que escapa. 
            Pare de trabalhar CONTRA sua produtividade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={problem.title}
              className="group p-6 rounded-2xl card-gradient border border-border/50 interactive-card"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="w-12 h-12 rounded-xl feature-icon flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <problem.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;