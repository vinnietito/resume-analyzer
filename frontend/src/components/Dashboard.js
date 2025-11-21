import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listResumes, deleteResume } from '../services/api';
import { FileText, Trash2, Eye, Plus, Calendar } from 'lucide-react';

const Dashboard = ({ setCurrentResume }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await listResumes();
      setResumes(response.data.resumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(resumeId);
        setResumes(resumes.filter(r => r.id !== resumeId));
      } catch (error) {
        console.error('Error deleting resume:', error);
        alert('Failed to delete resume');
      }
    }
  };

  const handleView = (resume) => {
    setCurrentResume(resume);
    navigate('/analysis');
  };

  const handleViewMatches = (resume) => {
    setCurrentResume(resume);
    navigate('/matches');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">My Resumes</h2>
            <p className="text-indigo-100 mt-2">Manage your resume submissions and job matches</p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center shadow-lg"
          >
            <Plus className="mr-2" size={20} />
            Upload New Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Resumes Yet</h3>
            <p className="text-gray-600 mb-6">Upload your first resume to get started with AI-powered analysis</p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition inline-flex items-center"
            >
              <Plus className="mr-2" size={20} />
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition fade-in">
                <div className="flex items-start justify-between mb-4">
                  <FileText className="text-indigo-600" size={32} />
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    resume.ats_score >= 70 ? 'bg-green-100 text-green-700' :
                    resume.ats_score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {resume.ats_score}% ATS
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{resume.filename}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2" size={16} />
                    {new Date(resume.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{resume.skills?.length || 0}</span> skills detected
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{resume.experience_years}</span> years experience
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(resume)}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center text-sm font-semibold"
                  >
                    <Eye className="mr-1" size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleViewMatches(resume)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                  >
                    Matches
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;