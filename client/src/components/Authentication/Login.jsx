import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaUserTie } from 'react-icons/fa';
import './Login.css';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import API from "../../api/api";



const Login = () => {
   const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const navigate = useNavigate();

   const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   

    if (!formData.role) {
      alert('Please select a valid role');
      return;
    }
    
    try {
      // const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const response = await API.post("/api/auth/login", formData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
  
      const role = response.data.user.role;
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (role === 'jobseeker') {
        navigate('/jobseeker-dashboard');
      }
toast.success('Login successfully!');
      // You can redirect user here based on role, e.g. using useNavigate from react-router
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    
    <div className="login-container">
     


      <h2>Recruiter / Employee Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group password-group">
  <FaLock className="icon" />
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Type Password"
    value={formData.password}
    onChange={handleChange}
    required
  />
  <span className="eye-icon" onClick={togglePasswordVisibility}>
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>


        <div className="input-group">
          <FaUserTie className="icon" />
          <select name="role" value={formData.role} onChange={handleChange}>
          <option value="">Select Role</option>
            <option value="recruiter">Recruiter</option>
            <option value="jobseeker">Job Seeker</option>
          </select>
        </div>
      <p style={{ marginTop: '10px', textAlign: 'right' }}>
  <Link to="/forgot-password" style={{ color: '#007bff' }}>
    Forgot Password?
  </Link>
</p>




        <button type="submit">Login</button>
        
      </form>
      <div className="register-section">
        <p>Don't have an account? <Link to="/register" className="register-link">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;
