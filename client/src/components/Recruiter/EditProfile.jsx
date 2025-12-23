import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/EditProfile.css';
import API from '../../api/api';
const BACKEND_URL = API.defaults.baseURL;

import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    companyName: '',
    companyWebsite: '',
    industry: '',
    designation: '',
    address: '',
    bio: '',
    linkedin: '',
    profileImage: null
  });

  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showPasswordFields, setShowPasswordFields] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/api/recruiter/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        
        // Set default empty string values to prevent uncontrolled input warnings
        const data = res.data;
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          companyName: data.companyName || '',
          companyWebsite: data.companyWebsite || '',
          industry: data.industry || '',
          designation: data.designation || '',
          address: data.address || '',
          bio: data.bio || '',
          linkedin: data.linkedin || '',
          profileImage: null
        });

        if (data.profileImage) {
          setPreview(`${BACKEND_URL}${data.profileImage}`);

        }

        checkCompletion(data);
      } catch (err) {
        console.error('Error fetching recruiter profile:', err);
      }
    };
    fetchData();
  }, []);

  const checkCompletion = (data) => {
    const requiredFields = ['name', 'phone', 'companyName', 'designation'];
    const filled = requiredFields.filter(field => data[field]);
    setStatus(filled.length === requiredFields.length ? 'Complete' : 'Incomplete');
  };
  const handlePasswordChange = async () => {
    if (!currentPassword) return alert('Please enter your current password');
    if (!isLengthValid) return alert('Password must be at least 8 characters');
    if (newPassword !== confirmPassword) return alert('Passwords do not match');
  
    try {
      const token = localStorage.getItem('token');
      await API.post(
        '/api/recruiter/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change password.');
      console.error(error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, profileImage: file }));
    setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
  
    // for (let key in formData) {
    //   if (formData[key]) {
    //     data.append(key, formData[key]);
    //   }
    // }
    for (let key in formData) {
      // Always append string fields, even if empty
      if (key === 'profileImage') {
        if (formData[key]) data.append(key, formData[key]); // append image only if selected
      } else {
        data.append(key, formData[key]); // send all text fields (even if empty)
      }
    }
    
  
    try {
      const res = await API.put('/api/recruiter/profile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Profile updated successfully!');
      checkCompletion(res.data);
      navigate('/recruiter-dashboard/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };
  // Password validation conditions (recomputed on each render)
const isLengthValid = newPassword.length >= 8;
const hasUppercase = /[A-Z]/.test(newPassword);
const hasLowercase = /[a-z]/.test(newPassword);
const hasNumber = /\d/.test(newPassword);
const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  

  return (
    <div className="edit-profile">
      <h2>Edit Your Profile</h2>
      <p>Status: <strong>{status}</strong></p>

     
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-column">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />

            <label>Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} required />

            <label>Company Name</label>
            <input name="companyName" value={formData.companyName} onChange={handleChange} />

            <label>Industry</label>
            <input name="industry" value={formData.industry} onChange={handleChange} />

            <label>Address</label>
            <input name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="form-column">
            <label>Designation</label>
            <input name="designation" value={formData.designation} onChange={handleChange} />

            <label>Company Website</label>
            <input name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} />

            <label>LinkedIn URL</label>
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} />

            <label>Short Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} />

            <label>Profile Image</label>
            <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Profile Preview" className="profile-preview" />}

          </div>
        </div>
        
        <button type="submit">Save Changes</button>
       

      </form>
      <div className="password-section">
  <button
    className="change-pass-btn"
    onClick={() => setShowPasswordFields(!showPasswordFields)}
  >
    {showPasswordFields ? 'Cancel Password Update' : 'Change Password'}
  </button>

  {showPasswordFields && (
    <div className="password-fields">
      <label>Current Password</label>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Enter current password"
      />

      <label>New Password</label>
      <div className="password-input-wrapper">
        <input
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
        <span
          className="eye-icon"
          onClick={() => setShowNewPassword(!showNewPassword)}
          role="button"
        >
          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      {newPassword && !(
        isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
      ) && (
        <div className="password-feedback">
          <ul>
            <li style={{ color: isLengthValid ? 'green' : 'red' }}>At least 8 characters</li>
            <li style={{ color: hasUppercase ? 'green' : 'red' }}>One uppercase letter</li>
            <li style={{ color: hasLowercase ? 'green' : 'red' }}>One lowercase letter</li>
            <li style={{ color: hasNumber ? 'green' : 'red' }}>One number</li>
            <li style={{ color: hasSpecialChar ? 'green' : 'red' }}>One special character</li>
          </ul>
        </div>
      )}

      <label>Confirm Password</label>
      <div className="password-input-wrapper">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
        <span
          className="eye-icon"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          role="button"
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button className="change-pass-btn" onClick={handlePasswordChange}>
        Update Password
      </button>
    </div>
  )}
</div>
    </div>
  );
};

export default EditProfile;
