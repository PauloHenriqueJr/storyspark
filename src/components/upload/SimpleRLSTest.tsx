import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Database, AlertTriangle } from 'lucide-react';

const SimpleRLSTest: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const { user } = useAuth();

    const testInsert = async () => {
        if (!user) {
            setResult('❌ Usuário não autenticado');
            return;
        }

        setLoading(true);
        setResult('🔄 Testando...');

        try {
            // Obter sessão atual
            const { data: session } = await supabase.auth.getSession();
            const userId = session.session?.user?.id;

            if (!userId) {
                setResult('❌ Não foi possível obter user ID da sessão');
                return;
            }

            // Dados de teste
            const testData = {
                user_id: userId,
                file_name: `test_simple_${Date.now()}.txt`,
                file_path: 'test/simple',
                file_type: 'text/plain',
                status: 'pending' as const
            };

            console.log('🔍 Dados de teste:', testData);

            // Tentar inserção
            const { data, error } = await supabase
                .from('ai_processing_jobs')
                .insert(testData)
                .select();

            if (error) {
                console.error('❌ Erro na inserção:', error);
                setResult(`❌ FALHA: ${error.message} (Código: ${error.code})\n\n` +
                    `🔍 User ID: ${userId}\n` +
                    `🔍 Dados: ${JSON.stringify(testData, null, 2)}\n\n` +
                    `💡 SOLUÇÃO: Execute o arquivo fix_rls_policies.sql no Supabase Dashboard`);
            } else {
                console.log('✅ Inserção bem-sucedida:', data);
                setResult(`✅ SUCESSO! Registro criado com ID: ${data[0]?.id}\n\n` +
                    `🎉 As políticas RLS estão funcionando corretamente!`);

                // Limpar registro de teste
                if (data[0]?.id) {
                    await supabase
                        .from('ai_processing_jobs')
                        .delete()
                        .eq('id', data[0].id);
                    setResult(prev => prev + '\n✅ Registro de teste removido');
                }
            }

        } catch (error) {
            console.error('❌ Erro geral:', error);
            setResult(`❌ ERRO GERAL: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Teste RLS Simples
                </CardTitle>
                <CardDescription>
                    Teste direto de inserção na tabela ai_processing_jobs
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <Button
                    onClick={testInsert}
                    disabled={loading || !user}
                    className="w-full"
                    variant={result.includes('✅ SUCESSO') ? 'default' : 'destructive'}
                >
                    {loading ? 'Testando...' : 'Testar Inserção RLS'}
                </Button>

                {!user && (
                    <div className="flex items-center gap-2 text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Faça login para executar o teste</span>
                    </div>
                )}

                {result && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                            {result}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SimpleRLSTest;