// Script de teste para login e envio de email
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://qgtgvqfikqfjbeixzbyb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGd2cWZpa3FmamJlaXh6YnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NzE2MTcsImV4cCI6MjA3MDI0NzYxN30.iNAOOITHhXMfAY2kJnQ_Dtrd44UZ7bhlufekerTdtw4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailFlow() {
  try {
    console.log('🔐 Fazendo login com conta de teste...');

    // Fazer login
   const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@storyspark.com',
    password: 'admin123'
  });

    if (authError) {
      console.error('❌ Erro no login:', authError.message);
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    console.log('👤 Usuário:', authData.user.email);

    // Aguardar um pouco para garantir que a sessão está ativa
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('📧 Testando envio de email...');

    // Testar envio de email através da Edge Function
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
      console.error('❌ Sessão não encontrada');
      return;
    }

    const response = await fetch('https://qgtgvqfikqfjbeixzbyb.supabase.co/functions/v1/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.session.access_token}`
      },
      body: JSON.stringify({
        to: 'teste@example.com',
        subject: 'Teste de Email - StorySpark',
        html: '<h1>Teste de Email</h1><p>Este é um teste do sistema de email do StorySpark.</p>',
        text: 'Teste de Email - Este é um teste do sistema de email do StorySpark.'
      })
    });

    console.log('📊 Status da resposta:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Email enviado com sucesso!');
      console.log('📋 Resultado:', result);
    } else {
      const error = await response.text();
      console.error('❌ Erro no envio:', error);
    }

  } catch (error) {
    console.error('💥 Erro geral:', error.message);
  }
}

// Executar o teste
testEmailFlow();