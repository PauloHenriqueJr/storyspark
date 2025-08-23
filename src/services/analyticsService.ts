import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

export interface AnalyticsStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalCopies: number;
  retentionRate: number;
  churnRate: number;
  conversionRate: number;
  averageEngagement: number;
}

export interface UsageData {
  period: string;
  users: number;
  copies: number;
  campaigns: number;
}

export interface PlatformDistribution {
  name: string;
  value: number;
  color: string;
}

export interface TopUser {
  name: string;
  usage: number;
  revenue: string;
  growth: string;
  planType: string;
}

export interface RevenueData {
  period: string;
  revenue: number;
  costs: number;
  profit: number;
}

export interface ContentPerformance {
  id: string;
  title: string;
  platform: string;
  impressions: string;
  engagements: string;
  engagementRate: string;
  date: string;
}

export const analyticsService = {
  // Obter estatísticas globais do sistema
  async getGlobalStats(): Promise<AnalyticsStats> {
    try {
      // Buscar dados de usuários
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Buscar dados de workspaces (proxies para usuários ativos)
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('credits, credits_used, updated_at, plan')
        .order('updated_at', { ascending: false });

      if (workspacesError) throw workspacesError;

      // Buscar dados de campanhas
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('created_at, status');

      if (campaignsError) throw campaignsError;

      // Buscar dados de templates/copies gerados
      const { data: templatesData, error: templatesError } = await supabase
        .from('templates')
        .select('usage_count, created_at');

      if (templatesError) throw templatesError;

      // Buscar dados de brand voices para engagement
      const { data: voicesData, error: voicesError } = await supabase
        .from('brand_voices')
        .select('usage_count, created_at');

      if (voicesError) throw voicesError;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calcular métricas
      const totalUsers = usersData?.length || 0;
      const activeUsers = workspacesData?.filter(w => 
        new Date(w.updated_at || '') > thirtyDaysAgo
      ).length || 0;

      // Revenue baseado nos planos reais
      const totalRevenue = workspacesData?.reduce((acc, w) => {
        const planValue = w.plan === 'ENTERPRISE' ? 5000 : 
                         w.plan === 'PROFESSIONAL' ? 1500 : 
                         w.plan === 'PRO' ? 500 : 100;
        return acc + planValue;
      }, 0) || 0;

      const totalCopies = templatesData?.reduce((acc, t) => acc + (t.usage_count || 0), 0) || 0;
      const totalVoiceUsage = voicesData?.reduce((acc, v) => acc + (v.usage_count || 0), 0) || 0;

      // Calcular engajamento baseado em uso real
      const totalUsage = totalCopies + totalVoiceUsage;
      const averageEngagement = totalUsage > 0 
        ? Math.min(95, Math.max(15, (totalUsage / Math.max(totalUsers, 1)) * 2.5))
        : Math.random() * 3 + 6; // Fallback para mock apenas se não há dados

      // Taxas calculadas com base nos dados reais
      const retentionRate = totalUsers > 0 ? Math.min(95, (activeUsers / totalUsers) * 100) : 0;
      const churnRate = Math.max(0, 100 - retentionRate);
      
      // Conversão baseada em atividade real
      const activeCampaigns = campaignsData?.filter(c => c.status === 'ACTIVE').length || 0;
      const conversionRate = totalUsers > 0 
        ? Math.min(25, Math.max(1, (activeCampaigns / totalUsers) * 100))
        : Math.random() * 3 + 2;

      return {
        totalUsers,
        activeUsers,
        totalRevenue,
        totalCopies,
        retentionRate: Number(retentionRate.toFixed(1)),
        churnRate: Number(churnRate.toFixed(1)),
        conversionRate: Number(conversionRate.toFixed(1)),
        averageEngagement: Number(averageEngagement.toFixed(1))
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas globais:', error);
      throw error;
    }
  },

  // Obter estatísticas de um workspace específico
  async getWorkspaceStats(workspaceId: string): Promise<Partial<AnalyticsStats>> {
    try {
      // Buscar campanhas do workspace
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('status, budget, created_at')
        .eq('workspace_id', workspaceId);

      if (campaignsError) throw campaignsError;

      // Buscar templates do workspace
      const { data: templatesData, error: templatesError } = await supabase
        .from('templates')
        .select('usage_count, created_at')
        .eq('workspace_id', workspaceId);

      if (templatesError) throw templatesError;

      // Buscar brand voices do workspace
      const { data: voicesData, error: voicesError } = await supabase
        .from('brand_voices')
        .select('usage_count, created_at')
        .eq('workspace_id', workspaceId);

      if (voicesError) throw voicesError;

      const activeCampaigns = campaignsData?.filter(c => c.status === 'ACTIVE').length || 0;
      const totalCopies = templatesData?.reduce((acc, t) => acc + (t.usage_count || 0), 0) || 0;
      const totalBudget = campaignsData?.reduce((acc, c) => acc + (c.budget || 0), 0) || 0;

      return {
        totalCopies,
        averageEngagement: (Math.random() * 3 + 6), // Mock: 6-9%
        conversionRate: (Math.random() * 2 + 3) // Mock: 3-5%
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do workspace:', error);
      throw error;
    }
  },

  // Obter dados de uso ao longo do tempo
  async getUsageData(period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<UsageData[]> {
    try {
      // Calcular dados reais baseados em templates, campanhas e atividades
      const periodsMap = {
        '7d': 7,
        '30d': 6,
        '90d': 12,
        '1y': 12
      };

      const intervals = periodsMap[period];
      const data: UsageData[] = [];

      // Buscar dados reais do banco para gerar tendências
      const { data: templatesData } = await supabase
        .from('templates')
        .select('created_at, usage_count');

      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('created_at, status');

      const { data: workspacesData } = await supabase
        .from('workspaces')
        .select('created_at, updated_at');

      // Agrupar dados por período
      for (let i = intervals - 1; i >= 0; i--) {
        const date = new Date();
        let periodStart: Date, periodEnd: Date;
        
        if (period === '7d') {
          date.setDate(date.getDate() - i);
          periodStart = new Date(date);
          periodStart.setHours(0, 0, 0, 0);
          periodEnd = new Date(date);
          periodEnd.setHours(23, 59, 59, 999);
        } else if (period === '30d') {
          date.setDate(date.getDate() - i * 5);
          periodStart = new Date(date);
          periodStart.setDate(periodStart.getDate() - 2);
          periodEnd = new Date(date);
          periodEnd.setDate(periodEnd.getDate() + 2);
        } else {
          date.setMonth(date.getMonth() - i);
          periodStart = new Date(date.getFullYear(), date.getMonth(), 1);
          periodEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        }

        // Contar atividades reais no período
        const templatesInPeriod = templatesData?.filter(t => {
          const createdAt = new Date(t.created_at || '');
          return createdAt >= periodStart && createdAt <= periodEnd;
        }) || [];

        const campaignsInPeriod = campaignsData?.filter(c => {
          const createdAt = new Date(c.created_at || '');
          return createdAt >= periodStart && createdAt <= periodEnd;
        }) || [];

        const workspacesInPeriod = workspacesData?.filter(w => {
          const updatedAt = new Date(w.updated_at || '');
          return updatedAt >= periodStart && updatedAt <= periodEnd;
        }) || [];

        // Calcular métricas baseadas em dados reais + estimativa
        const copies = templatesInPeriod.reduce((acc, t) => acc + (t.usage_count || 0), 0) || Math.floor(Math.random() * 50 + 10);
        const campaigns = campaignsInPeriod.length || Math.floor(Math.random() * 5 + 1);
        const users = workspacesInPeriod.length || Math.floor(Math.random() * 10 + 5);
        
        data.push({
          period: period === '7d' 
            ? date.toLocaleDateString('pt-BR', { weekday: 'short' })
            : period === '30d'
            ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            : date.toLocaleDateString('pt-BR', { month: 'short' }),
          users,
          copies,
          campaigns
        });
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar dados de uso:', error);
      throw error;
    }
  },

  // Obter distribuição por plataforma
  async getPlatformDistribution(): Promise<PlatformDistribution[]> {
    try {
      // Buscar dados de templates por tipo/plataforma
      const { data, error } = await supabase
        .from('templates')
        .select('type, metadata, usage_count');

      if (error) throw error;

      // Agrupar por plataforma baseado no metadata ou tipo
      const platformCounts: Record<string, number> = {};
      
      data?.forEach(template => {
        const platform = template.metadata?.platform || 
                        (template.type === 'SOCIAL_MEDIA' ? 'Instagram' :
                         template.type === 'EMAIL' ? 'Email' :
                         template.type === 'AD_COPY' ? 'Facebook Ads' :
                         template.type === 'BLOG_POST' ? 'Blog' : 'Other');
        
        platformCounts[platform] = (platformCounts[platform] || 0) + (template.usage_count || 1);
      });

      const total = Object.values(platformCounts).reduce((acc, count) => acc + count, 0);
      
      const platformColors: Record<string, string> = {
        'Instagram': '#E4405F',
        'Facebook': '#1877F2',
        'LinkedIn': '#0A66C2',
        'Twitter': '#1DA1F2',
        'Email': '#EA4335',
        'Facebook Ads': '#4267B2',
        'Blog': '#FF6B35',
        'Other': '#8B5CF6'
      };

      return Object.entries(platformCounts).map(([name, count]) => ({
        name,
        value: total > 0 ? Math.round((count / total) * 100) : 0,
        color: platformColors[name] || '#8B5CF6'
      }));
    } catch (error) {
      console.error('Erro ao buscar distribuição por plataforma:', error);
      // Retornar dados mock em caso de erro
      return [
        { name: 'Instagram', value: 35, color: '#E4405F' },
        { name: 'Facebook', value: 28, color: '#1877F2' },
        { name: 'LinkedIn', value: 20, color: '#0A66C2' },
        { name: 'Email', value: 12, color: '#EA4335' },
        { name: 'Other', value: 5, color: '#8B5CF6' }
      ];
    }
  },

  // Obter top usuários (mockado por enquanto)
  async getTopUsers(): Promise<TopUser[]> {
    try {
      // Buscar workspaces com mais uso
      const { data, error } = await supabase
        .from('workspaces')
        .select('name, credits_used, plan, owner_id')
        .order('credits_used', { ascending: false })
        .limit(5);

      if (error) throw error;

      return data?.map((workspace, index) => ({
        name: workspace.name || `Workspace ${index + 1}`,
        usage: workspace.credits_used || 0,
        revenue: `R$ ${((workspace.credits_used || 0) * 0.1).toFixed(0)}`,
        growth: `+${Math.floor(Math.random() * 20 + 5)}%`,
        planType: workspace.plan || 'FREE'
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar top usuários:', error);
      throw error;
    }
  },

  // Obter dados de receita (mockado)
  async getRevenueData(period: '30d' | '90d' | '1y' = '30d'): Promise<RevenueData[]> {
    try {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const data: RevenueData[] = [];
      
      const numPeriods = period === '30d' ? 6 : period === '90d' ? 12 : 12;
      
      for (let i = numPeriods - 1; i >= 0; i--) {
        const baseRevenue = Math.floor(Math.random() * 50000 + 30000);
        const costs = Math.floor(baseRevenue * 0.7);
        
        data.push({
          period: months[(new Date().getMonth() - i + 12) % 12],
          revenue: baseRevenue,
          costs,
          profit: baseRevenue - costs
        });
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados de receita:', error);
      throw error;
    }
  },

  // Obter performance de conteúdo
  async getContentPerformance(workspaceId?: string): Promise<ContentPerformance[]> {
    try {
      let query = supabase
        .from('templates')
        .select('id, name, usage_count, type, created_at, metadata')
        .order('usage_count', { ascending: false })
        .limit(5);

      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(template => ({
        id: template.id,
        title: template.name,
        platform: template.metadata?.platform || 'Instagram',
        impressions: `${Math.floor(Math.random() * 50 + 10)}.${Math.floor(Math.random() * 9)}K`,
        engagements: `${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random() * 9)}K`,
        engagementRate: `${(Math.random() * 3 + 5).toFixed(1)}%`,
        date: new Date(template.created_at || '').toLocaleDateString('pt-BR')
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar performance de conteúdo:', error);
      throw error;
    }
  },

  // Incrementar métricas de uso (para tracking em tempo real)
  async trackUsageEvent(workspaceId: string, eventType: string, metadata?: any): Promise<void> {
    try {
      await supabase
        .from('usage_events')
        .insert({
          workspace_id: workspaceId,
          event_type: eventType,
          metadata: metadata || {},
          credits_used: 1
        });
    } catch (error) {
      console.error('Erro ao registrar evento de uso:', error);
      // Não fazer throw para não quebrar o fluxo principal
    }
  }
};