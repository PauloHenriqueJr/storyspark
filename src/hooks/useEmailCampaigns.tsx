import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
    const [loading, setLoading] = useState(true);
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

    // Criar tabela de campanhas se não existir
    const ensureCampaignsTable = async () => {
        try {
            const { error } = await supabase.rpc('execute_sql', {
                query: `
          CREATE TABLE IF NOT EXISTS email_campaigns (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            subject VARCHAR(500) NOT NULL,
            template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
            status VARCHAR(20) DEFAULT 'draft',
            target_list_id UUID,
            html_content TEXT,
            text_content TEXT,
            scheduled_for TIMESTAMP WITH TIME ZONE,
            sent_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_by UUID,
            
            -- Métricas
            total_sent INTEGER DEFAULT 0,
            total_delivered INTEGER DEFAULT 0,
            total_bounced INTEGER DEFAULT 0,
            total_opened INTEGER DEFAULT 0,
            total_clicked INTEGER DEFAULT 0,
            unique_opens INTEGER DEFAULT 0,
            unique_clicks INTEGER DEFAULT 0,
            
            CONSTRAINT valid_status CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled'))
          );
          
          CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
          CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON email_campaigns(created_at);
          CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled_for ON email_campaigns(scheduled_for);
        `
            });

            if (error) throw error;
        } catch (err) {
            console.error('Erro ao criar tabela de campanhas:', err);
        }
    };

    // Carregar campanhas
    const loadCampaigns = async () => {
        try {
            setLoading(true);
            setError(null);

            await ensureCampaignsTable();

            const { data: rawData, error: rawError } = await supabase
                .rpc('execute_sql', {
                    query: `
            SELECT 
              c.*,
              t.name as template_name,
              COALESCE(c.total_opened, 0) as opens,
              COALESCE(c.total_clicked, 0) as clicks,
              CASE 
                WHEN c.total_sent > 0 THEN ROUND((c.total_opened::float / c.total_sent) * 100, 2)
                ELSE 0 
              END as open_rate,
              CASE 
                WHEN c.total_sent > 0 THEN ROUND((c.total_clicked::float / c.total_sent) * 100, 2)
                ELSE 0 
              END as click_rate,
              CASE 
                WHEN c.total_sent > 0 THEN ROUND((c.total_delivered::float / c.total_sent) * 100, 2)
                ELSE 0 
              END as delivery_rate,
              CASE 
                WHEN c.total_sent > 0 THEN ROUND((c.total_bounced::float / c.total_sent) * 100, 2)
                ELSE 0 
              END as bounce_rate
            FROM email_campaigns c
            LEFT JOIN email_templates t ON c.template_id = t.id
            ORDER BY c.created_at DESC
          `
                });

            if (rawError) throw rawError;

            const mappedCampaigns: EmailCampaign[] = (rawData || []).map((campaign: any) => ({
                id: campaign.id,
                name: campaign.name,
                subject: campaign.subject,
                template_id: campaign.template_id,
                template_name: campaign.template_name,
                status: campaign.status,
                recipients: campaign.total_sent || 0,
                target_list_id: campaign.target_list_id,
                html_content: campaign.html_content,
                text_content: campaign.text_content,
                scheduled_for: campaign.scheduled_for,
                sent_at: campaign.sent_at,
                created_at: campaign.created_at,
                updated_at: campaign.updated_at,
                created_by: campaign.created_by,
                total_sent: campaign.total_sent || 0,
                total_delivered: campaign.total_delivered || 0,
                total_bounced: campaign.total_bounced || 0,
                total_opened: campaign.total_opened || 0,
                total_clicked: campaign.total_clicked || 0,
                unique_opens: campaign.unique_opens || 0,
                unique_clicks: campaign.unique_clicks || 0,
                opens: campaign.opens || 0,
                clicks: campaign.clicks || 0,
                open_rate: campaign.open_rate || 0,
                click_rate: campaign.click_rate || 0,
                delivery_rate: campaign.delivery_rate || 0,
                bounce_rate: campaign.bounce_rate || 0,
            }));

            setCampaigns(mappedCampaigns);
            await loadStats(mappedCampaigns);
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

            const stats: CampaignStats = {
                total_campaigns: data.length,
                active_campaigns: data.filter(c => ['sending', 'scheduled'].includes(c.status)).length,
                sent_campaigns: data.filter(c => c.status === 'sent').length,
                draft_campaigns: data.filter(c => c.status === 'draft').length,
                scheduled_campaigns: data.filter(c => c.status === 'scheduled').length,
                total_sent: data.reduce((sum, c) => sum + (c.total_sent || 0), 0),
                total_delivered: data.reduce((sum, c) => sum + (c.total_delivered || 0), 0),
                total_opened: data.reduce((sum, c) => sum + (c.total_opened || 0), 0),
                total_clicked: data.reduce((sum, c) => sum + (c.total_clicked || 0), 0),
                avg_open_rate: data.length > 0 ? data.reduce((sum, c) => sum + (c.open_rate || 0), 0) / data.length : 0,
                avg_click_rate: data.length > 0 ? data.reduce((sum, c) => sum + (c.click_rate || 0), 0) / data.length : 0,
                avg_delivery_rate: data.length > 0 ? data.reduce((sum, c) => sum + (c.delivery_rate || 0), 0) / data.length : 0,
            };

            setStats(stats);
        } catch (err) {
            console.error('Erro ao calcular estatísticas:', err);
        }
    };

    // Criar campanha
    const createCampaign = async (input: CreateCampaignInput): Promise<EmailCampaign | null> => {
        try {
            const { data, error } = await supabase
                .rpc('execute_sql', {
                    query: `
            INSERT INTO email_campaigns (
              name, subject, template_id, target_list_id, 
              html_content, text_content, scheduled_for, status
            ) VALUES (
              '${input.name}', '${input.subject}', 
              ${input.template_id ? `'${input.template_id}'` : 'NULL'},
              ${input.target_list_id ? `'${input.target_list_id}'` : 'NULL'},
              ${input.html_content ? `'${input.html_content.replace(/'/g, "''")}'` : 'NULL'},
              ${input.text_content ? `'${input.text_content.replace(/'/g, "''")}'` : 'NULL'},
              ${input.scheduled_for ? `'${input.scheduled_for}'` : 'NULL'},
              '${input.status || 'draft'}'
            ) RETURNING *
          `
                });

            if (error) throw error;

            toast.success('Campanha criada com sucesso!');
            await loadCampaigns();

            return data?.[0] || null;
        } catch (err) {
            console.error('Erro ao criar campanha:', err);
            toast.error('Erro ao criar campanha');
            return null;
        }
    };

    // Atualizar campanha
    const updateCampaign = async (id: string, updates: Partial<CreateCampaignInput>): Promise<boolean> => {
        try {
            const setClause = Object.entries(updates)
                .map(([key, value]) => {
                    if (value === null || value === undefined) return `${key} = NULL`;
                    if (typeof value === 'string') return `${key} = '${value.replace(/'/g, "''")}'`;
                    return `${key} = '${value}'`;
                })
                .join(', ');

            const { error } = await supabase
                .rpc('execute_sql', {
                    query: `
            UPDATE email_campaigns 
            SET ${setClause}, updated_at = NOW()
            WHERE id = '${id}'
          `
                });

            if (error) throw error;

            toast.success('Campanha atualizada com sucesso!');
            await loadCampaigns();
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
            const { error } = await supabase
                .rpc('execute_sql', {
                    query: `DELETE FROM email_campaigns WHERE id = '${id}'`
                });

            if (error) throw error;

            toast.success('Campanha removida com sucesso!');
            await loadCampaigns();
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
            const { data, error } = await supabase
                .rpc('execute_sql', {
                    query: `
            INSERT INTO email_campaigns (
              name, subject, template_id, target_list_id, 
              html_content, text_content, status
            ) 
            SELECT 
              name || ' (Cópia)', subject, template_id, target_list_id,
              html_content, text_content, 'draft'
            FROM email_campaigns 
            WHERE id = '${id}'
            RETURNING *
          `
                });

            if (error) throw error;

            toast.success('Campanha duplicada com sucesso!');
            await loadCampaigns();
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
            const { error } = await supabase
                .rpc('execute_sql', {
                    query: `
            UPDATE email_campaigns 
            SET status = 'sending', updated_at = NOW()
            WHERE id = '${id}'
          `
                });

            if (error) throw error;

            toast.success('Campanha enviada com sucesso!');
            await loadCampaigns();
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
