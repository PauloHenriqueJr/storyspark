import fs from 'node:fs/promises';
import path from 'node:path';
import { Client } from 'pg';

async function main() {
    const fileArg = process.argv[2];
    if (!fileArg) {
        console.error('[apply-sql] Uso: node scripts/apply_sql_file.js <caminho_do_sql>');
        process.exit(1);
    }

    const sqlPath = path.resolve(process.cwd(), fileArg);
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        console.error('[apply-sql] Defina a variável de ambiente DATABASE_URL (Service Role) para conectar no Postgres (Supabase).');
        process.exit(1);
    }

    const sql = await fs.readFile(sqlPath, 'utf8');
    const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        console.log(`[apply-sql] Aplicando arquivo: ${sqlPath}`);
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log('[apply-sql] OK: migração aplicada com sucesso.');
    } catch (e) {
        try { await client.query('ROLLBACK'); } catch { }
        console.error('[apply-sql] ERRO ao aplicar SQL:', e?.message || e);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
