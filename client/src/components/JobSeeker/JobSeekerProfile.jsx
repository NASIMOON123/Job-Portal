
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/JobSeekerProfile.css'; // Adjust if needed

const JobSeekerProfile = () => {
  const [user, setUser] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/jobseeker/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        calculateCompletion(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job seeker profile:', err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const calculateCompletion = (data) => {
    const basicFields = ['name', 'email', 'phone'];
    const extendedFields = ['address', 'education', 'skills', 'linkedin', 'bio', 'experience', 'profileImage'];
    const totalFields = basicFields.length + extendedFields.length;
    const filled = [...basicFields, ...extendedFields].filter(field => data[field] && data[field].toString().trim() !== '').length;
    const percent = Math.round((filled / totalFields) * 100);
    setCompletion(percent);
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No profile found.</p>;

  return (
    <div className="jobseeker-profile-container">
      <h2>Job Seeker Profile</h2>

      <div className="profile-info">
        <div className="profile-image-container" style={{ marginBottom: '1rem',   textAlign:'center'}}>
          {user.profileImage ? (
            // If profileImage is a URL or base64 string:
            // Adjust accordingly; here assuming base64 string without data prefix
            <img
  src={
    user.profileImage.startsWith('http')
      ? user.profileImage
      : `http://localhost:5000/${user.profileImage}`
  }
  alt="Profile"
  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
/>

          ) : (
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#ccc',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
              color: '#666'
            }}>
              ?
            </div>
          )}
        </div>

        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
        {user.address && <p><strong>Address:</strong> {user.address}</p>}
        {user.dob && <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString('en-GB')}</p>}
        {user.gender && <p><strong>Gender:</strong> {user.gender}</p>}
        {user.education && <p><strong>Education:</strong> {user.education}</p>}
        {user.skills && <p><strong>Skills:</strong> {user.skills}</p>}
        {user.experience && <p><strong>Experience:</strong> {user.experience}</p>}
        {user.currentRole && <p><strong>Current Role:</strong> {user.currentRole}</p>}
        {user.linkedin && (
          <p><strong>LinkedIn:</strong> <a href={user.linkedin} target="_blank" rel="noopener noreferrer">{user.linkedin}</a></p>
        )}
        {user.github && (
          <p><strong>GitHub:</strong> <a href={user.github} target="_blank" rel="noopener noreferrer">{user.github}</a></p>
        )}
        {user.resumeFile && (
  <p>
    <strong>Resume:</strong>{' '}
    <a
      href={`http://localhost:5000/${user.resumeFile}`}
      target="_blank"
      rel="noopener noreferrer"
      download
    >
      View / Download Resume
    </a>
  </p>
)}

{user.coverLetterFile && (
  <p>
    <strong>Cover Letter:</strong>{' '}
    <a
      href={`http://localhost:5000/${user.coverLetterFile}`}
      target="_blank"
      rel="noopener noreferrer"
      download
    >
      View / Download Cover Letter
    </a>
  </p>
)}

        {user.portfolio && (
          <p><strong>Portfolio:</strong> <a href={user.portfolio} target="_blank" rel="noopener noreferrer">{user.portfolio}</a></p>
        )}
        {user.languages && <p><strong>Languages:</strong> {user.languages}</p>}
        {user.careerObjective && <p><strong>Career Objective:</strong> {user.careerObjective}</p>}
        {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
      </div>
      <div className="profile-progress">
        <p>Profile Completion: {completion}%</p>
        <div className="progress-bar" style={{ width: '100%', height: '20px', backgroundColor: '#eee', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
          <div className="filled" style={{ width: `${completion}%`, height: '100%', backgroundColor: '#4caf50', transition: 'width 0.5s ease' }}></div>
        </div>

        {completion < 100 ? (
          <button onClick={() => navigate('/jobseeker-dashboard/edit-profile')}>
            Complete Your Profile
          </button>
        ) : (
          <button onClick={() => navigate('/jobseeker-dashboard/edit-profile')}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default JobSeekerProfile;
