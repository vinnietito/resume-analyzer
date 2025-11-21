import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume, analyzeResumeText } from '../services/api';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const ResumeUpload = ({ setCurrentResume }) => {
  const [uploadMethod, setUploadMethod] = useState('text'); // 'file' or 'text'
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 16 * 1024 * 1024) {
        setError('File size must be less than 16MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let response;
      
      if (uploadMethod === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        response = await uploadResume(formData);
      } else if (uploadMethod === 'text' && resumeText.trim()) {
        response = await analyzeResumeText(resumeText);
      } else {
        setError('Please provide resume content');
        setLoading(false);
        return;
      }

      setSuccess('Resume analyzed successfully!');
      setCurrentResume(response.data.resume);
      
      setTimeout(() => {
        navigate('/analysis');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-3">Upload Your Resume</h2>
          <p className="text-indigo-100 text-lg">Get instant AI-powered analysis and job recommendations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 fade-in">
          {/* Upload Method Selection */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setUploadMethod('text')}
              className={`flex-1 py-4 rounded-lg font-semibold transition ${
                uploadMethod === 'text'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText className="inline mr-2" size={20} />
              Paste Text
            </button>
            <button
              onClick={() => setUploadMethod('file')}
              className={`flex-1 py-4 rounded-lg font-semibold transition ${
                uploadMethod === 'file'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Upload className="inline mr-2" size={20} />
              Upload File
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="text-red-600 mr-3 flex-shrink-0" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
              <CheckCircle className="text-green-600 mr-3 flex-shrink-0" size={20} />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {uploadMethod === 'text' ? (
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Paste Your Resume Content
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here...

Include sections like:
- Contact Information
- Professional Summary
- Work Experience
- Education
- Skills
- Certifications"
                  className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none font-mono text-sm"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Word count: {resumeText.split(/\s+/).filter(Boolean).length}
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Upload Resume File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition">
                  <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                  <input
                    type="file"
                    accept=".txt,.pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Click to upload
                  </label>
                  <span className="text-gray-600"> or drag and drop</span>
                  <p className="text-sm text-gray-500 mt-2">
                    TXT, PDF, or DOCX (max 16MB)
                  </p>
                  {file && (
                    <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                      <p className="text-indigo-700 font-medium">{file.name}</p>
                      <p className="text-sm text-indigo-600">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="spinner border-white mr-3"></div>
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <FileText className="mr-2" size={24} />
                  Analyze Resume
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;