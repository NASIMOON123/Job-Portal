


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './css/EditJobSeekerProfile.css';
import API from '../../api/api';
const BACKEND_URL = API.defaults.baseURL;

const EditJobSeekerProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
const [imagePreview, setImagePreview] = useState('');


  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/jobseeker/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(res.data);
    };
    fetchDetails();
  }, []);

  const isLengthValid = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    // 🔁 Convert comma-separated skills string to an array
    const processedForm = { ...form };
    if (processedForm.skills && typeof processedForm.skills === 'string') {
      processedForm.skills = processedForm.skills
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean); // remove empty strings
    }

    // 🔁 Append all fields to FormData
    for (const key in processedForm) {
      if (Array.isArray(processedForm[key])) {
        processedForm[key].forEach((val, i) => {
          formData.append(`${key}[${i}]`, val); // array support in Express
        });
      } else {
        formData.append(key, processedForm[key]);
      }
    }

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    await API.put('/api/jobseeker/update-profile', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Profile updated!');
    navigate('/jobseeker-dashboard/profile');
  } catch (error) {
    alert('Failed to update profile.');
    console.error(error);
  }
};

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      alert('Please enter your current password');
      return;
    }
    if (!isLengthValid) {
      alert('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await API.post(
        '/api/jobseeker/change-password',
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

  return (
    <div className="edit-profile-container">
      <h2>Edit Job Seeker Profile</h2>

      <div className="form-section">
        <label>Name</label>
        <input type="text" name="name" value={form.name || ''} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={form.email || ''} onChange={handleChange} />

        <label>Phone</label>
        <input type="text" name="phone" value={form.phone || ''} onChange={handleChange} />

        <label>Address</label>
        <input type="text" name="address" value={form.address || ''} onChange={handleChange} />

        <label>Date of Birth</label>
        {/* <input type="date" name="dob" value={form.dob || ''} onChange={handleChange} /> */}
        <input
  type="date"
  name="dob"
  value={form.dob ? new Date(form.dob).toISOString().split('T')[0] : ''}
  onChange={handleChange}
/>



        <label>Gender</label>
        <select name="gender" value={form.gender || ''} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <label>Profile Image</label>
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  }}
/>
{/* Show existing profile image if no new image is selected */}
{!imagePreview && form.profileImage && (
  <img
    // src={`${BACKEND_URL}/${form.profileImage}`}
    src={`${BACKEND_URL}${form.profileImage}`}

    alt="Current Profile"
    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', marginTop: '10px' }}
  />
)}
{imagePreview && (
  <img
    src={imagePreview}
    alt="Profile Preview"
    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', marginTop: '10px' }}
  />
)}

        <label>Education</label>
        <input type="text" name="education" value={form.education || ''} onChange={handleChange} />

        <label>Skills</label>
        <input type="text" name="skills" value={form.skills || ''} onChange={handleChange} />

        <label>Experience</label>
<select name="experience" value={form.experience || ''} onChange={handleChange}>
  <option value="">Select Experience Level</option>
  <option value="Entry">Entry</option>
  <option value="Mid">Mid</option>
  <option value="Senior">Senior</option>
</select>

<label>Year of Passing</label>
<input
  type="number"
  name="yearOfPassing"
  min="1900"
  max="2099"
  step="1"
  value={form.yearOfPassing || ''}
  onChange={handleChange}
/>

        <label>Current Role</label>
        <select name="currentRole" value={form.currentRole || ''} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Student">Student</option>
          <option value="Employee">Employee</option>
          <option value="HR">HR</option>
          <option value="Other">Other</option>
        </select>

        <label>LinkedIn</label>
        <input type="url" name="linkedin" value={form.linkedin || ''} onChange={handleChange} />

        <label>GitHub Profile</label>
        <input type="url" name="github" value={form.github || ''} onChange={handleChange} />

        <label>Portfolio URL</label>
        <input type="url" name="portfolio" value={form.portfolio || ''} onChange={handleChange} />

        <label>Languages Known</label>
        <input type="text" name="languages" value={form.languages || ''} onChange={handleChange} />

        <label>Career Objective</label>
        <textarea name="careerObjective" value={form.careerObjective || ''} onChange={handleChange} />

        <label>Short Bio</label>
        <textarea name="bio" value={form.bio || ''} onChange={handleChange} />

        <button className="save-btn" onClick={handleSubmit}>Save Profile</button>
      </div>

      <div className="password-section">
        <button className="change-pass-btn" onClick={() => setShowPasswordFields(!showPasswordFields)}>
          {showPasswordFields ? 'Cancel Password Update' : 'Change Password'}
        </button>

        {showPasswordFields && (
          <div className="password-fields">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
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
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {newPassword.length > 0 && !(
              isLengthValid && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
            ) && (
              <div className="password-feedback">
                <ul>
                  <li style={{ color: isLengthValid ? 'green' : 'red' }}>✅ At least 8 characters</li>
                  <li style={{ color: hasUppercase ? 'green' : 'red' }}>✅ One uppercase letter</li>
                  <li style={{ color: hasLowercase ? 'green' : 'red' }}>✅ One lowercase letter</li>
                  <li style={{ color: hasNumber ? 'green' : 'red' }}>✅ One number</li>
                  <li style={{ color: hasSpecialChar ? 'green' : 'red' }}>✅ One special character</li>
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
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setShowConfirmPassword(!showConfirmPassword)}
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

export default EditJobSeekerProfile;
