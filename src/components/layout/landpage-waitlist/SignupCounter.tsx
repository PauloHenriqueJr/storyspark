import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Clock } from 'lucide-react';
import type { WaitlistStats } from '@/types/waitlist';

export default function SignupCounter({ seed = 2847 }: { seed?: number }) {
  const [count, setCount] = useState<number>(() => {
    if (typeof window === 'undefined') return seed;
    const stored = Number(localStorage.getItem('storyspark-waitlist-count') || '0');
    return stored > 0 ? stored : seed;
  });

  const [lastAt, setLastAt] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('storyspark-waitlist-last') || null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // On mount: try to fetch authoritative stats from DB via RPC
    let mounted = true;
    
    const fetchStats = async () => {
      if (isLoading) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_waitlist_stats');
        
        if (!mounted) return;
        
        if (!error && data) {
          // data can be an array or object depending on client
          const row: WaitlistStats = Array.isArray(data) ? data[0] : data;
          const newCount = Number(row?.count ?? 0);
          const lastCreated = row?.last_created_at ?? null;
          
          if (newCount > 0) {
            setCount(newCount);
            // Persist to localStorage for faster subsequent loads
            try {
              localStorage.setItem('storyspark-waitlist-count', String(newCount));
            } catch {
              // Ignore localStorage errors
            }
          }
          
          if (lastCreated) {
            const lastAtISO = new Date(lastCreated).toISOString();
            setLastAt(lastAtISO);
            try {
              localStorage.setItem('storyspark-waitlist-last', lastAtISO);
            } catch {
              // Ignore localStorage errors
            }
          }
        }
      } catch {
        // ignore RPC errors and keep fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    const handler = () => {
      try {
        const stored = Number(localStorage.getItem('storyspark-waitlist-count') || '0');
        if (stored > 0) {
          setCount(stored);
        } else {
          setCount(c => c + 1);
        }
        setLastAt(localStorage.getItem('storyspark-waitlist-last'));
      } catch {
        setCount(c => c + 1);
        setLastAt(new Date().toISOString());
      }
    };
    
    window.addEventListener('waitlist:added', handler as EventListener);
    return () => {
      mounted = false;
      window.removeEventListener('waitlist:added', handler as EventListener);
    };
  }, [seed, isLoading]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  return (
    <div 
      className="inline-flex flex-col items-center sm:flex-row sm:items-center gap-3 text-sm sm:text-base text-muted-foreground bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-lg border border-primary/10" 
      role="status"
      aria-live="polite"
      aria-label="Estatísticas da lista de espera"
    >
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" aria-hidden="true" />
        <div className="text-2xl sm:text-3xl font-bold text-primary">
          {count.toLocaleString()}
        </div>
        <span className="text-sm font-medium text-foreground">inscritos</span>
      </div>
      
      <div className="hidden sm:block w-px h-6 bg-border" aria-hidden="true"></div>
      
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <Clock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <span>última: <span className="font-medium">{formatDate(lastAt)}</span></span>
      </div>
      
      {/* Screen readers: announce updates */}
      <span className="sr-only">
        {count} inscritos na lista de espera; última inscrição: {formatDate(lastAt)}
      </span>
    </div>
  );
}
