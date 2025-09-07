// Teste para verificar se os templates estão sendo carregados corretamente
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (usando as mesmas configurações do projeto)
const supabaseUrl = 'https://pbxyagvjkuprspxmzxfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBieHlhZ3Zqa3VwcnNweG16eGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM5MjUyNzAsImV4cCI6MjAzOTUwMTI3MH0.ZzZhVXEF-lR4hBKLIafh8XDcuGZvOYvqfJFiDbAjbMI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTemplateLoading() {
    console.log('🔍 Testando carregamento de templates...\n');

    try {
        // Tentar carregar todos os templates
        const { data: allTemplates, error: allError } = await supabase
            .from('email_templates')
            .select('*')
            .order('created_at', { ascending: false });

        if (allError) {
            console.error('❌ Erro ao carregar todos os templates:', allError);
        } else {
            console.log(`✅ ${allTemplates?.length || 0} templates encontrados no total:`);
            allTemplates?.forEach((template, index) => {
                console.log(`${index + 1}. ${template.name} (${template.category}) - Ativo: ${template.is_active}`);
                console.log(`   HTML: ${template.html_content ? `${template.html_content.length} caracteres` : 'Vazio'}`);
                console.log(`   ID: ${template.id}\n`);
            });
        }

        // Testar especificamente o template de confirmação da waitlist
        console.log('\n🎯 Testando template específico da waitlist...');
        const { data: waitlistTemplate, error: waitlistError } = await supabase
            .from('email_templates')
            .select('*')
            .eq('id', 'f8ddd384-6fc4-413c-aa27-fde1eb7b6468')
            .single();

        if (waitlistError) {
            console.error('❌ Erro ao carregar template da waitlist:', waitlistError);
        } else if (waitlistTemplate) {
            console.log('✅ Template da waitlist encontrado:');
            console.log(`Nome: ${waitlistTemplate.name}`);
            console.log(`Categoria: ${waitlistTemplate.category}`);
            console.log(`Ativo: ${waitlistTemplate.is_active}`);
            console.log(`HTML: ${waitlistTemplate.html_content ? `${waitlistTemplate.html_content.length} caracteres` : 'Vazio'}`);
            console.log(`Primeira linha do HTML: ${waitlistTemplate.html_content?.substring(0, 100)}...`);
        } else {
            console.log('❌ Template da waitlist não encontrado');
        }

        // Testar filtros por categoria
        console.log('\n🏷️ Testando filtro por categoria Waitlist...');
        const { data: waitlistTemplates, error: categoryError } = await supabase
            .from('email_templates')
            .select('*')
            .eq('category', 'Waitlist')
            .eq('is_active', true);

        if (categoryError) {
            console.error('❌ Erro ao filtrar por categoria:', categoryError);
        } else {
            console.log(`✅ ${waitlistTemplates?.length || 0} templates ativos na categoria Waitlist:`);
            waitlistTemplates?.forEach(template => {
                console.log(`- ${template.name} (${template.id})`);
            });
        }

    } catch (error) {
        console.error('❌ Erro geral:', error);
    }
}

testTemplateLoading();
