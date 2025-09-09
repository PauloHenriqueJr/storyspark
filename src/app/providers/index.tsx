import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

// Create Query Client with optimized settings
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error) => {
                // Don't retry on 4xx errors
                if (error instanceof Error) {
                    // Verificar se é um erro HTTP com status 4xx
                    const httpError = error as any;
                    if (httpError.status >= 400 && httpError.status < 500) {
                        return false;
                    }
                    // Verificar padrão de mensagem mais específico
                    if (/\b4\d{2}\b/.test(error.message)) {
                        return false;
                    }
                }
                return failureCount < 3;
            },
        },
    },
});

interface AppProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="storyspark-theme">
                <AuthProvider>
                    {children}
                    <Toaster />
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider >
    );
}
