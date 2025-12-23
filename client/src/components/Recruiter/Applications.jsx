


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Applications.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../../api/api';
const BACKEND_URL = API.defaults.baseURL;

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get('/api/recruiter/applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data.applications);
        setLoading(false);
      } catch (err) {
        setError('Failed to load applications');
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const updateStatusAndEmail = async (applicantId, jobId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await API.post(
        `/api/recruiter/applications/${applicantId}/${jobId}/status-and-offer`,
        
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Application ${newStatus} and email sent!`);
      setApplications((apps) =>
        apps.map((app) => {
          if (app.applicantId === applicantId && app.jobId === jobId) {
            return { ...app, status: newStatus };
          }
          return app;
        })
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update status or send email.');
    }
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="applications-container">
      <h2>Job Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found for your jobs.</p>
      ) : (
        <div className="applications-card-grid">
          {applications.map((app) => (
            <div key={`${app.applicantId}-${app.jobId}`} className="application-card">
              <h3>{app.applicantName}</h3>
              <p><strong>Job Title Applied for:</strong> {app.jobTitle}</p>
              <p><strong>Email:</strong> {app.applicantEmail}</p>
              <p><strong>Phone:</strong> {app.applicantPhone}</p>

              <p>
                <strong>Resume:</strong>{' '}
                {app.resumeFile ? (
                  <a href={`${BACKEND_URL}/${app.resumeFile}`} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                ) : 'N/A'}
              </p>

              <p>
                <strong>Cover Letter:</strong>{' '}
                {app.coverLetterFile ? (
                  <a href={`${BACKEND_URL}/${app.coverLetterFile}`} target="_blank" rel="noopener noreferrer">
                    View Cover Letter
                  </a>
                ) : 'N/A'}
              </p>

              <p><strong>Additional Details:</strong> {app.additionalDetails || 'N/A'}</p>

              {(app.linkedin || app.github || app.programmingProfiles || app.skills || app.graduation || app.yearOfPassing) && (
                <>
                  {app.linkedin && <p><strong>LinkedIn:</strong> {app.linkedin}</p>}
                  {app.github && <p><strong>GitHub:</strong> {app.github}</p>}
                  {app.programmingProfiles && <p><strong>Programming Profiles:</strong> {app.programmingProfiles}</p>}
                  {app.skills && <p><strong>Skills:</strong> {app.skills}</p>}
                  {app.graduation && <p><strong>Graduation:</strong> {app.graduation}</p>}
                  {app.yearOfPassing && <p><strong>Year of Passing:</strong> {app.yearOfPassing}</p>}
                </>
              )}

              <p><strong>Applied At:</strong> {new Date(app.appliedAt).toLocaleString()}</p>

              <div className="status-section">
                <div className="status-label">
                  Status: <span className={`status-text status-${app.status.toLowerCase()}`}>{app.status}</span>
                </div>
                <div className="status-buttons">
                  <button
                    onClick={() => updateStatusAndEmail(app.applicantId, app.jobId, 'Accepted')}
                    disabled={app.status === 'Accepted' || app.status === 'Rejected'}
                    className="btn-accept"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatusAndEmail(app.applicantId, app.jobId, 'Rejected')}
                    disabled={app.status === 'Accepted' || app.status === 'Rejected'}
                    className="btn-reject"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default RecruiterApplications;
