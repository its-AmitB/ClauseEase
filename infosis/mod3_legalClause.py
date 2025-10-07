# Detect and label legal clauses in contract text using NLP and ML

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Define clause categories - this is lightweight and can stay here
clause_labels = {
    0: "Confidentiality",
    1: "Termination",
    2: "Indemnity",
    3: "Dispute Resolution",
    4: "Governing Law"
}

def load_classification_model():
    """
    Loads the Legal-BERT model and tokenizer.
    Should be called once when the web application starts.
    """
    model_name = "nlpaueb/legal-bert-base-uncased"
    # To support a wider range of clauses, we'll use a larger num_labels.
    # The original code had 5, but let's assume a more general model might be swapped in.
    # For the specific pre-trained model, the number of labels would be set during fine-tuning.
    # We will stick to the original num_labels=5 as per the initial script's intent.
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=5)
    return model, tokenizer

def detect_clause_type(text: str, model, tokenizer) -> str:
    """
    Detects the clause type using a pre-loaded model and tokenizer.
    """
    # Tokenize the input text
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    
    # Get model predictions without computing gradients
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Extract logits and determine the predicted class
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()
    
    # Return the corresponding clause label
    return clause_labels.get(predicted_class, "Uncategorized")


if __name__ == "__main__":
    print("Loading model for local testing...")
    # 1. Load the model and tokenizer first
    clf_model, clf_tokenizer = load_classification_model()
    print("Model loaded.")

    # 2. Use the loaded objects for prediction
    sample_clause = """
    Either party may terminate this Agreement upon written notice in case of a breach by the other party.
    """
    detected_type = detect_clause_type(sample_clause, clf_model, clf_tokenizer)
    print(f"\nDetected Clause Type: {detected_type}")