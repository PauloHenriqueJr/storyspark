
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

interface Activity {
  id: string;
  title: string;
  description: string;
  type: string;
  created_at: string;
}

export const useRecentActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) {
        // Retornar atividades padrão se não houver usuário
        setActivities([
          {
            id: '1',
            title: 'Copy criado',
            description: 'Criado copy para campanha de verão',
            type: 'content',
            created_at: new Date().toISOString()
          },
          {
            id: '2', 
            title: 'Campanha publicada',
            description: 'Campanha de Black Friday foi publicada',
            type: 'campaign',
            created_at: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
        setLoading(false);
        return;
      }

      // Cache simples para atividades
      const cacheKey = `activities_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);
      
      if (cached && cacheTime) {
        const ageMinutes = (Date.now() - parseInt(cacheTime)) / (1000 * 60);
        if (ageMinutes < 2) { // Cache por 2 minutos (atividades mudam mais frequentemente)
          setActivities(JSON.parse(cached));
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

        // Fetch recent activities
        const { data, error } = await supabase
          .from('user_activities')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching activities:', error);
        } else {
          setActivities(data || []);
        }
      } catch (error) {
        console.error('Error in activities fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  return { activities, loading };
};
