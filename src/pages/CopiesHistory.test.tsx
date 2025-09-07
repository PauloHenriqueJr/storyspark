import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Para toBeInTheDocument
import { MemoryRouter } from 'react-router-dom';
import CopiesHistory from './CopiesHistory';
import * as copiesServiceModule from '@/services/copiesService';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useWorkspace } from '@/hooks/useWorkspace';
import { AuthProvider } from '@/components/auth/AuthProvider';

vi.mock('@/services/copiesService');
vi.mock('@/hooks/useFeatureFlags');
vi.mock('@/hooks/useWorkspace');

const mockUseFeatureFlags = useFeatureFlags as vi.Mock;
mockUseFeatureFlags.mockReturnValue({
    isFlagEnabled: vi.fn(() => true),
});

const mockUseWorkspace = useWorkspace as vi.Mock;
mockUseWorkspace.mockReturnValue({
    workspace: { id: 'test-ws' },
    user: { id: 'test-user' },
    loading: false,
});

const mockAuthProviderValue = {
    user: { id: 'test-user', email: 'test@example.com' },
};

const renderWithAuthProvider = (component: React.ReactElement) => {
    return render(
        <AuthProvider value={mockAuthProviderValue}>
            <MemoryRouter>
                {component}
            </MemoryRouter>
        </AuthProvider>
    );
};

describe('CopiesHistory', () => {
    const mockList = vi.spyOn(copiesServiceModule, 'copiesService', 'get').mockReturnValue({
        list: vi.fn().mockResolvedValue({
            items: [],
            total: 0,
        }),
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockList.mockReturnValue({
            list: vi.fn().mockResolvedValue({ items: [], total: 0 }),
        });
    });

    it('deve renderizar o componente corretamente', async () => {
        renderWithAuthProvider(<CopiesHistory />);

        await waitFor(() => {
            expect(screen.getByText('Histórico de Copies')).toBeInTheDocument();
            expect(screen.getByText('Busque, filtre e exporte as copies já geradas pela IA.')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Buscar por título ou conteúdo...')).toBeInTheDocument();
        });
    });

    it('deve mostrar mensagem quando não há resultados', async () => {
        renderWithAuthProvider(<CopiesHistory />);

        await waitFor(() => {
            expect(screen.getByText('Nenhum resultado')).toBeInTheDocument();
        });
    });

    it('deve chamar list ao renderizar com workspace_id', async () => {
        const mockResolvedValue = { items: [], total: 0 };
        mockList.mockReturnValue({
            list: vi.fn().mockResolvedValue(mockResolvedValue),
        });

        renderWithAuthProvider(<CopiesHistory />);

        await waitFor(() => {
            expect(mockList().list).toHaveBeenCalledWith(expect.objectContaining({
                workspace_id: 'test-ws',
                page: 1,
                pageSize: 20,
            }));
        });
    });

    it('deve filtrar ao submeter form de busca', async () => {
        const mockQ = 'test search';
        const mockResolvedValue = {
            items: [{ id: '1', title: 'Test', content: 'Test content', created_at: '2023-01-01', user_id: 'u1', workspace_id: 'test-ws' }],
            total: 1
        };

        mockList.mockReturnValue({
            list: vi.fn().mockResolvedValue(mockResolvedValue),
        });

        renderWithAuthProvider(<CopiesHistory />);

        const searchInput = screen.getByPlaceholderText('Buscar por título ou conteúdo...');
        fireEvent.change(searchInput, { target: { value: mockQ } });
        fireEvent.submit(searchInput.closest('form')!);

        await waitFor(() => {
            expect(mockList().list).toHaveBeenCalledWith(expect.objectContaining({
                q: mockQ,
                page: 1,
                workspace_id: 'test-ws',
            }));
            expect(screen.getByText('Test')).toBeInTheDocument();
        });
    });
});
