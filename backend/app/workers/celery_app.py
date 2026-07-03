from celery import Celery
from app.config import settings

# Initialize Celery app
celery_app = Celery(
    "resume_tasks",
    broker=settings.CELERY_BROKER_URL or "redis://localhost:6379/0",
    backend=settings.CELERY_RESULT_BACKEND or "redis://localhost:6379/0"
)

# Apply settings
celery_app.conf.update(
    task_always_eager=settings.CELERY_TASK_ALWAYS_EAGER,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True
)

# Auto-discover tasks in workers folder
celery_app.autodiscover_tasks(["app.workers"])
