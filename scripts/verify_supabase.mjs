import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';

async function loadDotEnv(envPath = path.resolve(process.cwd(), '.env')) {
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    const out = {};
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n\r]*)"?\s*$/i);
      if (m) out[m[1]] = m[2];
    }
    return out;
  } catch {
    return {};
  }
}

async function main() {
  const env = await loadDotEnv();
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('[verify-supabase] Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no ambiente ou no .env');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Prefer: 'return=representation' } },
  });

  console.log('[verify-supabase] URL:', SUPABASE_URL);

  // 1) Testar get_waitlist_stats (não mutável)
  try {
    const { data, error } = await supabase.rpc('get_waitlist_stats');
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    console.log('[get_waitlist_stats] ok ->', row);
  } catch (e) {
    console.error('[get_waitlist_stats] erro ->', e?.message || e);
  }

  // 2) Testar add_waitlist_entry (pode inserir ou retornar already_exists)
  try {
    const testEmail = `codex-check+${Date.now()}@storyspark.dev`;
    const { data, error } = await supabase.rpc('add_waitlist_entry', {
      p_email: testEmail,
      p_consent: true,
      p_utm_source: 'verify_script',
      p_utm_medium: 'cli',
      p_utm_campaign: 'verify',
      p_utm_term: null,
      p_utm_content: null,
      p_referrer: 'cli-verify',
      p_variant: 'verify_script',
    });
    if (error) throw error;
    const inserted = Array.isArray(data) ? data[0] : data;
    console.log('[add_waitlist_entry] ok ->', inserted === true ? 'inserted' : 'already_exists');
  } catch (e) {
    console.error('[add_waitlist_entry] erro ->', e?.message || e);
  }

  // 3) Opcional: testar claim_referral_for_signup com código inválido (não deve quebrar)
  try {
    const { data, error } = await supabase.rpc('claim_referral_for_signup', {
      p_code: 'INVALID_CODE',
      p_referred_email: 'codex-check@example.com',
    });
    if (error) throw error;
    console.log('[claim_referral_for_signup] ok ->', data);
  } catch (e) {
    console.warn('[claim_referral_for_signup] aviso/erro ->', e?.message || e);
  }
}

main().catch((e) => {
  console.error('[verify-supabase] Fatal:', e);
  process.exit(1);
});

