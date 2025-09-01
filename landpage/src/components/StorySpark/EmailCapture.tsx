import { useState } from "react";
import SignupCounter from '../SignupCounter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Gift, Users, Zap } from "lucide-react";
import { toast } from "sonner";

const benefits = [
  {
    icon: <Gift className="w-5 h-5" />,
    text: "Acesso antecipado à plataforma"
  },
  {
    icon: <Users className="w-5 h-5" />,
    text: "Comunidade exclusiva de beta testers"
  },
  {
    icon: <Zap className="w-5 h-5" />,
    text: "Templates gratuitos toda semana"
  }
];

const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // Simular requisição e armazenar localmente para demo
      await new Promise((r) => setTimeout(r, 800));
      const key = "storyspark-landpage-waitlist";
      const list: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      const normalized = email.trim().toLowerCase();
      if (list.includes(normalized)) {
        setAlreadyExists(true);
        toast("Você já está na lista — já recebemos esse e‑mail.");
      } else {
        list.push(normalized);
        localStorage.setItem(key, JSON.stringify(list));
        setAlreadyExists(false);
        toast.success("Inscrição confirmada! Acesso antecipado chegando em breve.");
      }
      setIsSubmitted(true);
      setEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card-gradient rounded-3xl p-12 border border-primary/20">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              {alreadyExists ? (
                <>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Você já está na lista</h2>
                  <p className="text-lg text-muted-foreground">Recebemos seu e‑mail anteriormente — não é necessário enviar novamente.</p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Você está na lista! 🎉</h2>
                  <p className="text-lg text-muted-foreground mb-6">Em breve você receberá novidades exclusivas da StorySpark e será um dos primeiros a testar nossa plataforma.</p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Templates exclusivos</span>
                    <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Acesso antecipado</span>
                    <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Comunidade VIP</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/20 relative overflow-hidden shadow-lg">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Transforme Suas Ideias em
                  <span className="block text-primary">Vendas com IA</span>
                </h2>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Seja um dos primeiros a acessar a plataforma que vai revolucionar como você cria conteúdo que converte. Templates exclusivos, acesso antecipado e suporte VIP esperando por você.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Seu melhor email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-12 text-base"
                    required
                  />
                  <Button 
                    type="submit" 
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Entrar na Lista"}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Sem spam. Apenas conteúdo de valor e novidades da plataforma.
                </p>
              </form>

              {/* Social proof */}
              <div className="mt-8 text-center">
                <SignupCounter />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;