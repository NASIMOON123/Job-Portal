
import React, { useState , useEffect } from 'react';
import AdminLogin from './AdminLogin';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import './CombinedLogin.css';
import loginImg from '../../assets/login.jpg';
import { FaSun, FaMoon } from 'react-icons/fa';
const CombinedLogin = () => {
  const [selectedLogin, setSelectedLogin] = useState('recruiter'); // default
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('loginTheme', newTheme);
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('loginTheme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <div className="combined-login-wrapper">
      
      {/* Left side - image */}
      <div className="login-left">
        <button className="back-home-btn-left" onClick={() => navigate('/')}>
          &larr; Back to Home
        </button>
        <div className="login-image" style={{ backgroundImage: `url(${loginImg})` }}></div>
      </div>

      {/* Right side - login form */}
      <div className="login-right">
         {/* Theme toggle */}
        {/* Theme toggle */}
<div className="theme-toggle-login-top" onClick={toggleTheme}>
  <div className={`switch ${theme === "dark" ? "dark" : ""}`}>
    <div className="circle">
      {theme === "dark" ? <FaSun className="icon" /> : <FaMoon className="icon" />}
    </div>
  </div>
</div>

        <div className="login-header">
          
          <p>Login to access your dashboard</p>
   

        {/* Toggle buttons */}
        <div className="login-toggle">
          <button
            className={selectedLogin === 'admin' ? 'active' : ''}
            onClick={() => setSelectedLogin('admin')}
          >
            Admin Login
          </button>
          <button
            className={selectedLogin === 'recruiter' ? 'active' : ''}
            onClick={() => setSelectedLogin('recruiter')}
          >
            Recruiter / Employer Login
          </button>
        </div>

        {/* Selected login form */}
        <div className="login-form-container">
          {selectedLogin === 'admin' && <AdminLogin />}
          {selectedLogin === 'recruiter' && <Login />}
        </div>
      </div>
      </div>
    </div>
  );
};

export default CombinedLogin;
