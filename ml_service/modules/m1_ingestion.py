import fitz # PyMuPDF
import docx
import io

def accept_file(file_bytes: bytes, filename: str) -> str:
    """
    Extracts raw text from PDF or DOCX using bytes.
    """
    text = ""
    lower_name = filename.lower()
    
    if lower_name.endswith('.pdf'):
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text("text") + "\n"
        except Exception as e:
            print(f"PDF Parsing error: {e}")
            text = "Error parsing PDF document."
            
    elif lower_name.endswith('.docx'):
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"DOCX Parsing error: {e}")
            text = "Error parsing DOCX document."
            
    else:
        # Fallback to UTF-8 decode
        try:
            text = file_bytes.decode('utf-8')
        except:
            text = "Unsupported file format."
            
    # Normalize: Strip excess whitespace and normalize newlines
    normalized_text = " ".join(text.split())
    return normalized_text
