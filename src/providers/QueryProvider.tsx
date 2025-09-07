import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configuração otimizada do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos
      staleTime: 5 * 60 * 1000,
      // Manter cache por 10 minutos quando não usado
      cacheTime: 10 * 60 * 1000,
      // Retry automático em caso de falha
      retry: 2,
      // Refetch quando a janela fica em foco
      refetchOnWindowFocus: false,
      // Refetch quando reconecta
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry em mutações críticas
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools apenas em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

// Exportar o queryClient para usar em outras partes da aplicação
export { queryClient };
