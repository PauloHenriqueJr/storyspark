
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
        setLoading(false);
        return;
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
