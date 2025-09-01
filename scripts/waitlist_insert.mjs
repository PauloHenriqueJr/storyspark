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
    console.error('Erro: defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no ambiente ou no .env');
    process.exit(1);
  }

  const emailArg = process.argv.find(a => a.includes('@')) || process.env.EMAIL;
  if (!emailArg) {
    console.error('Uso: npm run waitlist:insert -- you@example.com [source]');
    process.exit(1);
  }
  const source = process.argv[process.argv.indexOf(emailArg) + 1] || 'script';

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Prefer: 'return=minimal' } },
  });

  const payload = {
    email: emailArg,
    consent: true,
    utm_source: source,
    // Script removido: use RPC server-side (add_waitlist_entry) ou migrações para inserir entradas de waitlist.
    // Para testes locais, invoque a RPC a partir de um backend com a chave de serviço
    // ou execute SQL diretamente com seu cliente de banco.
    // Este arquivo foi convertido em stub para evitar execução acidental e exposição de chaves.
    referrer: 'cli',

    variant: 'script',
  };

  console.log('Payload:', payload);
  // const { data, error } = await supabase.from('waitlist').insert([payload]);
  // if (error) throw error;
  // console.log('Sucesso:', data);
}

main().catch(e => {
  console.error('Erro:', e);
  process.exit(1);
});
