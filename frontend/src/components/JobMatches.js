import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchJobs } from '../services/api';
import { Briefcase, MapPin, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const JobMatches = ({ resume }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (resume) {
      fetchMatches();
    }
  }, [resume]);

  const fetchMatches = async () => {
    try {
      const response = await matchJobs(resume.id);
      setMatches(response.data.matches);
    } catch (err) {
      setError('Failed to fetch job matches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-white mb-4"></div>
          <p className="text-white text-xl">Finding perfect job matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-gray-800 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getMatchColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBgColor = (score) => {
    if (score >= 70) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-3">Job Matches</h2>
          <p className="text-indigo-100 text-lg">
            Found {matches.filter(m => m.match_score >= 50).length} suitable positions based on your profile
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Job Matches Found</h3>
            <p className="text-gray-600 mb-6">Try improving your resume to get better matches</p>
            <button
              onClick={() => navigate('/analysis')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              View Analysis
            </button>
          </div>
        ) : (
          <div className="space-y-6 fade-in">
            {matches.map((match, index) => (
              <div 
                key={match.job.id} 
                className={`bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition ${
                  index === 0 && match.match_score >= 70 ? 'border-4 border-green-400' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <Briefcase className="text-indigo-600 flex-shrink-0 mt-1" size={32} />
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {match.job.title}
                        </h3>
                        <p className="text-xl text-gray-600 font-semibold mb-3">
                          {match.job.company}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="mr-2" size={16} />
                            {match.job.location}
                          </div>
                          {match.job.salary_range && (
                            <div className="flex items-center">
                              <DollarSign className="mr-2" size={16} />
                              {match.job.salary_range}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className={`text-5xl font-bold ${getMatchColor(match.match_score)}`}>
                      {match.match_score}%
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Match Score</p>
                    {index === 0 && match.match_score >= 70 && (
                      <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        TOP MATCH
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">{match.job.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className={`p-4 rounded-lg border-2 ${getMatchBgColor(match.match_score)}`}>
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <TrendingUp className="mr-2 text-green-600" size={20} />
                      Your Matching Skills ({match.matching_skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {match.matching_skills.length > 0 ? (
                        match.matching_skills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-600 text-sm">No matching skills found</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <AlertCircle className="mr-2 text-red-600" size={20} />
                      Skills to Learn ({match.missing_skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {match.missing_skills.length > 0 ? (
                        match.missing_skills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-green-600 text-sm font-semibold">
                          ✓ You have all required skills!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {match.job.requirements && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-2">Requirements:</h4>
                    <p className="text-gray-700 text-sm">{match.job.requirements}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                    Apply Now
                  </button>
                  <button className="flex-1 border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">
                    Save Job
                  </button>
                  <button className="px-6 border-2 border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Share
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

export default JobMatches;