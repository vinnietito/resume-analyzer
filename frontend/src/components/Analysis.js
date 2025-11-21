import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, TrendingUp, AlertCircle, CheckCircle, Target, Briefcase } from 'lucide-react';

const Analysis = ({ resume }) => {
  const navigate = useNavigate();

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No resume data available</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getATSColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getATSMessage = (score) => {
    if (score >= 70) return "Excellent! Your resume is well-optimized for ATS systems.";
    if (score >= 50) return "Good start, but there's room for improvement.";
    return "Your resume needs significant improvements for ATS compatibility.";
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-white">Resume Analysis</h2>
            <p className="text-indigo-100 mt-2">{resume.filename}</p>
          </div>
          <button
            onClick={() => navigate('/matches')}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center shadow-lg"
          >
            <Briefcase className="mr-2" size={20} />
            View Job Matches
          </button>
        </div>

        <div className="space-y-6 fade-in">
          {/* ATS Score */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="mr-3 text-indigo-600" size={28} />
              ATS Compatibility Score
            </h3>
            <div className="flex items-center gap-8">
              <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="14" fill="none" />
                  <circle 
                    cx="80" 
                    cy="80" 
                    r="70" 
                    stroke={resume.ats_score >= 70 ? '#10b981' : resume.ats_score >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="14" 
                    fill="none"
                    strokeDasharray={`${resume.ats_score * 4.4} 440`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-5xl font-bold ${getATSColor(resume.ats_score)}`}>
                    {resume.ats_score}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xl text-gray-700 mb-4">
                  {getATSMessage(resume.ats_score)}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    {resume.has_email ? (
                      <CheckCircle className="text-green-500 mr-2" size={20} />
                    ) : (
                      <AlertCircle className="text-red-500 mr-2" size={20} />
                    )}
                    <span className="font-medium">{resume.has_email ? 'Email found' : 'Email missing'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    {resume.has_phone ? (
                      <CheckCircle className="text-green-500 mr-2" size={20} />
                    ) : (
                      <AlertCircle className="text-red-500 mr-2" size={20} />
                    )}
                    <span className="font-medium">{resume.has_phone ? 'Phone number found' : 'Phone number missing'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="mr-3 text-indigo-600" size={24} />
                Detected Skills ({resume.skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.skills && resume.skills.length > 0 ? (
                  resume.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills detected. Add more technical skills to your resume.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Resume Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-semibold text-gray-700">Experience:</span>
                  <span className="text-gray-600 font-medium">
                    {resume.experience_years > 0 ? `${resume.experience_years}+ years` : 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="font-semibold text-gray-700">Education:</span>
                  <span className="text-gray-600 font-medium capitalize">{resume.education}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Word Count:</span>
                  <span className="text-gray-600 font-medium">{resume.word_count} words</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Target className="mr-3 text-indigo-600" size={24} />
              Recommendations for Improvement
            </h3>
            <ul className="space-y-3">
              {!resume.has_email && (
                <li className="flex items-start p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="text-yellow-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Add a professional email address at the top of your resume</span>
                </li>
              )}
              {!resume.has_phone && (
                <li className="flex items-start p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="text-yellow-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Include your phone number for easy contact</span>
                </li>
              )}
              {(!resume.skills || resume.skills.length < 10) && (
                <li className="flex items-start p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="text-yellow-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Add more relevant technical and soft skills to your resume</span>
                </li>
              )}
              {resume.word_count < 300 && (
                <li className="flex items-start p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="text-yellow-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Expand your resume with more details about your experience and achievements</span>
                </li>
              )}
              {resume.experience_years === 0 && (
                <li className="flex items-start p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="text-yellow-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Clearly specify your years of experience in relevant roles</span>
                </li>
              )}
              {resume.ats_score >= 70 && (
                <li className="flex items-start p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="text-green-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Your resume is well-optimized! Consider viewing job matches now.</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;