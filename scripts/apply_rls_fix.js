#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Erro: Variáveis de ambiente do Supabase não encontradas');
    console.error('Verifique VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyRLSFix() {
    console.log('🔧 Aplicando correção de RLS e sistema de créditos...\n');

    try {
        // Ler o arquivo SQL
        const sqlContent = readFileSync(join(process.cwd(), 'sql', 'fix_profiles_rls_and_credits.sql'), 'utf8');

        // Dividir o SQL em comandos separados (por linhas vazias ou comentários)
        const sqlCommands = sqlContent
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd && !cmd.startsWith('--') && cmd !== '');

        console.log(`📝 Encontrados ${sqlCommands.length} comandos SQL para executar...\n`);

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < sqlCommands.length; i++) {
            const command = sqlCommands[i];
            if (!command) continue;

            try {
                console.log(`⚡ Executando comando ${i + 1}/${sqlCommands.length}...`);

                const { error } = await supabase.rpc('exec_sql', {
                    query: command + ';'
                });

                if (error) {
                    console.error(`❌ Erro no comando ${i + 1}:`, error.message);
                    errorCount++;
                } else {
                    console.log(`✅ Comando ${i + 1} executado com sucesso`);
                    successCount++;
                }
            } catch (err) {
                console.error(`❌ Erro inesperado no comando ${i + 1}:`, err);
                errorCount++;
            }
        }

        console.log(`\n📊 Resumo da execução:`);
        console.log(`✅ Sucessos: ${successCount}`);
        console.log(`❌ Erros: ${errorCount}`);

        // Verificar se as políticas foram criadas
        console.log('\n🔍 Verificando políticas RLS criadas...');

        const { data: policies, error: policiesError } = await supabase
            .from('pg_policies')
            .select('policyname, tablename')
            .eq('tablename', 'profiles');

        if (policiesError) {
            console.error('❌ Erro ao verificar políticas:', policiesError.message);
        } else {
            console.log(`✅ ${policies?.length || 0} políticas encontradas na tabela profiles:`);
            policies?.forEach(policy => {
                console.log(`  - ${policy.policyname}`);
            });
        }

        // Testar adição de créditos
        console.log('\n🧪 Testando função de adicionar créditos...');

        const { data: testResult, error: testError } = await supabase.rpc('admin_add_credits', {
            target_user_id: '00000000-0000-0000-0000-000000000000', // UUID de teste
            credits_to_add: 50,
            reason: 'Teste da função admin_add_credits'
        });

        if (testError && testError.message.includes('Usuário não encontrado')) {
            console.log('✅ Função admin_add_credits criada e funcionando (usuário de teste não encontrado, como esperado)');
        } else if (testError) {
            console.error('❌ Erro ao testar função:', testError.message);
        } else {
            console.log('✅ Função admin_add_credits funcionando:', testResult);
        }

    } catch (error) {
        console.error('❌ Erro geral:', error);
        process.exit(1);
    }
}

// Executar se foi chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    applyRLSFix()
        .then(() => {
            console.log('\n🎉 Correção de RLS e créditos aplicada com sucesso!');
            console.log('\n📝 Próximos passos:');
            console.log('1. Teste adicionar créditos na interface admin');
            console.log('2. Verifique se o admin consegue atualizar créditos');
            console.log('3. Confirme que usuários normais não perdem acesso');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Falha na aplicação da correção:', error);
            process.exit(1);
        });
}

export { applyRLSFix };
