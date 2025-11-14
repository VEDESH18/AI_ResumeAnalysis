# AI Resume Analyzer

An intelligent ATS-style resume analyzer powered by AI. Upload a PDF, optionally include a job description, and get a score, keyword coverage, issues, suggestions, and formatting tips.

## Project Structure

```
backend/                # Node.js + Express API
  src/
    services/           # pdfExtractor, parser, scoring, suggestions, db, logger
    server.js
  openapi.json          # Swagger spec (served at /docs)
  package.json
  README.md

frontend/               # Next.js 14 + Clerk Auth + Tailwind CSS
  app/
    (root, features, upload, contact pages)
    layout.tsx          # ClerkProvider + navbar with auth
  middleware.ts         # Clerk auth middleware
  package.json
```

## Quick Start

### Backend (Express + MongoDB/Postgres/JSON)

```powershell
cd backend
npm install
# Set env vars in .env (see backend/.env.example)
npm run start
# Server runs on http://localhost:4001 (default)
```

### Frontend (Next.js)

```powershell
cd frontend
npm install
# Set env vars in .env.local (Clerk keys + backend URL)
npm run dev
# App runs on http://localhost:3000 (default)
```

Access:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4001
- API Docs: http://localhost:4001/docs
- Swagger UI: http://localhost:4001/docs

## Features

- **Resume Upload**: PDF parsing with server-side extraction
- **ATS Scoring**: Keywords, structure, formatting, language quality (0–100)
- **Keyword Match**: Compare resume against job descriptions
- **Actionable Insights**: Issues, suggestions, and formatting tips
- **Clerk Authentication**: Sign-in/up with email or Google OAuth
- **Responsive UI**: Next.js + Tailwind CSS
- **Secure Persistence**: MongoDB Atlas (primary), Postgres (optional), JSON fallback

## Authentication

Configure Clerk:

1. Create a free Clerk account at https://clerk.com
2. Create an application and get your publishable + secret keys
3. Add keys to `frontend/.env.local` and `backend/.env`
4. Enable Google OAuth in Clerk dashboard if desired

## Configuration

### Backend (.env)

```env
PORT=4001
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Database
MONGODB_URI=mongodb+srv://...
MONGODB_DB=ai_resume_analyzer
DATABASE_URL=postgresql://...

# Clerk Auth
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:4001
```

## Deployment

### Vercel (Frontend)

```bash
cd frontend
vercel deploy
```

### Render / Railway (Backend)

Use `render.yaml` preset or configure manually:

- Set `PORT=4001`
- Configure MongoDB Atlas or Postgres connection string
- Set Clerk keys

## Tech Stack

- **Backend**: Node.js, Express, pdf-parse, pino (logging), mongodb/pg (optional)
- **Frontend**: Next.js 14, React, Tailwind CSS, Clerk
- **Auth**: Clerk (email + OAuth)
- **Hosting**: Vercel (frontend), Render/Railway (backend)

## Notes

- Request logging via pino; centralized error handling
- Analysis summary persisted: MongoDB → Postgres → JSON fallback
- Swagger/OpenAPI docs at `http://localhost:4001/docs`
- Frontend gated by Clerk auth when keys are present

## Roadmap

- Optional grammar checks (LanguageTool API)
- LLM-assisted recommendations (OpenAI integration)
- User dashboard with analysis history
- Resume templates and best practices
