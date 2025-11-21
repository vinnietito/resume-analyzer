import re

class SkillExtractor:
    def __init__(self):
        self.skill_database = self._load_skill_database()
    
    def _load_skill_database(self):
        """Load common technical and soft skills"""
        return [
            # Programming Languages
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'c', 'ruby', 
            'php', 'swift', 'kotlin', 'go', 'rust', 'scala', 'r', 'matlab', 'perl',
            
            # Web Technologies
            'html', 'css', 'react', 'angular', 'vue', 'vue.js', 'node.js', 'express',
            'django', 'flask', 'spring', 'asp.net', 'jquery', 'bootstrap', 'tailwind',
            'next.js', 'nuxt.js', 'svelte', 'ember.js',
            
            # Databases
            'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'cassandra', 'oracle',
            'sqlite', 'dynamodb', 'elasticsearch', 'neo4j', 'mariadb',
            
            # Cloud & DevOps
            'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins',
            'terraform', 'ansible', 'vagrant', 'ci/cd', 'devops', 'linux', 'unix',
            'nginx', 'apache', 'heroku', 'vercel', 'netlify',
            
            # Mobile Development
            'android', 'ios', 'react native', 'flutter', 'xamarin', 'ionic',
            
            # Data Science & ML
            'machine learning', 'deep learning', 'data science', 'artificial intelligence',
            'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
            'matplotlib', 'seaborn', 'jupyter', 'nlp', 'computer vision', 'opencv',
            
            # Version Control & Tools
            'git', 'github', 'gitlab', 'bitbucket', 'svn', 'jira', 'confluence',
            'slack', 'trello', 'asana',
            
            # Methodologies
            'agile', 'scrum', 'kanban', 'waterfall', 'test-driven development', 'tdd',
            
            # APIs & Architecture
            'rest api', 'restful', 'graphql', 'soap', 'microservices', 'monolithic',
            'serverless', 'event-driven',
            
            # Other Technologies
            'blockchain', 'solidity', 'ethereum', 'web3', 'redis', 'rabbitmq', 'kafka',
            'spark', 'hadoop', 'tableau', 'power bi', 'excel', 'word', 'powerpoint',
            
            # Soft Skills
            'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
            'project management', 'time management', 'critical thinking', 'creativity',
            'adaptability', 'collaboration', 'presentation', 'negotiation'
        ]
    
    def extract_skills(self, text):
        """Extract skills from resume text"""
        text_lower = text.lower()
        found_skills = []
        
        for skill in self.skill_database:
            # Use word boundaries for exact matching
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.append(skill)
        
        # Remove duplicates and return
        return list(set(found_skills))
    
    def categorize_skills(self, skills):
        """Categorize skills into technical and soft skills"""
        soft_skills = [
            'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
            'project management', 'time management', 'critical thinking', 'creativity',
            'adaptability', 'collaboration', 'presentation', 'negotiation'
        ]
        
        technical = [skill for skill in skills if skill not in soft_skills]
        soft = [skill for skill in skills if skill in soft_skills]
        
        return {
            'technical': technical,
            'soft': soft
        }