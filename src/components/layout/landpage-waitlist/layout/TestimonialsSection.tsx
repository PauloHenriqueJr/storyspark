import React from 'react';
import TestimonialsGrid from '@/components/layout/landpage-waitlist/TestimonialsGrid';
import { motion } from 'framer-motion';

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 bg-background/0">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">O que early testers estão dizendo</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">Depoimentos reais de usuários que testaram nossa ferramenta — selecionados e aprovados pelo time.</p>
          <div className="max-w-5xl mx-auto">
            <TestimonialsGrid />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
