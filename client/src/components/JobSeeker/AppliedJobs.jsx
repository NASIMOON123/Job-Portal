import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/AppliedJobs.css';
import API from '../../api/api';
const BACKEND_URL = API.defaults.baseURL;


const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        // Endpoint should return applied jobs along with application details
        const res = await API.get('/api/jobseeker/applied', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppliedJobs(res.data);
      } catch (err) {
        setError('Failed to fetch applied jobs');
        console.error(err);
      }
    };

    fetchAppliedJobs();
  }, []);

  const toggleExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  if (error) return <p className="error-msg">{error}</p>;

  if (appliedJobs.length === 0) return <p className="empty-msg">You have not applied to any jobs yet.</p>;


return (
  <div className="applied-jobs-container">
    <h2>Applied Jobs</h2>

    <div className="jobs-grid"> {/* 👈 Add grid wrapper here */}
      {appliedJobs.map(({ job, application }) => (
        <div key={job._id} className="job-card">
          <h3>{job.title}</h3>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> ₹{job.salary}</p>
          <p><strong>Type:</strong> {job.type}</p>
          <p><strong>Status:</strong> {job.status === 'Expired' ? '❌ Expired' : '✅ Open'}</p>

          {expandedJobId === job._id && (
            <div className="job-details">
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Skills Required:</strong> {job.skills?.join(', ')}</p>
              <p><strong>Openings:</strong> {job.openings}</p>
              <p><strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
              <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
              <p><strong>Education:</strong> {job.educationRequirements}</p>
              <p><strong>Work Mode:</strong> {job.workMode}</p>
              <p><strong>Posted by:</strong> {job.recruiterId?.name} ({job.recruiterId?.email})</p>

              <hr />

              <h4>Your Application Details:</h4>
              {application ? (
                <>
                  {application.coverLetterFile && (
                    <p>
                      <strong>Cover Letter:</strong>{' '}
                      <a  href={`${BACKEND_URL}/${application.coverLetterFile}`} target="_blank" rel="noopener noreferrer">
                        View/Download
                      </a>
                    </p>
                  )}
                  {application.resumeFile && (
                    <p>
                      <strong>Resume:</strong>{' '}
                      <a href={`${BACKEND_URL}/${application.resumeFile}`} target="_blank" rel="noopener noreferrer">
                        View/Download
                      </a>
                    </p>
                  )}
                  {application.additionalDetails && <p><strong>Message:</strong> {application.additionalDetails}</p>}
                  {application.linkedin && <p><strong>LinkedIn / GitHub:</strong> {application.linkedin}</p>}
                  {application.github && <p><strong>GitHub:</strong> {application.github}</p>}
                  {application.programmingProfiles && <p><strong>Other Profiles:</strong> {application.programmingProfiles}</p>}
                  {application.skills && <p><strong>Skills:</strong> {application.skills}</p>}
                  {application.graduation && <p><strong>Graduation:</strong> {application.graduation}</p>}
                  {application.yearOfPassing && <p><strong>Year of Passing:</strong> {application.yearOfPassing}</p>}
                  {application.status && (
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className={`application-status-pill ${(application.status || 'Pending').toLowerCase()}`}>
                        {application.status || 'Pending'}
                      </span>
                    </p>
                  )}

                  <p><strong>Applied On:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                </>
              ) : (
                <p>No application details available.</p>
              )}
            </div>
          )}

          <button
            className="view-more-btn"
            onClick={() => toggleExpand(job._id)}
          >
            {expandedJobId === job._id ? 'View Less' : 'View More'}
          </button>
        </div>
      ))}
    </div>
  </div>
);


};

export default AppliedJobs;
