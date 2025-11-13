import fitz  # PyMuPDF
from .utils import clean_text


def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    all_text = []
    try:
        for page in doc:
            all_text.append(page.get_text("text"))
    finally:
        doc.close()
    return clean_text("\n".join(all_text))
