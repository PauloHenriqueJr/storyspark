// Script de teste para verificar substituição de variáveis no template
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://qgtgvqfikqfjbeixzbyb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGd2cWZpa3FmamJlaXh6YnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NzE2MTcsImV4cCI6MjA3MDI0NzYxN30.iNAOOITHhXMfAY2kJnQ_Dtrd44UZ7bhlufekerTdtw4';

async function getEmailTemplate(templateName) {
  console.log(`📋 Buscando template: ${templateName}...`);
  
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/email_templates?name=eq.${encodeURIComponent(templateName)}&select=*`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar template: ${response.statusText}`);
  }

  const templates = await response.json();
  if (!templates || templates.length === 0) {
    throw new Error(`Template '${templateName}' não encontrado`);
  }

  return templates[0];
}

function processTemplate(template, variables) {
  let html = template.html_content || '';
  let subject = template.subject || '';
  
  console.log('\n📝 Processando variáveis...');
  
  // Processar cada variável
  Object.entries(variables).forEach(([key, value]) => {
    console.log(`  - ${key}: "${value}"`);
    
    // Suportar múltiplos formatos
    const patterns = [
      new RegExp(`\\{\\{${key}\\}\\}`, 'gi'),          // {{name}}
      new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi'),  // {{ name }}
      new RegExp(`\\{${key}\\}`, 'gi'),                // {name}
      new RegExp(`\\{\\s*${key}\\s*\\}`, 'gi'),        // { name }
    ];
    
    patterns.forEach(regex => {
      const countHtml = (html.match(regex) || []).length;
      const countSubject = (subject.match(regex) || []).length;
      
      if (countHtml > 0 || countSubject > 0) {
        console.log(`    ✓ Encontrado padrão: ${regex.source} (${countHtml} no HTML, ${countSubject} no assunto)`);
      }
      
      html = html.replace(regex, value);
      subject = subject.replace(regex, value);
    });
  });
  
  return { html, subject };
}

async function testEmailWithVariables() {
  try {
    // 1. Buscar template
    const template = await getEmailTemplate('Confirmação da Waitlist');
    console.log('✅ Template encontrado:', template.name);
    console.log('📝 Assunto original:', template.subject);
    
    // 2. Definir variáveis de teste
    const variables = {
      name: 'João Silva',
      position: '42',
      email: 'joao.silva@example.com',
      website_url: 'https://storyspark.com.br',
      unsubscribe_url: 'https://storyspark.com.br/unsubscribe',
      currentYear: '2025'
    };
    
    console.log('\n🔧 Variáveis a substituir:');
    Object.entries(variables).forEach(([key, value]) => {
      console.log(`  ${key}: "${value}"`);
    });
    
    // 3. Processar template
    const processed = processTemplate(template, variables);
    
    console.log('\n✅ Assunto processado:', processed.subject);
    
    // 4. Verificar se ainda existem placeholders não substituídos
    const remainingPlaceholders = processed.html.match(/\{[^}]+\}/g) || [];
    if (remainingPlaceholders.length > 0) {
      console.warn('\n⚠️ Placeholders não substituídos encontrados:');
      remainingPlaceholders.forEach(placeholder => {
        console.warn(`  - ${placeholder}`);
      });
    } else {
      console.log('\n✅ Todos os placeholders foram substituídos!');
    }
    
    // 5. Enviar email de teste
    console.log('\n📧 Enviando email de teste...');
    
    const emailPayload = {
      to: 'paulojack2011@gmail.com',
      subject: processed.subject,
      html: processed.html,
      from: 'suporte@storyspark.com.br',
      fromName: 'StorySpark'
    };
    
    const sendResponse = await fetch(
      `${SUPABASE_URL}/functions/v1/send-email`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      }
    );
    
    const result = await sendResponse.json();
    
    if (result.success) {
      console.log('\n✅ Email enviado com sucesso!');
      console.log('Message ID:', result.messageId);
      console.log('\n📬 Verifique seu email para confirmar que:');
      console.log('  1. O nome aparece como "João Silva" (não {name})');
      console.log('  2. A posição aparece como "#42" (não {position})');
      console.log('  3. Todos os outros campos foram substituídos corretamente');
    } else {
      console.error('\n❌ Erro ao enviar email:', result.error);
    }
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  }
}

// Executar teste
console.log('🚀 StorySpark - Teste de Substituição de Variáveis');
console.log('='.repeat(60));
testEmailWithVariables();
