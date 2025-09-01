import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, AlertTriangle, Database } from 'lucide-react';

const RLSTestComponent: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const { user } = useAuth();

    const runRLSTest = async () => {
        if (!user) {
            setResults(['❌ Usuário não autenticado']);
            return;
        }

        setLoading(true);
        const testResults: string[] = [];

        try {
            // Teste 1: Verificar sessão
            const { data: session } = await supabase.auth.getSession();
            testResults.push(`✅ Sessão ativa: ${session.session?.user?.id}`);
            testResults.push(`✅ Email: ${session.session?.user?.email}`);

            // Teste 2: Tentar SELECT na tabela
            try {
                const { data, error } = await supabase
                    .from('ai_processing_jobs')
                    .select('*')
                    .limit(1);

                if (error) {
                    testResults.push(`❌ SELECT falhou: ${error.message} (${error.code})`);
                } else {
                    testResults.push(`✅ SELECT funcionou: ${data.length} registros`);
                }
            } catch (error) {
                testResults.push(`❌ SELECT erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            }

            // Teste 3: Tentar INSERT na tabela
            try {
                const testData = {
                    user_id: session.session?.user?.id,
                    file_name: `test_${Date.now()}.txt`,
                    file_path: 'test/rls',
                    file_type: 'text/plain',
                    status: 'pending' as const
                };

                const { data, error } = await supabase
                    .from('ai_processing_jobs')
                    .insert(testData)
                    .select();

                if (error) {
                    testResults.push(`❌ INSERT falhou: ${error.message} (${error.code})`);

                    // Diagnóstico adicional para erro 42501
                    if (error.code === '42501') {
                        testResults.push(`🔍 Erro 42501 indica problema de RLS`);
                        testResults.push(`🔍 Verifique se as políticas RLS estão corretas`);
                        testResults.push(`🔍 Execute o script supabase_fix_complete.sql`);
                    }
                } else {
                    testResults.push(`✅ INSERT funcionou: ID ${data[0]?.id}`);

                    // Limpar o registro de teste
                    if (data[0]?.id) {
                        await supabase
                            .from('ai_processing_jobs')
                            .delete()
                            .eq('id', data[0].id);
                        testResults.push(`✅ Registro de teste removido`);
                    }
                }
            } catch (error) {
                testResults.push(`❌ INSERT erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            }

            // Teste 4: Verificar auth.uid() via SQL
            try {
                const { data, error } = await supabase
                    .rpc('get_current_user_id');

                if (error) {
                    testResults.push(`⚠️ RPC get_current_user_id não disponível: ${error.message}`);
                } else {
                    testResults.push(`✅ auth.uid() via RPC: ${data}`);
                }
            } catch (error) {
                testResults.push(`⚠️ Não foi possível testar auth.uid() via RPC`);
            }

            // Teste 5: Verificar com query SQL direta
            try {
                const { data, error } = await supabase
                    .from('ai_processing_jobs')
                    .select('count(*)')
                    .eq('user_id', session.session?.user?.id);

                if (error) {
                    testResults.push(`❌ COUNT query falhou: ${error.message}`);
                } else {
                    testResults.push(`✅ COUNT query funcionou`);
                }
            } catch (error) {
                testResults.push(`❌ COUNT query erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            }

        } catch (error) {
            testResults.push(`❌ Erro geral: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }

        setResults(testResults);
        setLoading(false);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Teste RLS Específico
                </CardTitle>
                <CardDescription>
                    Teste focado nas políticas Row Level Security
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <Button
                    onClick={runRLSTest}
                    disabled={loading || !user}
                    className="w-full"
                >
                    {loading ? 'Testando RLS...' : 'Testar Políticas RLS'}
                </Button>

                {!user && (
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Faça login para executar o teste RLS
                        </AlertDescription>
                    </Alert>
                )}

                {results.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm">Resultados do Teste RLS:</h3>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm space-y-1">
                            {results.map((result, index) => (
                                <div key={index} className={
                                    result.startsWith('✅') ? 'text-green-600' :
                                        result.startsWith('❌') ? 'text-red-600' :
                                            result.startsWith('⚠️') ? 'text-yellow-600' :
                                                result.startsWith('🔍') ? 'text-blue-600' :
                                                    'text-gray-600'
                                }>
                                    {result}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {results.some(r => r.includes('42501')) && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Erro 42501 detectado!</strong><br />
                            Execute o script <code>supabase_fix_complete.sql</code> no Supabase Dashboard para corrigir as políticas RLS.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
};

export default RLSTestComponent;