import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import fs from 'fs'
import crypto from 'node:crypto'
import { fileURLToPath } from 'url'
import { initDbPg, insertAnalysisPg } from './db_pg.js'
import { initDbMongo, insertAnalysisMongo } from './db_mongo.js'

let db;
let usePg = false;
let useMongo = false;

export async function initDb() {
  if (db || usePg || useMongo) return db;
  // Prefer MongoDB if MONGODB_URI is set
  if (process.env.MONGODB_URI) {
    try {
      const mc = await initDbMongo();
      if (mc) {
        useMongo = true;
        return null;
      }
    } catch {
      // fallback to others
    }
  }
  // Next prefer Postgres if DATABASE_URL is set
  if (process.env.DATABASE_URL) {
    try {
      const pg = await initDbPg();
      if (pg) {
        usePg = true;
        return null;
      }
    } catch {
      // fallback to lowdb
    }
  }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dir = path.resolve(__dirname, '../../data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'analyses.json');
  const adapter = new JSONFile(file);
  db = new Low(adapter, { analyses: [] });
  await db.read();
  db.data ||= { analyses: [] };
  await db.write();
  return db;
}

export { db };

export async function insertAnalysis({ atsScore, keywordMatch, keywords }) {
  if (!db && !usePg && !useMongo) await initDb();
  if (useMongo) {
    try {
      return await insertAnalysisMongo({ atsScore, keywordMatch, keywords });
    } catch {
      // if mongo fails, try pg/json
      useMongo = false;
    }
  }
  if (usePg) {
    try {
      return await insertAnalysisPg({ atsScore, keywordMatch, keywords });
    } catch {
      // if pg fails, silently fall back to json
      usePg = false;
    }
  }
  const id = crypto.randomUUID();
  db.data.analyses.push({
    id,
    createdAt: new Date().toISOString(),
    atsScore,
    keywordMatch,
    keywords: keywords || ''
  });
  await db.write();
  return id;
}
