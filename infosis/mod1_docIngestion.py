import os
import logging
import fitz  # PyMuPDF
from docx import Document

# Set up logging format
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


class UnsupportedFileType(Exception):
    """Custom error when file type is not PDF or DOCX."""
    pass


def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    try:
        doc = fitz.open(file_path)  # Open PDF file
        all_text = ""
        for page in doc:
            text = page.get_text()
            all_text += text
        doc.close()
        return all_text.strip()  # Remove extra spaces
    except Exception as e:
        logging.error(f"Could not read PDF file '{file_path}': {e}")
        raise


def extract_text_from_docx(file_path: str) -> str:
    """Extract text from a DOCX (Word) file."""
    try:
        doc = Document(file_path)  # Open the DOCX file
        paragraphs = []
        for para in doc.paragraphs:
            if para.text.strip():  # Skip empty ones
                paragraphs.append(para.text)
        return "\n".join(paragraphs).strip()  # Join paragraphs with newlines
    except Exception as e:
        logging.error(f"Could not read DOCX file '{file_path}': {e}")
        raise


def extract_text(file_path: str) -> str:
    """Detects the file type (.pdf or .docx) and extracts its text."""
    if not os.path.exists(file_path):  # Check if file exists
        raise FileNotFoundError(f"File not found: {file_path}")

    _, ext = os.path.splitext(file_path)  # Get file extension
    ext = ext.lower()  # Make it lowercase for safety

    # Choose function based on file type
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return extract_text_from_docx(file_path)
    else:
        raise UnsupportedFileType(
            f"Unsupported file type: '{ext}'. Only .pdf and .docx are supported."
        )


if __name__ == "__main__":
    # Example file to test (change path if needed)
    file_path = "file/SampleContract_short.pdf"
    logging.info(f"Reading file: {file_path}")
    try:
        text = extract_text(file_path)
        logging.info("Text extraction completed successfully.")
        # Show only first 500 characters for preview
        print("\n=== Extracted Text (First 500 Characters) ===\n")
        print(text[:500])
    except FileNotFoundError as e:
        logging.error(e)
    except UnsupportedFileType as e:
        logging.error(e)
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")