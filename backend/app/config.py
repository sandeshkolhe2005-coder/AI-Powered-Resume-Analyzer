import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Resume Analyzer API"
    API_V1_STR: str = "/api/v1"
    
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_key_resume_analyzer_998877")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # Database Settings - Fallback to SQLite locally
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    
    # Cache / Celery Settings - Fallback if no redis is available
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", None)
    CELERY_BROKER_URL: Optional[str] = os.getenv("CELERY_BROKER_URL", None)
    CELERY_RESULT_BACKEND: Optional[str] = os.getenv("CELERY_RESULT_BACKEND", None)
    CELERY_TASK_ALWAYS_EAGER: bool = True  # Default to True locally, override to False when Redis is present
    
    # Vector Database Settings
    QDRANT_URL: Optional[str] = os.getenv("QDRANT_URL", None)  # If None, client runs in-memory: QdrantClient(":memory:")
    QDRANT_API_KEY: Optional[str] = os.getenv("QDRANT_API_KEY", None)
    
    # AI/LLM Settings
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")  # gemini, mock
    
    # File Storage Settings
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    S3_BUCKET: Optional[str] = os.getenv("S3_BUCKET", None)
    
    # Supabase Settings
    SUPABASE_PROJECT_ID: Optional[str] = os.getenv("SUPABASE_PROJECT_ID", None)
    SUPABASE_KEY: Optional[str] = os.getenv("SUPABASE_KEY", None)
    
    class Config:
        case_sensitive = True
        env_file = (".env", "../.env")

settings = Settings()

# Adjust Celery eager mode based on Redis URL availability
if settings.REDIS_URL or settings.CELERY_BROKER_URL:
    settings.CELERY_TASK_ALWAYS_EAGER = False
    if not settings.CELERY_BROKER_URL:
        settings.CELERY_BROKER_URL = settings.REDIS_URL
    if not settings.CELERY_RESULT_BACKEND:
        settings.CELERY_RESULT_BACKEND = settings.REDIS_URL

# Create upload directory if it doesn't exist
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
