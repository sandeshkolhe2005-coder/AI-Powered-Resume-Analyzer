from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.api.deps import get_current_user
from app.models.models import User, Resume, AnalysisReport, JobMatch, CoverLetter, InterviewQuestion
from app.schemas.schemas import (
    AnalysisReportResponse, JobMatchRequest, JobMatchResponse,
    CoverLetterRequest, CoverLetterResponse, InterviewQuestionsRequest, InterviewQuestionsResponse,
    BulletRewriteRequest, BulletRewriteResponse, ChatRequest, ChatResponse
)
from app.services.job_matcher import JobMatcherService
from app.services.llm_service import LLMService
from typing import List, Dict, Any

router = APIRouter()

@router.get("/report/{resume_id}", response_model=AnalysisReportResponse)
def get_analysis_report(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
        
    report = db.query(AnalysisReport).filter(AnalysisReport.resume_id == resume_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found. Resume may still be parsing."
        )
    return report

@router.post("/match", response_model=JobMatchResponse)
def match_job(
    request: JobMatchRequest,
    resume_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.status != "Parsed":
        raise HTTPException(status_code=400, detail=f"Resume is in '{resume.status}' state. It must be 'Parsed' before matching.")
        
    result = JobMatcherService.match(
        resume_text=resume.parsed_text or "",
        job_title=request.job_title,
        job_description=request.job_description
    )
    
    job_match = JobMatch(
        resume_id=resume.id,
        job_title=request.job_title,
        job_description=request.job_description,
        match_score=result["match_score"],
        matching_skills=result["matching_skills"],
        missing_skills=result["missing_skills"],
        improvements=result["improvements"]
    )
    db.add(job_match)
    db.commit()
    db.refresh(job_match)
    return job_match

@router.post("/rewrite-bullet", response_model=BulletRewriteResponse)
def rewrite_bullet(
    request: BulletRewriteRequest,
    current_user: User = Depends(get_current_user)
):
    suggestions = LLMService.rewrite_bullet_point(
        bullet_point=request.bullet_point,
        job_desc=request.job_description
    )
    return {"suggestions": suggestions}

@router.post("/cover-letter", response_model=CoverLetterResponse)
def generate_cover_letter_endpoint(
    request: CoverLetterRequest,
    resume_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    content = LLMService.generate_cover_letter(
        resume_text=resume.parsed_text or "",
        job_title=request.job_title,
        job_desc=request.job_description
    )
    
    cover_letter = CoverLetter(
        resume_id=resume.id,
        job_title=request.job_title,
        content=content
    )
    db.add(cover_letter)
    db.commit()
    db.refresh(cover_letter)
    return cover_letter

@router.post("/interview-questions", response_model=InterviewQuestionsResponse)
def generate_interview_questions_endpoint(
    request: InterviewQuestionsRequest,
    resume_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    questions = LLMService.generate_interview_questions(
        resume_text=resume.parsed_text or "",
        job_title=request.job_title,
        job_desc=request.job_description
    )
    
    interview_q = InterviewQuestion(
        resume_id=resume.id,
        job_title=request.job_title,
        questions=questions
    )
    db.add(interview_q)
    db.commit()
    db.refresh(interview_q)
    return interview_q

@router.post("/chat", response_model=ChatResponse)
def chat_with_resume(
    request: ChatRequest,
    resume_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    reply = LLMService.chat(
        message=request.message,
        history=request.history,
        resume_text=resume.parsed_text or ""
    )
    return {"reply": reply}

@router.get("/trends")
def get_analytics_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch all reports for the user's resumes
    reports = (
        db.query(AnalysisReport)
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(AnalysisReport.created_at.asc())
        .all()
    )
    
    trend_data = []
    for rep in reports:
        # Get resume name for labels
        resume = db.query(Resume).filter(Resume.id == rep.resume_id).first()
        trend_data.append({
            "report_id": rep.id,
            "resume_id": rep.resume_id,
            "filename": resume.filename if resume else "Unknown",
            "date": rep.created_at.strftime("%Y-%m-%d"),
            "overall_score": rep.overall_score,
            "keyword_score": rep.keyword_score,
            "formatting_score": rep.formatting_score,
            "grammar_score": rep.grammar_score,
            "experience_score": rep.experience_score,
            "projects_score": rep.projects_score
        })
        
    # Get general counts for dashboard KPIs
    total_resumes = db.query(Resume).filter(Resume.user_id == current_user.id).count()
    job_matches = (
        db.query(JobMatch)
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .all()
    )
    
    avg_match = int(sum(m.match_score for m in job_matches) / len(job_matches)) if job_matches else 0
    latest_report = (
        db.query(AnalysisReport)
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(AnalysisReport.created_at.desc())
        .first()
    )
    latest_score = latest_report.overall_score if latest_report else 0
    
    return {
        "trends": trend_data,
        "kpis": {
            "total_resumes": total_resumes,
            "avg_job_match": avg_match,
            "latest_ats_score": latest_score
        }
    }
