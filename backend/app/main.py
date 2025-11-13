from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional

from .models import AnalysisResponse, ErrorResponse
from .pdf_extractor import extract_text_from_pdf
from .parser import parse_resume
from .scoring import compute_scores
from .suggestions import generate_improvements

app = FastAPI(title="AI Resume Analyzer", version="0.1.0")

# Allow local dev origins (Vite/Next default ports)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalysisResponse, responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def analyze_resume(file: UploadFile = File(...), job_description: Optional[str] = Form(None)):
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Empty file uploaded")

        text = extract_text_from_pdf(file_bytes)
        parsed = parse_resume(text)

        scores = compute_scores(
            resume_text=text,
            parsed=parsed,
            job_description=job_description or "",
        )

        improvements = generate_improvements(
            resume_text=text,
            parsed=parsed,
            scores=scores,
            job_description=job_description or "",
        )

        response = AnalysisResponse(
            atsScore=scores.total,
            keywordMatch=scores.keyword_match,
            subScores=scores.subscores,
            sections=parsed.sections,
            contacts=parsed.contacts,
            skills=parsed.skills,
            keywords=parsed.keywords,
            issues=improvements.issues,
            suggestions=improvements.suggestions,
            formattingTips=improvements.formatting_tips,
        )
        return response
    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(status_code=500, content=ErrorResponse(detail=f"Analysis failed: {e}").dict())
