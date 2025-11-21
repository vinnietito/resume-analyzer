from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.job import Job
from models.resume import Resume
from services.job_matcher import JobMatcher
from app import db

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('/list', methods=['GET'])
def list_jobs():
    jobs = Job.query.filter_by(is_active=True).order_by(Job.created_at.desc()).all()
    return jsonify({'jobs': [job.to_dict() for job in jobs]}), 200

@jobs_bp.route('/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404
    return jsonify({'job': job.to_dict()}), 200

@jobs_bp.route('/match/<int:resume_id>', methods=['GET'])
@jwt_required()
def match_jobs(resume_id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404
    
    jobs = Job.query.filter_by(is_active=True).all()
    matcher = JobMatcher()
    
    matches = []
    for job in jobs:
        match_result = matcher.calculate_match(resume, job)
        matches.append({
            'job': job.to_dict(),
            'match_score': match_result['match_score'],
            'matching_skills': match_result['matching_skills'],
            'missing_skills': match_result['missing_skills'],
            'experience_match': match_result['experience_match']
        })
    
    # Sort by match score
    matches.sort(key=lambda x: x['match_score'], reverse=True)
    
    return jsonify({'matches': matches}), 200

@jobs_bp.route('/create', methods=['POST'])
@jwt_required()
def create_job():
    data = request.get_json()
    
    required_fields = ['title', 'company', 'description', 'required_skills']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    job = Job(
        title=data['title'],
        company=data['company'],
        location=data.get('location', ''),
        salary_range=data.get('salary_range', ''),
        description=data['description'],
        requirements=data.get('requirements', ''),
        experience_required=data.get('experience_required', ''),
        education_required=data.get('education_required', '')
    )
    job.set_required_skills(data['required_skills'])
    
    db.session.add(job)
    db.session.commit()
    
    return jsonify({
        'message': 'Job created successfully',
        'job': job.to_dict()
    }), 201