import { useState, useEffect } from 'react';
import { useWorkspace } from './useWorkspace';
import { brandVoicesService, type BrandVoiceWithStats } from '@/services/brandVoicesService';
import type { Database } from '@/integrations/supabase/types';

type CreateBrandVoiceInput = Database['public']['Tables']['brand_voices']['Insert'];
type UpdateBrandVoiceInput = Database['public']['Tables']['brand_voices']['Update'];

interface ErrorWithCode {
  message?: string;
  code?: string;
  status?: string;
  error_description?: string;
}

export interface UseBrandVoicesReturn {
  voices: BrandVoiceWithStats[];
  loading: boolean;
  error: string | null;
  createVoice: (input: Omit<CreateBrandVoiceInput, 'workspace_id' | 'user_id'>) => Promise<void>;
  updateVoice: (id: string, updates: UpdateBrandVoiceInput) => Promise<void>;
  deleteVoice: (id: string) => Promise<void>;
  toggleVoiceStatus: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useBrandVoices = (): UseBrandVoicesReturn => {
  const [voices, setVoices] = useState<BrandVoiceWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { workspace, user } = useWorkspace();

  const fetchVoices = async () => {
    if (!workspace?.id) {
      console.warn('Workspace ID não encontrado');
      return;
    }
    
    if (!user?.id) {
      console.warn('Usuário não autenticado');
      setError('Você precisa estar logado para acessar as brand voices.');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await brandVoicesService.getAll(workspace.id);
      setVoices(data || []);
    } catch (err) {
      console.error('Erro ao carregar brand voices:', err);
      
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
        errorMessage = 'Nenhuma brand voice encontrada.';
        setVoices([]);
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

  const createVoice = async (input: Omit<CreateBrandVoiceInput, 'workspace_id' | 'user_id'>) => {
    if (!workspace?.id || !user?.id) {
      throw new Error('Workspace ou usuário não encontrado');
    }

    try {
      await brandVoicesService.create({
        ...input,
        workspace_id: workspace.id,
        user_id: user.id
      });
      
      // Refetch data after creation
      await fetchVoices();
    } catch (err) {
      console.error('Erro ao criar brand voice:', err);
      throw err;
    }
  };

  const updateVoice = async (id: string, updates: UpdateBrandVoiceInput) => {
    try {
      await brandVoicesService.update(id, updates);
      
      // Update local state optimistically
      setVoices(prev => prev.map(voice => 
        voice.id === id ? { ...voice, ...updates } : voice
      ));
      
      // Refetch to ensure consistency
      await fetchVoices();
    } catch (err) {
      console.error('Erro ao atualizar brand voice:', err);
      throw err;
    }
  };

  const deleteVoice = async (id: string) => {
    try {
      await brandVoicesService.delete(id);
      
      // Remove from local state optimistically
      setVoices(prev => prev.filter(voice => voice.id !== id));
    } catch (err) {
      console.error('Erro ao deletar brand voice:', err);
      throw err;
    }
  };

  const toggleVoiceStatus = async (id: string) => {
    try {
      const updatedVoice = await brandVoicesService.toggleStatus(id);
      
      // Update local state
      setVoices(prev => prev.map(voice => 
        voice.id === id ? { ...voice, is_active: updatedVoice.is_active } : voice
      ));
    } catch (err) {
      console.error('Erro ao alterar status da brand voice:', err);
      throw err;
    }
  };

  const refetch = async () => {
    await fetchVoices();
  };

  // Load voices when workspace or user changes
  useEffect(() => {
    if (workspace?.id && user?.id) {
      fetchVoices();
    } else if (workspace?.id && !user?.id) {
      console.warn('Hook useBrandVoices: Usuário não autenticado');
      setVoices([]);
      setLoading(false);
      setError('Você precisa estar logado para acessar as brand voices.');
    } else {
      console.warn('Hook useBrandVoices: Workspace não disponível');
      setVoices([]);
      setLoading(false);
      setError(null);
    }
  }, [workspace?.id, user?.id]);

  return {
    voices,
    loading,
    error,
    createVoice,
    updateVoice,
    deleteVoice,
    toggleVoiceStatus,
    refetch
  };
};