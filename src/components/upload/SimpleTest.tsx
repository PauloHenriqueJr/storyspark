import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

const SimpleTest: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const { user } = useAuth();

    const runTest = async () => {
        if (!user) {
            setResult('❌ Usuário não autenticado');
            return;
        }

        setLoading(true);
        setResult('🔄 Testando...');

        try {
            // Teste simples de inserção
            const { data, error } = await supabase
                .from('ai_processing_jobs')
                .insert({
                    user_id: user.id,
                    file_name: 'teste_simples.txt',
                    file_path: 'test/simple',
                    file_type: 'text/plain',
                    status: 'pending'
                })
                .select();

            if (error) {
                setResult(`❌ ERRO: ${error.message} (Código: ${error.code})`);
                return;
            }

            // Teste de leitura
            const { data: readData, error: readError } = await supabase
                .from('ai_processing_jobs')
                .select('*')
                .eq('user_id', user.id)
                .limit(5);

            if (readError) {
                setResult(`❌ ERRO NA LEITURA: ${readError.message}`);
                return;
            }

            setResult(`✅ SUCESSO! 
Inserção: ${data?.length || 0} registro(s)
Leitura: ${readData?.length || 0} registro(s) encontrados
🎉 Problema resolvido!`);

        } catch (error: any) {
            setResult(`❌ ERRO INESPERADO: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <h3 className="text-xl font-bold mb-4 text-green-800 dark:text-green-200">
                🚀 Teste Final - Supabase Corrigido
            </h3>

            <Button
                onClick={runTest}
                disabled={loading || !user}
                className="w-full mb-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                size="lg"
            >
                {loading ? '🔄 Testando...' : '🎯 Testar Agora'}
            </Button>

            {result && (
                <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                        {result}
                    </pre>
                </div>
            )}

            {!user && (
                <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                    <p className="font-semibold">⚠️ Faça login primeiro</p>
                    <p className="text-sm">Você precisa estar autenticado para testar.</p>
                </div>
            )}
        </div>
    );
};

export default SimpleTest;