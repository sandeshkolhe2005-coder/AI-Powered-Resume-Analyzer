import re
from typing import Dict, Any, List

COMMON_SKILLS = {
    # Tech Stack
    "python", "javascript", "typescript", "java", "c++", "c#", "golang", "rust", "php", "ruby", "sql", "html", "css",
    "react", "angular", "vue", "next.js", "node.js", "express", "django", "flask", "fastapi", "spring boot", "laravel",
    "postgresql", "mysql", "sqlite", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb",
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "terraform", "ansible", "git", "ci/cd", "github",
    # Data & AI
    "pytorch", "tensorflow", "scikit-learn", "numpy", "pandas", "spark", "hadoop", "machine learning", "deep learning",
    "nlp", "computer vision", "data analysis", "tableau", "power bi",
    # Management & Methodologies
    "agile", "scrum", "kanban", "project management", "product management", "system design", "microservices", "graphql",
    "rest api", "unit testing", "grpc", "jira", "confluence"
}

ACTION_VERBS = {
    "led", "managed", "designed", "built", "implemented", "created", "developed", "architected", "optimized",
    "engineered", "spearheaded", "accelerated", "accomplished", "achieved", "delivered", "expanded", "launched",
    "streamlined", "reduced", "increased", "maximized", "transformed", "generated", "solved", "analyzed"
}

WEAK_VERBS = {
    "assisted", "helped", "responsible for", "participated", "worked on", "handled", "duties included"
}

