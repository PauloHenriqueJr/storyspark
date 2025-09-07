import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

// Mock do service
vi.mock('@/services/copiesService', () => {
  const items = [
    {
      id: '1',
      created_at: new Date('2025-09-07T12:00:00Z').toISOString(),
      user_id: 'u1',
      workspace_id: 'w1',
      title: 'Post de lançamento',
      content: 'Conteúdo de teste para o histórico',
      platform: 'instagram',
      copy_type: 'post',
      tokens_input: 10,
      tokens_output: 50,
      cost_usd: 0.0025,
      metadata: {},
    },
  ];
  return {
    copiesService: {
      list: vi.fn().mockResolvedValue({ items, total: items.length }),
    },
  };
});

// Mock de ícones/lazy que não impactam
vi.mock('lucide-react', () => ({ History: () => <div data-testid="icon" /> }));

import CopiesHistory from '../CopiesHistory';

describe('CopiesHistory page', () => {
  it('renderiza uma linha com dados retornados do service', async () => {
    render(<CopiesHistory />);

    // Título da página
    expect(await screen.findByText(/Histórico de Copies/i)).toBeInTheDocument();

    // Deve aparecer o título da copy mockada
    await waitFor(() => {
      expect(screen.getByText(/Post de lançamento/i)).toBeInTheDocument();
    });

    // Não deve mostrar mensagem de vazio
    expect(screen.queryByText(/Nenhum resultado/i)).not.toBeInTheDocument();
  });
});
