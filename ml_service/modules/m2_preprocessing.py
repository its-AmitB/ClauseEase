import pandas as pd
import numpy as np
import re

def preprocess(raw_text: str) -> list:
    """
    Preprocess raw text into a list of clean sentences/clauses using Pandas/NumPy.
    """
    # Simple regex split on sentence boundaries
    raw_sentences = re.split(r'(?<=\.)\s+(?=[A-Z])|(?<=\.\n)', raw_text)
    
    if not len(raw_sentences):
        return []

    # Load text into a Pandas Series
    s = pd.Series(raw_sentences)
    
    # Use vectorized .str operations
    # Standardize curly quotes to straight quotes
    s = s.str.replace(r'[“”]', '"', regex=True)
    s = s.str.replace(r'[‘’]', "'", regex=True)
    
    # Strip leading/trailing whitespace
    s = s.str.strip()
    
    # Use NumPy to filter out sentences shorter than 10 chars
    lengths = s.str.len().values
    valid_mask = np.where(lengths >= 10, True, False)
    
    s = s[valid_mask]
    
    # Filter boilerplate: simple heuristic for headers/footers
    def is_not_boilerplate(text):
        if not isinstance(text, str): return False
        lower = text.lower()
        if "page " in lower and len(text) < 15: return False
        if re.match(r'^\d+$', text): return False
        return True
        
    s = s[s.apply(is_not_boilerplate)]
    
    # Return as list of strings
    return s.tolist()
