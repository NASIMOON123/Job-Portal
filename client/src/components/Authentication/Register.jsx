import React, { useState } from 'react';
import { FaUser, FaPhoneAlt, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import { Link ,useNavigate  } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';




const Register = () => {

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  const navigate = useNavigate();
  const [emailExists, setEmailExists] = useState(false);
  const checkEmailExists = async () => {
    if (!formData.email || !formData.role) return;
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, role: formData.role })
      });
  
      const data = await response.json();
      setEmailExists(data.exists);
    } catch (error) {
      console.error('Email check failed:', error);
    }
  };
  
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Live password rules
  const isLengthValid = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[\W_]/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!(isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSpecialChar)) {
      alert("Password doesn't meet strength requirements.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    if (formData.role === '' || formData.role === 'Select Role') {
      alert("Please select a valid role.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || 'Registration failed');
        return;
      }
  
      // alert('Registration successful!');
      // Example success
toast.success('Registered successfully!');
    
      navigate('/user-login');  // or your login route path

      // optionally redirect to login page here
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Server error, please try again later.');
    }
  };
  

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="login-form">

        {/* Other Inputs */}
        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange}  required />
        </div>
        <div className="input-group">
          <FaEnvelope className="icon" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} onBlur={checkEmailExists}  required />
        </div>
        {emailExists && <p style={{ color: 'red' }}>❌ Email already registered!</p>}



         
        <div className="input-group password-group">
  <FaLock className="icon" />
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Create Password"
    value={password}
    onChange={handleChange}
    required
  />
  <span className="eye-icon" onClick={togglePasswordVisibility}>
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>


        {/* Show rules only while typing */}
        {password.length > 0 && !(
  isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
) && (
  <div className="password-feedback">
    <ul>
      <li style={{ color: isLengthValid ? 'green' : 'red' }}>
        {isLengthValid ? '✅' : '❌'} At least 8 characters
      </li>
      <li style={{ color: hasUppercase ? 'green' : 'red' }}>
        {hasUppercase ? '✅' : '❌'} One uppercase letter
      </li>
      <li style={{ color: hasLowercase ? 'green' : 'red' }}>
        {hasLowercase ? '✅' : '❌'} One lowercase letter
      </li>
      <li style={{ color: hasNumber ? 'green' : 'red' }}>
        {hasNumber ? '✅' : '❌'} One number
      </li>
      <li style={{ color: hasSpecialChar ? 'green' : 'red' }}>
        {hasSpecialChar ? '✅' : '❌'} One special character
      </li>
    </ul>
  </div>
)}

          
        <div className="input-group">
          <FaUserTag className="icon" />
          <select name="role" value={formData.role} onChange={handleChange}>
           <option value="">Select Role</option>
            <option value="jobseeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
       
          </select>
        </div>

       

<div className="input-group">
          <FaPhoneAlt className="icon" />
         <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            minLength="10"
            maxLength="10"
            title="Phone number must be exactly 10 digits"
            required
          />

        </div>

        <button type="submit">Register</button>
      </form>

      <div className="register-section">
      <p>
  Already have an account?{' '}
  <Link to="/combined-login" className="register-link">
    Login here
  </Link>
</p>

      </div>
    </div>
  );
};

export default Register;
