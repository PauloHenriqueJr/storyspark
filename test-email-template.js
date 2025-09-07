import fetch from 'node-fetch';

async function testEmailTemplate() {
  try {
    const supabaseUrl = 'https://qgtgvqfikqfjbeixzbyb.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGd2cWZpa3FmamJlaXh6YnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NzE2MTcsImV4cCI6MjA3MDI0NzYxN30.iNAOOITHhXMfAY2kJnQ_Dtrd44UZ7bhlufekerTdtw4';
    
    // Simular HTML processado com ideias selecionadas
    const htmlWithIdeas = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #f97316; }
          .position { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .position-number { font-size: 36px; font-weight: bold; color: #f97316; }
          .ideas-section { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f97316; }
          .idea-item { margin: 8px 0; padding: 8px 12px; background: #f1f5f9; border-radius: 6px; color: #475569; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">StorySpark</div>
            <h1>🎉 Você está na Waitlist!</h1>
          </div>
          
          <p>Olá!</p>
          
          <p>Parabéns! Você foi adicionado à nossa waitlist exclusiva do StorySpark - a plataforma de IA que vai revolucionar a criação de copies para marketing digital.</p>
          
          <div class="position">
            <p>Sua Posição na Waitlist</p>
            <div class="position-number">#37</div>
          </div>
          
          <div class="ideas-section">
            <h3>💡 Suas ideias selecionadas:</h3>
            <div class="idea-item">• Criação de copies para redes sociais</div>
            <div class="idea-item">• Otimização de conversões</div>
            <div class="idea-item">• Templates personalizados</div>
          </div>
          
          <h3>🚀 O que vem por aí:</h3>
          <ul>
            <li>Acesso antecipado à plataforma</li>
            <li>Créditos gratuitos para testar todas as funcionalidades</li>
            <li>Suporte prioritário da nossa equipe</li>
            <li>Desconto especial no primeiro mês</li>
          </ul>
          
          <p>Fique de olho no seu email - em breve enviaremos mais novidades sobre o lançamento!</p>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="https://storyspark.com.br" style="background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Visitar Site</a>
          </p>
          
          <p style="margin-top: 20px; color: #6b7280;">
            Dúvidas? Entre em contato: <a href="mailto:suporte@storyspark.com.br">suporte@storyspark.com.br</a>
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="text-align: center; color: #9ca3af; font-size: 14px;">
            StorySpark - Transformando ideias em copies que convertem<br>
            © 2024 StorySpark. Todos os direitos reservados.
          </p>
        </div>
      </body>
      </html>
    `;
    
    console.log('📧 Enviando email de teste com template processado...\n');
    
    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        from: {
          email: 'suporte@storyspark.com.br',
          name: 'StorySpark'
        },
        to: [{
          email: 'paulojack2011@gmail.com'
        }],
        subject: '🎉 Você está na Waitlist do StorySpark!',
        html: htmlWithIdeas,
        category: 'waitlist_confirmation'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Email enviado com sucesso!');
      console.log('Message ID:', result.messageId);
      if (result.warning) {
        console.log('⚠️ Aviso:', result.warning);
      }
    } else {
      console.log('❌ Erro ao enviar email:');
      console.log(result);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
  }
}

testEmailTemplate();
