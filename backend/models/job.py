from app import db
from datetime import datetime
import json

class Job(db.Model):
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200))
    salary_range = db.Column(db.String(100))
    description = db.Column(db.Text)
    requirements = db.Column(db.Text)
    required_skills = db.Column(db.Text)  # JSON string
    experience_required = db.Column(db.String(50))
    education_required = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_required_skills(self, skills_list):
        self.required_skills = json.dumps(skills_list)
    
    def get_required_skills(self):
        return json.loads(self.required_skills) if self.required_skills else []
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'salary_range': self.salary_range,
            'description': self.description,
            'requirements': self.requirements,
            'required_skills': self.get_required_skills(),
            'experience_required': self.experience_required,
            'education_required': self.education_required,
            'created_at': self.created_at.isoformat()
        }