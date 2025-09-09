// Test script for tokens system
import { supabase } from '../src/integrations/supabase/client.js';

async function testTokensSystem() {
    console.log('🧪 Testando Sistema de Tokens...\n');

    // Buscar um usuário para teste
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, role, plan, monthly_tokens_limit, monthly_tokens_used, total_tokens_used')
        .limit(3);

    if (error) {
        console.error('❌ Erro ao buscar perfis:', error);
        return;
    }

    console.log('👥 Perfis encontrados:');
    profiles.forEach(profile => {
        console.log(`   📧 ${profile.email} (${profile.role}) - Plano: ${profile.plan}`);
        console.log(`   🎫 Limite: ${profile.monthly_tokens_limit || 'Ilimitado'} | Usados: ${profile.monthly_tokens_used || 0} | Total: ${profile.total_tokens_used || 0}\n`);
    });

    // Testar consumo de tokens em um usuário regular
    const regularUser = profiles.find(p => p.role === 'user');
    if (regularUser) {
        console.log(`🎯 Testando consumo de tokens para ${regularUser.email}...\n`);

        // Simular consumo de 150 tokens
        const tokensToConsume = 150;
        const currentUsed = regularUser.monthly_tokens_used || 0;
        const currentTotal = regularUser.total_tokens_used || 0;
        const newMonthlyUsed = currentUsed + tokensToConsume;
        const newTotalUsed = currentTotal + tokensToConsume;

        // Atualizar o profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                monthly_tokens_used: newMonthlyUsed,
                total_tokens_used: newTotalUsed,
                updated_at: new Date().toISOString()
            })
            .eq('id', regularUser.id);

        if (updateError) {
            console.error('❌ Erro ao atualizar tokens:', updateError);
        } else {
            console.log(`✅ Tokens consumidos: ${tokensToConsume}`);
            console.log(`📊 Mensal: ${currentUsed} → ${newMonthlyUsed}`);
            console.log(`📊 Total: ${currentTotal} → ${newTotalUsed}`);

            // Verificar o limite
            const limit = regularUser.monthly_tokens_limit;
            if (limit && newMonthlyUsed > limit) {
                console.log(`⚠️  LIMITE EXCEDIDO! (${newMonthlyUsed}/${limit})`);
            } else if (limit) {
                const remaining = limit - newMonthlyUsed;
                const percentage = Math.round((newMonthlyUsed / limit) * 100);
                console.log(`🎫 Restantes: ${remaining} tokens (${percentage}% usado)`);
            }
        }
    }

    // Verificar admin
    const adminUser = profiles.find(p => p.role === 'admin');
    if (adminUser) {
        console.log(`\n👑 Admin encontrado: ${adminUser.email}`);
        console.log(`🎫 Limite: ${adminUser.monthly_tokens_limit || 'Ilimitado'} (esperado: Ilimitado)`);
    }

    console.log('\n✅ Teste concluído!');
}

// Executar teste
testTokensSystem().catch(console.error);
