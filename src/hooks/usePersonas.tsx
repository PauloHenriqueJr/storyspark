import { useState, useEffect } from 'react';
import { useWorkspace } from './useWorkspace';
import { personasService, type PersonaWithStats } from '@/services/personasService';
import type { Database } from '@/integrations/supabase/types';

type CreatePersonaInput = Database['public']['Tables']['target_personas']['Insert'];
type UpdatePersonaInput = Database['public']['Tables']['target_personas']['Update'];

interface ErrorWithCode {
  message?: string;
  code?: string;
  status?: string;
  error_description?: string;
}

export interface UsePersonasReturn {
  personas: PersonaWithStats[];
  loading: boolean;
  error: string | null;
  createPersona: (input: Omit<CreatePersonaInput, 'workspace_id' | 'user_id'>) => Promise<void>;
  updatePersona: (id: string, updates: UpdatePersonaInput) => Promise<void>;
  deletePersona: (id: string) => Promise<void>;
  duplicatePersona: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const usePersonas = (): UsePersonasReturn => {
  const [personas, setPersonas] = useState<PersonaWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { workspace, user } = useWorkspace();

  const fetchPersonas = async () => {
    if (!workspace?.id) {
      console.debug('Workspace ID não encontrado, aguardando...');
      setLoading(false);
      return;
    }
    
    if (!user?.id) {
      console.debug('Usuário não autenticado, aguardando...');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await personasService.getAll(workspace.id);
      setPersonas(data || []);
    } catch (err) {
      console.error('Erro ao carregar personas:', err);
      
      let errorMessage = 'Erro desconhecido';
      let errorCode = '';
      
      // Extrair informações do erro
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as ErrorWithCode;
        errorMessage = errorObj.message || errorObj.error_description || String(err);
        errorCode = errorObj.code || errorObj.status || '';
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Personalizar mensagens de erro específicas
      if (errorCode === 'PGRST301' || errorMessage.includes('row-level security')) {
        errorMessage = 'Acesso negado: você não tem permissão para acessar estes dados. Verifique se está logado corretamente.';
      } else if (errorCode === 'PGRST116') {
        errorMessage = 'Nenhuma persona encontrada.';
        setPersonas([]);
        setError(null);
        setLoading(false);
        return;
      } else if (errorMessage.includes('400') || errorCode === '400') {
        errorMessage = 'Erro na requisição: verifique sua autenticação e permissões.';
      } else if (errorMessage.includes('401') || errorCode === '401') {
        errorMessage = 'Não autenticado: faça login novamente.';
      } else if (errorMessage.includes('403') || errorCode === '403') {
        errorMessage = 'Acesso negado: você não tem permissão para acessar estes dados.';
      } else if (errorMessage.includes('404') || errorCode === '404') {
        errorMessage = 'Workspace não encontrado.';
      } else if (errorMessage.includes('500') || errorCode === '500') {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Erro de conexão: verifique sua internet e tente novamente.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createPersona = async (input: Omit<CreatePersonaInput, 'workspace_id' | 'user_id'>) => {
    if (!workspace?.id || !user?.id) {
      throw new Error('Workspace ou usuário não encontrado');
    }

    try {
      await personasService.create({
        ...input,
        workspace_id: workspace.id,
        user_id: user.id
      });
      
      // Refetch data after creation
      await fetchPersonas();
    } catch (err) {
      console.error('Erro ao criar persona:', err);
      throw err;
    }
  };

  const updatePersona = async (id: string, updates: UpdatePersonaInput) => {
    try {
      await personasService.update(id, updates);
      
      // Update local state optimistically
      setPersonas(prev => prev.map(persona => 
        persona.id === id ? { ...persona, ...updates } : persona
      ));
      
      // Refetch to ensure consistency
      await fetchPersonas();
    } catch (err) {
      console.error('Erro ao atualizar persona:', err);
      throw err;
    }
  };

  const deletePersona = async (id: string) => {
    try {
      await personasService.delete(id);
      
      // Remove from local state optimistically
      setPersonas(prev => prev.filter(persona => persona.id !== id));
      
      // Refetch para garantir consistência com o servidor
      await fetchPersonas();
    } catch (err) {
      console.error('Erro ao deletar persona:', err);
      // Se houver erro, refazer o fetch para restaurar o estado correto
      await fetchPersonas();
      throw err;
    }
  };

  const duplicatePersona = async (id: string) => {
    try {
      await personasService.duplicate(id);
      
      // Refetch data after duplication
      await fetchPersonas();
    } catch (err) {
      console.error('Erro ao duplicar persona:', err);
      throw err;
    }
  };

  const refetch = async () => {
    await fetchPersonas();
  };

  // Load personas when workspace or user changes
  useEffect(() => {
    if (workspace?.id && user?.id) {
      fetchPersonas();
    } else if (workspace?.id && !user?.id) {
      console.warn('Hook usePersonas: Usuário não autenticado');
      setPersonas([]);
      setLoading(false);
      setError('Você precisa estar logado para acessar as personas.');
    } else {
      console.debug('Hook usePersonas: Workspace não disponível, aguardando...');
      setPersonas([]);
      setLoading(false);
      setError(null);
    }
  }, [workspace?.id, user?.id]);

  return {
    personas,
    loading,
    error,
    createPersona,
    updatePersona,
    deletePersona,
    duplicatePersona,
    refetch
  };
};
