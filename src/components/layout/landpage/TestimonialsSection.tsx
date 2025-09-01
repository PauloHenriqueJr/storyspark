import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ana Silva',
    role: 'Marketing Manager',
    company: 'TechStart',
    content: 'O StorySpark revolucionou nossa criação de conteúdo. Conseguimos produzir 10x mais posts mantendo a qualidade e consistência da nossa marca.',
    rating: 5,
    avatar: '/placeholder.svg'
  },
  {
    name: 'Carlos Mendes',
    role: 'CEO',
    company: 'Agência Digital+',
    content: 'Com o StorySpark, nossa agência conseguiu atender mais clientes sem perder a qualidade. A IA entende perfeitamente o tom de cada marca.',
    rating: 5,
    avatar: '/placeholder.svg'
  },
  {
    name: 'Mariana Costa',
    role: 'Social Media',
    company: 'E-commerce Pro',
    content: 'Antes levava horas para criar uma campanha completa. Agora, com o StorySpark, faço isso em minutos. Incrível como a IA captura nossa voz!',
    rating: 5,
    avatar: '/placeholder.svg'
  }
];

export const TestimonialsSection = () => {
  return (
    <section id="cases" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Depoimentos
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            O que nossos clientes
            <span className="bg-gradient-primary bg-clip-text text-transparent"> estão dizendo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mais de 1.000 empresas já transformaram sua criação de conteúdo com o StorySpark.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <Quote className="h-8 w-8 text-primary mb-4 opacity-50" />
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-8 text-muted-foreground">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">1000+</p>
              <p className="text-sm">Empresas Ativas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">50M+</p>
              <p className="text-sm">Conteúdos Gerados</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">99%</p>
              <p className="text-sm">Satisfação</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};