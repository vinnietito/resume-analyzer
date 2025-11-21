from app import db
from datetime import datetime
import json

class Resume(db.Model):
    __tablename__ = 'resumes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255))
    file_path = db.Column(db.String(500))
    raw_text = db.Column(db.Text)
    
    # Analysis results
    skills = db.Column(db.Text)  # JSON string
    experience_years = db.Column(db.Integer)
    education = db.Column(db.String(100))
    ats_score = db.Column(db.Integer)
    word_count = db.Column(db.Integer)
    has_email = db.Column(db.Boolean, default=False)
    has_phone = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_skills(self, skills_list):
        self.skills = json.dumps(skills_list)
    
    def get_skills(self):
        return json.loads(self.skills) if self.skills else []
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'filename': self.filename,
            'skills': self.get_skills(),
            'experience_years': self.experience_years,
            'education': self.education,
            'ats_score': self.ats_score,
            'word_count': self.word_count,
            'has_email': self.has_email,
            'has_phone': self.has_phone,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }