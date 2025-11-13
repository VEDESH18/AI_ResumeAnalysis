from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    detail: str


class ParseResult(BaseModel):
    sections: Dict[str, str] = Field(default_factory=dict)
    contacts: Dict[str, Optional[str]] = Field(default_factory=dict)
    skills: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)


class SubScores(BaseModel):
    keywords: int
    structure: int
    formatting: int
    language: int


class Scores(BaseModel):
    total: int
    keyword_match: int
    subscores: SubScores


class AnalysisResponse(BaseModel):
    atsScore: int
    keywordMatch: int
    subScores: SubScores
    sections: Dict[str, str]
    contacts: Dict[str, Optional[str]]
    skills: List[str]
    keywords: List[str]
    issues: List[str]
    suggestions: List[str]
    formattingTips: List[str]
