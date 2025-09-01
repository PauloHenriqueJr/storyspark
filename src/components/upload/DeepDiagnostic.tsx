import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Search, AlertTriangle } from 'lucide-react';

const DeepDiagnostic: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const { user } = useAuth();

    const runDeepDiagnostic = async () => {
        if (!user) {
            setResult('❌ Usuário não autenticado');
            return;
        }

        setLoading(true);
        const results: string[] = [];

        try {
            // 1. Verificar se RLS está realmente habilitado
            results.push('🔍 TESTE 1: Verificando RLS...');

            try {
                const { data: rlsData, error: rlsError } = await supabase
                    .rpc('check_rls_status');

                if (rlsError) {
                    results.push(`⚠️ Não foi possível verificar RLS via RPC: ${rlsError.message}`);
                } else {
                    results.push(`✅ RLS Status via RPC: ${JSON.stringify(rlsData)}`);
                }
            } catch (e) {
                results.push(`⚠️ RPC check_rls_status não disponível`);
            }

            // 2. Testar com RLS temporariamente desabilitado (via SQL)
            results.push('\n🔍 TESTE 2: Tentando desabilitar RLS temporariamente...');

            try {
                // Tentar executar SQL que desabilita RLS temporariamente
                const { data: disableData, error: disableError } = await supabase
                    .rpc('temp_disable_rls_test');

                if (disableError) {
                    results.push(`❌ Não foi possível desabilitar RLS: ${disableError.message}`);
                } else {
                    results.push(`✅ RLS temporariamente desabilitado para teste`);
                }
            } catch (e) {
                results.push(`⚠️ Função temp_disable_rls_test não disponível`);
            }

            // 3. Verificar permissões do usuário atual
            results.push('\n🔍 TESTE 3: Verificando permissões do usuário...');

            try {
                const { data: userInfo, error: userError } = await supabase
                    .rpc('get_current_user_info');

                if (userError) {
                    results.push(`❌ Erro ao obter info do usuário: ${userError.message}`);
                } else {
                    results.push(`✅ Info do usuário: ${JSON.stringify(userInfo)}`);
                }
            } catch (e) {
                results.push(`⚠️ Função get_current_user_info não disponível`);
            }

            // 4. Testar inserção em uma tabela diferente (para verificar se é problema geral)
            results.push('\n🔍 TESTE 4: Testando inserção em outra tabela...');

            try {
                // Tentar inserir em auth.users (que deveria falhar, mas com erro diferente)
                const { data: testData, error: testError } = await supabase
                    .from('profiles') // ou qualquer outra tabela que possa existir
                    .select('*')
                    .limit(1);

                if (testError) {
                    results.push(`⚠️ Tabela profiles não existe ou sem acesso: ${testError.message}`);
                } else {
                    results.push(`✅ Acesso a outras tabelas funciona`);
                }
            } catch (e) {
                results.push(`⚠️ Não foi possível testar outras tabelas`);
            }

            // 5. Verificar se o problema é com a conexão/autenticação
            results.push('\n🔍 TESTE 5: Verificando conexão e autenticação...');

            const { data: session } = await supabase.auth.getSession();

            if (session.session) {
                results.push(`✅ Sessão válida: ${session.session.user.id}`);
                results.push(`✅ Token expira: ${new Date(session.session.expires_at! * 1000).toLocaleString()}`);
                results.push(`✅ Roles: ${JSON.stringify(session.session.user.role || 'authenticated')}`);

                // Verificar se o token não está expirado
                const now = Date.now() / 1000;
                const expiresAt = session.session.expires_at!;

                if (now >= expiresAt) {
                    results.push(`❌ TOKEN EXPIRADO! Agora: ${now}, Expira: ${expiresAt}`);
                } else {
                    results.push(`✅ Token válido por mais ${Math.round((expiresAt - now) / 60)} minutos`);
                }
            } else {
                results.push(`❌ Sessão inválida ou expirada`);
            }

            // 6. Teste final - tentar uma operação muito simples
            results.push('\n🔍 TESTE 6: Operação mais simples possível...');

            try {
                // Apenas contar registros existentes
                const { count, error: countError } = await supabase
                    .from('ai_processing_jobs')
                    .select('*', { count: 'exact', head: true });

                if (countError) {
                    results.push(`❌ Até mesmo COUNT falhou: ${countError.message} (${countError.code})`);

                    if (countError.code === '42501') {
                        results.push(`🔍 DIAGNÓSTICO: Erro 42501 até no COUNT indica problema fundamental com RLS`);
                        results.push(`🔍 POSSÍVEL CAUSA: RLS não foi realmente desabilitado ou há problema com auth.uid()`);
                    }
                } else {
                    results.push(`✅ COUNT funcionou: ${count} registros`);
                }
            } catch (e) {
                results.push(`❌ Erro no COUNT: ${e}`);
            }

            // 7. Diagnóstico final
            results.push('\n📋 DIAGNÓSTICO FINAL:');
            results.push('Se até operações simples como COUNT falham com 42501,');
            results.push('o problema é que RLS ainda está ativo e auth.uid() não está funcionando.');
            results.push('\n💡 PRÓXIMOS PASSOS:');
            results.push('1. Verificar se as políticas foram realmente aplicadas no Supabase Dashboard');
            results.push('2. Tentar desabilitar RLS completamente na tabela');
            results.push('3. Verificar se há algum problema com a função auth.uid()');

        } catch (error) {
            results.push(`❌ ERRO GERAL: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }

        setResult(results.join('\n'));
        setLoading(false);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Diagnóstico Profundo
                </CardTitle>
                <CardDescription>
                    Análise completa de todos os pontos possíveis do problema
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <Button
                    onClick={runDeepDiagnostic}
                    disabled={loading || !user}
                    className="w-full"
                >
                    {loading ? 'Executando Diagnóstico Profundo...' : 'Executar Diagnóstico Profundo'}
                </Button>

                {!user && (
                    <div className="flex items-center gap-2 text-yellow-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Faça login para executar o diagnóstico</span>
                    </div>
                )}

                {result && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                            {result}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DeepDiagnostic;