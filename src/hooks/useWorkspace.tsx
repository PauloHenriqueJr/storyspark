
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
  const { user, isAuthenticated } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!isAuthenticated || !user) {
        setWorkspace(null);
        setLoading(false);
        return;
      }

      // Cache simples para workspace (atualizado por realtime quando disponível)
      const cacheKey = `workspace_${user.id}`;
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);

      if (cached && cacheTime) {
        const ageMinutes = (Date.now() - parseInt(cacheTime)) / (1000 * 60);
        if (ageMinutes < 10) { // Cache por 10 minutos
          setWorkspace(JSON.parse(cached));
          setLoading(false);
          // segue adiante para (re)assinar realtime
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

          setWorkspace(workspaceWithCredits);
          // Cache o workspace
          const cacheKey = `workspace_${user.id}`;
          localStorage.setItem(cacheKey, JSON.stringify(workspaceWithCredits));
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString());

          // Realtime: assinar mudanças em profiles (credits) e workspaces (credits_used, plan)
          try {
            // Perfil (créditos do usuário)
            const profileChannel = supabase.channel(`realtime-profile-${user.id}`)
              .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, (payload) => {
                const newCredits = (payload.new as any)?.credits;
                if (typeof newCredits === 'number') {
                  setWorkspace((prev) => {
                    if (!prev) return prev;
                    const updated = { ...prev, credits: newCredits } as any;
                    localStorage.setItem(cacheKey, JSON.stringify(updated));
                    localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
                    return updated;
                  });
                }
              })
              .subscribe();

            // Workspace (credits_used, plan etc.)
            const wsId = workspace.id;
            const workspaceChannel = supabase.channel(`realtime-workspace-${wsId}`)
              .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'workspaces', filter: `id=eq.${wsId}` }, (payload) => {
                const updatedRow = payload.new as any;
                setWorkspace((prev) => {
                  if (!prev) return prev;
                  const updated = {
                    ...prev,
                    credits_used: typeof updatedRow.credits_used === 'number' ? updatedRow.credits_used : prev.credits_used,
                    plan: updatedRow.plan ?? prev.plan,
                  } as any;
                  localStorage.setItem(cacheKey, JSON.stringify(updated));
                  localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
                  return updated;
                });
              })
              .subscribe();

            // Cleanup quando usuário mudar
            return () => {
              try { profileChannel.unsubscribe(); } catch { }
              try { workspaceChannel.unsubscribe(); } catch { }
            };
          } catch (e) {
            console.warn('Falha ao assinar realtime de créditos:', e);
          }
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
