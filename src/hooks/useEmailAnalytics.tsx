import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface AnalyticsData {
    // Métricas gerais
    total_sent: number;
    total_delivered: number;
    total_bounced: number;
    total_complaints: number;

    // Taxas de engajamento
    open_rate: number;
    click_rate: number;
    bounce_rate: number;
    unsubscribe_rate: number;
    complaint_rate: number;

    // Performance de campanhas
    avg_revenue_per_email: number;
    total_revenue: number;
    roi: number;

    // Crescimento
    subscriber_growth_rate: number;
    campaign_frequency: number;

    // Dados temporais
    period_start: string;
    period_end: string;
    last_updated: string;
}

export interface CampaignPerformance {
    id: string;
    name: string;
    subject: string;
    sent_at: string;
    recipients: number;
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
    complaints: number;
    revenue: number;

    // Métricas calculadas
    open_rate: number;
    click_rate: number;
    bounce_rate: number;
    unsubscribe_rate: number;
    complaint_rate: number;
    revenue_per_recipient: number;
}

export interface TopPerformingTemplate {
    id: string;
    name: string;
    category: string;
    times_used: number;
    avg_open_rate: number;
    avg_click_rate: number;
    total_revenue: number;
    last_used: string;
}

export interface SubscriberInsights {
    total_subscribers: number;
    active_subscribers: number;
    new_subscribers_this_month: number;
    unsubscribed_this_month: number;
    growth_rate: number;

    // Segmentação
    by_status: {
        subscribed: number;
        unsubscribed: number;
        bounced: number;
        complained: number;
    };

    by_engagement: {
        highly_engaged: number;
        moderately_engaged: number;
        low_engaged: number;
        never_engaged: number;
    };
}

export interface TimeSeriesData {
    date: string;
    sent: number;
    opens: number;
    clicks: number;
    revenue: number;
}

