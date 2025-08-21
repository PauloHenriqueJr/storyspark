import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.1),transparent)]" />
          
          <div className="relative text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Pronto para revolucionar
              <br />
              sua criação de conteúdo?
            </h2>

            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de criadores e empresas que já transformaram 
              sua produtividade com nossa plataforma de IA.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 shadow-elegant"
              >
                <Link to="/register" className="group">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button 
                asChild
                variant="ghost"
                size="lg"
                className="text-primary-foreground hover:bg-white/10"
              >
                <Link to="/feedback">
                  Agendar Demo
                </Link>
              </Button>
            </div>

            <p className="text-primary-foreground/70 text-sm mt-6">
              ✨ 7 dias grátis • Sem cartão de crédito • Suporte em português
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-8 left-8 h-20 w-20 rounded-full bg-white/10 blur-xl" />
          <div className="absolute bottom-8 right-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        </div>
      </div>
    </section>
  );
};