# AI Resume Analyzer

An intelligent ATS-style resume analyzer. Upload a PDF, optionally include a job description, and get a score, keyword coverage, issues, suggestions, and formatting tips.

## Project Structure

```
backend/                # Node.js + Express API (serves frontend too)
  src/
    services/           # pdfExtractor, parser, scoring, suggestions, utils
    server.js
  openapi.json          # Swagger spec (served at /docs)
  package.json
  README.md
frontend/               # Static HTML + Bootstrap UI
  index.html
  features.html
  upload.html
  contact.html
  styles.css
  app.js
  upload.js
```

## Run (Windows PowerShell)

```
cd "e:\ai resume maker\backend"
npm install
# Optionally set a port (default 4000 if not set in .env)
# $env:PORT=4000
npm run dev
```

- Open `http://localhost:<PORT or 4000>/` for the UI
- API docs at `http://localhost:<PORT or 4000>/docs`

## Features

- Upload PDF (server-side parsing with pdf-parse)
- ATS scoring: keywords, structure, formatting, language
- Keyword match against job description
- Actionable issues, suggestions, and formatting tips
- Clean, responsive Bootstrap UI

## Configuration

Create `backend/.env` (see `backend/.env.example`):

```
# Networking
PORT=4000
CORS_ORIGINS=http://localhost:4000,http://localhost:3000,http://localhost:5173

# Primary datastore (optional; falls back to JSON via lowdb)
MONGODB_URI=
MONGODB_DB=

# Optional Postgres fallback
DATABASE_URL=

# Optional APIs
OPENAI_API_KEY=
LANGUAGETOOL_API_URL=https://api.languagetool.org/v2
```

## Notes

- Request logging via pino; centralized error handling
- Persists a small analysis summary to MongoDB (if configured), else Postgres, else local JSON (`backend/data/analyses.json`)
- Swagger UI served from `backend/openapi.json` at `/docs`

## Roadmap

- Optional grammar checks (LanguageTool)
- Optional LLM-assisted recommendations (OpenAI)
- Deployment presets (Render/Railway) using `render.yaml`
