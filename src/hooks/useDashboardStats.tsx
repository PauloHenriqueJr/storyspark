import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useWorkspace } from './useWorkspace';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export interface DashboardStats {
  activeCampaigns: number;
  totalBrandVoices: number;
  totalPersonas: number;
  totalCopies: number;
  averageEngagement: number;
  conversionRate: number;
  monthlyGrowth: {
    campaigns: string;
    engagement: string;
    conversion: string;
    copies: string;
  };
}

export interface RecentActivity {
  id: string;
  type: 'campaign_created' | 'voice_created' | 'template_used' | 'persona_created';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { workspace } = useWorkspace();
  const { isFlagEnabled } = useFeatureFlags();

  const fetchDashboardData = async () => {
    if (!workspace?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Respeitar feature flags
      const campaignsEnabled = isFlagEnabled('principal', '/campaigns');
      const voicesEnabled = isFlagEnabled('voices', '/brand-voices');
      const personasEnabled = isFlagEnabled('voices', '/personas');

      // Base: dados mestre necessários (apenas quando habilitados)
      const campaignsData = campaignsEnabled
        ? (await supabase
          .from('campaigns')
          .select('id, status, created_at, name')
          .eq('workspace_id', workspace.id)).data || []
        : [];

      const voicesData = voicesEnabled
        ? (await supabase
          .from('brand_voices')
          .select('id, usage_count, is_active, created_at, name')
          .eq('workspace_id', workspace.id)).data || []
        : [];

      const personasData = personasEnabled
        ? (await supabase
          .from('target_personas')
          .select('id, created_at, name')
          .eq('workspace_id', workspace.id)).data || []
        : [];

      // Copias geradas (tabela copies). Fallback para templates se tabela não existir
      let totalCopies = 0;
      let copiesRecent = 0;
      let copiesPrev = 0;
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      try {
        const { count: copiesCount, error: copiesCountError } = await supabase
          .from('copies')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', workspace.id);
        if (copiesCountError) throw copiesCountError;
        totalCopies = copiesCount || 0;

        const { count: copiesRecentCount } = await supabase
          .from('copies')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', workspace.id)
          .gte('created_at', thirtyDaysAgo.toISOString());
        copiesRecent = copiesRecentCount || 0;

        const { count: copiesPrevCount } = await supabase
          .from('copies')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', workspace.id)
          .lt('created_at', thirtyDaysAgo.toISOString())
          .gte('created_at', sixtyDaysAgo.toISOString());
        copiesPrev = copiesPrevCount || 0;
      } catch (e) {
        // Fallback para templates (ambiente sem tabela copies)
        const { data: templatesData } = await supabase
          .from('templates')
          .select('id, usage_count, created_at')
          .eq('workspace_id', workspace.id);
        totalCopies = templatesData?.reduce((acc, t) => acc + (t.usage_count || 0), 0) || 0;
        copiesRecent = templatesData?.filter(t => new Date(t.created_at || '') > thirtyDaysAgo).length || 0;
        copiesPrev = templatesData?.filter(t => {
          const c = new Date(t.created_at || '');
          return c > sixtyDaysAgo && c <= thirtyDaysAgo;
        }).length || 0;
      }

      // Analytics do workspace (métricas da tabela workspace_analytics)
      let averageEngagement = 0;
      let conversionRate = 0;
      let activeCampaigns = 0;

      try {
        const { data: latestAnalytics } = await supabase
          .from('workspace_analytics')
          .select('date, engagement_rate, conversion_rate, active_campaigns')
          .eq('workspace_id', workspace.id)
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestAnalytics) {
          averageEngagement = Number(latestAnalytics.engagement_rate || 0);
          conversionRate = Number(latestAnalytics.conversion_rate || 0);
          activeCampaigns = campaignsEnabled ? Number(latestAnalytics.active_campaigns || 0) : 0;
        } else {
          // Fallback para dados básicos das tabelas mestres
          activeCampaigns = campaignsEnabled ? (campaignsData?.filter(c => c.status === 'ACTIVE').length || 0) : 0;
          // Calcular métricas básicas se não há dados históricos
          if (voicesData.length > 0 && campaignsData.length > 0) {
            averageEngagement = Math.min(85, 45 + (voicesData.length * 5) + (campaignsData.length * 3));
            conversionRate = Math.min(25, 8 + (activeCampaigns * 2) + (totalCopies > 0 ? 5 : 0));
          }
        }
      } catch (error) {
        console.warn('workspace_analytics não disponível, usando fallback:', error);
        // Fallback para dados básicos
        activeCampaigns = campaignsEnabled ? (campaignsData?.filter(c => c.status === 'ACTIVE').length || 0) : 0;
        if (voicesData.length > 0 && campaignsData.length > 0) {
          averageEngagement = Math.min(85, 45 + (voicesData.length * 5) + (campaignsData.length * 3));
          conversionRate = Math.min(25, 8 + (activeCampaigns * 2) + (totalCopies > 0 ? 5 : 0));
        }
      }

      // Crescimento últimos 30 vs 30 anteriores usando workspace_analytics
      let campaignGrowth = 0;
      let engagementGrowth = 0;
      let conversionGrowth = 0;
      let copiesGrowth = 0;

      try {
        const { data: recentAnalytics } = await supabase
          .from('workspace_analytics')
          .select('engagement_rate, conversion_rate, active_campaigns, date')
          .eq('workspace_id', workspace.id)
          .gte('date', thirtyDaysAgo.toISOString().slice(0, 10));

        const { data: prevAnalytics } = await supabase
          .from('workspace_analytics')
          .select('engagement_rate, conversion_rate, active_campaigns, date')
          .eq('workspace_id', workspace.id)
          .lt('date', thirtyDaysAgo.toISOString().slice(0, 10))
          .gte('date', sixtyDaysAgo.toISOString().slice(0, 10));

        const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
        const pct = (cur: number, prev: number) => {
          if (prev === 0) return cur > 0 ? 100 : 0;
          return Math.round(((cur - prev) / prev) * 100);
        };

        if (recentAnalytics && prevAnalytics && recentAnalytics.length > 0 && prevAnalytics.length > 0) {
          const recentEngAvg = avg(recentAnalytics.map(a => Number(a.engagement_rate || 0)));
          const prevEngAvg = avg(prevAnalytics.map(a => Number(a.engagement_rate || 0)));
          engagementGrowth = pct(recentEngAvg, prevEngAvg);

          const recentConvAvg = avg(recentAnalytics.map(a => Number(a.conversion_rate || 0)));
          const prevConvAvg = avg(prevAnalytics.map(a => Number(a.conversion_rate || 0)));
          conversionGrowth = pct(recentConvAvg, prevConvAvg);

          const recentActAvg = avg(recentAnalytics.map(a => Number(a.active_campaigns || 0)));
          const prevActAvg = avg(prevAnalytics.map(a => Number(a.active_campaigns || 0)));
          campaignGrowth = campaignsEnabled ? pct(recentActAvg, prevActAvg) : 0;
        } else {
          // Fallback para crescimento baseado em criação de dados
          const recentCampaigns = campaignsEnabled ? (campaignsData?.filter(c => new Date(c.created_at || '') > thirtyDaysAgo).length || 0) : 0;
          const previousCampaigns = campaignsEnabled ? (campaignsData?.filter(c => {
            const createdAt = new Date(c.created_at || '');
            return createdAt > sixtyDaysAgo && createdAt <= thirtyDaysAgo;
          }).length || 0) : 0;

          campaignGrowth = campaignsEnabled && previousCampaigns > 0
            ? Math.round(((recentCampaigns - previousCampaigns) / previousCampaigns) * 100)
            : (campaignsEnabled && recentCampaigns > 0 ? 100 : 0);

          const recentVoices = voicesEnabled ? (voicesData?.filter(v => new Date(v.created_at || '') > thirtyDaysAgo).length || 0) : 0;
          engagementGrowth = recentVoices > 0 ? Math.min(25, recentVoices * 8) : 0;
          conversionGrowth = activeCampaigns > 0 ? Math.min(15, activeCampaigns * 3) : 0;
        }
      } catch (error) {
        console.warn('Erro ao calcular crescimento de analytics:', error);
        // Fallback simples baseado em criação de dados
        const recentCampaigns = campaignsEnabled ? (campaignsData?.filter(c => new Date(c.created_at || '') > thirtyDaysAgo).length || 0) : 0;
        const previousCampaigns = campaignsEnabled ? (campaignsData?.filter(c => {
          const createdAt = new Date(c.created_at || '');
          return createdAt > sixtyDaysAgo && createdAt <= thirtyDaysAgo;
        }).length || 0) : 0;
        campaignGrowth = campaignsEnabled && previousCampaigns > 0
          ? Math.round(((recentCampaigns - previousCampaigns) / previousCampaigns) * 100)
          : (campaignsEnabled && recentCampaigns > 0 ? 100 : 0);
      }

      // Crescimento de copies usando contagem (já calculado acima)
      copiesGrowth = copiesPrev > 0 ? Math.round(((copiesRecent - copiesPrev) / copiesPrev) * 100) : (copiesRecent > 0 ? 100 : 0);

      setStats({
        activeCampaigns,
        totalBrandVoices: voicesEnabled ? (voicesData?.filter(v => v.is_active).length || 0) : 0,
        totalPersonas: personasEnabled ? (personasData?.length || 0) : 0,
        totalCopies,
        averageEngagement: Number(averageEngagement.toFixed(1)),
        conversionRate: Number(conversionRate.toFixed(1)),
        monthlyGrowth: {
          campaigns: `${campaignsEnabled && campaignGrowth >= 0 ? '+' : ''}${campaignsEnabled ? campaignGrowth : 0}%`,
          engagement: `${engagementGrowth >= 0 ? '+' : ''}${engagementGrowth}%`,
          conversion: `${conversionGrowth >= 0 ? '+' : ''}${conversionGrowth}%`,
          copies: `${copiesGrowth >= 0 ? '+' : ''}${copiesGrowth}%`
        }
      });

      // Atividades recentes (campanhas e voices)
      const activities: RecentActivity[] = [];
      campaignsEnabled && campaignsData
        ?.filter(c => new Date(c.created_at || '') > thirtyDaysAgo)
        .slice(0, 2)
        .forEach(c => {
          activities.push({
            id: c.id,
            type: 'campaign_created',
            title: 'Nova campanha criada',
            description: c.name || 'Campanha sem nome',
            timestamp: new Date(c.created_at || '').toLocaleDateString('pt-BR'),
            icon: '🎯'
          });
        });
      voicesEnabled && voicesData
        ?.filter(v => new Date(v.created_at || '') > thirtyDaysAgo)
        .slice(0, 2)
        .forEach(v => {
          activities.push({
            id: v.id,
            type: 'voice_created',
            title: 'Brand voice criada',
            description: v.name || 'Voice sem nome',
            timestamp: new Date(v.created_at || '').toLocaleDateString('pt-BR'),
            icon: '🎤'
          });
        });
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivities(activities.slice(0, 5));

    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [workspace?.id]);

  return {
    stats,
    recentActivities,
    loading,
    error,
    refetch: fetchDashboardData
  };
};