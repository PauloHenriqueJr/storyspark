import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    icon: FileText,
    number: '1',
    title: 'Briefing Inteligente',
    description: 'Defina objetivo, público-alvo e tom de voz em poucos cliques',
    features: [
      'Templates pré-configurados por nicho',
      'Sugestões automáticas de personas',
      'Histórico de briefings salvos'
    ]
  },
  {
    icon: Sparkles,
    number: '2',
    title: 'Gerar + Refinar',
    description: 'IA cria múltiplas variações e você escolhe a melhor',
    features: [
      '10+ variações por solicitação',
      'Edição em tempo real',
      'Sugestões proativas da IA'
    ]
  },
  {
    icon: Send,
    number: '3',
    title: 'Publicar Direto',
    description: 'Publique nas suas plataformas ou exporte nos formatos que precisa',
    features: [
      'Integração com redes sociais',
      'Export PDF, DOCX, TXT, HTML',
      'Agendamento automático'
    ]
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-bold mb-6"
            variants={fadeInUp}
          >
            Como funciona em{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              3 passos simples
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Do briefing à publicação, tudo em um só lugar. Sem copiar e colar, sem trocar de ferramentas.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-2xl p-8 border border-border shadow-elegant relative"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                  <step.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-primary">{step.number}</div>
              </div>

              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground mb-6">{step.description}</p>

              <ul className="space-y-2">
                {step.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Connection line to next step */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-primary" />
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6">
            Pronto para testar? Comece agora mesmo, é grátis!
          </h3>
          <Button size="lg" className="bg-gradient-primary hover:shadow-glow">
            Experimentar gratuitamente
          </Button>
        </motion.div>
      </div>
    </section>
  );
};