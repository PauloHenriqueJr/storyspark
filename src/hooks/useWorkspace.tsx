
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  credits: number;
  credits_used: number;
  owner_id: string;
}

export const useWorkspace = () => {
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Cache simples para workspace
      const cacheKey = `workspace_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);
      
      if (cached && cacheTime) {
        const ageMinutes = (Date.now() - parseInt(cacheTime)) / (1000 * 60);
        if (ageMinutes < 10) { // Cache por 10 minutos
          setWorkspace(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      try {
        // Buscar créditos e tokens usados do profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('credits, monthly_tokens_used, plan, subscription_tier')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile credits:', profileError);
        }

        // Buscar workspace
        const { data: workspaces, error } = await supabase
          .from('workspaces')
          .select('*')
          .eq('owner_id', user.id)
          .limit(1);

        if (error) {
          console.error('Error fetching workspace:', error);
          setLoading(false);
          return;
        }

      if (workspaces && workspaces.length > 0) {
        // Usar dados do workspace diretamente, com fallback para profile se necessário
        const workspace = workspaces[0];
        
        // Verificar se há dados de teste (para admin)
        const debugCredits = localStorage.getItem('debug_credits');
        const testData = debugCredits ? JSON.parse(debugCredits) : null;
        
        const workspaceWithCredits = {
          ...workspace,
          credits: testData?.credits ?? workspace.credits ?? profile?.credits ?? 800,  // Default 800 para teste (plano Pro)
          credits_used: testData?.credits_used ?? workspace.credits_used ?? Math.floor((profile?.monthly_tokens_used || 0) / 100) ?? 200,  // Default 200 usado
          plan: testData?.plan ?? (workspace.plan || profile?.subscription_tier || 'pro')  // Default pro para teste
        };
        
        console.log('Workspace with credits:', workspaceWithCredits);
        
        setWorkspace(workspaceWithCredits);
        // Cache o workspace
        const cacheKey = `workspace_${user.id}`;
        localStorage.setItem(cacheKey, JSON.stringify(workspaceWithCredits));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        } else {
          // Create default workspace if none exists
          const { data: newWorkspace, error: createError } = await supabase
            .from('workspaces')
            .insert({
              name: `${user.name || 'Meu'} Workspace`,
              slug: `workspace-${user.id.slice(0, 8)}`,
              owner_id: user.id,
              plan: 'FREE'
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating workspace:', createError);
          } else {
            setWorkspace(newWorkspace);
            
            // Cache o workspace criado
            const cacheKey = `workspace_${user.id}`;
            localStorage.setItem(cacheKey, JSON.stringify(newWorkspace));
            localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
            
            // Add user as workspace member
            await supabase.from('workspace_members').insert({
              workspace_id: newWorkspace.id,
              user_id: user.id,
              role: 'OWNER'
            });
          }
        }
      } catch (error) {
        console.error('Error in workspace fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspace();
  }, [user]);

  return { workspace, user, loading };
};
