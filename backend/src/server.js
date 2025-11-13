import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pinoHttp from 'pino-http';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { clerkMiddleware, requireAuth } from '@clerk/express';

import { extractTextFromPdf } from './services/pdfExtractor.js';
import { parseResume } from './services/parser.js';
import { computeScores } from './services/scoring.js';
import { generateImprovements } from './services/suggestions.js';
import logger from './logger.js';
import { db, initDb, insertAnalysis } from './services/db.js';

const app = express();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
});

const PORT = process.env.PORT || 4000;

const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4000',
  'http://127.0.0.1:4000',
];
const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const allowedOrigins = envOrigins.length ? envOrigins : defaultOrigins;

app.use(pinoHttp({ logger }));
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Clerk auth (optional; enabled when keys are present)
const publishableKey = process.env.CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasClerk = Boolean(publishableKey && process.env.CLERK_SECRET_KEY);
if (hasClerk) {
  app.use(
    clerkMiddleware({
      publishableKey,
      secretKey: process.env.CLERK_SECRET_KEY,
    })
  );
}

// Serve static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(process.cwd(), '../frontend');
app.use(express.static(frontendPath));

// Swagger UI
try {
  const specPath = path.resolve(__dirname, '../openapi.json');
  const openapi = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));
} catch (e) {
  logger.warn({ err: e }, 'OpenAPI spec not loaded');
}

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Public config for frontend (exposes only publishable key)
app.get('/config/public', (_req, res) => {
  res.json({
    clerkPublishableKey: publishableKey || null,
  });
});

// Serve index.html on root for convenience
app.get('/', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const analyzeMiddlewares = [];
if (hasClerk) analyzeMiddlewares.push(requireAuth());
analyzeMiddlewares.push(upload.single('file'));
app.post('/analyze', analyzeMiddlewares, async (req, res) => {
  try {
    const file = req.file;
    const jobDescription = req.body.job_description || '';

    if (!file) {
      return res.status(400).json({ detail: 'No file uploaded' });
    }

    if (!['application/pdf', 'application/octet-stream'].includes(file.mimetype)) {
      return res.status(400).json({ detail: 'Only PDF files are supported' });
    }

    const text = await extractTextFromPdf(file.buffer);
    const parsed = parseResume(text);
    const scores = computeScores({ resumeText: text, parsed, jobDescription });
    const improvements = generateImprovements({ resumeText: text, parsed, scores, jobDescription });

    const result = {
      atsScore: scores.total,
      keywordMatch: scores.keywordMatch,
      subScores: scores.subScores,
      sections: parsed.sections,
      contacts: parsed.contacts,
      skills: parsed.skills,
      keywords: parsed.keywords,
      issues: improvements.issues,
      suggestions: improvements.suggestions,
      formattingTips: improvements.formattingTips,
    };

    // persist minimal analysis summary
    try {
      await insertAnalysis({
        atsScore: scores.total,
        keywordMatch: scores.keywordMatch,
        keywords: (parsed.keywords || []).slice(0, 20).join(','),
      });
    } catch (persistErr) {
      req.log?.warn({ err: persistErr }, 'Failed to persist analysis');
    }

    return res.json(result);
  } catch (e) {
    req.log?.error({ err: e }, 'Analyze failed');
    return res.status(500).json({ detail: `Analysis failed: ${e.message || e}` });
  }
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ detail: 'Internal Server Error' });
});

await initDb();
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`AI Resume Analyzer backend listening on http://localhost:${PORT}`);
  logger.info(`Serving frontend from: ${frontendPath}`);
});
