from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

# Resume Schemas
class ResumeResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    file_size: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Analysis Report Schemas
class AnalysisReportResponse(BaseModel):
    id: str
    resume_id: str
    overall_score: int
    keyword_score: int
    formatting_score: int
    grammar_score: int
    experience_score: int
    projects_score: int
    detailed_feedback: Optional[str] = None
    missing_skills: List[str] = []
    suggestions: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Job Matcher Schemas
class JobMatchRequest(BaseModel):
    job_title: str
    job_description: str

class JobMatchResponse(BaseModel):
    id: str
    resume_id: str
    job_title: str
    match_score: int
    matching_skills: List[str] = []
    missing_skills: List[str] = []
    improvements: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Cover Letter Schemas
class CoverLetterRequest(BaseModel):
    job_title: str
    job_description: Optional[str] = None

class CoverLetterResponse(BaseModel):
    id: str
    resume_id: str
    job_title: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

# Interview Questions Schemas
class QuestionItem(BaseModel):
    question: str
    type: str  # technical / behavioral
    suggestion: str

class InterviewQuestionsRequest(BaseModel):
    job_title: str
    job_description: Optional[str] = None

class InterviewQuestionsResponse(BaseModel):
    id: str
    resume_id: str
    job_title: str
    questions: List[Dict[str, Any]] = []
    created_at: datetime

    class Config:
        from_attributes = True

# AI Bullet point & Chat schemas
class BulletRewriteRequest(BaseModel):
    bullet_point: str
    job_description: Optional[str] = None

class BulletRewriteResponse(BaseModel):
    suggestions: List[str]

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []  # List of {"role": "user/assistant", "content": "..."}

class ChatResponse(BaseModel):
    reply: str
