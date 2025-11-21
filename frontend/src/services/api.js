import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getCurrentUser = () => api.get('/auth/me');

// Resume APIs
export const uploadResume = (formData) => {
  return api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const analyzeResumeText = (text) => api.post('/resume/analyze', { text });
export const listResumes = () => api.get('/resume/list');
export const getResume = (resumeId) => api.get(`/resume/${resumeId}`);
export const deleteResume = (resumeId) => api.delete(`/resume/${resumeId}`);

// Job APIs
export const listJobs = () => api.get('/jobs/list');
export const getJob = (jobId) => api.get(`/jobs/${jobId}`);
export const matchJobs = (resumeId) => api.get(`/jobs/match/${resumeId}`);
export const createJob = (jobData) => api.post('/jobs/create', jobData);

export default api;