from app.workers.celery_app import celery_app
from app.database.connection import SessionLocal
from app.models.models import Resume, AnalysisReport
from app.services.resume_parser import ResumeParserService
from app.services.ats_engine import ATSEngineService
from app.services.embedding import EmbeddingService

@celery_app.task(name="app.workers.tasks.analyze_resume_task")
def analyze_resume_task(resume_id: str, file_path: str) -> str:
    db = SessionLocal()
    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            return f"Resume {resume_id} not found"
            
        # Update status
        resume.status = "Processing"
        db.commit()
        
        # 1. Parse text from file
        import os
        import tempfile
        from app.config import settings
        from app.services.supabase_service import SupabaseService

        local_parse_path = file_path
        temp_file_created = False

        if file_path.startswith("http://") or file_path.startswith("https://"):
            filename = os.path.basename(file_path.split("?")[0])
            local_cache_path = os.path.join(settings.UPLOAD_DIR, filename)
            if os.path.exists(local_cache_path):
                local_parse_path = local_cache_path
            else:
                suffix = os.path.splitext(filename)[1].lower()
                temp_fd, temp_path = tempfile.mkstemp(suffix=suffix)
                os.close(temp_fd)
                if SupabaseService.download_file(file_path, temp_path):
                    local_parse_path = temp_path
                    temp_file_created = True
                else:
                    raise FileNotFoundError(f"Could not download remote file from {file_path}")

        parsed_text = ResumeParserService.parse(local_parse_path)
        resume.parsed_text = parsed_text

        # Cleanup temp file if created
        if temp_file_created and os.path.exists(local_parse_path):
            try:
                os.remove(local_parse_path)
            except Exception as e:
                print(f"Failed to delete temp file {local_parse_path}: {e}")
        
        # 2. Run heuristic ATS Analysis
        analysis_result = ATSEngineService.analyze(parsed_text)
        
        # 3. Create Analysis Report in DB
        report = AnalysisReport(
            resume_id=resume_id,
            overall_score=analysis_result["overall_score"],
            keyword_score=analysis_result["keyword_score"],
            formatting_score=analysis_result["formatting_score"],
            grammar_score=analysis_result["grammar_score"],
            experience_score=analysis_result["experience_score"],
            projects_score=analysis_result["projects_score"],
            detailed_feedback=analysis_result["detailed_feedback"],
            missing_skills=analysis_result["missing_skills"],
            suggestions=analysis_result["suggestions"]
        )
        db.add(report)
        
        # 4. Generate & Index vector embedding
        EmbeddingService.upsert_resume(resume_id, parsed_text)
        
        # Mark as parsed
        resume.status = "Parsed"
        db.commit()
        return f"Resume {resume_id} analyzed successfully"
        
    except Exception as e:
        db.rollback()
        # Fetch resume again inside session transaction
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if resume:
            resume.status = "Failed"
            db.commit()
        return f"Error analyzing resume {resume_id}: {str(e)}"
    finally:
        db.close()
