import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { supabase } from '@/lib/supabase';

interface CreditsContextValue {
  loading: boolean;
  credits: number;            // total credits assigned (or large number for unlimited)
  creditsUsed: number;        // used credits in workspace
  remainingCredits: number;   // computed remaining
  plan: string | undefined;
  refresh: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextValue | undefined>(undefined);

export const CreditsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { workspace, user, loading } = useWorkspace();

  const credits = useMemo(() => {
    if (!workspace) return 0;
    if (workspace.credits === -1) return 99999; // enterprise unlimited visual
    return workspace.credits || 0;
  }, [workspace]);

  const creditsUsed = useMemo(() => workspace?.credits_used || 0, [workspace]);

  const remainingCredits = useMemo(() => {
    if (!workspace) return 0;
    if (workspace.credits === -1) return 99999;
    return Math.max(0, (workspace.credits || 0) - (workspace.credits_used || 0));
  }, [workspace]);

  const plan = workspace?.plan;

  const refresh = useCallback(async () => {
    try {
      if (user?.id) {
        // Trigger a fetch for credits (profiles) — useWorkspace realtime deve refletir
        await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single();
      }
      if (workspace?.id) {
        await supabase
          .from('workspaces')
          .select('credits_used, plan')
          .eq('id', workspace.id)
          .single();
      }
    } catch (e) {
      // silencioso
    }
  }, [user?.id, workspace?.id]);

  const value: CreditsContextValue = {
    loading,
    credits,
    creditsUsed,
    remainingCredits,
    plan,
    refresh,
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = (): CreditsContextValue => {
  const ctx = useContext(CreditsContext);
  if (!ctx) throw new Error('useCredits must be used within CreditsProvider');
  return ctx;
};

