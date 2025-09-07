import React from 'react';
import { Calendar, BarChart3, Users } from 'lucide-react';

export const calendarAndAnalyticsConfigs: Record<string, any> = {
  '/calendar': {
    title: 'Copy para Eventos do Calendário',
    icon: Calendar,
    color: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    description: 'Gerar copy para eventos agendados ou criar novos',
    suggestions: [
      'Post para evento agendado',
      'Anúncio de lançamento',
      'Stories promocional'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/calendar'
  },
  '/analytics': {
    title: 'Copy para Analytics',
    icon: BarChart3,
    color: 'bg-gradient-to-r from-slate-600 to-gray-600',
    description: 'Copy baseada em dados e insights',
    suggestions: [
      'Copy sobre métricas de sucesso',
      'Copy sobre otimizações',
      'Copy sobre resultados'
    ],
    defaultPlatform: 'LinkedIn',
    defaultType: 'Post Orgânico',
    targetPage: '/analytics'
  },
  '/crm': {
    title: 'Copy para CRM',
    icon: Users,
    color: 'bg-gradient-to-r from-emerald-600 to-green-600',
    description: 'Copy para relacionamento com clientes',
    suggestions: [
      'Copy de follow-up com leads',
      'Copy de reativação',
      'Copy de agradecimento'
    ],
    defaultPlatform: 'Email',
    defaultType: 'Follow-up',
    targetPage: '/crm'
  },
  '/content-library': {
    title: 'Copy para Content Library',
    icon: BarChart3,
    color: 'bg-gradient-to-r from-amber-600 to-orange-600',
    description: 'Copy para organizar e promover conteúdo',
    suggestions: [
      'Copy para descrição de assets',
      'Copy para promoção de conteúdo',
      'Copy para categorização'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/content-library'
  }
};