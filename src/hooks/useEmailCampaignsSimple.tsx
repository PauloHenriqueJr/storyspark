import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface EmailCampaign {
    id: string;
    name: string;
    subject: string;
    template_id?: string;
    template_name?: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
    recipients: number;
    target_list_id?: string;
    target_list_name?: string;
    html_content?: string;
    text_content?: string;
    scheduled_for?: string;
    sent_at?: string;
    created_at: string;
    updated_at: string;
    created_by?: string;

    // Métricas
    total_sent?: number;
    total_delivered?: number;
    total_bounced?: number;
    total_opened?: number;
    total_clicked?: number;
    unique_opens?: number;
    unique_clicks?: number;

    // Campos calculados
    opens: number;
    clicks: number;
    open_rate?: number;
    click_rate?: number;
    delivery_rate?: number;
    bounce_rate?: number;
}

export interface CreateCampaignInput {
    name: string;
    subject: string;
    template_id?: string;
    target_list_id?: string;
    html_content?: string;
    text_content?: string;
    scheduled_for?: string;
    status?: 'draft' | 'scheduled';
}

export interface CampaignStats {
    total_campaigns: number;
    active_campaigns: number;
    sent_campaigns: number;
    draft_campaigns: number;
    scheduled_campaigns: number;
    total_sent: number;
    total_delivered: number;
    total_opened: number;
    total_clicked: number;
    avg_open_rate: number;
    avg_click_rate: number;
    avg_delivery_rate: number;
}

