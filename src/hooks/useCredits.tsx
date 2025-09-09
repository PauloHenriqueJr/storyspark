import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditsService } from '@/services/creditsService';
import { useAuth } from '@/components/auth/AuthProvider';

interface CreditsInfo {
    currentCredits: number;
    isUnlimited: boolean;
    plan: string;
    role: string;
    monthlyTokensUsed: number;
    totalTokensUsed: number;
}

export function useCredits() {
    const { user } = useAuth();
    const [creditsInfo, setCreditsInfo] = useState<CreditsInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshCreditsInfo = async () => {
        if (!user) {
            setCreditsInfo(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const info = await CreditsService.getCreditsInfo(user.id);
            setCreditsInfo(info);
        } catch (err) {
            console.error('Erro ao carregar informações de créditos:', err);
            setError(err instanceof Error ? err.message : 'Erro ao carregar créditos');
        } finally {
            setLoading(false);
        }
    };

    const checkCreditsAvailable = async () => {
        if (!user) return { success: false, error: 'Usuário não autenticado' };

        return await CreditsService.checkCreditsAvailable(user.id);
    };

    const consumeCredit = async (tokensUsedForLogging: number = 0) => {
        if (!user) return { success: false, error: 'Usuário não autenticado' };

        const result = await CreditsService.consumeCredit(user.id, tokensUsedForLogging);

        // Atualizar o estado local se foi bem-sucedido
        if (result.success) {
            await refreshCreditsInfo();
        }

        return result;
    };

    const addCredits = async (creditsToAdd: number, reason: string = 'Manual') => {
        if (!user) return { success: false, error: 'Usuário não autenticado' };

        const result = await CreditsService.addCredits(user.id, creditsToAdd, reason);

        // Atualizar o estado local se foi bem-sucedido
        if (result.success) {
            await refreshCreditsInfo();
        }

        return result;
    };

    useEffect(() => {
        refreshCreditsInfo();
    }, [user]);

    // Realtime subscription for credits changes
    useEffect(() => {
        if (!user) return;

        const subscription = supabase
            .channel('credits_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`
                },
                (payload: any) => {
                    console.log('Credits changed:', payload);
                    refreshCreditsInfo();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [user, refreshCreditsInfo]);

    return {
        creditsInfo,
        loading,
        error,
        refreshCreditsInfo,
        checkCreditsAvailable,
        consumeCredit,
        addCredits,

        // Computed values for easy access
        hasUnlimitedCredits: creditsInfo?.isUnlimited || false,
        currentCredits: creditsInfo?.currentCredits || 0,
        isLowOnCredits: creditsInfo ? creditsInfo.currentCredits <= 5 && !creditsInfo.isUnlimited : false,
        isOutOfCredits: creditsInfo ? creditsInfo.currentCredits <= 0 && !creditsInfo.isUnlimited : false,
    };
}
