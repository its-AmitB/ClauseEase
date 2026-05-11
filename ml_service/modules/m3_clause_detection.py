import numpy as np
import torch
from transformers import AutoTokenizer, AutoModel

# Load model globally to avoid reloading per request
MODEL_NAME = "prajjwal1/bert-mini"

# Lazy-loaded globals
_tokenizer = None
_model = None
_anchor_matrix = None
_labels = []

LEGAL_ANCHORS = {
    "Confidentiality": "The parties agree to keep all proprietary information, trade secrets, and data strictly confidential and not disclose it to any third party.",
    "Indemnity": "Party shall indemnify, defend, and hold harmless the other party from and against any and all claims, damages, liabilities, and expenses.",
    "Termination": "This Agreement may be terminated by either party upon written notice if the other party materially breaches any of its terms.",
    "Liability": "In no event shall either party be liable for any indirect, incidental, special, consequential or punitive damages.",
    "Governing Law": "This Agreement shall be governed by and construed in accordance with the laws of the State, without regard to its conflict of law principles.",
    "Payment": "The Client shall pay the Service Provider the fees described in the invoice within thirty days of receipt."
}

def _get_embedding(text: str) -> np.ndarray:
    """Mean pooling over the last hidden state."""
    global _tokenizer, _model
    if _tokenizer is None:
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        _model = AutoModel.from_pretrained(MODEL_NAME)
        _model.eval()

    inputs = _tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = _model(**inputs)
    
    # Last hidden state: (1, seq_len, hidden_size)
    hidden = outputs.last_hidden_state
    # Mean pooling
    mean_pool = hidden.mean(dim=1).squeeze().numpy()
    return mean_pool

def _init_anchors():
    """Precompute embeddings for anchors."""
    global _anchor_matrix, _labels
    if _anchor_matrix is None:
        embeds = []
        for label, text in LEGAL_ANCHORS.items():
            _labels.append(label)
            embeds.append(_get_embedding(text))
        _anchor_matrix = np.array(embeds) # (num_anchors, hidden_size)

def classify_clauses(clause_list: list) -> list:
    """
    Classify a list of strings by computing cosine similarity against the anchor matrix.
    """
    _init_anchors()
    results = []
    
    for clause in clause_list:
        if len(clause) < 30: # Skip very short sentences
            continue
            
        emb = _get_embedding(clause) # (hidden_size,)
        
        # num = dot(A, B)
        # Cosine similarity = num / (norm(A) * norm(B))
        num = np.dot(_anchor_matrix, emb)
        den = np.linalg.norm(_anchor_matrix, axis=1) * np.linalg.norm(emb)
        sims = num / den
        
        max_idx = np.argmax(sims)
        max_score = float(sims[max_idx])
        
        # thresholding (heuristic for generic texts)
        if max_score > 0.65:
            results.append({
                "text": clause,
                "label": _labels[max_idx],
                "confidence": max_score
            })
        else:
            results.append({
                "text": clause,
                "label": "Other",
                "confidence": max_score
            })
            
    return results
