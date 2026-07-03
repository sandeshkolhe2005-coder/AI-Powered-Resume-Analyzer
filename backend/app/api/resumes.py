import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.deps import get_current_user
from app.models.models import User, Resume
from app.schemas.schemas import ResumeResponse
from app.config import settings
from app.workers.tasks import analyze_resume_task
from typing import List

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate extension
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".pdf", ".docx", ".doc"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Only PDF and DOCX files are allowed."
        )
        
    # Read file content and size check (max 10MB)
    content = await file.read()
    file_size = len(content)
    if file_size > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the maximum limit of 10MB."
        )
        
    # Reset read pointer
    await file.seek(0)
    
    # Save file on local filesystem
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file locally: {str(e)}"
        )
        
    # Upload to Supabase Storage
    from app.services.supabase_service import SupabaseService
    supabase_url = SupabaseService.upload_resume(file_path, unique_filename)
    db_file_path = supabase_url if supabase_url else file_path

    # Create DB entry
    resume = Resume(
        user_id=current_user.id,
        filename=filename,
        file_path=db_file_path,
        file_size=file_size,
        status="Pending"
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    # Trigger background tasks
    # Celery eager mode handles this inline synchronously, regular Celery sends to background
    if settings.CELERY_TASK_ALWAYS_EAGER:
        analyze_resume_task(resume.id, file_path)
        db.refresh(resume)
    else:
        analyze_resume_task.delay(resume.id, file_path)
        
    return resume

@router.get("", response_model=List[ResumeResponse])
def get_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()
    return resumes

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    return resume

@router.delete("/{resume_id}", status_code=status.HTTP_200_OK)
def delete_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
        
    # Clean up file from Supabase Storage
    if resume.file_path.startswith("http://") or resume.file_path.startswith("https://"):
        try:
            from app.services.supabase_service import SupabaseService
            SupabaseService.delete_resume(resume.file_path)
        except Exception as e:
            print(f"Failed to delete file from Supabase Storage: {e}")

    # Clean up file from filesystem
    if os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except Exception as e:
            print(f"Failed to delete local file {resume.file_path}: {e}")
            
    db.delete(resume)
    db.commit()
    return {"detail": "Resume deleted successfully"}
