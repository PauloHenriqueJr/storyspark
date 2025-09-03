import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Key, AlertTriangle } from 'lucide-react';

const AuthTokenTest: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const { user } = useAuth();

    const testAuthToken = async () => {
        if (!user) {
            setResult('❌ Usuário não autenticado');
            return;
        }

        setLoading(true);
        setResult('🔄 Testando token de autenticação...');

        try {
            // 1. Verificar sessão atual
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !sessionData.session) {
                setResult('❌ Erro ao obter sessão: ' + (sessionError?.message || 'Sessão não encontrada'));
                return;
            }

            const session = sessionData.session;
            let testResults = [];

            testResults.push(`✅ Sessão obtida: ${session.user.id}`);
            testResults.push(`✅ Token presente: ${session.access_token ? 'Sim' : 'Não'}`);
            testResults.push(`✅ Token expira em: ${new Date(session.expires_at! * 1000).toLocaleString()}`);

            // 2. Usar instância singleton do Supabase (já autenticada automaticamente)
            const authenticatedClient = supabase;

            // 3. Testar INSERT com cliente autenticado explicitamente
            const testData = {
                user_id: session.user.id,
                file_name: `auth_test_${Date.now()}.txt`,
                file_path: 'test/auth',
                file_type: 'text/plain',
                status: 'pending' as const
            };

            testResults.push(`🔍 Tentando INSERT com cliente autenticado explícito...`);

            const { data, error } = await authenticatedClient
                .from('ai_processing_jobs')
                .insert(testData)
                .select();

            if (error) {
                testResults.push(`❌ INSERT com token explícito falhou: ${error.message} (${error.code})`);

                // 4. Testar com cliente padrão para comparação
                testResults.push(`🔍 Testando com cliente padrão...`);

                const { data: data2, error: error2 } = await supabase
                    .from('ai_processing_jobs')
                    .insert(testData)
                    .select();

                if (error2) {
                    testResults.push(`❌ Cliente padrão também falhou: ${error2.message} (${error2.code})`);
                    testResults.push(`🔍 PROBLEMA: Token não está sendo enviado corretamente`);
                } else {
                    testResults.push(`✅ Cliente padrão funcionou! Problema com configuração de headers`);
                }
            } else {
                testResults.push(`✅ INSERT com token explícito funcionou! ID: ${data[0]?.id}`);

                // Limpar registro de teste
                if (data[0]?.id) {
                    await authenticatedClient
                        .from('ai_processing_jobs')
                        .delete()
                        .eq('id', data[0].id);
                    testResults.push(`✅ Registro de teste removido`);
                }
            }

            // 5. Verificar headers do cliente padrão
            testResults.push(`🔍 Verificando configuração do cliente padrão...`);

            // Tentar acessar headers (pode não funcionar dependendo da versão)
            try {
                const headers = (supabase as any).rest?.headers || (supabase as any).headers || {};
                testResults.push(`🔍 Headers do cliente: ${JSON.stringify(headers, null, 2)}`);
            } catch (e) {
                testResults.push(`⚠️ Não foi possível acessar headers do cliente`);
            }

            setResult(testResults.join('\n'));

        } catch (error) {
            console.error('❌ Erro no teste de token:', error);
            setResult(`❌ ERRO: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Teste de Token de Autenticação
                </CardTitle>
                <CardDescription>
                    Verifica se o token JWT está sendo enviado corretamente
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <Button
                    onClick={testAuthToken}
                    disabled={loading || !user}
                    className="w-full"
                >
                    {loading ? 'Testando Token...' : 'Testar Token de Autenticação'}
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

export default AuthTokenTest;