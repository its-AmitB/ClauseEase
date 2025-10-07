import os
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename

# --- Import Your Custom Modules ---
# Make sure the 'infosis' directory is in the same folder as app.py
from infosis.mod1_docIngestion import extract_text, UnsupportedFileType
from infosis.mod2_preprocess import preprocess_contract_text
from infosis.mod3_legalClause import load_classification_model, detect_clause_type
from infosis.mod4_legalTermRec import recognize_legal_terms, legal_terms as terms_dictionary
from infosis.mod5_LangSimplifier import load_simplifier_pipeline, simplify_text

# --- Flask App Initialization and Configuration ---
app = Flask(__name__)

# Configure a temporary folder for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload size

# --- CRITICAL: Load Models ONCE at Startup ---
# This prevents reloading the heavy models on every request, which would be very slow.
print("Loading NLP models... This may take a moment.")
try:
    clf_model, clf_tokenizer = load_classification_model()
    simplifier_pipeline = load_simplifier_pipeline()
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    # In a real app, you might want to exit or handle this more gracefully.
    clf_model, clf_tokenizer, simplifier_pipeline = None, None, None


def allowed_file(filename):
    """Checks if the uploaded file has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- App Routes ---

@app.route('/')
def index():
    """Renders the main upload page."""
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_document():
    """Handles file upload and the entire analysis pipeline."""
    if 'file' not in request.files:
        return render_template('index.html', error="No file part in the request. Please select a file.")

    file = request.files['file']

    if file.filename == '':
        return render_template('index.html', error="No file selected. Please choose a PDF or DOCX file.")

    if not file or not allowed_file(file.filename):
        return render_template('index.html', error="Invalid file type. Only PDF and DOCX files are allowed.")

    # Securely save the uploaded file
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    try:
        # --- PROCESSING PIPELINE ---
        # 1. Extract text from the document
        raw_text = extract_text(filepath)
        if not raw_text or not raw_text.strip():
            raise ValueError("Could not extract any text from the document. It might be empty or image-based.")

        # 2. Preprocess text to get segmented clauses
        processed_clauses = preprocess_contract_text(raw_text)
        if not processed_clauses:
             raise ValueError("The document does not seem to contain standard numbered clauses for analysis.")

        # 3. Analyze each clause individually
        analysis_results = []
        for clause_data in processed_clauses:
            clause_text = clause_data.get("raw_text", "")
            if not clause_text:
                continue

            # Run classification, simplification, and term recognition
            clause_type = detect_clause_type(clause_text, clf_model, clf_tokenizer)
            simplified_text = simplify_text(clause_text, simplifier_pipeline)
            found_terms = recognize_legal_terms(clause_text, terms_dictionary)

            # Append all data for the frontend
            clause_data['clause_type'] = clause_type
            clause_data['simplified_text'] = simplified_text
            clause_data['legal_terms'] = found_terms
            analysis_results.append(clause_data)

        # Render the page again with the results
        return render_template('index.html', results=analysis_results)

    except (UnsupportedFileType, ValueError, FileNotFoundError) as e:
        # Handle specific, known errors
        return render_template('index.html', error=str(e))
    except Exception as e:
        # Handle unexpected errors during processing
        print(f"An unexpected error occurred: {e}")
        return render_template('index.html', error=f"An unexpected error occurred during analysis: {e}")
    finally:
        # 4. Clean up by deleting the uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)

if __name__ == '__main__':
    # Create the 'uploads' directory if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    # Run the Flask app
    app.run(debug=True)