export const useEmailCampaigns = () => {
    // Criar campanhas de exemplo iniciais
    const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
        {
            id: '1',
            name: 'Newsletter Semanal',
            subject: 'Novidades da Semana',
            status: 'sent',
            recipients: 1250,
            opens: 875,
            clicks: 234,
            sent_at: '2024-01-15T10:00:00Z',
            template_name: 'Newsletter Promocional',
            created_at: '2024-01-15T09:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
            total_sent: 1250,
            total_delivered: 1240,
            total_bounced: 10,
            total_opened: 875,
            total_clicked: 234,
            unique_opens: 800,
            unique_clicks: 200,
            open_rate: 70.0,
            click_rate: 18.7,
            delivery_rate: 99.2,
            bounce_rate: 0.8,
        },
        {
            id: '2',
            name: 'Promoção Black Friday',
            subject: 'Ofertas Imperdíveis - Black Friday',
            status: 'scheduled',
            recipients: 2500,
            opens: 0,
            clicks: 0,
            scheduled_for: '2024-01-20T09:00:00Z',
            template_name: 'Newsletter Promocional',
            created_at: '2024-01-15T14:00:00Z',
            updated_at: '2024-01-15T14:00:00Z',
            total_sent: 0,
            total_delivered: 0,
            total_bounced: 0,
            total_opened: 0,
            total_clicked: 0,
            unique_opens: 0,
            unique_clicks: 0,
            open_rate: 0,
            click_rate: 0,
            delivery_rate: 0,
            bounce_rate: 0,
        },
        {
            id: '3',
            name: 'Onboarding Novos Usuários',
            subject: 'Bem-vindo à nossa plataforma!',
            status: 'draft',
            recipients: 0,
            opens: 0,
            clicks: 0,
            template_name: 'E-mail de Boas-vindas',
            created_at: '2024-01-16T10:00:00Z',
            updated_at: '2024-01-16T10:00:00Z',
            total_sent: 0,
            total_delivered: 0,
            total_bounced: 0,
            total_opened: 0,
            total_clicked: 0,
            unique_opens: 0,
            unique_clicks: 0,
            open_rate: 0,
            click_rate: 0,
            delivery_rate: 0,
            bounce_rate: 0,
        },
        {
            id: '4',
            name: 'Convite Waitlist - Beta',
            subject: 'Você foi selecionado para nosso beta!',
            status: 'sent',
            recipients: 500,
            opens: 420,
            clicks: 180,
            sent_at: '2024-01-10T08:00:00Z',
            template_name: 'Convite da Waitlist',
            created_at: '2024-01-10T07:00:00Z',
            updated_at: '2024-01-10T08:00:00Z',
            total_sent: 500,
            total_delivered: 495,
            total_bounced: 5,
            total_opened: 420,
            total_clicked: 180,
            unique_opens: 380,
            unique_clicks: 150,
            open_rate: 84.0,
            click_rate: 36.0,
            delivery_rate: 99.0,
            bounce_rate: 1.0,
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<CampaignStats>({
        total_campaigns: 0,
        active_campaigns: 0,
        sent_campaigns: 0,
        draft_campaigns: 0,
        scheduled_campaigns: 0,
        total_sent: 0,
        total_delivered: 0,
        total_opened: 0,
        total_clicked: 0,
        avg_open_rate: 0,
        avg_click_rate: 0,
        avg_delivery_rate: 0,
    });

    // Carregar campanhas (simulado)
    const loadCampaigns = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simular carregamento
            await new Promise(resolve => setTimeout(resolve, 300));

            await loadStats(campaigns);

        } catch (err) {
            console.error('Erro ao carregar campanhas:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    // Carregar estatísticas
    const loadStats = async (campaignData?: EmailCampaign[]) => {
        try {
            const data = campaignData || campaigns;

            const calculatedStats: CampaignStats = {
                total_campaigns: data.length,
                active_campaigns: data.filter(c => ['sending', 'scheduled'].includes(c.status)).length,
                sent_campaigns: data.filter(c => c.status === 'sent').length,
                draft_campaigns: data.filter(c => c.status === 'draft').length,
                scheduled_campaigns: data.filter(c => c.status === 'scheduled').length,
                total_sent: data.reduce((sum, c) => sum + (c.total_sent || 0), 0),
                total_delivered: data.reduce((sum, c) => sum + (c.total_delivered || 0), 0),
                total_opened: data.reduce((sum, c) => sum + (c.total_opened || 0), 0),
                total_clicked: data.reduce((sum, c) => sum + (c.total_clicked || 0), 0),
                avg_open_rate: data.length > 0 ? Number((data.reduce((sum, c) => sum + (c.open_rate || 0), 0) / data.length).toFixed(1)) : 0,
                avg_click_rate: data.length > 0 ? Number((data.reduce((sum, c) => sum + (c.click_rate || 0), 0) / data.length).toFixed(1)) : 0,
                avg_delivery_rate: data.length > 0 ? Number((data.reduce((sum, c) => sum + (c.delivery_rate || 0), 0) / data.length).toFixed(1)) : 0,
            };

            setStats(calculatedStats);
        } catch (err) {
            console.error('Erro ao calcular estatísticas:', err);
        }
    };

    // Criar campanha
    const createCampaign = async (input: CreateCampaignInput): Promise<EmailCampaign | null> => {
        try {
            const newCampaign: EmailCampaign = {
                id: Date.now().toString(),
                name: input.name,
                subject: input.subject,
                template_id: input.template_id,
                template_name: input.template_id ? 'Template Selecionado' : undefined,
                status: input.status || 'draft',
                recipients: 0,
                target_list_id: input.target_list_id,
                html_content: input.html_content,
                text_content: input.text_content,
                scheduled_for: input.scheduled_for,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                opens: 0,
                clicks: 0,
                total_sent: 0,
                total_delivered: 0,
                total_bounced: 0,
                total_opened: 0,
                total_clicked: 0,
                unique_opens: 0,
                unique_clicks: 0,
                open_rate: 0,
                click_rate: 0,
                delivery_rate: 0,
                bounce_rate: 0,
            };

            setCampaigns(prev => [newCampaign, ...prev]);
            toast.success('Campanha criada com sucesso!');
            await loadStats([newCampaign, ...campaigns]);

            return newCampaign;
        } catch (err) {
            console.error('Erro ao criar campanha:', err);
            toast.error('Erro ao criar campanha');
            return null;
        }
    };

    // Atualizar campanha
    const updateCampaign = async (id: string, updates: Partial<CreateCampaignInput>): Promise<boolean> => {
        try {
            setCampaigns(prev =>
                prev.map(campaign =>
                    campaign.id === id
                        ? { ...campaign, ...updates, updated_at: new Date().toISOString() }
                        : campaign
                )
            );

            toast.success('Campanha atualizada com sucesso!');
            return true;
        } catch (err) {
            console.error('Erro ao atualizar campanha:', err);
            toast.error('Erro ao atualizar campanha');
            return false;
        }
    };

    // Deletar campanha
    const deleteCampaign = async (id: string): Promise<boolean> => {
        try {
            setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
            toast.success('Campanha removida com sucesso!');
            return true;
        } catch (err) {
            console.error('Erro ao deletar campanha:', err);
            toast.error('Erro ao deletar campanha');
            return false;
        }
    };

    // Duplicar campanha
    const duplicateCampaign = async (id: string): Promise<boolean> => {
        try {
            const originalCampaign = campaigns.find(c => c.id === id);
            if (!originalCampaign) {
                toast.error('Campanha não encontrada');
                return false;
            }

            const duplicatedCampaign: EmailCampaign = {
                ...originalCampaign,
                id: Date.now().toString(),
                name: originalCampaign.name + ' (Cópia)',
                status: 'draft',
                recipients: 0,
                opens: 0,
                clicks: 0,
                sent_at: undefined,
                scheduled_for: undefined,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                total_sent: 0,
                total_delivered: 0,
                total_bounced: 0,
                total_opened: 0,
                total_clicked: 0,
                unique_opens: 0,
                unique_clicks: 0,
                open_rate: 0,
                click_rate: 0,
                delivery_rate: 0,
                bounce_rate: 0,
            };

            setCampaigns(prev => [duplicatedCampaign, ...prev]);
            toast.success('Campanha duplicada com sucesso!');
            return true;
        } catch (err) {
            console.error('Erro ao duplicar campanha:', err);
            toast.error('Erro ao duplicar campanha');
            return false;
        }
    };

    // Enviar campanha
    const sendCampaign = async (id: string): Promise<boolean> => {
        try {
            setCampaigns(prev =>
                prev.map(campaign =>
                    campaign.id === id
                        ? {
                            ...campaign,
                            status: 'sent' as const,
                            sent_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            recipients: Math.floor(Math.random() * 1000) + 100, // Simular destinatários
                            total_sent: Math.floor(Math.random() * 1000) + 100,
                        }
                        : campaign
                )
            );

            toast.success('Campanha enviada com sucesso!');
            return true;
        } catch (err) {
            console.error('Erro ao enviar campanha:', err);
            toast.error('Erro ao enviar campanha');
            return false;
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    return {
        campaigns,
        loading,
        error,
        stats,
        loadCampaigns,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        duplicateCampaign,
        sendCampaign,
    };
};
