import { MongoClient } from 'mongodb';
import crypto from 'node:crypto';

let client;
let db;
let collection;

export async function initDbMongo() {
  if (collection) return collection;
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  const dbName = process.env.MONGODB_DB || 'ai_resume_analyzer';
  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
  });
  await client.connect();
  db = client.db(dbName);
  collection = db.collection('analysis');
  // Basic index for createdAt
  await collection.createIndex({ createdAt: -1 });
  return collection;
}

export async function insertAnalysisMongo({ atsScore, keywordMatch, keywords }) {
  if (!collection) await initDbMongo();
  if (!collection) throw new Error('Mongo collection not initialized');
  const id = crypto.randomUUID();
  await collection.insertOne({
    _id: id,
    createdAt: new Date(),
    atsScore,
    keywordMatch,
    keywords: keywords || '',
  });
  return id;
}
