import json
import re
import urllib.request
from typing import List, Dict, Any, Optional
from app.config import settings

class LLMService:
    @classmethod
    def call_llm(cls, prompt: str, system_instruction: Optional[str] = None) -> str:
        if not settings.GEMINI_API_KEY or settings.LLM_PROVIDER == "mock":
            return cls._get_mock_response(prompt)
            
        try:
            # Connect directly to Google Generative Language API
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
            headers = {"Content-Type": "application/json"}
            
            payload = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            
            if system_instruction:
                payload["systemInstruction"] = {
                    "parts": [{"text": system_instruction}]
                }
                
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode("utf-8"))
                candidates = result.get('candidates', [])
                if candidates:
                    parts = candidates[0].get('content', {}).get('parts', [])
                    if parts:
                        return parts[0].get('text', '')
                return cls._get_mock_response(prompt)
                
        except Exception as e:
            print(f"Gemini REST API failure: {str(e)}. Falling back to mock content.")
            return cls._get_mock_response(prompt)

    @classmethod
    def rewrite_bullet_point(cls, bullet_point: str, job_desc: Optional[str] = None) -> List[str]:
        prompt = f"""
        You are a professional resume writer. Rewrite the following resume bullet point to make it more impactful, metric-driven, and active.
        Original Bullet Point: "{bullet_point}"
        """
        if job_desc:
            prompt += f"\nTarget Job Description:\n{job_desc}\n\nTailor the rewritten bullet points to match keywords from this job description."
            
        prompt += "\nFormat your response as a JSON array of 3 strings containing the rewritten options, nothing else. e.g. [\"Option 1\", \"Option 2\", \"Option 3\"]"
        
        response_text = cls.call_llm(prompt, "You are an expert ATS resume optimizer. Respond only with a JSON list of strings.")
        try:
            match = re.search(r'\[.*\]', response_text.replace('\n', ' '))
            if match:
                parsed = json.loads(match.group(0))
                if isinstance(parsed, list) and len(parsed) > 0:
                    return parsed[:3]
        except Exception:
            pass
            
        return [
            f"Led implementation of key systems, improving performance and accuracy by 25%.",
            f"Collaborated with cross-functional teams to streamline workflows, reducing cycle times by 15%.",
            f"Designed and deployed responsive components, enhancing user engagement and interface speed."
        ]

    @classmethod
    def generate_cover_letter(cls, resume_text: str, job_title: str, job_desc: Optional[str] = None) -> str:
        prompt = f"""
        Write a professional, tailored, and persuasive cover letter for the role of '{job_title}' based on the candidate's resume below.
        
        Candidate Resume:
        {resume_text[:2000]}
        """
        if job_desc:
            prompt += f"\nJob Description details:\n{job_desc[:1500]}"
            
        prompt += "\nMake it feel personalized, highlight relevant achievements from the resume, format it with placeholder contact details, and write it in a professional tone. Keep it under 400 words."
        
        return cls.call_llm(prompt, "You are a professional cover letter writer. Deliver only the text of the letter.")

    @classmethod
    def generate_interview_questions(cls, resume_text: str, job_title: str, job_desc: Optional[str] = None) -> List[Dict[str, Any]]:
        prompt = f"""
        Generate 5 interview questions (3 technical and 2 behavioral) that a hiring manager would ask a candidate with the resume below for the role of '{job_title}'.
        
        Candidate Resume:
        {resume_text[:2000]}
        """
        if job_desc:
            prompt += f"\nJob Description details:\n{job_desc[:1500]}"
            
        prompt += """
        Format your response as a JSON list of objects, each with 'question', 'type' ('technical' or 'behavioral'), and 'suggestion' (explaining what the interviewer is looking for or how to answer).
        Example format:
        [
          {"question": "...", "type": "technical", "suggestion": "..."},
          {"question": "...", "type": "behavioral", "suggestion": "..."}
        ]
        Respond ONLY with the JSON block.
        """
        
        response_text = cls.call_llm(prompt, "You are a senior hiring manager. Respond only with JSON.")
        try:
            match = re.search(r'\[\s*\{.*\}\s*\]', response_text, re.DOTALL)
            if match:
                parsed = json.loads(match.group(0))
                if isinstance(parsed, list) and len(parsed) > 0:
                    return parsed
        except Exception:
            pass
            
        return [
            {
                "question": f"Can you detail your technical experience with {job_title} key requirements?",
                "type": "technical",
                "suggestion": "Focus on specific projects where you used matching technologies. Outline the architecture, challenges, and solutions."
            },
            {
                "question": "Walk me through a complex technical problem you solved recently.",
                "type": "technical",
                "suggestion": "Use the STAR method (Situation, Task, Action, Result). State the impact of your solution in numbers if possible."
            },
            {
                "question": "Tell me about a time you had a conflict with a team member. How did you resolve it?",
                "type": "behavioral",
                "suggestion": "Showcase empathy, active listening, and collaboration. Explain how you aligned on a professional resolution."
            },
            {
                "question": "How do you stay updated with the latest industry technologies?",
                "type": "technical",
                "suggestion": "Mention blogs, open-source projects, personal research, courses, or tech communities you follow."
            },
            {
                "question": "Why are you interested in this role?",
                "type": "behavioral",
                "suggestion": "Connect your background and skills to the goals of the role and the company's domain."
            }
        ]

    @classmethod
    def chat(cls, message: str, history: List[Dict[str, str]], resume_text: str) -> str:
        context_prompt = f"You are a professional career coach assisting a user with their resume. Here is the user's resume content:\n{resume_text[:2000]}\n\n"
        
        for msg in history:
            role = "User" if msg.get("role") == "user" else "Assistant"
            context_prompt += f"{role}: {msg.get('content')}\n"
            
        context_prompt += f"User: {message}\nAssistant:"
        
        return cls.call_llm(context_prompt, "You are a helpful, professional career coach. Provide clear, concise, and constructive suggestions.")

    @classmethod
    def _get_mock_response(cls, prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "rewrite" in prompt_lower or "bullet" in prompt_lower:
            return json.dumps([
                "Optimized system architecture and components, boosting response times by 30% through caching.",
                "Led engineering efforts to build scalable features, accelerating user growth metrics by 20%.",
                "Spearheaded redesign of database schemas, reducing query latency and storage footprints by 15%."
            ])
        elif "cover letter" in prompt_lower:
            return """Dear Hiring Manager,

I am writing to express my strong interest in the open position. Based on my technical background and professional experience, I believe I can make an immediate, positive impact on your engineering team.

In my previous roles, I have consistently focused on building scalable, reliable applications and working collaboratively to solve complex problems. I am eager to bring my skills in design, optimization, and development to your organization.

Thank you for your time and consideration. I look forward to the possibility of discussing how my experience aligns with your requirements.

Sincerely,
Professional Candidate"""
        elif "interview" in prompt_lower:
            return json.dumps([
                {
                    "question": "How do you optimize application performance under heavy load?",
                    "type": "technical",
                    "suggestion": "Discuss database query optimization, horizontal scaling, caching strategies (Redis), and connection pooling."
                },
                {
                    "question": "Can you describe a project where you had to collaborate closely with product and design teams?",
                    "type": "behavioral",
                    "suggestion": "Emphasize how you communicated constraints, compromises you reached, and the final business impact."
                },
                {
                    "question": "What is your approach to system testing and code coverage?",
                    "type": "technical",
                    "suggestion": "Discuss integration testing, unit testing (pytest/jest), CI/CD automation, and balance of speed vs depth."
                },
                {
                    "question": "Tell me about a time you had to learn a brand-new technology quickly to deliver a feature.",
                    "type": "behavioral",
                    "suggestion": "Highlight your learning methodology: documentation, prototyping, asking questions, and incremental delivery."
                },
                {
                    "question": "Why do you feel you are the best fit for this specific position?",
                    "type": "behavioral",
                    "suggestion": "Synthesize your technical skills, active project examples, and excitement for the team's domain."
                }
            ])
        else:
            return "This is a professional AI-generated advice response assisting with your resume optimization and profile enhancements."
