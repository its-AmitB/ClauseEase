# ClauseEase

A microservices-based legal document analysis platform.

## Architecture

This project is divided into three distinct microservices:

1. **Gateway (`/gateway`)**: A Node.js / Express API gateway handling user authentication, caching state, and routing files using multer.
2. **ML Engine (`/ml_service`)**: A FastAPI Python service that runs NLP models (Flan-T5-small, BERT-mini, spaCy) to classify clauses, recognize terms, and simplify complex legal jargon.
3. **Frontend (`/frontend`)**: A React.js / Vite dashboard.

## Running Locally via Docker (Recommended)

1. Ensure you have Docker and Docker Compose installed.
2. Clone or export the repository.
3. Because the directories rely on Dockerfiles that aren't strictly specified in the prompt but are implied by the stack, you may need to add simple `Dockerfile`s to each folder or run them locally as described below.

If you add Dockerfiles, simply compile the suite using:
```bash
docker-compose up --build
```

## Running Locally Without Docker

### 1. MongoDB Database
Ensure a local instance of MongoDB is running on `mongodb://localhost:27017` or update the `.env` files with your Atlas URI.

### 2. ML Engine (Python)
```bash
cd ml_service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --host 0.0.0.0 --port 8000
```
*(The first analysis might take a few seconds as the transformers download from HuggingFace to your local cache).*

### 3. API Gateway (Node.js)
```bash
cd gateway
npm install
node server.js
```

### 4. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Visit the dashboard at `http://localhost:3000`. 
Register an account, click the login toggle, and upload a `.pdf` or `.docx` file to experience AI Legal Document Analysis!

## Credits

ClauseEase was designed and built by **Amit Badoni** as a comprehensive legal document analysis platform leveraging modern NLP techniques.

