# ⚖️ ClauseEase – Legal Clause Detection & Simplification Website

ClauseEase is an AI-powered web app that analyzes legal documents, detects clause types, identifies key legal terms, and simplifies complex legal language into plain English.

## 🚀 Features
- Upload PDF/DOCX legal documents  
- Automatic text extraction and clause segmentation  
- Clause classification using Legal-BERT  
- Legal term recognition with definitions  
- Simplified language output using T5-small  
- Clean, interactive web interface (Flask-based)

## 🧩 Project Structure
  ```bash
    infosis_web/
    ├─ infosis/ # Backend modules
    ├─ templates/ # HTML templates
    ├─ static/ # CSS & JS files
    └─ app.py # Flask app entry point


## ⚙️ Installation
```bash
git clone https://github.com/its-AmitB/ClauseEase.git
cd ClauseEase/infosis_web
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py
