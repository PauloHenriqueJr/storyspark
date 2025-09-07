import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCredits() {
  console.log('🚀 Atualizando créditos no profile...');
  
  // Atualizar o profile com email específico
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      credits: 150,  // Total de créditos do plano Starter
      monthly_tokens_used: 12000,  // Simular 120 créditos usados (12000/100)
      subscription_tier: 'starter'
    })
    .eq('email', 'paulojack2011@gmail.com');
  
  if (error) {
    console.error('❌ Erro ao atualizar:', error);
  } else {
    console.log('✅ Créditos atualizados com sucesso!');
    console.log('   - Total: 150 créditos');
    console.log('   - Usados: ~120 créditos');
    console.log('   - Restantes: ~30 créditos (20%)');
  }
  
  // Verificar atualização
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('email, credits, monthly_tokens_used, subscription_tier')
    .eq('email', 'paulojack2011@gmail.com')
    .single();
  
  if (!fetchError && profile) {
    console.log('\n📊 Estado atual do profile:');
    console.log(profile);
  }
}

updateCredits();
