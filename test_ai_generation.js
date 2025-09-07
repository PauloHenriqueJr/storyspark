// Script de teste para verificar se a IA está gerando conteúdo correto
// Execute no console do navegador

console.log('🧪 Teste de Geração de IA');

// Simular dados de teste
const testCopy = `Esta é uma copy de teste muito longa para verificar se o botão de expansão está funcionando corretamente. 
Este texto precisa ter mais de 100 caracteres para ativar o botão "Ver copy completa".
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

console.log('📊 Dados do teste:', {
  length: testCopy.length,
  shouldShowButton: testCopy.length > 100,
  preview: testCopy.substring(0, 100)
});

console.log('✅ Se você vê este conteúdo no componente, o problema não é na geração');
console.log('❌ Se não vê, o problema está na passagem de dados entre componentes');
