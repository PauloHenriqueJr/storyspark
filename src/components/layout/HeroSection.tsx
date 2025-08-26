import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, Play, Users, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import appDark from '@/assets/app-dark.png';
import appLight from '@/assets/app-light.png';
import { waitlistService } from '@/services/waitlistService';
import { useToast } from '@/hooks/use-toast';

const stats = [
  { icon: Users, value: '2.500+', label: 'Profissionais confiam' },
  { icon: Zap, value: '10x', label: 'Mais rápido' },
  { icon: TrendingUp, value: '156%', label: 'ROI de conteúdo' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const HeroSection = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  
  // Determina qual imagem usar baseada no tema
  // Modo escuro = imagem clara, modo claro = imagem escura
  const getCurrentImage = () => {
    if (theme === 'dark') {
      return appLight; // imagem clara no tema escuro
    } else if (theme === 'light') {
      return appDark; // imagem escura no tema claro  
    } else {
      // Modo system - detecta preferência do sistema
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDarkMode ? appLight : appDark;
    }
  };

  return (
    <main className="relative overflow-hidden bg-gradient-hero">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />
      <div className="absolute top-0 right-0 h-96 w-96 bg-muted/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 h-64 w-64 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-32 lg:pt-48">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Hero heading */}
            <motion.div variants={fadeInUp}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground font-medium">✨ Acabe com a página em branco para sempre</span>
              </div>
            </motion.div>

            <motion.h1 
              className="text-balance text-5xl font-bold md:text-6xl lg:text-7xl"
              variants={fadeInUp}
            >
              Crie copies que{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                vendem
              </span>{' '}
              em minutos
            </motion.h1>

            <motion.p 
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
              variants={fadeInUp}
            >
              Dialeto usa IA para criar posts, e-mails, anúncios e landing pages 
              com o seu tom de voz, integrado às suas ferramentas favoritas.
            </motion.p>

            {/* CTA Form */}
            <motion.div className="mt-12" variants={fadeInUp}>
              <form
                className="mx-auto max-w-md"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (isSubmitting || submitted) return;
                  setIsSubmitting(true);
                  try {
                    await waitlistService.join(email);
                    toast({ title: 'Inscrição realizada', description: 'Você entrou na lista de espera!' });
                    setSubmitted(true);
                  } catch (err) {
                    toast({
                      title: 'Erro ao inscrever',
                      description: 'Tente novamente mais tarde.',
                      variant: 'destructive',
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <div className="relative grid grid-cols-[1fr_auto] items-center rounded-2xl border border-border bg-card pr-2 shadow-elegant">
                  <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto h-5 w-5 text-muted-foreground" />

                  <input
                    placeholder="Seu melhor email"
                    className="h-14 w-full bg-transparent pl-12 pr-4 text-base focus:outline-none"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting || submitted}
                    required
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-primary hover:shadow-glow h-10 px-6"
                    disabled={isSubmitting || submitted}
                  >
                    <span className="hidden md:block">
                      {submitted ? 'Enviado' : 'Entrar na lista'}
                    </span>
                    <Send className="h-5 w-5 md:hidden" />
                  </Button>
                </div>
              </form>

              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/billing">Ver planos</Link>
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                ✨ Teste grátis agora • Veja a IA em ação
              </p>
            </motion.div>

            {/* Demo Actions */}
            <motion.div 
              className="mt-16 flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow" asChild>
                <Link to="/dashboard">Demo Interativo</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/auth">Começar Demo</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3"
              variants={fadeInUp}
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <stat.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div 
              className="relative mt-24"
              variants={fadeInUp}
            >
              <div className="relative mx-auto max-w-4xl">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-radial opacity-20" />
                
                {/* Main mockup */}
                <div className="relative rounded-2xl border border-border bg-card p-2 shadow-elegant">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={getCurrentImage()}
                      alt="Dashboard do Dialeto"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-4 -left-4 rounded-xl border border-border bg-card p-4 shadow-elegant"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-glow-pulse" />
                    <span className="text-sm font-medium">IA Ativa</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute -bottom-4 -right-4 rounded-xl border border-border bg-card p-4 shadow-elegant"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <div className="flex items-center gap-3">
                    <Play className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Demo Interativa</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};