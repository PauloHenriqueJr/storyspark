import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { dataApplicationService } from '@/services/dataApplicationService';
import { Upload, CheckCircle2, Users, Sparkles, Target } from 'lucide-react';

interface ImportDataContextProps {
    onAction?: (action: string, data?: any) => void;
}

export const ImportDataContext: React.FC<ImportDataContextProps> = ({ onAction }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{ totalBrandVoices: number; totalPersonas: number; totalCampaigns: number; lastApplication: string | null } | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const uid = session?.user?.id;
                if (!uid) return;
                const s = await dataApplicationService.getApplicationStats(uid);
                if (mounted) setStats(s);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    const goToUpload = () => {
        const el = document.getElementById('import-upload');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            onAction?.('scroll_to_upload');
        } else {
            // fallback: navega para página
            navigate('/import-data');
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="p-4 space-y-3">
                    <div className="text-sm text-muted-foreground">
                        Faça o upload do documento e a IA criará Brand Voice, Personas e Campanhas automaticamente.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Button variant="secondary" className="justify-start" onClick={goToUpload}>
                            <Upload className="w-4 h-4 mr-2" /> Ir para Upload
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/brand-voices')}>
                            <Sparkles className="w-4 h-4 mr-2" /> Ver Brand Voices
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => navigate('/personas')}>
                            <Users className="w-4 h-4 mr-2" /> Ver Personas
                        </Button>
                    </div>

                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/campaigns')}>
                        <Target className="w-4 h-4 mr-2" /> Ver Campanhas
                    </Button>

                    {!loading && stats && (
                        <Alert>
                            <CheckCircle2 className="w-4 h-4" />
                            <AlertDescription className="text-sm">
                                Atual: {stats.totalBrandVoices} brand voices, {stats.totalPersonas} personas, {stats.totalCampaigns} campanhas. Última importação: {stats.lastApplication ? new Date(stats.lastApplication).toLocaleString() : '—'}.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="text-xs text-muted-foreground">
                        Dicas para melhor qualidade: inclua tom de voz, público-alvo, objetivos e exemplos de mensagens.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ImportDataContext;
