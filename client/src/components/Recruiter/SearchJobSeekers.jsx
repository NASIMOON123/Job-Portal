


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/SearchJobSeekers.css';
import API from '../../api/api';
const BACKEND_URL = API.defaults.baseURL;

const SearchJobSeekers = () => {
  const [filters, setFilters] = useState({
    name: '',
    skills: '',
    education: '',
    yearOfPassing: '',
  });

  const [results, setResults] = useState([]);

  // New: jobs list and selectedJobId state
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');

  // Fetch jobs on mount to populate the dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/api/recruiter/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/recruiter/search-jobseekers', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });
      setResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handleSendEmail = async (jobSeekerId, jobId) => {
    if (!jobId) {
      alert('Please select a job first.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await API.post(
        '/api/recruiter/send-job-email',
        { jobSeekerId, jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Failed to send email', error);
      alert('Failed to send email');
    }
  };

  return (
    <div className="search-container">
      <h2>🔍 Search Job Seekers</h2>

      {/* Filters */}
      <div className="filters">
        <input name="name" placeholder="Name" value={filters.name} onChange={handleChange} />
        <input name="skills" placeholder="Skills (comma separated)" value={filters.skills} onChange={handleChange} />
        <input
          name="education"
          placeholder="Education"
          value={filters.education}
          onChange={handleChange}
        />
        <input name="yearOfPassing" placeholder="Year of Passing" value={filters.yearOfPassing} onChange={handleChange} />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Job selector dropdown */}
      <div style={{ margin: '20px 0' }}>
        <label htmlFor="job-select">Select Job to Contact Applicants: </label>
        <select
          id="job-select"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          <option value="">-- Select a job --</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="results">
        {results.length === 0 ? (
          <p className="no-results">No job seekers found</p>
        ) : (
          results.map((js) => (
            <div key={js._id} className="jobseeker-card">
              <h3>{js.name}</h3>
              <p><strong>Email:</strong> {js.email}</p>
              <p><strong>Phone:</strong> {js.phone || 'N/A'}</p>
              <p><strong>Education:</strong> {js.education || 'N/A'}</p>
              <p><strong>Skills:</strong> {Array.isArray(js.skills) ? js.skills.join(', ') : js.skills || 'N/A'}</p>
              <p><strong>Experience:</strong> {js.experience || 'N/A'}</p>
              <p><strong>Current Role:</strong> {js.currentRole || 'N/A'}</p>
              <p><strong>LinkedIn:</strong> {js.linkedin ? <a href={js.linkedin} target="_blank" rel="noreferrer">Profile</a> : 'N/A'}</p>
              {js.resumeFile ? (
                <p>
                  <strong>Resume: </strong>
                  <a href={`${BACKEND_URL}/${js.resumeFile}`} target="_blank" rel="noopener noreferrer">
                    View / Download
                  </a>
                </p>
              ) : (
                <p><strong>Resume:</strong> Not uploaded</p>
              )}
              {js.profileImage && (
                <img
                src={`${BACKEND_URL}/${js.profileImage}`}
                  alt="Profile"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginTop: '10px' }}
                />
              )}

              <button
                className="btn"
                disabled={!selectedJobId}
                onClick={() => handleSendEmail(js._id, selectedJobId)}
              >
                📧 Contact
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchJobSeekers;
