import { useState, useEffect } from 'react';
import { TokensService } from '@/services/tokensService';
import { useAuth } from '@/components/auth/AuthProvider';

interface TokensUsage {
    monthlyUsed: number;
    monthlyLimit: number | null;
    totalUsed: number;
    remainingTokens: number | null;
    usagePercentage: number;
    isUnlimited: boolean;
    plan: string;
    role: string;
}

export function useTokens() {
    const { user } = useAuth();
    const [tokensUsage, setTokensUsage] = useState<TokensUsage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshTokensUsage = async () => {
        if (!user) {
            setTokensUsage(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const usage = await TokensService.getTokensUsage(user.id);
            setTokensUsage(usage);
        } catch (err) {
            console.error('Erro ao carregar uso de tokens:', err);
            setError(err instanceof Error ? err.message : 'Erro ao carregar tokens');
        } finally {
            setLoading(false);
        }
    };

    const checkTokensAvailable = async (tokensNeeded: number = 0) => {
        if (!user) return { success: false, error: 'Usuário não autenticado' };

        return await TokensService.checkTokensAvailable(user.id, tokensNeeded);
    };

    const consumeTokens = async (tokensUsed: number) => {
        if (!user) return { success: false, error: 'Usuário não autenticado' };

        const result = await TokensService.consumeTokens(user.id, tokensUsed);

        // Atualizar o estado local se foi bem-sucedido
        if (result.success) {
            await refreshTokensUsage();
        }

        return result;
    };

    useEffect(() => {
        refreshTokensUsage();
    }, [user]);

    return {
        tokensUsage,
        loading,
        error,
        refreshTokensUsage,
        checkTokensAvailable,
        consumeTokens,

        // Computed values for easy access
        hasUnlimitedTokens: tokensUsage?.isUnlimited || false,
        isNearLimit: tokensUsage ? tokensUsage.usagePercentage > 80 : false,
        isOverLimit: tokensUsage ? tokensUsage.usagePercentage >= 100 : false,
        remainingTokens: tokensUsage?.remainingTokens || 0,
        usagePercentage: tokensUsage?.usagePercentage || 0,
    };
}
