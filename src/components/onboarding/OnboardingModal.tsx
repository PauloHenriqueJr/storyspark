import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Bot, 
  Target, 
  Calendar, 
  BarChart3, 
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Zap
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao StorySpark! 🎉',
    description: 'Sua plataforma de IA para criar copies que vendem',
    icon: Sparkles,
    content: (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Transforme ideias em campanhas incríveis</h3>
          <p className="text-muted-foreground">
            Com IA avançada, você vai criar copies persuasivas em minutos, 
            não em horas. Vamos começar sua jornada!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'composer',
    title: 'Composer - Sua IA Criativa',
    description: 'Gere copies otimizadas com poucos cliques',
    icon: Bot,
    content: (
      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Bot className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-semibold">IA Specialist</h4>
              <p className="text-sm text-muted-foreground">Assistente especializado em copy</p>
            </div>
          </div>
          <p className="text-sm">
            "Crie um anúncio para Instagram sobre curso de marketing digital, 
            público-alvo: empreendedores de 25-40 anos"
          </p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">
            A IA analisa seu briefing e gera múltiplas variações de copy, 
            otimizadas para cada plataforma e público.
          </p>
        </div>
      </div>
    ),
    action: {
      label: 'Testar Composer',
      href: '/composer'
    }
  },
  {
    id: 'campaigns',
    title: 'Campanhas Organizadas',
    description: 'Gerencie todos os seus projetos em um só lugar',
    icon: Target,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Black Friday</span>
            </div>
            <div className="text-xs text-muted-foreground">12 copies • 3 plataformas</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Lançamento</span>
            </div>
            <div className="text-xs text-muted-foreground">8 copies • 2 plataformas</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Organize suas campanhas por projeto, acompanhe performance 
          e mantenha tudo sincronizado.
        </p>
      </div>
    ),
    action: {
      label: 'Ver Campanhas',
      href: '/campaigns'
    }
  },
  {
    id: 'analytics',
    title: 'Analytics Inteligentes',
    description: 'Dados que realmente importam para otimizar resultados',
    icon: BarChart3,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-green-600">+156%</div>
            <div className="text-xs text-muted-foreground">ROI Médio</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">8.2%</div>
            <div className="text-xs text-muted-foreground">CTR</div>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">143K</div>
            <div className="text-xs text-muted-foreground">Alcance</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Acompanhe métricas em tempo real e descubra quais copies 
          geram mais conversões.
        </p>
      </div>
    ),
    action: {
      label: 'Ver Analytics',
      href: '/analytics'
    }
  },
  {
    id: 'ready',
    title: 'Pronto para começar! 🚀',
    description: 'Sua conta está configurada e pronta para usar',
    icon: CheckCircle,
    content: (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Tudo pronto!</h3>
          <p className="text-muted-foreground">
            Agora você pode criar copies incríveis, gerenciar campanhas 
            e acompanhar resultados. Que tal começar criando sua primeira copy?
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-muted/50 rounded">
            <strong>📝 Composer</strong><br/>
            Crie copies com IA
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <strong>🎯 Campanhas</strong><br/>
            Organize projetos
          </div>
        </div>
      </div>
    ),
    action: {
      label: 'Criar primeira copy',
      href: '/composer'
    }
  }
];

export const OnboardingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Verifica se o onboarding já foi completado
    const completed = localStorage.getItem('onboarding-completed');
    const isInApp = window.location.pathname.startsWith('/dashboard') || 
                    window.location.pathname.startsWith('/composer') ||
                    window.location.pathname.startsWith('/campaigns') ||
                    window.location.pathname.startsWith('/analytics');
    
    if (!completed && isInApp) {
      // Delay para mostrar após o carregamento da página, mas apenas dentro da plataforma
      setTimeout(() => setIsOpen(true), 2000);
    } else {
      setIsCompleted(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setIsCompleted(true);
    setIsOpen(false);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleAction = (href: string) => {
    handleComplete();
    window.location.href = href;
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const step = onboardingSteps[currentStep];

  if (isCompleted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <step.icon className="w-6 h-6 text-primary" />
              <div>
                <DialogTitle>{step.title}</DialogTitle>
                <DialogDescription>{step.description}</DialogDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1} de {onboardingSteps.length}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[200px] flex items-center justify-center"
            >
              {step.content}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
              <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                Pular tutorial
              </Button>
            </div>

            <div className="flex gap-2">
              {step.action && (
                <Button
                  variant="outline"
                  onClick={() => handleAction(step.action!.href)}
                >
                  {step.action.label}
                </Button>
              )}
              <Button onClick={handleNext}>
                {currentStep === onboardingSteps.length - 1 ? (
                  'Finalizar'
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};