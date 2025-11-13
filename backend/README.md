# AI Resume Analyzer – Backend (Node/Express)

A lightweight Node.js + Express API that analyzes PDF resumes and returns ATS-like scores, issues, and suggestions.

## Endpoints

- `GET /health` – health check
- `POST /analyze` – multipart form with fields:
  - `file`: PDF file (required)
  - `job_description`: string (optional)
    Docs: Swagger UI available at `GET /docs` (served from `openapi.json`).

Returns JSON with:

```
{
  "atsScore": number,
  "keywordMatch": number,
  "subScores": { "keywords": number, "structure": number, "formatting": number, "language": number },
  "sections": object,
  "contacts": object,
  "skills": string[],
  "keywords": string[],
  "issues": string[],
  "suggestions": string[],
  "formattingTips": string[]
}
```

## Run (Windows PowerShell)

```
cd "e:\ai resume maker\backend"
npm install
npm run dev
```

Open http://localhost:4000 and use the UI (served from `../frontend`).
Open API docs at http://localhost:4000/docs

### Test the API quickly

```
# Health
Invoke-WebRequest -UseBasicParsing http://localhost:4000/health | Select-Object -ExpandProperty Content

# Analyze (replace sample.pdf with your path)
$Form = @{ job_description = "Node.js backend role with Express and REST APIs" }
$File = Get-Item "C:\path\to\sample.pdf"
Invoke-WebRequest -UseBasicParsing -Method Post -Uri http://localhost:4000/analyze -Form $Form -InFile $File -ContentType "application/pdf"
```

## Notes

- PDF text extraction uses `pdf-parse`.
- NLP/scoring is rule-based and deterministic; you can plug in LLMs or LanguageTool later.
- Request logging via pino; errors are centralized.
- Analysis summaries are stored in a local JSON DB at `backend/data/analyses.json` (via lowdb) by default.
- If `DATABASE_URL` is set (PostgreSQL), results are persisted to Postgres instead. Use a URL like:
  `postgres://USERNAME:PASSWORD@HOST:5432/DBNAME?sslmode=require`.

## Deploy (Render)

Add this repo to Render and use the included `render.yaml`. It will build and start the backend from the `backend` folder. Set environment variables (e.g., `CORS_ORIGINS`, `OPENAI_API_KEY`) in Render Dashboard.
