import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube,
  Heart,
  Zap,
  Crown,
  Sparkles,
  Rocket,
  Star,
  ArrowUp,
  Send,
  Flame,
  Diamond,
  Shield,
  Award
} from "lucide-react";
import { toast } from "sonner";

export default function NewFooter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("🎉 Inscrito na newsletter!", {
        description: "Você receberá todas as novidades em primeira mão!"
      });
      setEmail("");
    } catch (error) {
      toast.error("Erro ao inscrever. Tente novamente!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Como Funciona", href: "#how-it-works" },
    { label: "Preços", href: "#pricing" },
    { label: "Depoimentos", href: "#customers" },
  ];

  const legalLinks = [
    { label: "Política de Privacidade", href: "#" },
    { label: "Termos de Uso", href: "#" },
    { label: "Cookies", href: "#" },
  ];

  const socialLinks = [
    { 
      icon: Instagram, 
      href: "https://instagram.com/storyspark", 
      label: "Instagram",
      color: "hover:text-primary",
      followers: "12.5K"
    },
    { 
      icon: Twitter, 
      href: "https://twitter.com/storyspark", 
      label: "Twitter",
      color: "hover:text-accent-foreground",
      followers: "8.2K"
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/storyspark", 
      label: "LinkedIn",
      color: "hover:text-primary",
      followers: "15.3K"
    },
    { 
      icon: Youtube, 
      href: "https://youtube.com/storyspark", 
      label: "YouTube",
      color: "hover:text-accent-foreground",
      followers: "25.7K"
    },
  ];

  const achievements = [
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Seus dados protegidos"
    },
    {
      icon: Award,
      title: "Premiado",
      description: "Top IA Marketing 2024"
    },
    {
      icon: Star,
      title: "4.9/5 Estrelas",
      description: "+1.2K avaliações"
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-background via-primary/5 to-background border-t border-primary/10 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-64 h-64 bg-accent/8 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        <motion.div
          className="absolute top-1/3 right-20 text-primary/10"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Diamond className="w-24 h-24" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-16 text-accent-foreground/10"
          animate={{
            y: [0, 25, 0],
            rotate: [0, -180, -360],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Flame className="w-20 h-20" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <Mail className="w-16 h-16 text-primary" />
            </motion.div>

            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Fique por dentro de <span className="gradient-text">tudo</span>!
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Receba dicas exclusivas de copywriting, novidades do StorySpark e ofertas especiais. 
              Seja o primeiro a saber quando lançarmos!
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor e-mail aqui..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 border-primary/20 focus:border-primary gradient-border"
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 bg-gradient-to-r from-primary to-primary-light text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Inscrever
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-12 h-12 bg-gradient-to-br from-primary via-primary-light to-primary rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Flame className="w-7 h-7 text-primary-foreground" />
                </motion.div>
                <div>
                  <h4 className="text-2xl font-bold gradient-text">StorySpark</h4>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-0.5 bg-gradient-to-r from-primary to-primary-light rounded-full"
                  />
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                A plataforma de IA mais avançada para criar copy que converte. 
                Transforme seu marketing digital e <strong className="text-primary">multiplique suas vendas</strong> em poucos cliques.
              </p>

              <div className="space-y-3">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <span>contato@storyspark.ai</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+55 (11) 99999-9999</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>São Paulo, Brasil</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" />
                Links Rápidos
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group"
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.querySelector(link.href);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <ArrowUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Legal
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group"
                    >
                      <ArrowUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 hover:border-primary/40 transition-all duration-300 group"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                    className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mb-3"
                  >
                    <achievement.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h5 className="font-semibold text-foreground mb-1">
                    {achievement.title}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <Heart className="w-12 h-12 text-primary fill-primary" />
            </motion.div>
            
            <h4 className="text-xl font-semibold mb-4">
              Siga-nos nas <span className="gradient-text">redes sociais</span>
            </h4>
            <p className="text-muted-foreground mb-8">
              Conteúdo exclusivo, dicas de copywriting e bastidores do StorySpark
            </p>

            <div className="flex justify-center items-center gap-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.2,
                    y: -5
                  }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative group p-3 rounded-xl border border-primary/20 bg-primary/5 ${social.color} transition-all duration-300 hover:border-primary/40 hover:bg-primary/10`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-6 h-6" />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {social.followers} seguidores
                  </motion.div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="border-t border-primary/10 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© 2024 StorySpark. Feito com</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-primary fill-primary" />
              </motion.div>
              <span>para revolucionar seu marketing.</span>
            </div>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
            >
              <span className="text-sm font-medium">Voltar ao topo</span>
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowUp className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-8 p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl border border-primary/10"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-primary">
                Transforme seu marketing agora mesmo!
              </span>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
              >
                <Crown className="w-5 h-5 text-primary" />
              </motion.div>
            </div>
            <p className="text-xs text-muted-foreground">
              Junte-se a +2.500 empreendedores que já estão revolucionando suas vendas com StorySpark
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}