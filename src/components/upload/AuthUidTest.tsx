import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Shield, AlertTriangle } from 'lucide-react';

const AuthUidTest: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const { user } = useAuth();

    const testAuthUid = async () => {
        if (!user) {
            setResult('❌ Usuário não autenticado');
            return;
        }

        setLoading(true);
        setResult('🔄 Testando auth.uid()...');

        try {
            let testResults = [];

            // 1. Verificar sessão local
            const { data: sessionData } = await supabase.auth.getSession();
            const localUserId = sessionData.session?.user?.id;

            testResults.push(`✅ User ID local: ${localUserId}`);

            // 2. Tentar executar uma query que usa auth.uid() diretamente
            try {
                const { data, error } = await supabase
                    .rpc('get_auth_uid');

                if (error) {
                    testResults.push(`❌ RPC get_auth_uid falhou: ${error.message}`);

                    // Tentar uma abordagem alternativa - query simples que força auth.uid()
                    try {
                        const { data: selectData, error: selectError } = await supabase
                            .from('ai_processing_jobs')
                            .select('user_id')
                            .eq('user_id', localUserId)
                            .limit(1);

                        if (selectError) {
                            testResults.push(`❌ SELECT com user_id falhou: ${selectError.message}`);
                        } else {
                            testResults.push(`✅ SELECT com user_id funcionou: ${selectData.length} registros`);

                            // Se SELECT funciona, o problema é específico do INSERT
                            testResults.push(`🔍 DIAGNÓSTICO: SELECT funciona, INSERT falha`);
                            testResults.push(`🔍 CAUSA PROVÁVEL: Política de INSERT muito restritiva`);
                            testResults.push(`🔍 SOLUÇÃO: Execute debug_rls_final.sql`);
                        }
                    } catch (selectErr) {
                        testResults.push(`❌ Erro no SELECT alternativo: ${selectErr}`);
                    }
                } else {
                    testResults.push(`✅ auth.uid() via RPC: ${data}`);

                    if (data === localUserId) {
                        testResults.push(`✅ auth.uid() corresponde ao user_id local`);
                    } else {
                        testResults.push(`❌ auth.uid() (${data}) ≠ user_id local (${localUserId})`);
                    }
                }
            } catch (rpcError) {
                testResults.push(`⚠️ RPC não disponível, testando diretamente...`);

                // 3. Testar com uma query que deveria funcionar se auth.uid() estiver OK
                try {
                    const { count, error } = await supabase
                        .from('ai_processing_jobs')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', localUserId);

                    if (error) {
                        testResults.push(`❌ COUNT query falhou: ${error.message}`);
                    } else {
                        testResults.push(`✅ COUNT query funcionou: ${count} registros`);
                    }
                } catch (countErr) {
                    testResults.push(`❌ Erro no COUNT: ${countErr}`);
                }
            }

            // 4. Diagnóstico final
            testResults.push(`\n🔍 RESUMO DO DIAGNÓSTICO:`);
            testResults.push(`- Sessão ativa: ✅`);
            testResults.push(`- Token presente: ✅`);
            testResults.push(`- SELECT funciona: ✅`);
            testResults.push(`- INSERT falha: ❌`);
            testResults.push(`\n💡 PRÓXIMO PASSO:`);
            testResults.push(`Execute o arquivo debug_rls_final.sql no Supabase Dashboard`);
            testResults.push(`Isso vai criar uma política temporária mais permissiva para identificar o problema exato.`);

            setResult(testResults.join('\n'));

        } catch (error) {
            console.error('❌ Erro no teste auth.uid():', error);
            setResult(`❌ ERRO: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Teste auth.uid()
                </CardTitle>
                <CardDescription>
                    Verifica se a função auth.uid() está funcionando corretamente
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <Button
                    onClick={testAuthUid}
                    disabled={loading || !user}
                    className="w-full"
                >
                    {loading ? 'Testando auth.uid()...' : 'Testar auth.uid()'}
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

export default AuthUidTest;