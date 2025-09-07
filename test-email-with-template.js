// Script de teste para verificar envio de email com template do banco
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

async function sendTestEmail() {
  try {
    // 1. Buscar um template do banco
    const template = await getEmailTemplate('Confirmação da Waitlist');
    console.log('✅ Template encontrado:', template.name);
    console.log('📝 Assunto:', template.subject);
    
    // 2. Processar variáveis do template
    const variables = {
      userName: 'Usuário Teste',
      userEmail: 'teste@example.com',
      selectedIdeas: ['Ideia 1', 'Ideia 2', 'Ideia 3'],
      waitlistPosition: 42,
      dashboardUrl: 'https://app.storyspark.com.br',
      currentYear: new Date().getFullYear()
    };
    
    // 3. Substituir variáveis no template
    let htmlContent = template.html_content || '';
    let subject = template.subject || '';
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      if (Array.isArray(value)) {
        htmlContent = htmlContent.replace(regex, value.join(', '));
      } else {
        htmlContent = htmlContent.replace(regex, String(value));
        subject = subject.replace(regex, String(value));
      }
    });
    
    // 4. Preparar payload para envio
    const emailPayload = {
      to: 'paulojack2011@gmail.com', // Email de teste configurado
      subject: subject,
      html: htmlContent,
      from: 'suporte@storyspark.com.br',
      fromName: 'StorySpark'
    };
    
    console.log('\n📧 Enviando email de teste...');
    console.log('Para:', emailPayload.to);
    console.log('Assunto:', emailPayload.subject);
    
    // 5. Enviar via Edge Function
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
      if (result.warning) {
        console.log('⚠️ Aviso:', result.warning);
      }
    } else {
      console.error('\n❌ Erro ao enviar email:', result.error);
      if (result.details) {
        console.error('Detalhes:', result.details);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  }
}

// Executar teste
console.log('🚀 StorySpark - Teste de Email com Template do Banco');
console.log('='.repeat(50));
sendTestEmail();
