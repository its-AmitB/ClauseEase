import re

def count_syllables(word: str) -> int:
    """
    Counts syllables in a word using a regex vowel-group approach.
    """
    word = word.lower()
    
    if len(word) <= 3:
        return 1
        
    # Remove some common silent endings
    word = re.sub(r'e$', '', word)
    word = re.sub(r'es$', '', word)
    word = re.sub(r'ed$', '', word)
    
    # Count vowel groups
    vowel_groups = re.findall(r'[aeiouy]+', word)
    count = len(vowel_groups)
    
    return max(1, count)

def score(text: str) -> float:
    """
    Calculates the Flesch-Kincaid Reading Ease score.
    Formula: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
    """
    if not text or len(text.strip()) == 0:
        return 0.0
        
    # Filter text
    clean_text = re.sub(r'[^\w\s\.]', '', text)
    
    # Use simple heuristic for sentences: split by dot followed by space or newline
    sentences = re.split(r'\.\s*', text.strip())
    sentences = [s for s in sentences if len(s.strip()) > 0]
    num_sentences = max(1, len(sentences))
    
    words = clean_text.split()
    num_words = max(1, len(words))
    
    num_syllables = sum(count_syllables(w) for w in words)
    
    fk_score = 206.835 - 1.015 * (num_words / num_sentences) - 84.6 * (num_syllables / num_words)
    
    # Clamp score to reasonable bounds
    return max(0.0, min(fk_score, 100.0))

def grade_level(fk_score: float) -> str:
    """
    Returns standard grade level mapping for a Flesch-Kincaid score.
    """
    if fk_score >= 90:
        return "5th Grade"
    elif fk_score >= 80:
        return "6th Grade"
    elif fk_score >= 70:
        return "7th Grade"
    elif fk_score >= 60:
        return "8th-9th Grade"
    elif fk_score >= 50:
        return "10th-12th Grade"
    elif fk_score >= 30:
        return "College"
    else:
        return "Post-Graduate"
