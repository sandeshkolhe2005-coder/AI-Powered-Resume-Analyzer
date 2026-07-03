# AI Resume Analyzer

AI Resume Analyzer is a production-quality, full-stack web application that lets users upload their resumes (PDF/DOCX), parse them, score them against ATS criteria, match them semantically against job descriptions, and use Google Gemini to generate suggestions, cover letters, and interview preparation questions.

## Features & Stack

- **Frontend**: React 19 + Vite, Tailwind CSS v4, Framer Motion, Recharts, Zustand state store, Axios (with silent JWT refresh).
- **Backend**: FastAPI, SQLAlchemy ORM (SQLite/PostgreSQL), Celery task worker, Qdrant semantic vector similarity matching.
- **AI Integrations**: Native Google Gemini 1.5 Flash API connector.
- **Portability**: Platform-agnostic REST adapters enabling instant runs without heavy machine compiler tools.

---

## Getting Started

### 1. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Google Gemini API key configuration (Required for AI actions, optional for mock fallback)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Active LLM provider (gemini, mock)
LLM_PROVIDER=gemini

# Secret key for signing JWT tokens
SECRET_KEY=ats_analyzer_super_secret_signing_key_9988
```

### 2. Run via Docker Compose (Recommended)
You can launch the complete ecosystem (PostgreSQL database, Redis, Qdrant, celery worker, backend API, and Vite webapp) in one command:
```bash
docker-compose up --build
```
- Web Application: `http://localhost:3000`
- API Documentation: `http://localhost:8000/docs`

### 3. Run Locally (Fast Development Run)
If you want to run without Docker, the application automatically falls back to SQLite database, eager synchronous workers, and in-memory vector storage:

**Backend Setup**:
```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
pip install httpx email-validator

# Start FastAPI API server
uvicorn backend.app.main:app --reload --port 8000
```

**Frontend Setup**:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Verifications & Testing

Run unit tests inside your virtual environment to verify credentials and endpoint routing:
```bash
.\venv\Scripts\pytest backend/tests/
```
All tests should pass successfully.
