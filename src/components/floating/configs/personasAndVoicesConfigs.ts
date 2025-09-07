import React from 'react';
import { Users, Mic } from 'lucide-react';

export const personasAndVoicesConfigs: Record<string, any> = {
  '/personas': {
    title: 'Copy para Personas',
    icon: Users,
    color: 'bg-gradient-to-r from-purple-600 to-pink-600',
    description: 'Copy direcionada para personas específicas',
    suggestions: [
      'Copy para persona empreendedor',
      'Copy para persona profissional',
      'Copy para persona estudante'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/personas'
  },
  '/brand-voices': {
    title: 'Copy com Brand Voice',
    icon: Mic,
    color: 'bg-gradient-to-r from-teal-600 to-cyan-600',
    description: 'Copy alinhada com sua marca',
    suggestions: [
      'Copy com tom profissional',
      'Copy com tom casual',
      'Copy com tom inspirador'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/brand-voices'
  },
  '/voices': {
    title: 'Copy com Voice Personalizada',
    icon: Mic,
    color: 'bg-gradient-to-r from-violet-600 to-purple-600',
    description: 'Copy usando suas voices personalizadas',
    suggestions: [
      'Copy com voice de especialista',
      'Copy com voice de mentor',
      'Copy com voice de amigo'
    ],
    defaultPlatform: 'Instagram',
    defaultType: 'Post Orgânico',
    targetPage: '/voices'
  }
};