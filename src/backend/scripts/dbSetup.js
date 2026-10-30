const fs = require('fs/promises');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const pool = require('../db');

async function runSqlFile(client, fileName) {
  const filePath = path.join(__dirname, '../../../db', fileName);
  const sql = await fs.readFile(filePath, 'utf8');
  await client.query(sql);
}

async function main() {
  const mode = process.argv[2] || 'setup';
  if (!['setup', 'migrate', 'seed'].includes(mode)) {
    throw new Error('Usage: node scripts/dbSetup.js [setup|migrate|seed]');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (mode === 'setup' || mode === 'migrate') await runSqlFile(client, 'schema.sql');
    if (mode === 'setup' || mode === 'seed') await runSqlFile(client, 'seed.sql');
    await client.query('COMMIT');
    console.log(mode === 'migrate'
      ? 'Database schema is ready.'
      : mode === 'seed'
        ? 'Sample data is ready.'
        : 'Database schema and sample data are ready.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Database setup failed:', error.message);
  process.exitCode = 1;
});
