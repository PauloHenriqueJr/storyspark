import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ReferralWidget: React.FC<{ initialCode?: string }> = ({ initialCode }) => {
  const [code, setCode] = useState<string | null>(initialCode || null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // read progress from localStorage fallback
    if (code) {
      try {
        const key = `ref_prog_${code}`;
        const v = Number(localStorage.getItem(key) || '0');
        setProgress(v);
      } catch {}
    }
  }, [code]);

  const createCode = async () => {
    // call create_referral RPC via supabase client in lib if available
    try {
      // ... try to run RPC client-side if SUPABASE key available
      const { supabase } = await import('@/lib/supabase');
      const resp: any = await supabase.rpc('create_referral', { p_referrer_email: localStorage.getItem('storyspark-waitlist-last-email') || null });
      const newCode = Array.isArray(resp.data) ? resp.data[0] : resp.data;
      setCode(newCode);
      toast({ title: 'Código gerado', description: 'Seu link de convite foi criado.' });
    } catch (err) {
      // fallback: create pseudo code locally
      const pseudo = Math.random().toString(36).slice(2, 10).toUpperCase();
      setCode(pseudo);
      toast({ title: 'Código criado localmente', description: 'Use este código para compartilhar. Será sincronizado quando o backend estiver disponível.' });
    }
  };

  const copy = async () => {
    if (!code) return;
    const url = `${location.origin}${location.pathname}?ref=${code}`;
    try { await navigator.clipboard.writeText(url); toast({ title: 'Link copiado', description: url }); } catch { try { prompt('Copie o link abaixo', url); } catch {} }
  };

  return (
    <div className="bg-card/80 p-4 rounded-xl border border-border/10">
      <h4 className="font-semibold mb-2">Programa de Convites</h4>
      {!code ? (
        <div>
          <p className="text-sm text-muted-foreground mb-3">Convide 3 amigos e ganhe prioridade no acesso.</p>
          <div className="flex gap-2">
            <Button onClick={createCode}>Gerar meu link</Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Seu link:</p>
          <div className="flex items-center gap-2">
            <code className="px-3 py-1 bg-background/70 rounded">{`${location.origin}${location.pathname}?ref=${code}`}</code>
            <Button onClick={copy}>Copiar</Button>
          </div>
          <div className="mt-3 text-sm">Progresso: {progress} / 3</div>
        </div>
      )}
    </div>
  );
};

export default ReferralWidget;
