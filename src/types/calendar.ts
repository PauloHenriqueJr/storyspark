import React from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  platform: string;
  time: string;
  date: Date;
  status: 'Agendado' | 'Publicado' | 'Rascunho';
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}