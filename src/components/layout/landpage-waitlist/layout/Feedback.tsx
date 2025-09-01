import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Lightbulb, Target, Zap } from "lucide-react";

const feedbackOptions = [
  { id: "ai-content", label: "IA para criação de conteúdo", icon: Lightbulb },
  { id: "collaboration", label: "Colaboração em equipe", icon: Target },
  { id: "analytics", label: "Analytics em tempo real", icon: MessageSquare },
  { id: "multi-platform", label: "Publicação multi-plataforma", icon: Zap }
];

const Feedback = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption || suggestion) {
      // TODO: Integrar com Supabase para salvar feedback
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ajude-nos a priorizar
              <span className="block text-primary">suas necessidades</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Queremos entender suas dores para criar a solução perfeita
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Poll question */}
            <div className="card-gradient rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
                Qual recurso você mais gostaria de usar primeiro?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {feedbackOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOption(option.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedOption === option.id
                        ? 'border-primary bg-accent shadow-soft'
                        : 'border-border/50 hover:border-primary/30 hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedOption === option.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <option.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-foreground">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestion box */}
            <div className="card-gradient rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                Escreva sua sugestão 🚀
              </h3>
              <p className="text-muted-foreground mb-6">
                Que funcionalidade você gostaria de ver? Como podemos tornar a StorySpark perfeita para você?
              </p>
              
              <Textarea
                placeholder="Ex: Gostaria de integração com WhatsApp Business, templates para stories do Instagram, geração de legendas em vídeos..."
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Submit button */}
            <div className="text-center">
              <Button 
                type="submit" 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                disabled={isSubmitted}
              >
                {isSubmitted ? '✓ Feedback enviado!' : 'Enviar feedback'}
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Seu feedback nos ajuda a priorizar as funcionalidades mais importantes
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Feedback;