export const useEmailAnalytics = () => {
    // Dados de analytics com informações realistas
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        total_sent: 15420,
        total_delivered: 14892,
        total_bounced: 312,
        total_complaints: 23,

        open_rate: 24.5,
        click_rate: 3.2,
        bounce_rate: 2.0,
        unsubscribe_rate: 0.8,
        complaint_rate: 0.15,

        avg_revenue_per_email: 1.85,
        total_revenue: 28527.40,
        roi: 4.2,

        subscriber_growth_rate: 12.5,
        campaign_frequency: 3.2,

        period_start: '2024-01-01T00:00:00Z',
        period_end: '2024-01-31T23:59:59Z',
        last_updated: new Date().toISOString(),
    });

    // Performance das campanhas
    const [campaignPerformances] = useState<CampaignPerformance[]>([
        {
            id: '1',
            name: 'Newsletter Semanal',
            subject: 'Novidades desta semana',
            sent_at: '2024-01-15T10:00:00Z',
            recipients: 1250,
            opens: 356,
            clicks: 51,
            bounces: 18,
            unsubscribes: 8,
            complaints: 1,
            revenue: 2840.50,
            open_rate: 28.5,
            click_rate: 4.1,
            bounce_rate: 1.4,
            unsubscribe_rate: 0.6,
            complaint_rate: 0.08,
            revenue_per_recipient: 2.27
        },
        {
            id: '2',
            name: 'Promoção Especial',
            subject: 'Ofertas imperdíveis só hoje!',
            sent_at: '2024-01-12T14:30:00Z',
            recipients: 2100,
            opens: 674,
            clicks: 122,
            bounces: 35,
            unsubscribes: 15,
            complaints: 3,
            revenue: 4125.75,
            open_rate: 32.1,
            click_rate: 5.8,
            bounce_rate: 1.7,
            unsubscribe_rate: 0.7,
            complaint_rate: 0.14,
            revenue_per_recipient: 1.96
        },
        {
            id: '3',
            name: 'Update de Produto',
            subject: 'Novidades da plataforma',
            sent_at: '2024-01-10T09:15:00Z',
            recipients: 950,
            opens: 183,
            clicks: 20,
            bounces: 12,
            unsubscribes: 3,
            complaints: 0,
            revenue: 890.25,
            open_rate: 19.3,
            click_rate: 2.1,
            bounce_rate: 1.3,
            unsubscribe_rate: 0.3,
            complaint_rate: 0.0,
            revenue_per_recipient: 0.94
        },
        {
            id: '4',
            name: 'Black Friday Preview',
            subject: 'Antecipação exclusiva - Black Friday',
            sent_at: '2024-01-08T16:00:00Z',
            recipients: 1800,
            opens: 892,
            clicks: 234,
            bounces: 28,
            unsubscribes: 12,
            complaints: 2,
            revenue: 8750.20,
            open_rate: 49.6,
            click_rate: 13.0,
            bounce_rate: 1.6,
            unsubscribe_rate: 0.7,
            complaint_rate: 0.11,
            revenue_per_recipient: 4.86
        }
    ]);

    // Templates com melhor performance
    const [topTemplates] = useState<TopPerformingTemplate[]>([
        {
            id: '1',
            name: 'Newsletter Promocional',
            category: 'Marketing',
            times_used: 15,
            avg_open_rate: 32.4,
            avg_click_rate: 6.8,
            total_revenue: 12450.80,
            last_used: '2024-01-15T10:00:00Z'
        },
        {
            id: '2',
            name: 'E-mail de Boas-vindas',
            category: 'Onboarding',
            times_used: 8,
            avg_open_rate: 68.9,
            avg_click_rate: 12.3,
            total_revenue: 5890.45,
            last_used: '2024-01-14T09:30:00Z'
        },
        {
            id: '3',
            name: 'Convite para Webinar',
            category: 'Eventos',
            times_used: 6,
            avg_open_rate: 45.2,
            avg_click_rate: 18.7,
            total_revenue: 3240.60,
            last_used: '2024-01-12T14:15:00Z'
        }
    ]);

    // Insights dos assinantes
    const [subscriberInsights] = useState<SubscriberInsights>({
        total_subscribers: 1880,
        active_subscribers: 1624,
        new_subscribers_this_month: 156,
        unsubscribed_this_month: 28,
        growth_rate: 7.3,

        by_status: {
            subscribed: 1624,
            unsubscribed: 198,
            bounced: 45,
            complained: 13
        },

        by_engagement: {
            highly_engaged: 320,
            moderately_engaged: 890,
            low_engaged: 414,
            never_engaged: 256
        }
    });

    // Dados de série temporal para gráficos
    const [timeSeriesData] = useState<TimeSeriesData[]>([
        { date: '2024-01-01', sent: 450, opens: 125, clicks: 18, revenue: 520.30 },
        { date: '2024-01-02', sent: 320, opens: 89, clicks: 12, revenue: 340.15 },
        { date: '2024-01-03', sent: 680, opens: 198, clicks: 28, revenue: 780.45 },
        { date: '2024-01-04', sent: 520, opens: 156, clicks: 22, revenue: 620.80 },
        { date: '2024-01-05', sent: 890, opens: 267, clicks: 42, revenue: 1150.25 },
        { date: '2024-01-08', sent: 1800, opens: 892, clicks: 234, revenue: 8750.20 },
        { date: '2024-01-10', sent: 950, opens: 183, clicks: 20, revenue: 890.25 },
        { date: '2024-01-12', sent: 2100, opens: 674, clicks: 122, revenue: 4125.75 },
        { date: '2024-01-15', sent: 1250, opens: 356, clicks: 51, revenue: 2840.50 },
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Carregar dados de analytics
    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simular carregamento
            await new Promise(resolve => setTimeout(resolve, 500));

            // Aqui seria feita a chamada à API real
            // const data = await analyticsService.getAnalytics();

        } catch (err) {
            console.error('Erro ao carregar analytics:', err);
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            toast.error('Erro ao carregar dados de analytics');
        } finally {
            setLoading(false);
        }
    };

    // Atualizar período de análise
    const updateAnalyticsPeriod = async (startDate: string, endDate: string) => {
        try {
            setLoading(true);

            // Simular atualização
            await new Promise(resolve => setTimeout(resolve, 300));

            setAnalytics(prev => ({
                ...prev,
                period_start: startDate,
                period_end: endDate,
                last_updated: new Date().toISOString()
            }));

            toast.success('Período atualizado com sucesso!');
        } catch (err) {
            console.error('Erro ao atualizar período:', err);
            toast.error('Erro ao atualizar período');
        } finally {
            setLoading(false);
        }
    };

    // Exportar relatório
    const exportReport = async (format: 'pdf' | 'excel' | 'csv' = 'pdf') => {
        try {
            setLoading(true);

            // Simular exportação
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success(`Relatório ${format.toUpperCase()} exportado com sucesso!`);
        } catch (err) {
            console.error('Erro ao exportar relatório:', err);
            toast.error('Erro ao exportar relatório');
        } finally {
            setLoading(false);
        }
    };

    // Obter comparação com período anterior
    const getComparison = (): { value: number, trend: 'up' | 'down' | 'stable' } => {
        // Simular comparação com período anterior
        const randomChange = (Math.random() - 0.5) * 20; // -10% a +10%
        return {
            value: Number(randomChange.toFixed(1)),
            trend: randomChange > 2 ? 'up' : randomChange < -2 ? 'down' : 'stable'
        };
    };

    // Calcular estatísticas de engajamento
    const getEngagementStats = () => {
        const totalEngaged = subscriberInsights.by_engagement.highly_engaged +
            subscriberInsights.by_engagement.moderately_engaged;
        const engagementRate = (totalEngaged / subscriberInsights.total_subscribers) * 100;

        return {
            engagement_rate: Number(engagementRate.toFixed(1)),
            highly_engaged_rate: Number(((subscriberInsights.by_engagement.highly_engaged / subscriberInsights.total_subscribers) * 100).toFixed(1)),
            never_engaged_rate: Number(((subscriberInsights.by_engagement.never_engaged / subscriberInsights.total_subscribers) * 100).toFixed(1))
        };
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    return {
        analytics,
        campaignPerformances,
        topTemplates,
        subscriberInsights,
        timeSeriesData,
        loading,
        error,
        loadAnalytics,
        updateAnalyticsPeriod,
        exportReport,
        getComparison,
        getEngagementStats,
    };
};
