from fastapi import FastAPI, UploadFile, File, BackgroundTasks
import uuid
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modules import m1_ingestion, m2_preprocessing, m3_clause_detection, m4_term_recognition, m5_simplification
from utils import readability

app = FastAPI(title="ClauseEase ML Engine")

def run_pipeline(file_bytes: bytes, filename: str):
    """
    Executes the full NLP pipeline.
    """
    # Module 1: Ingestion
    raw_text = m1_ingestion.accept_file(file_bytes, filename)
    
    # Module 2: Preprocessing
    clauses = m2_preprocessing.preprocess(raw_text)
    
    # Module 3: Clause Detection
    detected_clauses = m3_clause_detection.classify_clauses(clauses)
    
    # filter out non-legal ("Other") and low-confidence
    filtered_clauses = [c for c in detected_clauses if c['label'] != 'Other' and c['confidence'] > 0.6]
    
    # Module 4: Term Recognition
    extracted_terms = m4_term_recognition.extract_terms(raw_text)
    
    # Module 5: Simplification
    # Pass only the legal clauses to simplify to save inference time, or simplify the whole raw_text.
    # The requirement says: "For each clause, run the prompt... Join all simplified clauses"
    simplified_text = m5_simplification.simplify_text(clauses)
    
    # Readability Score
    original_score = readability.score(raw_text)
    simplified_score = readability.score(simplified_text)
    
    return {
        "original_text": raw_text,
        "simplified_text": simplified_text,
        "clauses": filtered_clauses,
        "terms": extracted_terms,
        "readability": {
            "original_score": original_score,
            "simplified_score": simplified_score,
            "grade_level_original": readability.grade_level(original_score),
            "grade_level_simplified": readability.grade_level(simplified_score)
        }
    }

@app.post("/analyze")
async def analyze_async(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Async endpoint returning task ID."""
    task_id = str(uuid.uuid4())
    file_bytes = await file.read()
    filename = file.filename
    # Normally we would save to a db or queue here
    background_tasks.add_task(run_pipeline, file_bytes, filename)
    return {"status": "processing", "task_id": task_id}

@app.post("/analyze/sync")
async def analyze_sync(file: UploadFile = File(...)):
    """Synchronous endpoint for development simplicity."""
    file_bytes = await file.read()
    filename = file.filename
    result = run_pipeline(file_bytes, filename)
    return result

@app.get("/health")
def health():
    return {"status": "ok", "service": "ml_service"}
