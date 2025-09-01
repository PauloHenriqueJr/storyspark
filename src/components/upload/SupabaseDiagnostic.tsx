import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, AlertTriangle, Database, Shield, User } from 'lucide-react';

interface DiagnosticResult {
    test: string;
    status: 'success' | 'error' | 'warning';
    message: string;
    details?: string;
}

const SupabaseDiagnostic: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<DiagnosticResult[]>([]);
    const { user } = useAuth();

    const runDiagnostics = async () => {
        if (!user) {
            setResults([{
                test: 'Autenticação',
                status: 'error',
                message: 'Usuário não autenticado',
                details: 'Faça login primeiro'
            }]);
            return;
        }

        setLoading(true);
        const diagnosticResults: DiagnosticResult[] = [];

        try {
            // Teste 1: Verificar sessão
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !sessionData.session) {
                diagnosticResults.push({
                    test: 'Sessão do Usuário',
                    status: 'error',
                    message: 'Sessão inválida ou expirada',
                    details: sessionError?.message || 'Nenhuma sessão ativa'
                });
            } else {
                diagnosticResults.push({
                    test: 'Sessão do Usuário',
                    status: 'success',
                    message: 'Sessão ativa e válida',
                    details: `User ID: ${sessionData.session.user.id}`
                });
            }

            // Teste 2: Verificar se a tabela existe
            try {
                const { error: tableError } = await supabase
                    .from('ai_processing_jobs')
                    .select('id')
                    .limit(1);

                if (tableError) {
                    if (tableError.code === '42P01') {
                        diagnosticResults.push({
                            test: 'Tabela ai_processing_jobs',
                            status: 'error',
                            message: 'Tabela não existe',
                            details: 'Execute a migração SQL fornecida no Supabase Dashboard'
                        });
                    } else if (tableError.code === '42501') {
                        diagnosticResults.push({
                            test: 'Tabela ai_processing_jobs',
                            status: 'warning',
                            message: 'Tabela existe mas sem permissões RLS',
                            details: 'Configure as políticas RLS usando a migração fornecida'
                        });
                    } else {
                        diagnosticResults.push({
                            test: 'Tabela ai_processing_jobs',
                            status: 'error',
                            message: `Erro na tabela: ${tableError.message}`,
                            details: `Código: ${tableError.code}`
                        });
                    }
                } else {
                    diagnosticResults.push({
                        test: 'Tabela ai_processing_jobs',
                        status: 'success',
                        message: 'Tabela existe e acessível'
                    });
                }
            } catch (error) {
                diagnosticResults.push({
                    test: 'Tabela ai_processing_jobs',
                    status: 'error',
                    message: 'Erro ao verificar tabela',
                    details: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }

            // Teste 3: Tentar inserção de teste
            if (sessionData?.session) {
                try {
                    const { data, error } = await supabase
                        .from('ai_processing_jobs')
                        .insert({
                            user_id: sessionData.session.user.id,
                            file_name: 'diagnostic_test.txt',
                            file_path: 'test/diagnostic',
                            file_type: 'text/plain',
                            status: 'pending'
                        })
                        .select();

                    if (error) {
                        diagnosticResults.push({
                            test: 'Inserção de Teste',
                            status: 'error',
                            message: `Falha na inserção: ${error.message}`,
                            details: `Código: ${error.code}`
                        });
                    } else {
                        diagnosticResults.push({
                            test: 'Inserção de Teste',
                            status: 'success',
                            message: 'Inserção bem-sucedida',
                            details: `ID criado: ${data?.[0]?.id}`
                        });

                        // Limpar o registro de teste
                        if (data?.[0]?.id) {
                            await supabase
                                .from('ai_processing_jobs')
                                .delete()
                                .eq('id', data[0].id);
                        }
                    }
                } catch (error) {
                    diagnosticResults.push({
                        test: 'Inserção de Teste',
                        status: 'error',
                        message: 'Erro na inserção',
                        details: error instanceof Error ? error.message : 'Erro desconhecido'
                    });
                }
            }

            // Teste 4: Verificar bucket de storage
            try {
                const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

                if (bucketError) {
                    diagnosticResults.push({
                        test: 'Storage Buckets',
                        status: 'error',
                        message: `Erro ao listar buckets: ${bucketError.message}`
                    });
                } else {
                    // Procurar por qualquer bucket que contenha 'document-uploads'
                    const documentBucket = buckets.find(b =>
                        b.name === 'document-uploads' ||
                        b.name.includes('document-uploads') ||
                        b.id === 'document-uploads'
                    );

                    if (documentBucket) {
                        diagnosticResults.push({
                            test: 'Storage Buckets',
                            status: 'success',
                            message: `Bucket encontrado: ${documentBucket.name}`,
                            details: `ID: ${documentBucket.id}, Público: ${documentBucket.public ? 'Sim' : 'Não'}`
                        });
                    } else {
                        diagnosticResults.push({
                            test: 'Storage Buckets',
                            status: 'warning',
                            message: 'Bucket document-uploads não encontrado',
                            details: `Buckets disponíveis: ${buckets.map(b => b.name).join(', ')}`
                        });
                    }
                }
            } catch (error) {
                diagnosticResults.push({
                    test: 'Storage Buckets',
                    status: 'error',
                    message: 'Erro ao verificar storage',
                    details: error instanceof Error ? error.message : 'Erro desconhecido'
                });
            }

        } catch (error) {
            diagnosticResults.push({
                test: 'Diagnóstico Geral',
                status: 'error',
                message: 'Erro durante diagnóstico',
                details: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }

        setResults(diagnosticResults);
        setLoading(false);
    };

    const getStatusIcon = (status: DiagnosticResult['status']) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
        }
    };

    const getStatusColor = (status: DiagnosticResult['status']) => {
        switch (status) {
            case 'success':
                return 'border-green-200 bg-green-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'error':
                return 'border-red-200 bg-red-50';
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Diagnóstico do Supabase
                </CardTitle>
                <CardDescription>
                    Verifique a configuração e permissões do banco de dados
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <Button
                    onClick={runDiagnostics}
                    disabled={loading || !user}
                    className="w-full"
                >
                    {loading ? 'Executando Diagnóstico...' : 'Executar Diagnóstico'}
                </Button>

                {!user && (
                    <Alert>
                        <User className="h-4 w-4" />
                        <AlertDescription>
                            Faça login para executar o diagnóstico
                        </AlertDescription>
                    </Alert>
                )}

                {results.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-sm">Resultados do Diagnóstico:</h3>
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
                            >
                                <div className="flex items-start gap-3">
                                    {getStatusIcon(result.status)}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm">{result.test}</p>
                                        <p className="text-sm text-gray-600">{result.message}</p>
                                        {result.details && (
                                            <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {results.some(r => r.status === 'error') && (
                    <Alert variant="destructive">
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                            Foram encontrados problemas. Execute o arquivo SQL de migração no Supabase Dashboard para corrigir.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
};

export default SupabaseDiagnostic;