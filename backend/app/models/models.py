import uuid
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.connection import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=False)
    parsed_text = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")  # Pending, Processing, Parsed, Failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", back_populates="resumes")
    reports = relationship("AnalysisReport", back_populates="resume", cascade="all, delete-orphan")
    matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")
    cover_letters = relationship("CoverLetter", back_populates="resume", cascade="all, delete-orphan")
    interview_questions = relationship("InterviewQuestion", back_populates="resume", cascade="all, delete-orphan")

class AnalysisReport(Base):
    __tablename__ = "analysis_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    
    # Score fields
    overall_score = Column(Integer, default=0)
    keyword_score = Column(Integer, default=0)
    formatting_score = Column(Integer, default=0)
    grammar_score = Column(Integer, default=0)
    experience_score = Column(Integer, default=0)
    projects_score = Column(Integer, default=0)
    
    # Textual details & JSON objects
    detailed_feedback = Column(Text, nullable=True)
    missing_skills = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    resume = relationship("Resume", back_populates="reports")

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    
    job_title = Column(String(255), nullable=False)
    job_description = Column(Text, nullable=False)
    match_score = Column(Integer, default=0)
    
    # Analysis results JSON
    matching_skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    improvements = Column(JSON, default=list)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resume = relationship("Resume", back_populates="matches")

class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    
    job_title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resume = relationship("Resume", back_populates="cover_letters")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    
    job_title = Column(String(255), nullable=False)
    questions = Column(JSON, default=list)  # list of dicts: {"question": "...", "type": "technical/behavioral", "suggestion": "..."}
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resume = relationship("Resume", back_populates="interview_questions")
