import pkg from 'pg';
import crypto from 'node:crypto';
const { Pool } = pkg;

let pool;

export async function initDbPg() {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  pool = new Pool({ connectionString: url, ssl: /sslmode=require|ssl=true/i.test(url) ? { rejectUnauthorized: false } : undefined });
  // create table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS analysis (
      id UUID PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      ats_score INT NOT NULL,
      keyword_match INT NOT NULL,
      keywords TEXT
    );
  `);
  return pool;
}

export async function insertAnalysisPg({ atsScore, keywordMatch, keywords }) {
  if (!pool) await initDbPg();
  if (!pool) throw new Error('Postgres pool not initialized');
  const res = await pool.query(
    'INSERT INTO analysis (id, ats_score, keyword_match, keywords) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id',
    [atsScore, keywordMatch, keywords || '']
  ).catch(async (e) => {
    // Fallback if gen_random_uuid() extension not available
    if (/gen_random_uuid/.test(String(e))) {
      return pool.query(
        'INSERT INTO analysis (id, ats_score, keyword_match, keywords) VALUES ($1, $2, $3, $4) RETURNING id',
        [crypto.randomUUID(), atsScore, keywordMatch, keywords || '']
      );
    }
    throw e;
  });
  return res.rows[0]?.id;
}
