import re
import PyPDF2
import docx
from services.skill_extractor import SkillExtractor

class ResumeParser:
    def __init__(self):
        self.skill_extractor = SkillExtractor()
    
    def extract_text_from_file(self, filepath):
        """Extract text from PDF, DOCX, or TXT file"""
        if filepath.endswith('.pdf'):
            return self._extract_from_pdf(filepath)
        elif filepath.endswith('.docx'):
            return self._extract_from_docx(filepath)
        elif filepath.endswith('.txt'):
            return self._extract_from_txt(filepath)
        else:
            raise ValueError('Unsupported file format')
    
    def _extract_from_pdf(self, filepath):
        text = ''
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    
    def _extract_from_docx(self, filepath):
        doc = docx.Document(filepath)
        return '\n'.join([paragraph.text for paragraph in doc.paragraphs])
    
    def _extract_from_txt(self, filepath):
        with open(filepath, 'r', encoding='utf-8') as file:
            return file.read()
    
    def analyze_resume(self, text):
        """Analyze resume text and return structured data"""
        analysis = {
            'skills': self.skill_extractor.extract_skills(text),
            'experience_years': self._extract_experience(text),
            'education': self._extract_education(text),
            'ats_score': self._calculate_ats_score(text),
            'word_count': len(text.split()),
            'has_email': self._has_email(text),
            'has_phone': self._has_phone(text),
            'sections': self._identify_sections(text)
        }
        
        return analysis
    
    def _extract_experience(self, text):
        """Extract years of experience from text"""
        patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'experience[:\s]+(\d+)\+?\s*years?',
            r'(\d+)\+?\s*years?\s+in'
        ]
        
        years = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            years.extend([int(match) for match in matches])
        
        return max(years) if years else 0
    
    def _extract_education(self, text):
        """Extract highest education level"""
        text_lower = text.lower()
        
        degrees = [
            ('phd', 'PhD'),
            ('ph.d', 'PhD'),
            ('doctorate', 'Doctorate'),
            ('master', 'Master\'s'),
            ('mba', 'MBA'),
            ('m.sc', 'Master\'s'),
            ('m.tech', 'Master\'s'),
            ('bachelor', 'Bachelor\'s'),
            ('b.sc', 'Bachelor\'s'),
            ('b.tech', 'Bachelor\'s'),
            ('associate', 'Associate')
        ]
        
        for keyword, degree in degrees:
            if keyword in text_lower:
                return degree
        
        return 'Not specified'
    
    def _calculate_ats_score(self, text):
        """Calculate ATS compatibility score"""
        score = 0
        
        # Contact information (25 points)
        if self._has_email(text):
            score += 15
        if self._has_phone(text):
            score += 10
        
        # Key sections (30 points)
        sections = self._identify_sections(text)
        if 'experience' in sections:
            score += 15
        if 'education' in sections:
            score += 10
        if 'skills' in sections:
            score += 5
        
        # Skills count (20 points)
        skills = self.skill_extractor.extract_skills(text)
        if len(skills) > 10:
            score += 20
        elif len(skills) > 5:
            score += 15
        else:
            score += 10
        
        # Length (25 points)
        word_count = len(text.split())
        if 300 <= word_count <= 1000:
            score += 25
        elif word_count >= 200:
            score += 15
        else:
            score += 5
        
        return min(score, 100)
    
    def _has_email(self, text):
        """Check if text contains email"""
        pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return bool(re.search(pattern, text))
    
    def _has_phone(self, text):
        """Check if text contains phone number"""
        patterns = [
            r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b',
            r'\(\d{3}\)\s*\d{3}[-.\s]?\d{4}',
            r'\+\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}'
        ]
        return any(re.search(pattern, text) for pattern in patterns)
    
    def _identify_sections(self, text):
        """Identify resume sections"""
        text_lower = text.lower()
        sections = []
        
        section_keywords = {
            'experience': ['experience', 'work history', 'employment', 'professional experience'],
            'education': ['education', 'academic', 'qualification'],
            'skills': ['skills', 'technical skills', 'competencies'],
            'projects': ['projects', 'portfolio'],
            'certifications': ['certifications', 'certificates', 'licenses']
        }
        
        for section, keywords in section_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                sections.append(section)
        
        return sections