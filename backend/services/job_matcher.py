from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class JobMatcher:
    def calculate_match(self, resume, job):
        """Calculate match score between resume and job"""
        resume_skills = set(resume.get_skills())
        job_skills = set(job.get_required_skills())
        
        # Skill matching (70% weight)
        matching_skills = list(resume_skills.intersection(job_skills))
        missing_skills = list(job_skills - resume_skills)
        
        if len(job_skills) > 0:
            skill_match_score = (len(matching_skills) / len(job_skills)) * 70
        else:
            skill_match_score = 0
        
        # Experience matching (30% weight)
        exp_required = self._extract_years(job.experience_required)
        exp_score = self._calculate_experience_match(resume.experience_years, exp_required) * 30
        
        total_score = int(skill_match_score + exp_score)
        
        return {
            'match_score': total_score,
            'matching_skills': matching_skills,
            'missing_skills': missing_skills,
            'experience_match': exp_score > 0
        }
    
    def _extract_years(self, text):
        """Extract years from text like '3+ years'"""
        import re
        if not text:
            return 0
        match = re.search(r'(\d+)', text)
        return int(match.group(1)) if match else 0
    
    def _calculate_experience_match(self, resume_exp, required_exp):
        """Calculate experience match score"""
        if required_exp == 0:
            return 1.0
        if resume_exp >= required_exp:
            return 1.0
        return resume_exp / required_exp
    
    def rank_jobs(self, matches):
        """Rank jobs by match score"""
        return sorted(matches, key=lambda x: x['match_score'], reverse=True)