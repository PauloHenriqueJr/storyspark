// Script de teste para verificar o sistema de email em produção
// Execute com: node test-email-production.js

const SUPABASE_URL = 'https://qgtgvqfikqfjbeixzbyb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGd2cWZpa3FmamJlaXh6YnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NzE2MTcsImV4cCI6MjA3MDI0NzYxN30.iNAOOITHhXMfAY2kJnQ_Dtrd44UZ7bhlufekerTdtw4';

async function testEmailProduction() {
  console.log('🚀 Testando sistema de email em PRODUÇÃO...\n');
  
  const testEmail = 'paulojack2011@gmail.com'; // Seu email para receber o teste
  
  const emailData = {
    to: testEmail,
    subject: '🎉 Teste de Email em Produção - StorySpark',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FF6B35;">✅ Sistema de Email Funcionando!</h1>
        <p>Este é um email de teste enviado do sistema StorySpark em <strong>modo produção</strong>.</p>
        
        <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Informações do Sistema:</h3>
          <ul>
            <li><strong>Modo:</strong> PRODUÇÃO ✨</li>
            <li><strong>API:</strong> Resend com Full Access</li>
            <li><strong>Domínio:</strong> storyspark.com.br</li>
            <li><strong>Remetente:</strong> suporte@storyspark.com.br</li>
            <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
          </ul>
        </div>
        
        <p style="color: #666;">
          Se você recebeu este email, significa que o sistema está configurado corretamente 
          e pronto para enviar emails para usuários reais.
        </p>
        
        <div style="border-top: 2px solid #FF6B35; margin-top: 30px; padding-top: 20px;">
          <p style="text-align: center; color: #999; font-size: 12px;">
            StorySpark - Transformando ideias em copies que convertem<br>
            <a href="https://storyspark.com.br" style="color: #FF6B35;">storyspark.com.br</a>
          </p>
        </div>
      </div>
    `
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Email enviado com sucesso!');
      console.log('📧 Destinatário:', testEmail);
      console.log('🆔 Message ID:', result.messageId);
      console.log('\n🎉 Sistema de email em produção funcionando perfeitamente!');
      console.log('📬 Verifique sua caixa de entrada em alguns segundos.');
    } else {
      console.error('❌ Erro ao enviar email:');
      console.error('Status:', response.status);
      console.error('Detalhes:', result);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:');
    console.error(error);
  }
}

// Executar teste
testEmailProduction();
