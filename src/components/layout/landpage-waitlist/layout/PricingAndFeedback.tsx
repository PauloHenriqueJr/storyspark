import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Check, 
  Crown, 
  Zap, 
  Star, 
  ArrowRight,
  Sparkles,
  Rocket,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  ThumbsUp,
  Gift,
  Flame,
  Diamond
} from "lucide-react";
import { toast } from "sonner";

export default function PricingAndFeedback() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [pollAnswer, setPollAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      icon: Sparkles,
      price: "R$ 97",
      period: "/mês",
      description: "Perfeito para começar a revolucionar seu marketing",
      features: [
        "50 copies por mês",
        "Posts para redes sociais",
        "E-mails básicos", 
        "Suporte por chat",
        "Templates exclusivos"
      ],
      popular: false,
      gradient: "from-primary/20 to-accent/20",
      buttonText: "Começar Grátis"
    },
    {
      id: "pro",
      name: "Professional",
      icon: Crown,
      price: "R$ 197",
      period: "/mês",
      description: "Para quem quer dominar completamente o marketing digital",
      features: [
        "200 copies por mês",
        "Todos os tipos de conteúdo",
        "Landing pages otimizadas",
        "Análise de performance",
        "Suporte prioritário",
        "Tom de marca personalizado",
        "Integração com ferramentas"
      ],
      popular: true,
      gradient: "from-primary via-primary-light to-primary",
      buttonText: "Mais Popular"
    },
    {
      id: "enterprise", 
      name: "Enterprise",
      icon: Diamond,
      price: "R$ 397",
      period: "/mês",
      description: "Solução completa para empresas que querem multiplicar vendas",
      features: [
        "Copies ilimitadas",
        "IA treinada na sua marca",
        "Múltiplas marcas",
        "API personalizada",
        "Suporte 24/7",
        "Consultoria estratégica",
        "Relatórios avançados",
        "Onboarding personalizado"
      ],
      popular: false,
      gradient: "from-accent/20 to-primary/30",
      buttonText: "Fale Conosco"
    }
  ];

  const pollOptions = [
    { id: "social", label: "Posts para redes sociais", icon: Users, count: 1247 },
    { id: "email", label: "E-mail marketing", icon: MessageSquare, count: 932 },
    { id: "ads", label: "Anúncios pagos", icon: Target, count: 1456 },
    { id: "landing", label: "Landing pages", icon: Rocket, count: 678 }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    const plan = plans.find(p => p.id === planId);
    toast.success(`🎉 Plano ${plan?.name} selecionado!`, {
      description: "Você será notificado quando lançarmos!"
    });
  };

  const handlePollVote = async (optionId: string) => {
    setPollAnswer(optionId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success("🗳️ Voto registrado!", {
        description: "Obrigado pela sua opinião!"
      });
    } catch (error) {
      toast.error("Erro ao registrar voto.");
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || !email.trim()) return;

    setIsSubmittingFeedback(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("💌 Feedback enviado!", {
        description: "Sua opinião é muito importante para nós!"
      });
      setFeedback("");
      setEmail("");
    } catch (error) {
      toast.error("Erro ao enviar feedback.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-40 sm:w-64 h-40 sm:h-64 bg-primary/10 rounded-full blur-2xl sm:blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-20 w-32 sm:w-48 h-32 sm:h-48 bg-accent/15 rounded-full blur-xl sm:blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4 sm:mb-6"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              Oferta de Lançamento
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-4"
          >
            Escolha seu{" "}
            <span className="gradient-text">plano</span>{" "}
            e{" "}
            <span className="text-primary">multiplique</span>{" "}
            suas vendas!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4"
          >
            Planos especiais para os <strong className="text-primary">primeiros 500 usuários</strong>. 
            Garante já o seu desconto de <span className="text-primary font-bold">70% OFF!</span>
          </motion.p>
        </motion.div>

        <div className="space-y-4 sm:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 xl:gap-8 mb-12 sm:mb-16 md:mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.02,
                y: -5
              }}
              className={`relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 cursor-pointer group touch-manipulation ${
                plan.popular 
                  ? "border-primary/50 bg-gradient-to-br from-primary/10 to-primary-light/10 lg:scale-105" 
                  : "border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 hover:border-primary/30"
              } ${
                selectedPlan === plan.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary to-primary-light rounded-full text-primary-foreground text-xs sm:text-sm font-bold shadow-lg"
                >
                  ⚡ MAIS POPULAR
                </motion.div>
              )}

              <div className="text-center mb-6 sm:mb-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}
                >
                  <plan.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 px-2">{plan.description}</p>

                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground mb-1 sm:mb-2 text-sm sm:text-base">{plan.period}</span>
                </div>
                
                <p className="text-xs text-primary font-medium">
                  🔥 70% OFF - Apenas para os primeiros 500!
                </p>
              </div>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + featureIndex * 0.1 }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button
                className={`w-full h-10 sm:h-12 font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 touch-manipulation ${
                  plan.popular
                    ? "bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-xl"
                    : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40"
                }`}
              >
                {selectedPlan === plan.id ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    Selecionado!
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {plan.popular && <Zap className="w-4 h-4 sm:w-5 sm:h-5" />}
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
              </Button>

              {selectedPlan === plan.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                >
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground fill-current" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Feedback section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-card via-accent/5 to-card rounded-2xl sm:rounded-3xl border border-primary/20 p-4 sm:p-6 md:p-8 lg:p-12 mb-12 sm:mb-16"
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 px-4">
                Sua opinião é <span className="gradient-text">ouro</span> para nós!
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Conte o que você espera do StorySpark e como podemos te ajudar a vender mais!
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="feedback" className="text-sm sm:text-base font-medium">
                  Seu feedback
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Ex: Preciso de copy para Instagram que converta seguidores em clientes..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-2 min-h-[100px] sm:min-h-[120px] resize-none border-primary/20 focus:border-primary text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <Label htmlFor="feedback-email" className="text-sm sm:text-base font-medium">
                  Seu melhor e-mail
                </Label>
                <Input
                  id="feedback-email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 border-primary/20 focus:border-primary text-sm sm:text-base h-10 sm:h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 touch-manipulation"
              >
                {isSubmittingFeedback ? (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    Enviando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    Enviar Feedback
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary via-primary-light to-primary rounded-xl sm:rounded-2xl text-primary-foreground font-semibold text-base sm:text-lg shadow-xl cursor-pointer touch-manipulation"
            onClick={() => {
              const heroSection = document.getElementById("hero");
              if (heroSection) {
                heroSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base md:text-lg">Garantir Meu Lugar na Lista VIP!</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          </motion.div>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground px-4">
            🎯 Seja um dos primeiros 500 e ganhe <strong className="text-primary">70% OFF</strong> para sempre!
          </p>
        </motion.div>
      </div>
    </section>
  );
}