import { useEffect, useMemo, useState } from 'react';

type UTM = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ref?: string;
};

const UTM_KEY = 'storyspark-utm';

const parseUTM = (): UTM => {
  const params = new URLSearchParams(window.location.search);
  const utm: UTM = {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
    ref: document.referrer || undefined,
  };
  return utm;
};

export const useUTM = () => {
  const [utm, setUtm] = useState<UTM>(() => {
    try {
      const cached = localStorage.getItem(UTM_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const found = parseUTM();
    const hasAny = Object.values(found).some(Boolean);
    if (hasAny) {
      setUtm(found);
      try { localStorage.setItem(UTM_KEY, JSON.stringify(found)); } catch {}
    }
  }, []);

  return useMemo(() => utm, [utm]);
};

export type { UTM };

