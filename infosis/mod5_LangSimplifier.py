# simplifier_t5.py
from transformers import pipeline
import nltk
from nltk.tokenize import sent_tokenize

# Ensure the sentence tokenizer is available
nltk.download('punkt', quiet=True)

def load_simplifier_pipeline():
    """
    Loads the T5 text-to-text generation pipeline.
    Should be called once when the web application starts.
    """
    model_name = "t5-small"
    simplifier = pipeline("text2text-generation", model=model_name, tokenizer=model_name)
    return simplifier

def simplify_text(text: str, simplifier, max_length: int = 60) -> str:
    """
    Simplifies a block of text sentence by sentence using a pre-loaded pipeline.
    """
    sentences = sent_tokenize(text)
    simplified_sentences = []

    for sent in sentences:
        # T5 expects a task prefix
        input_text = "paraphrase: " + sent
        
        # The pipeline returns a list of dictionaries
        result = simplifier(input_text, max_length=max_length, num_beams=5, early_stopping=True)
        
        if result:
            simplified_sentences.append(result[0]['generated_text'])

    return ' '.join(simplified_sentences)

if __name__ == "__main__":
    print("Loading simplification pipeline for local testing...")
    # 1. Load the pipeline first
    t5_simplifier = load_simplifier_pipeline()
    print("Pipeline loaded.")

    # 2. Use the loaded object for simplification
    complex_clause = """
    Notwithstanding anything to the contrary contained herein, the Lessee shall indemnify and hold harmless the Lessor from any liability arising out of the Lessee's use of the premises, including but not limited to, claims of third parties.
    """
    simplified_clause = simplify_text(complex_clause, t5_simplifier)

    print("\n--- Language Simplification ---")
    print("\nOriginal Clause:\n", complex_clause.strip())
    print("\nSimplified Clause:\n", simplified_clause)