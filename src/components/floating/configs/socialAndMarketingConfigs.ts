import React from 'react';
import { Wand2, Target, Mail, TrendingUp, FileText, Globe, Lightbulb } from 'lucide-react';

export const socialAndMarketingConfigs: Record<string, any> = {
  '/composer': {
    title: 'Composer - Criar Copy',
    icon: Wand2,
    color: 'bg-gradient-to-r from-green-600 to-teal-600',
    description: 'Criar copy personalizada com IA',
    suggestions: [
      'Copy para redes sociais',
      'E-mail promocional',
      'Anúncio persuasivo'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/composer'
  },
  '/campaigns': {
    title: 'Copy para Campanhas',
    icon: Target,
    color: 'bg-green-600',
    description: 'Copy focada em conversão para suas campanhas',
    suggestions: [
      'Campanha de Black Friday',
      'Lançamento de produto premium',
      'Campanha de retenção de clientes'
    ],
    defaultPlatform: 'Facebook',
    targetPage: '/campaigns'
  },
  '/email-marketing': {
    title: 'Copy para E-mail Marketing',
    icon: Mail,
    color: 'bg-purple-600',
    description: 'E-mails que convertem e engajam',
    suggestions: [
      'E-mail de boas-vindas',
      'E-mail de promoção',
      'E-mail de feedback'
    ],
    defaultPlatform: 'E-mail',
    targetPage: '/email-marketing'
  },
  '/social-media': {
    title: 'Copy para Mídias Sociais',
    icon: TrendingUp,
    color: 'bg-pink-600',
    description: 'Mídias Sociais que geram engajamento',
    suggestions: [
      'Post de Instagram',
      'Tópico do Twitter',
      'Story do Facebook'
    ],
    defaultPlatform: 'Instagram',
    targetPage: '/social-media'
  },
  '/social-scheduler': {
    title: 'Copy para Social Scheduler',
    icon: TrendingUp,
    color: 'bg-pink-600',
    description: 'Posts agendados que viralizam e engajam',
    suggestions: [
      'Post para Instagram Stories',
      'Carrossel educativo',
      'Post promocional agendado'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/social-scheduler'
  },
  '/templates': {
    title: 'Copy para Templates',
    icon: FileText,
    color: 'bg-blue-600',
    description: 'Crie copy otimizada para seus templates',
    suggestions: [
      'Template para lançamento de produto',
      'Template para promoção sazonal',
      'Template de engajamento'
    ],
    defaultType: 'Template',
    targetPage: '/templates'
  },
  '/landing-pages': {
    title: 'Copy para Landing Pages',
    icon: Globe,
    color: 'bg-gradient-to-r from-orange-600 to-red-600',
    description: 'Copy de alta conversão para landing pages',
    suggestions: [
      'Headline principal da landing page',
      'Copy do formulário de captura',
      'Copy dos benefícios do produto'
    ],
    defaultPlatform: 'Web',
    defaultType: 'Landing Page',
    targetPage: '/landing-pages'
  },
  '/funnels': {
    title: 'Copy para Funnels',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    description: 'Copy otimizada para cada etapa do funil',
    suggestions: [
      'Copy da página de entrada',
      'Copy do upsell',
      'Copy de fechamento'
    ],
    defaultPlatform: 'Web',
    defaultType: 'Funnel',
    targetPage: '/funnels'
  },
  '/ai-ideas': {
    title: 'Copy para AI Ideas',
    icon: Lightbulb,
    color: 'bg-gradient-to-r from-yellow-600 to-orange-600',
    description: 'Copy baseada em ideias geradas por IA',
    suggestions: [
      'Copy para headline de ideia',
      'Copy para desenvolvimento de conceito',
      'Copy para campanha baseada em ideia'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/ai-ideas'
  },
  '/trending-hooks': {
    title: 'Copy com Trending Hooks',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-red-600 to-pink-600',
    description: 'Copy usando hooks virais e tendências',
    suggestions: [
      'Copy com hook de transformação',
      'Copy com hook de contraste',
      'Copy com hook de experiência'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/trending-hooks'
  },
  '/hooks': {
    title: 'Copy com Hooks',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-red-600 to-pink-600',
    description: 'Copy usando hooks virais',
    suggestions: [
      'Copy com hook de transformação',
      'Copy com hook de contraste',
      'Copy com hook de experiência'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/hooks'
  }
};