import React from 'react';
import { Zap, Globe, TestTube, Lightbulb } from 'lucide-react';

export const otherConfigs: Record<string, any> = {
  '/ads': {
    title: 'Copy para Anúncios',
    icon: Zap,
    color: 'bg-orange-600',
    description: 'Anúncios que destacam os melhores do seu negócio',
    suggestions: [
      'Anúncio Google',
      'Anúncio Facebook',
      'Anúncio Instagram'
    ],
    defaultPlatform: 'Google Ads',
    defaultType: 'Anúncio',
    targetPage: '/ads'
  },
  '/webpages': {
    title: 'Copy para Páginas Web',
    icon: Globe,
    color: 'bg-sky-600',
    description: 'Páginas que levam conversas em sua plataforma',
    suggestions: [
      'Landing page de lead generation',
      'Página de contato',
      'Página de produto ou serviço'
    ],
    targetPage: '/webpages'
  },
  '/ab-tests': {
    title: 'Copy para A/B Tests',
    icon: TestTube,
    color: 'bg-gradient-to-r from-indigo-600 to-blue-600',
    description: 'Copy otimizada para testes A/B',
    suggestions: [
      'Copy para variação A',
      'Copy para variação B',
      'Copy para hipótese de teste'
    ],
    defaultPlatform: 'Web',
    defaultType: 'A/B Test',
    targetPage: '/ab-tests'
  },
  'default': {
    title: 'Criar Copy com IA',
    icon: Lightbulb,
    color: 'bg-gradient-to-r from-purple-600 to-blue-600',
    description: 'Copy personalizada para qualquer necessidade',
    suggestions: [
      'Copy para redes sociais',
      'E-mail marketing',
      'Landing page'
    ],
    targetPage: '/composer'
  }
};