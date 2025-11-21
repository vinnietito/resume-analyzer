from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config
import os

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Create upload folder
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.resume import resume_bp
    from routes.jobs import jobs_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'healthy', 'message': 'Resume Analyzer API is running'})
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)