from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models.resume import Resume
from services.resume_parser import ResumeParser
from app import db
import os

resume_bp = Blueprint('resume', __name__)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    user_id = get_jwt_identity()
    
    # Check if file or text is provided
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Use txt, pdf, or docx'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads', f"{user_id}_{filename}")
        file.save(filepath)
        
        # Parse the file
        parser = ResumeParser()
        text = parser.extract_text_from_file(filepath)
        
    elif request.get_json() and request.get_json().get('text'):
        text = request.get_json().get('text')
        filename = 'pasted_resume.txt'
        filepath = None
    else:
        return jsonify({'error': 'No file or text provided'}), 400
    
    # Analyze the resume
    parser = ResumeParser()
    analysis = parser.analyze_resume(text)
    
    # Save to database
    resume = Resume(
        user_id=user_id,
        filename=filename,
        file_path=filepath,
        raw_text=text,
        experience_years=analysis['experience_years'],
        education=analysis['education'],
        ats_score=analysis['ats_score'],
        word_count=analysis['word_count'],
        has_email=analysis['has_email'],
        has_phone=analysis['has_phone']
    )
    resume.set_skills(analysis['skills'])
    
    db.session.add(resume)
    db.session.commit()
    
    return jsonify({
        'message': 'Resume uploaded and analyzed successfully',
        'resume': resume.to_dict(),
        'analysis': analysis
    }), 201

@resume_bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_resume_text():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('text'):
        return jsonify({'error': 'Resume text is required'}), 400
    
    text = data['text']
    
    # Analyze the resume
    parser = ResumeParser()
    analysis = parser.analyze_resume(text)
    
    # Save to database
    resume = Resume(
        user_id=user_id,
        filename='pasted_resume.txt',
        raw_text=text,
        experience_years=analysis['experience_years'],
        education=analysis['education'],
        ats_score=analysis['ats_score'],
        word_count=analysis['word_count'],
        has_email=analysis['has_email'],
        has_phone=analysis['has_phone']
    )
    resume.set_skills(analysis['skills'])
    
    db.session.add(resume)
    db.session.commit()
    
    return jsonify({
        'message': 'Resume analyzed successfully',
        'resume': resume.to_dict(),
        'analysis': analysis
    }), 201

@resume_bp.route('/list', methods=['GET'])
@jwt_required()
def list_resumes():
    user_id = get_jwt_identity()
    resumes = Resume.query.filter_by(user_id=user_id).order_by(Resume.created_at.desc()).all()
    
    return jsonify({
        'resumes': [resume.to_dict() for resume in resumes]
    }), 200

@resume_bp.route('/<int:resume_id>', methods=['GET'])
@jwt_required()
def get_resume(resume_id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404
    
    return jsonify({'resume': resume.to_dict()}), 200

@resume_bp.route('/<int:resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume(resume_id):
    user_id = get_jwt_identity()
    resume = Resume.query.filter_by(id=resume_id, user_id=user_id).first()
    
    if not resume:
        return jsonify({'error': 'Resume not found'}), 404
    
    # Delete file if exists
    if resume.file_path and os.path.exists(resume.file_path):
        os.remove(resume.file_path)
    
    db.session.delete(resume)
    db.session.commit()
    
    return jsonify({'message': 'Resume deleted successfully'}), 200