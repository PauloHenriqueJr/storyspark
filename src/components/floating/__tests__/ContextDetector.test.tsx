import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContextDetector from '../ContextDetector';

describe('ContextDetector', () => {
  it('deve detectar o contexto correto para /personas', () => {
    const mockOnContextChange = jest.fn();
    
    render(
      <MemoryRouter initialEntries={['/personas']}>
        <ContextDetector onContextChange={mockOnContextChange} />
      </MemoryRouter>
    );
    
    expect(mockOnContextChange).toHaveBeenCalledWith({
      title: 'Copy para Personas',
      icon: expect.any(Function),
      color: 'bg-purple-600',
      description: 'Copy direcionada para personas específicas',
      suggestions: [
        'Copy para persona empreendedor',
        'Copy para persona profissional',
        'Copy para persona estudante'
      ],
      defaultPlatform: 'Instagram',
      defaultType: 'Post Orgânico',
      targetPage: '/personas'
    });
  });
  
  it('deve usar o contexto padrão para rotas desconhecidas', () => {
    const mockOnContextChange = jest.fn();
    
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <ContextDetector onContextChange={mockOnContextChange} />
      </MemoryRouter>
    );
    
    expect(mockOnContextChange).toHaveBeenCalledWith({
      title: 'Criar Copy com IA',
      icon: expect.any(Function),
      color: 'bg-gradient-to-r from-purple-600 to-blue-600',
      description: 'Copy personalizada para qualquer necessidade',
      suggestions: [
        'Copy para redes sociais',
        'E-mail marketing',
        'Landing page'
      ],
      targetPage: '/composer'
    });
  });
});