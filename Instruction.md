# INSTRUCTIONS.md — AI Resume Analyzer

Step-by-step guide to set up, run, and deploy the project locally and in production.

---

## 1. Prerequisites

Install the following before starting:

- **Node.js** ≥ 20.x and npm/pnpm
- **Python** ≥ 3.11
- **PostgreSQL** ≥ 15
- **Redis** ≥ 7
- **Docker & Docker Compose** (recommended, simplifies steps 2–3 below)
- An API key from **OpenAI**, **Google Gemini**, or **Anthropic (Claude)**
- (Optional) AWS S3 or Cloudinary account for file storage
- (Optional) Qdrant Cloud account, or run Qdrant locally via Docker

---

## 2. Option A — Run Everything with Docker (recommended)

```bash
git clone <your-repo-url> ai-resume-analyzer
cd ai-resume-analyzer

# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Fill in the .env files (see Section 4 below), then:
docker-compose up --build
```

This spins up: frontend (Vite dev server or Nginx), backend (FastAPI), PostgreSQL, Redis, Celery worker, and Qdrant.

- Frontend → http://localhost:5173
- Backend API docs → http://localhost:8000/docs

---

## 3. Option B — Manual Local Setup

### 3.1 Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env            # fill in values, see Section 4

# Run DB migrations
alembic upgrade head

# Start Redis (separate terminal, or via Docker)
redis-server

# Start Celery worker (separate terminal)
celery -A app.workers.celery_app worker --loglevel=info

# Start FastAPI
uvicorn app.main:app --reload --port 8000
```

### 3.2 Frontend

```bash
cd frontend
npm install
cp .env.example .env            # set VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Visit **http://localhost:5173**.

---

## 4. Environment Variables

### backend/.env

```env
# App
ENVIRONMENT=development
SECRET_KEY=replace-with-a-long-random-string
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resume_analyzer

# Redis
REDIS_URL=redis://localhost:6379/0

# AI Provider (choose one or support multiple)
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=

# Vector DB
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# File Storage
STORAGE_PROVIDER=s3            # or cloudinary
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
CLOUDINARY_URL=
```

### frontend/.env

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=AI Resume Analyzer
```

---

## 5. Database Migrations

Whenever you change a SQLAlchemy model:

```bash
cd backend
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

---

## 6. Running Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run test
```

---

## 7. Building for Production

```bash
# Frontend production build
cd frontend
npm run build        # outputs to frontend/dist

# Backend — build Docker image
cd backend
docker build -t resume-analyzer-backend .
```

---

## 8. Deployment (Docker + Nginx, single VM example)

1. Build and push images (frontend static build served via Nginx, backend as a container).
2. Provision PostgreSQL, Redis, and Qdrant (managed services or containers).
3. Set production environment variables (use secrets manager, not `.env` in prod).
4. Configure Nginx as reverse proxy: `/` → frontend static files, `/api` → FastAPI backend.
5. Enable HTTPS via Let's Encrypt/Certbot.
6. For Kubernetes: convert `docker-compose.yml` services into Deployments + Services, use a ConfigMap/Secret for env vars, and an Ingress for routing.

---

## 9. Troubleshooting

| Issue | Fix |
|---|---|
| `alembic` can't connect to DB | Confirm PostgreSQL is running and `DATABASE_URL` is correct |
| CORS errors in browser | Add frontend origin to FastAPI `CORSMiddleware` allow list |
| File upload fails silently | Check storage provider credentials and bucket permissions |
| AI calls returning 401 | Verify the correct API key env var is set for the provider in use |
| Celery tasks not running | Confirm Redis is reachable and the worker process is running |

---

## 10. Next Steps

Once running locally, use **ANTIGRAVITY_PROMPT.md** to have an AI coding agent scaffold and implement the actual application code, page by page, following the design system and phased build plan defined there.