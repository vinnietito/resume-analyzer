import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ResumeUpload from './components/ResumeUpload';
import Analysis from './components/Analysis';
import JobMatches from './components/JobMatches';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentResume(null);
  };

  return (
    <Router>
      <div className="App min-h-screen">
        <Header 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogout={handleLogout} 
        />
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
              <Login onLogin={handleLogin} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? 
              <Register onRegister={handleLogin} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard setCurrentResume={setCurrentResume} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/upload" 
            element={
              isAuthenticated ? 
              <ResumeUpload setCurrentResume={setCurrentResume} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/analysis" 
            element={
              isAuthenticated && currentResume ? 
              <Analysis resume={currentResume} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/matches" 
            element={
              isAuthenticated && currentResume ? 
              <JobMatches resume={currentResume} /> : 
              <Navigate to="/dashboard" />
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;