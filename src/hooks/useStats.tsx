
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

interface Stats {
  totalCampaigns: number;
  engagementRate: string;
  totalReach: string;
  copiesGenerated: number;
}

export const useStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalCampaigns: 0,
    engagementRate: '0%',
    totalReach: '0',
    copiesGenerated: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        // Usar stats padrão se não houver usuário
        setStats({
          totalCampaigns: 3,
          engagementRate: '12.5%',
          totalReach: '2.4K',
          copiesGenerated: 7
        });
        setLoading(false);
        return;
      }

      // Cache simples - verificar se já temos dados salvos recentemente
      const cacheKey = `stats_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);
      
      if (cached && cacheTime) {
        const ageMinutes = (Date.now() - parseInt(cacheTime)) / (1000 * 60);
        if (ageMinutes < 5) { // Cache por 5 minutos
          setStats(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      try {
        // Get user's workspace
        const { data: workspaces } = await supabase
          .from('workspaces')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1);

        if (!workspaces || workspaces.length === 0) {
          setLoading(false);
          return;
        }

        const workspaceId = workspaces[0].id;

        // Fetch campaigns count
        const { count: campaignsCount } = await supabase
          .from('campaigns')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspaceId);

        // Fetch generated copies count
        const { count: copiesCount } = await supabase
          .from('generated_copies')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspaceId);

        // Calculate engagement rate (mock calculation for now)
        const engagementRate = copiesCount ? Math.min(95, 70 + (copiesCount * 2)) : 0;
        
        // Calculate reach (mock calculation for now)
        const reach = copiesCount ? copiesCount * 150 + Math.floor(Math.random() * 1000) : 0;

        const newStats = {
          totalCampaigns: campaignsCount || 0,
          engagementRate: `${engagementRate.toFixed(1)}%`,
          totalReach: reach > 1000 ? `${(reach / 1000).toFixed(1)}K` : reach.toString(),
          copiesGenerated: copiesCount || 0
        };

        setStats(newStats);
        
        // Cache os dados por 5 minutos
        const cacheKey = `stats_${user.id}`;
        localStorage.setItem(cacheKey, JSON.stringify(newStats));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Em caso de erro, usar dados padrão
        const fallbackStats = {
          totalCampaigns: 0,
          engagementRate: '0%',
          totalReach: '0',
          copiesGenerated: 0
        };
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
};
