import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, FileText } from 'lucide-react';

const Header = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <FileText className="text-indigo-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">Resume Analyzer</h1>
          </Link>
          
          {isAuthenticated && user && (
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-4">
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-indigo-600 font-medium transition"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/upload" 
                  className="text-gray-700 hover:text-indigo-600 font-medium transition"
                >
                  Upload Resume
                </Link>
              </nav>
              
              <div className="flex items-center space-x-3 border-l pl-6">
                <User className="text-gray-600" size={20} />
                <span className="text-gray-700 font-medium">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;