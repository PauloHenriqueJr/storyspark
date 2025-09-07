import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Novos planos com créditos ajustados para criar escassez
const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 29.00,
    credits: 150,  // Reduzido de 200 para forçar upgrade
    features: [
      '150 créditos/mês',
      'Templates básicos',
      'Histórico 30 dias',
      'Export CSV',
      'Suporte por email'
    ]
  },
  pro: {
    name: 'Pro',
    price: 97.00,
    credits: 800,  // Reduzido de 1000
    features: [
      '800 créditos/mês',
      'Templates avançados',
      'Histórico ilimitado',
      'Analytics básico',
      'Biblioteca de copies',
      'Ideias IA (3 variações)',
      'Suporte prioritário'
    ]
  },
  business: {
    name: 'Business',
    price: 297.00,
    credits: 3000,  // Reduzido de 5000
    features: [
      '3000 créditos/mês',
      'Todos os templates',
      'Analytics avançado',
      'Calendário editorial',
      'Distribuição (Zapier/n8n)',
      'Leads Manager',
      'API Access',
      'Suporte dedicado'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 1200.00,
    credits: -1,  // Ilimitado
    features: [
      'Créditos ilimitados',
      'White-label',
      'API dedicada',
      'Personas avançadas',
      'Brand Voices customizadas',
      'A/B Testing avançado',
      'SLA 99.9%',
      'Gerente de conta'
    ]
  }
};

async function updateWorkspacePlans() {
  console.log('🚀 Atualizando planos de créditos dos workspaces...');
  
  try {
    // Buscar todos os workspaces
    const { data: workspaces, error: fetchError } = await supabase
      .from('workspaces')
      .select('*');
    
    if (fetchError) {
      console.error('❌ Erro ao buscar workspaces:', fetchError);
      return;
    }
    
    console.log(`📊 ${workspaces.length} workspaces encontrados`);
    
    // Atualizar cada workspace baseado no plano atual
    for (const workspace of workspaces) {
      let newCredits = 150; // Default para Starter
      let planName = 'starter';
      
      // Determinar plano baseado nos créditos atuais
      if (workspace.credits >= 5000) {
        newCredits = -1; // Enterprise
        planName = 'enterprise';
      } else if (workspace.credits >= 2000) {
        newCredits = 3000; // Business
        planName = 'business';
      } else if (workspace.credits >= 500) {
        newCredits = 800; // Pro
        planName = 'pro';
      }
      
      // Atualizar workspace
      const { error: updateError } = await supabase
        .from('workspaces')
        .update({
          credits: newCredits,
          plan: planName,
          updated_at: new Date().toISOString()
        })
        .eq('id', workspace.id);
      
      if (updateError) {
        console.error(`❌ Erro ao atualizar workspace ${workspace.name}:`, updateError);
      } else {
        console.log(`✅ Workspace "${workspace.name}" atualizado para plano ${planName.toUpperCase()} com ${newCredits === -1 ? 'créditos ilimitados' : `${newCredits} créditos`}`);
      }
    }
    
    console.log('✨ Atualização de planos concluída!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Criar tabela de planos se não existir
async function createPlansTable() {
  console.log('📋 Criando/atualizando tabela de planos...');
  
  const query = `
    CREATE TABLE IF NOT EXISTS pricing_plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(50) UNIQUE NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      credits INTEGER NOT NULL,
      features JSONB DEFAULT '[]',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  const { error } = await supabase.rpc('exec_sql', { query });
  
  if (error && !error.message.includes('already exists')) {
    console.error('❌ Erro ao criar tabela de planos:', error);
    return false;
  }
  
  // Inserir ou atualizar planos
  for (const [key, plan] of Object.entries(PRICING_PLANS)) {
    const { error: upsertError } = await supabase
      .from('pricing_plans')
      .upsert({
        name: plan.name.toLowerCase(),
        price: plan.price,
        credits: plan.credits,
        features: plan.features
      }, {
        onConflict: 'name'
      });
    
    if (upsertError) {
      console.error(`❌ Erro ao inserir plano ${plan.name}:`, upsertError);
    } else {
      console.log(`✅ Plano ${plan.name} configurado`);
    }
  }
  
  return true;
}

// Executar atualizações
async function main() {
  console.log('🎯 StorySpark - Atualização de Planos de Créditos');
  console.log('================================================');
  
  // await createPlansTable();
  await updateWorkspacePlans();
  
  console.log('\n📊 Novos limites de créditos:');
  console.log('- Starter: 150 créditos/mês (R$ 29)');
  console.log('- Pro: 800 créditos/mês (R$ 97)');
  console.log('- Business: 3000 créditos/mês (R$ 297)');
  console.log('- Enterprise: Ilimitado (R$ 1200)');
  
  process.exit(0);
}

main();
