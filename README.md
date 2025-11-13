# AI Resume Analyzer

An intelligent ATS-powered resume analysis tool. Upload a PDF resume, optionally include a job description, and get an instant score, keyword coverage, issues, suggestions, and formatting tips.

## Project Structure

```
/backend        # Node.js + Express API, also serves the frontend
  /src
    /services   # pdfExtractor, parser, scoring, suggestions, utils
    server.js
  package.json
  README.md
/frontend       # Static HTML + Bootstrap UI
  index.html
  script.js
```

## Run (Windows PowerShell)

```
cd "e:\ai resume maker\backend"
npm install
npm run dev
```

Open http://localhost:4000 in your browser.

## Features

- Upload PDF, secure server-side parsing
- ATS scoring (Keywords, Structure, Formatting, Language)
- Keyword match % against job description
- Issues, suggestions, and formatting tips
- Clean, responsive Bootstrap UI with gradient theme

## Extend

- Swap rule-based NLP with spaCy, NLTK, or transformers
- Add LanguageTool API for grammar
- Integrate OpenAI for richer recommendations
