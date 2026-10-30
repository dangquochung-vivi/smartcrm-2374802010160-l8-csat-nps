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
  if (!['setup', 'migrate', 'seed', 'import-dataset'].includes(mode)) {
    throw new Error('Usage: node scripts/dbSetup.js [setup|migrate|seed|import-dataset]');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (mode === 'setup' || mode === 'migrate') await runSqlFile(client, 'schema.sql');
    let importSummary;
    if (mode === 'setup' || mode === 'seed') {
      const { importSampleDataset } = require('./datasetImport');
      importSummary = await importSampleDataset(client);
    } else if (mode === 'import-dataset') {
      const datasetDirectory = process.argv[3];
      if (!datasetDirectory) {
        throw new Error('Provide the extracted dataset folder, for example: npm run db:import-dataset -- data/raw/dataset');
      }
      const { importFullDataset } = require('./datasetImport');
      importSummary = await importFullDataset(client, path.resolve(__dirname, '../../../', datasetDirectory));
    }
    if (mode === 'setup' || mode === 'seed' || mode === 'import-dataset') {
      await runSqlFile(client, 'seed.sql');
    }
    await client.query('COMMIT');
    console.log(mode === 'migrate'
      ? 'Database schema is ready.'
      : mode === 'import-dataset'
        ? `Assignment dataset import is ready: ${JSON.stringify(importSummary)}`
        : mode === 'seed'
          ? `Assignment sample data is ready: ${JSON.stringify(importSummary)}`
          : `Database schema and assignment sample data are ready: ${JSON.stringify(importSummary)}`);
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
