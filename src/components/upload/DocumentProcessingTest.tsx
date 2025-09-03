import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { testDocumentProcessing } from '@/utils/testDocumentProcessing';
import { supabase } from '@/lib/supabase';

const DocumentProcessingTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { user } = useAuth();

  const handleTestProcessing = async () => {
    if (!user) {
      setResult({ success: false, message: 'Usuário não autenticado. Faça login primeiro.' });
      return;
    }

    console.log("ID do usuário para o teste de inserção direta:", user.id);

    setLoading(true);
    setResult(null);

    try {
      // VERIFICAR SESSÃO ATUAL
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log("Dados da sessão:", sessionData);
      console.log("Erro da sessão:", sessionError);

      if (!sessionData.session) {
        throw new Error('Nenhuma sessão ativa encontrada');
      }

      console.log("Token JWT:", sessionData.session.access_token ? 'Presente' : 'Ausente');
      console.log("User ID da sessão:", sessionData.session.user?.id);
      console.log("Token completo (primeiros 50 chars):", sessionData.session.access_token?.substring(0, 50));

      // Usar a instância singleton do Supabase (já autenticada automaticamente)
      const authenticatedSupabase = supabase;

      // TESTE DE INSERÇÃO DIRETA COM CLIENTE AUTENTICADO
      console.log("Tentando inserir diretamente na tabela ai_processing_jobs com cliente autenticado...");

      const { data, error } = await authenticatedSupabase
        .from('ai_processing_jobs')
        .insert({
          user_id: sessionData.session.user.id,
          file_name: 'teste_direto.txt',
          file_path: 'test/direct',
          file_type: 'text/plain',
          status: 'pending'
        })
        .select();

      if (error) {
        console.error("Erro detalhado:", error);
        throw new Error(`Erro na inserção direta: ${error.message}`);
      }

      console.log("Inserção direta bem-sucedida:", data);
      setResult({ success: true, message: 'Inserção direta na tabela funcionou! A política está correta.' });

    } catch (error) {
      console.error("O teste de inserção direta falhou:", error);
      setResult({ success: false, message: `O teste de inserção direta falhou: ${error instanceof Error ? error.message : 'Erro desconhecido'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">Teste de Permissão (INSERT)</h3>
      <Button
        onClick={handleTestProcessing}
        disabled={loading || !user}
        className="w-full"
      >
        {loading ? 'Testando Inserção...' : 'Testar Inserção Direta'}
      </Button>

      {result && (
        <div className={`mt-3 p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="text-sm font-bold">{result.success ? 'SUCESSO' : 'FALHA'}</p>
          <p className="text-sm">{result.message}</p>
        </div>
      )}

      {!user && (
        <div className="mt-3 p-3 rounded bg-yellow-100 text-yellow-800">
          <p className="text-sm">Faça login para testar a permissão de inserção.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentProcessingTest;