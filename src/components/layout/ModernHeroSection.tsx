import React from 'react';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const ModernHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial opacity-20" />
      
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Announcement badge */}
        <motion.div variants={fadeInUp} className="mb-8">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            <Star className="w-4 h-4 mr-2 text-primary" />
            Novo: Suporte para AI Models
          </Badge>
        </motion.div>

        {/* Main heading */}
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          variants={fadeInUp}
        >
          Modern Solutions for{' '}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Customer Engagement
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
          variants={fadeInUp}
        >
          Highly customizable components for building modern websites and applications 
          that look and feel the way you mean it.
        </motion.p>

        {/* CTA buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          variants={fadeInUp}
        >
          <Button size="lg" className="bg-gradient-primary hover:shadow-glow">
            Start Building
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button size="lg" variant="outline">
            Request a demo
          </Button>
        </motion.div>

        {/* Features list */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
          variants={fadeInUp}
        >
          {[
            'Customizable components',
            'Modern design system', 
            'Full TypeScript support'
          ].map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              {feature}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};