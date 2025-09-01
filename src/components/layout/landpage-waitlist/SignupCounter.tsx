import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

  useEffect(() => {
    // On mount: try to fetch authoritative stats from DB via RPC
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.rpc('get_waitlist_stats');
        if (!mounted) return;
        if (!error && data) {
          // data can be an array or object depending on client
          const row = Array.isArray(data) ? data[0] : data;
          const c = Number(row?.count ?? 0);
          const last = row?.last_created_at ?? null;
          if (c > 0) setCount(c);
          if (last) setLastAt(new Date(last).toISOString());
          // also persist to localStorage for faster subsequent loads
          try {
            localStorage.setItem('storyspark-waitlist-count', String(c));
            if (last) localStorage.setItem('storyspark-waitlist-last', new Date(last).toISOString());
          } catch {}
        }
      } catch {
        // ignore RPC errors and keep fallback
      }
    })();

    const handler = () => {
      try {
        const stored = Number(localStorage.getItem('storyspark-waitlist-count') || '0');
        if (stored > 0) setCount(stored);
        else setCount(c => c + 1);
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
  }, [seed]);

  return (
    <div className="inline-flex flex-col items-center sm:flex-row sm:items-center gap-2 text-sm sm:text-base text-muted-foreground" aria-live="polite">
      <div className="text-2xl sm:text-3xl font-bold text-foreground" aria-hidden>{count.toLocaleString()}</div>
      <div className="text-xs sm:text-sm">inscritos · <span className="font-medium">última: {lastAt ? new Date(lastAt).toLocaleString() : '—'}</span></div>
      {/* Screen readers: announce updates */}
      <span className="sr-only" role="status">{count} inscritos; última: {lastAt ? new Date(lastAt).toLocaleString() : 'sem dados'}</span>
    </div>
  );
}
