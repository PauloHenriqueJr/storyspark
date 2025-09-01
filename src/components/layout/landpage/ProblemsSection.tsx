import React from 'react';
import { motion } from 'framer-motion';
import { Clock, RefreshCw, MessageSquare, Users } from 'lucide-react';

const problems = [
  {
    icon: Clock,
    title: 'Horas perdidas com a página em branco',
    description: 'Bloqueio criativo sob pressão de prazos apertados'
  },
  {
    icon: RefreshCw,
    title: 'Retrabalho infinito entre plataformas',
    description: 'Adaptar o mesmo conteúdo para diferentes canais manualmente'
  },
  {
    icon: MessageSquare,
    title: 'Inconsistência na comunicação',
    description: 'Tom de voz diferente a cada publicação'
  },
  {
    icon: Users,
    title: 'Dificuldade para personalizar por público',
    description: 'Criar mensagens específicas para cada persona'
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
      staggerChildren: 0.1
    }
  }
};

export const ProblemsSection = () => {
  return (
    <section className="py-24 bg-muted/50">
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
            Você está perdendo vendas por causa disso
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Enquanto você luta contra o bloqueio criativo e refaz o mesmo conteúdo 
            para diferentes canais, seus concorrentes já estão publicando, testando e otimizando.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {problems.map((problem, index) => (
            <motion.div 
              key={index}
              className="bg-card rounded-2xl p-8 border border-border shadow-elegant"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <problem.icon className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center bg-card rounded-2xl p-12 border border-border shadow-elegant"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4 text-destructive">
            O resultado? Stress, burnout e performance em queda
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            Cada dia que passa é uma oportunidade perdida. Enquanto você gasta tempo 
            criando conteúdo manualmente, poderia estar focando no que realmente importa: estratégia e resultados.
          </p>
          <div className="text-xl font-semibold">
            <span className="text-primary">A solução é simples:</span>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              IA que aprende seu tom de voz
            </span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              Publicação direta nas plataformas
            </span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              Fluxo unificado: briefing → publicação
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};