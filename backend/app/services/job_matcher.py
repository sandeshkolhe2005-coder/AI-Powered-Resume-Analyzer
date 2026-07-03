import re
from typing import Dict, Any, List
from app.services.embedding import EmbeddingService
from app.services.ats_engine import COMMON_SKILLS

class JobMatcherService:
    @staticmethod
    def match(resume_text: str, job_title: str, job_description: str) -> Dict[str, Any]:
        # 1. Cosine similarity of embeddings
        resume_vector = EmbeddingService.generate_embedding(resume_text)
        job_vector = EmbeddingService.generate_embedding(job_description)
        
        # Since both vectors are unit-normalized, cosine similarity is just the dot product
        dot_product = sum(r * j for r, j in zip(resume_vector, job_vector))
        similarity = max(0.0, min(1.0, dot_product))
        
        # 2. Textual overlap of skills
        resume_lower = resume_text.lower()
        job_lower = job_description.lower()
        
        resume_skills = set()
        job_skills = set()
        
        for skill in COMMON_SKILLS:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, resume_lower):
                resume_skills.add(skill)
            if re.search(pattern, job_lower):
                job_skills.add(skill)
                
        matching_skills = list(resume_skills.intersection(job_skills))
        missing_skills = list(job_skills.difference(resume_skills))
        
        # Calculate matching ratio
        job_skill_count = len(job_skills)
        if job_skill_count > 0:
            skill_match_ratio = len(matching_skills) / job_skill_count
        else:
            skill_match_ratio = 0.5  # Neutral default if job has no skills matching common list
            
        # Combine similarity and skill matching ratio
        # E.g. 40% vector similarity + 60% skill keywords intersection
        combined_score = int((similarity * 0.4 + skill_match_ratio * 0.6) * 100)
        combined_score = max(10, min(100, combined_score))
        
        # Dynamic improvement plan suggestions
        improvements = []
        if missing_skills:
            # Highlight top missing skills to add
            top_missing = missing_skills[:4]
            improvements.append(f"Incorporate these missing skills: {', '.join(top_missing)}.")
        
        if len(matching_skills) < 3:
            improvements.append("The resume shows low alignment with core qualifications. Add descriptive examples of matching skill sets.")
            
        # Check action verbs in relationship to job titles
        action_verb_match = re.search(r'\b(led|managed|optimized|implemented|architected)\b', resume_lower)
        if not action_verb_match:
            improvements.append("Replace passive phrases with strong metrics and action verbs like 'optimized' or 'implemented'.")
            
        if not improvements:
            improvements.append("Excellent alignment. Enhance impact metrics (%, $, time saved) for matching roles.")
            
        return {
            "match_score": combined_score,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "improvements": improvements
        }
