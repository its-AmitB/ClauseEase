"""
===============================
Legal Contract Text Preprocessor
===============================

This module preprocesses contract or legal text by:
- Cleaning and normalizing text
- Segmenting clauses based on numbering patterns (e.g., 1.1, 2.3.4)
- Splitting clauses into sentences
- Extracting named entities using spaCy (e.g., dates, organizations, money)
"""

import re
import nltk
import spacy
from nltk.tokenize import sent_tokenize
from typing import List, Dict, Tuple

# Ensure necessary models and tokenizers are available
nltk.download("punkt", quiet=True)
nlp = spacy.load("en_core_web_sm")

def clean_text(text: str) -> str:
    """
    Normalize and clean legal text for consistent processing.
    """
    text = text.replace("\xa0", " ")  # Non-breaking space
    text = re.sub(r"[\t\r\f\v]", " ", text)  # Remove control characters
    text = re.sub(r"\s+", " ", text)  # Collapse whitespace
    text = re.sub(r"[“”]", '"', text)  # Normalize double quotes
    text = re.sub(r"[’‘]", "'", text)  # Normalize single quotes
    return text.strip()

def segment_clauses(text: str) -> List[str]:
    """
    Segment text into clauses based on legal numbering patterns.
    """
    pattern = re.compile(r'(?=\n?\d{1,2}(\.\d{1,2})+[\)\.]?\s)')
    parts = pattern.split(text)
    clauses = []

    if not parts:
        return [text.strip()]

    temp = ""
    for part in parts:
        if re.match(r"\d{1,2}(\.\d{1,2})+[\)\.]?", part.strip()):
            if temp:
                clauses.append(temp.strip())
            temp = part
        else:
            temp += part

    if temp:
        clauses.append(temp.strip())

    return clauses

def split_sentences(text: str) -> List[str]:
    """
    Split a clause into individual sentences using NLTK.
    """
    return sent_tokenize(text)

def extract_entities(text: str) -> List[Tuple[str, str]]:
    """
    Extract named entities using spaCy’s NER pipeline.
    """
    doc = nlp(text)
    return [(ent.text, ent.label_) for ent in doc.ents]

def preprocess_clause(clause_text: str) -> Dict[str, any]:
    """
    Process a single clause: clean, split, and extract entities.
    """
    cleaned = clean_text(clause_text)
    sentences = split_sentences(cleaned)
    entities = extract_entities(cleaned)
    return {
        "raw_text": clause_text.strip(),
        "cleaned_text": cleaned,
        "sentences": sentences,
        "entities": entities,
    }

def preprocess_contract_text(raw_text: str) -> List[Dict[str, any]]:
    """
    Preprocess an entire contract: clean, segment, and process each clause.
    """
    cleaned_text = clean_text(raw_text)
    clauses = segment_clauses(cleaned_text)
    return [preprocess_clause(c) for c in clauses]

if __name__ == "__main__":
    sample_text = """
    WHEREAS, this AGREEMENT is made on September 15, 2021;
    1.1 The Company agrees to provide services to the Client.
    1.2 The Client shall pay an amount of $10,000 within 30 days.
    """
    processed = preprocess_contract_text(sample_text)
    print("\n=== First Clause Example ===")
    print(processed[0])
    print("\n=== Extracted Entities ===")
    for ent, label in processed[0]["entities"]:
        print(f"- {ent} ({label})")