// Script para testar e obter informações do inbox Mailtrap
const MAILTRAP_TOKEN = 'ff7d74116d126b14c800ce39f0d9b5618072cd9f98a2f8d12dd5e';

// Função para listar inboxes usando API v2
async function listInboxes() {
  try {
    console.log('🔍 Listando inboxes disponíveis...');
    
    const response = await fetch('https://mailtrap.io/api/accounts', {
      method: 'GET',
      headers: {
        'Api-Token': MAILTRAP_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status da resposta:', response.status);
    const data = await response.text();
    console.log('Resposta completa:', data);
    
    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('✅ Dados da conta:', JSON.stringify(jsonData, null, 2));
    }
  } catch (error) {
    console.error('❌ Erro ao listar inboxes:', error.message);
  }
}

// Função para testar diferentes endpoints
async function testEndpoints() {
  const endpoints = [
    'https://mailtrap.io/api/accounts',
    'https://mailtrap.io/api/inboxes',
    'https://sandbox.api.mailtrap.io/api/accounts',
    'https://api.mailtrap.io/api/accounts'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🧪 Testando endpoint: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Api-Token': MAILTRAP_TOKEN,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.text();
        console.log('✅ Sucesso:', data.substring(0, 200) + '...');
      } else {
        const errorData = await response.text();
        console.log('❌ Erro:', errorData);
      }
    } catch (error) {
      console.log('❌ Erro de rede:', error.message);
    }
  }
}

// Função para testar envio para sandbox com diferentes IDs
async function testSandboxSend() {
  // IDs comuns para testar
  const testIds = ['1', '123456', '1234567', '2', '3'];
  
  for (const inboxId of testIds) {
    try {
      console.log(`\n📧 Testando envio para inbox ID: ${inboxId}`);
      
      const response = await fetch(`https://sandbox.api.mailtrap.io/api/send/${inboxId}`, {
        method: 'POST',
        headers: {
          'Api-Token': MAILTRAP_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: [{ email: 'test@example.com', name: 'Test User' }],
          from: { email: 'noreply@example.com', name: 'StorySpark Test' },
          subject: 'Teste de Inbox ID',
          html: '<p>Testando inbox ID: ' + inboxId + '</p>'
        })
      });
      
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.text();
        console.log('✅ Sucesso! ID correto:', inboxId);
        console.log('Resposta:', data);
        break; // Para no primeiro sucesso
      } else {
        const errorData = await response.text();
        console.log('❌ Falhou:', errorData.substring(0, 100));
      }
    } catch (error) {
      console.log('❌ Erro de rede:', error.message);
    }
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 Iniciando testes do Mailtrap...');
  
  await listInboxes();
  await testEndpoints();
  await testSandboxSend();
  
  console.log('\n✅ Testes concluídos!');
}

runAllTests().catch(console.error);