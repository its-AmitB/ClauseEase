from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch

MODEL_NAME = "google/flan-t5-small"

_tokenizer = None
_model = None

def simplify_text(clause_list: list) -> str:
    """
    Simplifies a list of strings by prompting Flan-T5.
    Returns a single concatenated simplified string.
    """
    global _tokenizer, _model
    if _tokenizer is None:
        _tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME, legacy=False)
        _model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)
        _model.eval()

    simplified_sentences = []
    
    for clause in clause_list:
        if len(clause) < 20: 
            # Too short to simplify, keep original
            simplified_sentences.append(clause)
            continue
            
        prompt = f"Simplify this legal clause into plain English: {clause}"
        
        inputs = _tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
        
        with torch.no_grad():
            outputs = _model.generate(
                **inputs,
                max_new_tokens=150,
                num_beams=4,
                early_stopping=True,
                no_repeat_ngram_size=2
            )
            
        simplified = _tokenizer.decode(outputs[0], skip_special_tokens=True)
        simplified_sentences.append(simplified.capitalize())
        
    return " ".join(simplified_sentences)
