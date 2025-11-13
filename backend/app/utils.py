import re
from collections import Counter
from typing import List

STOPWORDS = set(
    [
        "the","and","a","an","to","in","of","for","on","at","by","with","from","as","is","are","was","were","be","been","being",
        "this","that","these","those","it","its","or","not","but","if","than","then","so","such","into","through","over","under",
        "i","me","my","we","our","you","your","he","she","they","them","their","his","her","our","us",
        "summary","experience","skills","education","projects","certifications","work","professional","responsibilities","achievements",
    ]
)

STRONG_ACTION_VERBS = [
    "led","built","delivered","designed","implemented","optimized","launched","migrated","automated","reduced","increased","improved",
    "developed","created","owned","spearheaded","streamlined","engineered","deployed","refactored","enhanced","analyzed","architected",
]

BULLET_SYMBOLS = ["-", "•", "*", "—", "–"]


def clean_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"\r", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def tokenize(text: str) -> List[str]:
    text = text.lower()
    # keep words and numbers
    tokens = re.findall(r"[a-zA-Z][a-zA-Z\-\+\.]*|\d+%?", text)
    return tokens


def keywords_from_text(text: str, top_k: int = 50) -> List[str]:
    tokens = [t for t in tokenize(text) if t not in STOPWORDS and len(t) > 2]
    counts = Counter(tokens)
    return [w for w, _ in counts.most_common(top_k)]


def passive_voice_ratio(text: str) -> float:
    # naive passive detection: forms of "be" followed by a past participle-like token
    matches = re.findall(r"\b(is|are|was|were|been|being|be|has been|have been)\s+[a-zA-Z]+ed\b", text.lower())
    sentences = re.split(r"[\.!?]\s+", text)
    total = max(1, len([s for s in sentences if s.strip()]))
    return min(1.0, len(matches) / total)


def bullet_lines(text: str) -> List[str]:
    lines = text.splitlines()
    return [ln.strip() for ln in lines if ln.strip().startswith(tuple(BULLET_SYMBOLS))]


def starts_with_strong_verb(line: str) -> bool:
    # remove bullet symbol if present
    line = line.lstrip("-•*—– ").strip().lower()
    first = line.split(" ")[:1]
    return bool(first) and first[0] in STRONG_ACTION_VERBS
