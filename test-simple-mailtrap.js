// Script simples para testar Mailtrap Sandbox
const MAILTRAP_TOKEN = 'ff7d74116d126b14c800ce39f0d9b5618072cd9f98a2f8d12dd5e';

// Testar diferentes IDs de inbox
const testInboxIds = ['1', '2', '3', '123456', '1234567', '2345678'];

async function testMailtrapSandbox() {
  console.log('🧪 Testando Mailtrap Sandbox...');
  
  for (const inboxId of testInboxIds) {
    try {
      console.log(`\n📧 Testando inbox ID: ${inboxId}`);
      
      const response = await fetch(`https://sandbox.api.mailtrap.io/api/send/${inboxId}`, {
        method: 'POST',
        headers: {
          'Api-Token': MAILTRAP_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: [{ email: 'test@example.com', name: 'Test User' }],
          from: { email: 'noreply@example.com', name: 'StorySpark' },
          subject: 'Teste Inbox ID ' + inboxId,
          html: `<p>Testando inbox ID: ${inboxId}</p>`
        })
      });
      
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.text();
        console.log('✅ SUCESSO! Inbox ID correto:', inboxId);
        console.log('Resposta:', data);
        return inboxId; // Retorna o ID que funcionou
      } else {
        const errorData = await response.text();
        console.log('❌ Erro:', errorData.substring(0, 100));
      }
    } catch (error) {
      console.log('❌ Erro de rede:', error.message);
    }
  }
  
  console.log('\n❌ Nenhum inbox ID funcionou');
  return null;
}

// Executar teste
testMailtrapSandbox()
  .then(workingId => {
    if (workingId) {
      console.log(`\n🎉 Use o inbox ID: ${workingId}`);
    }
  })
  .catch(console.error);