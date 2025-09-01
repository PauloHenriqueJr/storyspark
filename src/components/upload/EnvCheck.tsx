import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, AlertTriangle } from 'lucide-react';

const EnvCheck: React.FC = () => {
    const [showEnv, setShowEnv] = useState(false);

    const checkEnvironment = () => {
        setShowEnv(true);
    };

    const envVars = {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        NODE_ENV: import.meta.env.NODE_ENV,
        DEV: import.meta.env.DEV,
        PROD: import.meta.env.PROD,
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Verificação de Ambiente
                </CardTitle>
                <CardDescription>
                    Verifica se as variáveis de ambiente estão configuradas corretamente
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <Button
                    onClick={checkEnvironment}
                    className="w-full"
                >
                    Verificar Variáveis de Ambiente
                </Button>

                {showEnv && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Variáveis de Ambiente:</h3>
                            <div className="space-y-2 font-mono text-sm">
                                {Object.entries(envVars).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                        <span className="font-medium">{key}:</span>
                                        <span className={value ? 'text-green-600' : 'text-red-600'}>
                                            {key.includes('KEY')
                                                ? (value ? `${String(value).substring(0, 10)}...` : 'AUSENTE')
                                                : (value || 'AUSENTE')
                                            }
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Diagnóstico:</h3>

                            {!envVars.VITE_SUPABASE_URL && (
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-sm">VITE_SUPABASE_URL não configurada</span>
                                </div>
                            )}

                            {!envVars.VITE_SUPABASE_PUBLISHABLE_KEY && (
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-sm">VITE_SUPABASE_PUBLISHABLE_KEY não configurada</span>
                                </div>
                            )}

                            {envVars.VITE_SUPABASE_URL && envVars.VITE_SUPABASE_PUBLISHABLE_KEY && (
                                <div className="text-green-600 text-sm">
                                    ✅ Variáveis de ambiente configuradas corretamente
                                </div>
                            )}

                            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h4 className="font-medium text-blue-800 dark:text-blue-200">Verificações adicionais:</h4>
                                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                                    <li>• URL deve terminar com '.supabase.co'</li>
                                    <li>• Chave deve começar com 'eyJ'</li>
                                    <li>• Ambas devem ser do mesmo projeto Supabase</li>
                                    <li>• Verificar se não há espaços extras nas variáveis</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EnvCheck;