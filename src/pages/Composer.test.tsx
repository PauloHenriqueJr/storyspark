import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import Composer from './Composer';
import * as copiesServiceModule from '@/services/copiesService';
import { useWorkspace } from '@/hooks/useWorkspace';

vi.mock('@/services/copiesService');
vi.mock('@/hooks/useWorkspace');

const mockUseWorkspace = useWorkspace as vi.Mock;
mockUseWorkspace.mockReturnValue({
    workspace: { id: 'test-ws', credits: 100, credits_used: 90 },
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

describe('Composer', () => {
    const mockCreate = vi.spyOn(copiesServiceModule, 'copiesService', 'get').mockReturnValue({
        create: vi.fn().mockResolvedValue({ id: 'test-copy' }),
    });

    it('deve renderizar Composer e gerar copy deduzindo crédito', async () => {
        renderWithAuthProvider(<Composer />);

        // Simular input de prompt
        const promptInput = screen.getByPlaceholderText('Digite seu prompt aqui...');
        fireEvent.change(promptInput, { target: { value: 'Gerar copy teste' } });

        // Simular click em gerar
        const generateButton = screen.getByText('Gerar Copy');
        fireEvent.click(generateButton);

        await waitFor(() => {
            expect(mockCreate().create).toHaveBeenCalledWith('test-user', 'test-ws', {
                content: 'Gerar copy teste',
                // outros params...
            });
        });
    });

    it('deve mostrar upsell quando low credits', async () => {
        // Mock low credits
        mockUseWorkspace.mockReturnValue({
            workspace: { id: 'test-ws', credits: 100, credits_used: 85 }, // 15%
            user: { id: 'test-user' },
            loading: false,
        });

        renderWithAuthProvider(<Composer />);

        await waitFor(() => {
            expect(screen.getByText('Créditos baixos! Upgrade para mais.')).toBeInTheDocument();
        });
    });
});