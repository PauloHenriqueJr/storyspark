import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DocumentUploadFlow } from '@/components/upload/DocumentUploadFlow';
import { dataApplicationService } from '@/services/dataApplicationService';
import { supabase } from '@/lib/supabase';
import { Brain, Upload, CheckCircle, BarChart3 } from 'lucide-react';

export const ImportData: React.FC = () => {
    const [stats, setStats] = useState<{ totalBrandVoices: number; totalPersonas: number; totalCampaigns: number; lastApplication: string | null; } | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const uid = session?.user?.id || null;
            setUserId(uid);
            if (uid) {
                const s = await dataApplicationService.getApplicationStats(uid);
                setStats(s);
            }
        };
        load();
    }, []);

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">Importar dados da empresa com IA</h1>
                        <p className="text-sm text-muted-foreground">Envie um documento (PDF, DOCX, TXT) com brand voice, personas e diretrizes. A IA extrai e cria tudo automaticamente.</p>
                    </div>
                </div>
                <Badge variant="secondary" className="hidden sm:inline-flex">Beta</Badge>
            </div>

            {userId && stats && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Resumo atual</CardTitle>
                        <CardDescription>Itens já cadastrados no seu espaço de trabalho</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-lg border p-3">
                                <div className="text-xs text-muted-foreground">Brand Voices</div>
                                <div className="text-2xl font-semibold">{stats.totalBrandVoices}</div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-xs text-muted-foreground">Personas</div>
                                <div className="text-2xl font-semibold">{stats.totalPersonas}</div>
                            </div>
                            <div className="rounded-lg border p-3">
                                <div className="text-xs text-muted-foreground">Campanhas</div>
                                <div className="text-2xl font-semibold">{stats.totalCampaigns}</div>
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground">
                            Última importação: {stats.lastApplication ? new Date(stats.lastApplication).toLocaleString() : '—'}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card id="import-upload">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload único e aplicação automática
                    </CardTitle>
                    <CardDescription>Um único upload cria Brand Voice, Personas e Campanhas. Você não precisará reenviar nas outras páginas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DocumentUploadFlow />
                    <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Os itens criados aparecerão automaticamente nas telas de Brand Voices, Personas e Campanhas.
                    </div>
                </CardContent>
            </Card>

            <Alert>
                <BarChart3 className="h-4 w-4" />
                <AlertDescription className="text-sm">
                    Dica: após importar, visite Analytics para ver insights baseados nos dados e use o Composer para gerar copies já com a sua voz de marca.
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default ImportData;
