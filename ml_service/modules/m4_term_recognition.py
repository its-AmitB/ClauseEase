import spacy

_nlp = None

LEGAL_DICTIONARY = {
    "indemnify": "to compensate someone for harm or loss",
    "arbitration": "resolving disputes outside the courts",
    "fiduciary": "involving trust, especially with regard to the relationship between a trustee and a beneficiary",
    "tort": "a wrongful act or infringement of a right leading to legal liability",
    "injunction": "an authoritative warning or order",
    "jurisdiction": "the official power to make legal decisions and judgments",
    "liability": "the state of being legally responsible for something",
    "breach": "an act of breaking or failing to observe a law, agreement, or code of conduct",
    "severability": "a provision in a contract which states that if parts of the contract are held to be illegal or otherwise unenforceable, the remainder of the contract should still apply",
    "force majeure": "unforeseeable circumstances that prevent someone from fulfilling a contract",
    "waiver": "the voluntary relinquishment or surrender of some known right or privilege",
    "covenant": "an agreement, usually formal, between two or more persons to do or not do something specified",
    "liquidated damages": "damages whose amount the parties designate during the formation of a contract for the injured party to collect as compensation upon a specific breach",
    "warrant": "justify or necessitate a certain course of action",
    "remedy": "the means to achieve justice in any matter in which legal rights are involved"
}

def extract_terms(text: str) -> list:
    """
    Extract legal terms based on definitions dictionary.
    """
    global _nlp
    if _nlp is None:
        try:
            _nlp = spacy.load("en_core_web_sm")
        except OSError:
            # Fallback if model not downloaded, download dynamically
            from spacy.cli import download
            download("en_core_web_sm")
            _nlp = spacy.load("en_core_web_sm")

    # While NER can find orgs, persons, we specifically want to return Dictionary terms found.
    # We will simply scan the text (case-insensitive) for dictionary keys and return them.
    # To use spaCy, we can process the text and check tokens.
    
    doc = _nlp(text)
    
    found_terms = {}
    
    # Token matching
    text_lower = text.lower()
    for term, definition in LEGAL_DICTIONARY.items():
        if term in text_lower:
            found_terms[term] = definition
            
    # Format to required dict array
    results = [{"term": t, "definition": d} for t, d in found_terms.items()]
    return results
