import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';

export const communicationConfigs: Record<string, any> = {
  '/push-whatsapp': {
    title: 'Copy para Push/WhatsApp',
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-green-600 to-emerald-600',
    description: 'Mensagens diretas que convertem',
    suggestions: [
      'Mensagem de promoção WhatsApp',
      'Notificação push urgente',
      'Sequência de follow-up'
    ],
    defaultPlatform: 'WhatsApp',
    defaultType: 'Mensagem',
    targetPage: '/push-whatsapp'
  },
  '/call-scripts': {
    title: 'Copy para Call Scripts',
    icon: Phone,
    color: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    description: 'Scripts inteligentes para ligações',
    suggestions: [
      'Script de prospecção',
      'Script de follow-up',
      'Script de objeções'
    ],
    defaultPlatform: 'Phone',
    defaultType: 'Script',
    targetPage: '/call-scripts'
  },
  '/feedback': {
    title: 'Copy para Feedback',
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    description: 'Copy para coletar e responder feedback',
    suggestions: [
      'Copy para solicitar feedback',
      'Copy para agradecer feedback',
      'Copy para implementar sugestões'
    ],
    defaultPlatform: 'Email',
    defaultType: 'Feedback',
    targetPage: '/feedback'
  }
};