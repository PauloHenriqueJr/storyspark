import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, Users, BarChart3, Palette, Globe } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'IA Avançada',
    description: 'Geração de conteúdo com GPT-4 e Gemini, adaptado para sua marca e audiência.',
    badge: 'AI-Powered'
  },
  {
    icon: Zap,
    title: 'Criação Rápida',
    description: 'Crie posts, campanhas e conteúdo para múltiplas plataformas em segundos.',
    badge: 'Produtividade'
  },
  {
    icon: Users,
    title: 'Colaboração',
    description: 'Trabalhe em equipe com workspaces compartilhados e aprovações de conteúdo.',
    badge: 'Equipe'
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Acompanhe performance e otimize suas campanhas com métricas detalhadas.',
    badge: 'Insights'
  },
  {
    icon: Palette,
    title: 'Brand Voice',
    description: 'Mantenha consistência com vozes de marca personalizadas para cada cliente.',
    badge: 'Branding'
  },
  {
    icon: Globe,
    title: 'Multi-Plataforma',
    description: 'Publique diretamente no Instagram, LinkedIn, Facebook e outras redes sociais.',
    badge: 'Integração'
  }
];

export const FeaturesSection = () => {
  return (
    <section id="recursos" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Recursos Principais
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Tudo que você precisa para criar
            <span className="bg-gradient-primary bg-clip-text text-transparent"> conteúdo incrível</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ferramentas poderosas de IA combinadas com workflow inteligente para maximizar sua produtividade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};