class ATSEngineService:
    @staticmethod
    def analyze(text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        
        # 1. Contact Information & Formatting Check (formatting_score)
        formatting_score = 100
        suggestions = []
        
        email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        emails = re.findall(email_pattern, text)
        if not emails:
            formatting_score -= 20
            suggestions.append("Missing email address. Make sure your email is clearly visible at the top.")
            
        phone_pattern = r'\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}'
        phones = re.findall(phone_pattern, text)
        if not phones:
            formatting_score -= 15
            suggestions.append("Missing phone number. Recruiters need a way to call you.")
            
        linkedin_patterns = [r'linkedin\.com', r'linkedin']
        has_linkedin = any(re.search(pat, text_lower) for pat in linkedin_patterns)
        if not has_linkedin:
            formatting_score -= 15
            suggestions.append("LinkedIn profile link not found. A professional profile link is expected.")
            
        github_patterns = [r'github\.com', r'github', r'gitlab']
        has_github = any(re.search(pat, text_lower) for pat in github_patterns)
        
        # Length check
        words = text.split()
        word_count = len(words)
        if word_count < 200:
            formatting_score -= 20
            suggestions.append("Resume is too short. Try to add more details about your roles, accomplishments, and skills.")
        elif word_count > 1500:
            formatting_score -= 10
            suggestions.append("Resume is exceptionally long. Keep it concise, ideally under 2 pages (800-1000 words).")
            
        formatting_score = max(0, formatting_score)
        
        # 2. Skill Keywords Match (keyword_score)
        found_skills = []
        for skill in COMMON_SKILLS:
            # Match word boundary for skills to avoid matching 'c' in 'cat'
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
                
        skill_count = len(found_skills)
        if skill_count >= 15:
            keyword_score = 100
        elif skill_count >= 10:
            keyword_score = 85
        elif skill_count >= 5:
            keyword_score = 65
        else:
            keyword_score = 40
            suggestions.append("Include more industry-standard technical skills. Your resume seems low on technical keywords.")
            
        # 3. Action Verbs & Grammar Check (grammar_score)
        action_verb_count = sum(1 for verb in ACTION_VERBS if re.search(r'\b' + re.escape(verb) + r'\b', text_lower))
        weak_verb_count = sum(1 for verb in WEAK_VERBS if re.search(r'\b' + re.escape(verb) + r'\b', text_lower))
        
        grammar_score = 100
        if action_verb_count < 5:
            grammar_score -= 20
            suggestions.append("Use strong action verbs (e.g., 'led', 'designed', 'streamlined') at the start of your bullet points instead of passive phrasing.")
        if weak_verb_count > 3:
            grammar_score -= 10
            suggestions.append("Replace passive phrases like 'responsible for' or 'assisted with' with strong action-oriented statements.")
            
        # Basic check for spelling/text patterns
        if len(text) > 0 and text.isupper():
            grammar_score -= 30
            suggestions.append("Avoid writing entire blocks in CAPITAL letters. It hurts readability.")
        grammar_score = max(0, grammar_score)
        
        # 4. Experience & Timeline Check (experience_score)
        experience_score = 70
        year_matches = re.findall(r'\b(19\d{2}|20\d{2})\b', text)
        if len(year_matches) >= 4:
            experience_score += 30
        elif len(year_matches) >= 2:
            experience_score += 15
        else:
            suggestions.append("Ensure your work experience includes clear dates/years to establish your career timeline.")
            
        # Check for standard headers
        experience_headers = ["experience", "work history", "employment", "professional background"]
        has_exp_header = any(h in text_lower for h in experience_headers)
        if not has_exp_header:
            experience_score -= 20
            suggestions.append("Add a clear section header for your 'Work Experience' or 'Employment History'.")
        experience_score = max(0, min(100, experience_score))
        
        # 5. Projects & Impact Check (projects_score)
        projects_score = 60
        project_keywords = ["project", "portfolio", "built", "github.com", "hackathon", "designed", "application", "system"]
        found_proj_kw = sum(1 for kw in project_keywords if kw in text_lower)
        
        if found_proj_kw >= 4:
            projects_score += 40
        elif found_proj_kw >= 2:
            projects_score += 20
        else:
            suggestions.append("Detail custom projects or portfolio works to showcase hands-on experience.")
        projects_score = max(0, min(100, projects_score))
        
        # Calculate overall score
        overall_score = int(
            (formatting_score * 0.2) +
            (keyword_score * 0.3) +
            (grammar_score * 0.15) +
            (experience_score * 0.2) +
            (projects_score * 0.15)
        )
        
        # Determine missing skills (industry skills not found)
        # Recommend 5 relevant skills that are missing based on existing matches
        # If they match python, recommend fastAPI/docker/postgresql. If front-end, react/typescript/css etc.
        missing_skills = []
        tech_matches = set(found_skills)
        
        recommendations = {
            "python": ["fastapi", "django", "postgresql", "docker", "aws"],
            "javascript": ["typescript", "react", "node.js", "git", "next.js"],
            "react": ["next.js", "typescript", "tailwind", "redux", "jest"],
            "sql": ["postgresql", "mysql", "redis", "database design", "docker"],
            "aws": ["docker", "kubernetes", "terraform", "ci/cd", "gcp"],
            "machine learning": ["pytorch", "tensorflow", "numpy", "pandas", "scikit-learn"]
        }
        
        for k, recs in recommendations.items():
            if k in tech_matches:
                for r in recs:
                    if r not in tech_matches and r not in missing_skills:
                        missing_skills.append(r)
                        
        # Fallback to general skills if none recommended
        if not missing_skills:
            all_missing = [s for s in COMMON_SKILLS if s not in tech_matches]
            missing_skills = all_missing[:6]
            
        missing_skills = missing_skills[:6]
        
        # Formulate detailed markdown feedback
        feedback_parts = [
            f"### ATS Resume Analysis Summary",
            f"Your overall ATS score is **{overall_score}/100**.",
            f"",
            f"#### Category Ratings:",
            f"- **Skills & Keywords**: {keyword_score}/100 ({'Strong' if keyword_score >= 80 else 'Average' if keyword_score >= 60 else 'Needs Work'})",
            f"- **Formatting & Layout**: {formatting_score}/100 ({'Excellent' if formatting_score >= 90 else 'Good' if formatting_score >= 70 else 'Needs Work'})",
            f"- **Grammar & Action Verbs**: {grammar_score}/100 ({'Action-oriented' if grammar_score >= 80 else 'Passive' if grammar_score >= 60 else 'Weak'})",
            f"- **Experience Timeline**: {experience_score}/100",
            f"- **Projects & Portfolio**: {projects_score}/100",
            f"",
            f"#### Core Recommendations:",
        ]
        
        for idx, sug in enumerate(suggestions, 1):
            feedback_parts.append(f"{idx}. {sug}")
            
        if not suggestions:
            feedback_parts.append("Great job! Your resume complies with top ATS standards. Ensure you customize it for specific target job listings.")
            
        detailed_feedback = "\n".join(feedback_parts)
        
        return {
            "overall_score": overall_score,
            "keyword_score": keyword_score,
            "formatting_score": formatting_score,
            "grammar_score": grammar_score,
            "experience_score": experience_score,
            "projects_score": projects_score,
            "detailed_feedback": detailed_feedback,
            "missing_skills": missing_skills,
            "suggestions": suggestions if suggestions else ["Tailor your resume key accomplishments to the specific job description."]
        }
