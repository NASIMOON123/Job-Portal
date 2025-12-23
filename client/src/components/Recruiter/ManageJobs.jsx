


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import "./css/ManageJobs.css";
import API from '../../api/api';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [expandedJobs, setExpandedJobs] = useState({});
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/recruiter/jobs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to load jobs");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/api/recruiter/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Job deleted successfully!");
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  const toggleExpand = (jobId) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="manage-jobs-container">
      <h2>Manage Your Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="job-grid">
          {jobs.map(job => {
            const isExpanded = expandedJobs[job._id];

            return (
              <div key={job._id} className="job-card">
                <h3 className="heading">{job.title}</h3>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary}</p>
                <p><strong>Type:</strong> {job.type}</p>

                {isExpanded && (
                  <>
                    <p><strong>Skills:</strong> {job.skills.join(', ')}</p>
                    <p><strong>Openings:</strong> {job.openings}</p>
                    <p><strong>Application Deadline:</strong> {job.applicationDeadline?.split('T')[0]}</p>
                    <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
                    <p><strong>Education Requirements:</strong> {job.educationRequirements}</p>
                    <p><strong>Work Mode:</strong> {job.workMode}</p>
                    <p><strong>Posted On:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {job.status}</p>
                  </>
                )}

                
                <div className="job-buttons">
                <button className="view-toggle-button" onClick={() => toggleExpand(job._id)}>
                  {isExpanded ? 'View Less' : 'View More'}
                </button>

                  <button onClick={() => handleDelete(job._id)}>Delete</button>
                  <button onClick={() => navigate(`../edit-job/${job._id}`)}>Edit</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
