import { useState, useEffect } from 'react';
import { useWorkspace } from './useWorkspace';
import { 
  analyticsService, 
  type AnalyticsStats, 
  type UsageData,
  type PlatformDistribution,
  type TopUser,
  type RevenueData,
  type ContentPerformance
} from '@/services/analyticsService';

export interface UseAnalyticsReturn {
  // Global stats
  globalStats: AnalyticsStats | null;
  workspaceStats: Partial<AnalyticsStats> | null;
  
  // Time-based data
  usageData: UsageData[];
  revenueData: RevenueData[];
  
  // Distribution and rankings
  platformDistribution: PlatformDistribution[];
  topUsers: TopUser[];
  contentPerformance: ContentPerformance[];
  
  // Loading and error states
  loading: boolean;
  error: string | null;
  
  // Methods
  refreshData: () => Promise<void>;
  trackEvent: (eventType: string, metadata?: any) => Promise<void>;
  setTimeRange: (range: '7d' | '30d' | '90d' | '1y') => void;
  timeRange: '7d' | '30d' | '90d' | '1y';
}

export const useAnalytics = (includeGlobal: boolean = false): UseAnalyticsReturn => {
  const [globalStats, setGlobalStats] = useState<AnalyticsStats | null>(null);
  const [workspaceStats, setWorkspaceStats] = useState<Partial<AnalyticsStats> | null>(null);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [platformDistribution, setPlatformDistribution] = useState<PlatformDistribution[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  const { workspace } = useWorkspace();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const promises: Promise<any>[] = [];

      // Fetch global stats if needed (for admin)
      if (includeGlobal) {
        promises.push(analyticsService.getGlobalStats());
      }

      // Fetch workspace-specific stats
      if (workspace?.id) {
        promises.push(analyticsService.getWorkspaceStats(workspace.id));
      }

      // Always fetch these data sets
      promises.push(
        analyticsService.getUsageData(timeRange),
        analyticsService.getPlatformDistribution(),
        analyticsService.getContentPerformance(workspace?.id)
      );

      // Conditionally fetch admin-only data
      if (includeGlobal) {
        promises.push(
          analyticsService.getTopUsers(),
          analyticsService.getRevenueData(timeRange)
        );
      }

      const results = await Promise.all(promises);
      
      let resultIndex = 0;
      
      if (includeGlobal) {
        setGlobalStats(results[resultIndex++]);
      }
      
      if (workspace?.id) {
        setWorkspaceStats(results[resultIndex++]);
      }
      
      setUsageData(results[resultIndex++]);
      setPlatformDistribution(results[resultIndex++]);
      setContentPerformance(results[resultIndex++]);
      
      if (includeGlobal) {
        setTopUsers(results[resultIndex++]);
        setRevenueData(results[resultIndex++]);
      }

    } catch (err) {
      console.error('Erro ao carregar dados de analytics:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  const trackEvent = async (eventType: string, metadata?: any) => {
    if (!workspace?.id) return;
    
    try {
      await analyticsService.trackUsageEvent(workspace.id, eventType, metadata);
    } catch (error) {
      console.error('Erro ao registrar evento:', error);
      // Não fazer throw para não quebrar o fluxo principal
    }
  };

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
    setTimeRange(range);
  };

  // Load data when workspace or timeRange changes
  useEffect(() => {
    fetchData();
  }, [workspace?.id, timeRange, includeGlobal]);

  // Refetch usage and revenue data when timeRange changes
  useEffect(() => {
    const fetchTimeBasedData = async () => {
      try {
        const [newUsageData, newRevenueData] = await Promise.all([
          analyticsService.getUsageData(timeRange),
          includeGlobal ? analyticsService.getRevenueData(timeRange) : Promise.resolve([])
        ]);
        
        setUsageData(newUsageData);
        if (includeGlobal) {
          setRevenueData(newRevenueData);
        }
      } catch (err) {
        console.error('Erro ao atualizar dados baseados no tempo:', err);
      }
    };

    if (!loading) {
      fetchTimeBasedData();
    }
  }, [timeRange]);

  return {
    globalStats,
    workspaceStats,
    usageData,
    revenueData,
    platformDistribution,
    topUsers,
    contentPerformance,
    loading,
    error,
    refreshData,
    trackEvent,
    setTimeRange: handleTimeRangeChange,
    timeRange
  };
};