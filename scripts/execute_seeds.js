import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function executeSeedScript() {
  const client = new Client({
    connectionString: 'postgresql://postgres.hkzfcayaebwksfhvfirv:@aws-0-sa-east-1.pooler.supabase.com:6543/postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Conectando ao banco de dados...');
    await client.connect();
    
    console.log('Lendo script SQL...');
    const sqlScript = fs.readFileSync(path.join(__dirname, 'insert_seeds_safe.sql'), 'utf8');
    
    console.log('Executando script de inserção...');
    const result = await client.query(sqlScript);
    
    console.log('Script executado com sucesso!');
    console.log('Mensagens do banco:', result);
    
  } catch (error) {
    console.error('Erro ao executar script:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await client.end();
    console.log('Conexão fechada.');
  }
}

executeSeedScript();