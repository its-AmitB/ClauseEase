import re

# This dictionary is small and loads instantly
legal_terms = {
    "indemnity": "Security or protection against a loss or other financial burden.",
    "arbitration": "A method of resolving disputes outside the courts.",
    "force majeure": "Unforeseeable circumstances that prevent someone from fulfilling a contract.",
    "breach": "A violation of a law, duty, or other form of obligation.",
    "jurisdiction": "The official power to make legal decisions and judgments.",
}

def recognize_legal_terms(text: str, term_dict: dict) -> dict:
    """
    Recognizes legal terms in text based on a provided dictionary.
    Returns a dictionary of found terms and their definitions.
    """
    found_terms = {}
    for term in term_dict:
        # Using word boundaries (\b) to match whole words only
        if re.search(r'\b' + re.escape(term) + r'\b', text.lower()):
            found_terms[term] = term_dict[term]
    return found_terms

if __name__ == "__main__":
    contract_text = """
    This agreement is subject to arbitration and the parties waive any right to indemnity or to invoke force majeure clauses. A breach of this contract will fall under the agreed jurisdiction.
    """
    
    recognized = recognize_legal_terms(contract_text, legal_terms)
    
    print("--- Recognized Legal Terms ---")
    if not recognized:
        print("No terms found.")
    else:
        for term, definition in recognized.items():
            print(f"🔹 {term.capitalize()}: {definition}")