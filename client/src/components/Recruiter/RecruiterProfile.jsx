import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/RecruiterProfile.css';
import API from '../../api/api';
const BACKEND_URL = API.defaults.baseURL;
const RecruiterProfile = () => {
  const [recruiter, setRecruiter] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await API.get('/api/recruiter/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRecruiter(res.data);
          calculateCompletion(res.data);
          // Update preview with image URL from backend or fallback to default
          setPreview(res.data.profileImage ? `${BACKEND_URL}${res.data.profileImage}` : '');
          setLoading(false);
        } catch (err) {
          console.error('Error fetching recruiter profile:', err);
          setLoading(false);
        }
      };
      
    fetchProfile();
  }, []);


  const calculateCompletion = (data) => {
    const profileFields = [
      'name',
      'email',
      'phone',
      'companyName',
      'companyWebsite',
      'designation',
      'address',
      'bio',
      'linkedin',
      'industry',
      'profileImage'
    ];
  
    const filledCount = profileFields.filter(
      field => data[field] && data[field].toString().trim() !== ''
    ).length;
  
    const percentage = Math.round((filledCount / profileFields.length) * 100);
    setCompletion(percentage);
  };
  
  
  if (loading) return <p>Loading...</p>;
  if (!recruiter) return <p>Profile not found.</p>;

  return (
    <div className="recruiter-profile-container">
      <h2>Recruiter Profile</h2>
      <div className="profile-image-section">
  <img
    src={preview || '/default-avatar.png'} // You can place a default image in public folder
    alt="Profile"
    className="circular-profile-image"
  />
</div>

<div className="profile-info">
  <p><strong>Name:</strong> {recruiter.name}</p>
  <p><strong>Email:</strong> {recruiter.email}</p>
  <p><strong>Phone:</strong> {recruiter.phone}</p>

  {recruiter.companyName && (
    <p><strong>Company Name:</strong> {recruiter.companyName}</p>
  )}

  {recruiter.companyWebsite && (
    <p><strong>Website:</strong> {recruiter.companyWebsite}</p>
  )}

  {recruiter.industry && (
    <p><strong>Industry:</strong> {recruiter.industry}</p>
  )}

  {recruiter.designation && (
    <p><strong>Designation:</strong> {recruiter.designation}</p>
  )}

  {recruiter.address && (
    <p><strong>Address:</strong> {recruiter.address}</p>
  )}

  {recruiter.bio && (
    <p><strong>Bio:</strong> {recruiter.bio}</p>
  )}

  {recruiter.linkedin && (
    <p>
      <strong>LinkedIn:</strong>{' '}
      <a href={recruiter.linkedin} target="_blank" rel="noreferrer">
        {recruiter.linkedin}
      </a>
    </p>
  )}
</div>


      <div className="profile-progress">
        <p>Profile Completion: {completion}%</p>
        <div className="progress-bar">
          <div className="filled" style={{ width: `${completion}%` }}></div>
        </div>

    

  <button
    className="complete-btn"
    onClick={() => navigate('/recruiter-dashboard/edit-profile')}
  >
    {completion === 100 ? 'Edit Profile' : 'Complete Your Profile'}
  </button>

      </div>
    </div>
  );
};

export default RecruiterProfile;
