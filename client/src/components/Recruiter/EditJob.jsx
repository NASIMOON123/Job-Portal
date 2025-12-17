import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/EditJob.css';
const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    skills: '',
    type: '',
    openings: '',
    applicationDeadline: '',
    experienceLevel: '',
    educationRequirements: '',
    workMode: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/recruiter/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const job = response.data;
        setJobData({
          ...job,
          skills: job.skills.join(', '), // convert array to string
          applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : '',
        });
      } catch (error) {
        console.error('Failed to fetch job:', error);
        alert('Failed to load job details');
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/recruiter/jobs/${id}`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Job updated successfully');
      navigate('/recruiter-dashboard/manage-jobs');
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('Failed to update job');
    }
  };

  return (
    <div>
       <div className="edit-job-header">
      <button className="close-button" onClick={() => navigate('/recruiter-dashboard/manage-jobs')}>✕</button>
    </div>
      <h2>Edit Job</h2>
      
      <form onSubmit={handleSubmit} className="job-form">
      <label>Job Title</label>
        <input name="title" value={jobData.title} onChange={handleChange} required  readOnly style={{ backgroundColor: '#fdefer', cursor: 'not-allowed' }}/>

        
        <label>Location</label>
        <input name="location" value={jobData.location} onChange={handleChange} required readOnly style={{ backgroundColor: '#fdefer', cursor: 'not-allowed' }}/>

        <label>Salary</label>
        <input name="salary" value={jobData.salary} onChange={handleChange} required />

        <label>Skills (comma separated)</label>
        <input name="skills" value={jobData.skills} onChange={handleChange} required />

        <label>Job Type</label>
        <select name="type" value={jobData.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <label>Number of Openings</label>
        <input
        type="number"
        min="1"
        name="openings"
        value={jobData.openings}
        onChange={handleChange}
        required
        />
       

<label>Application Deadline</label>
<input
  type="date"
  name="applicationDeadline"
  value={jobData.applicationDeadline}
  onChange={handleChange}
/>

<label>Experience Level</label>
<select
  name="experienceLevel"
  value={jobData.experienceLevel}
  onChange={handleChange}
  required
>
  <option value="">Select Experience Level</option>
  <option value="Entry">Entry</option>
  <option value="Mid">Mid</option>
  <option value="Senior">Senior</option>
</select>

<label>Education Requirements</label>
<input
  type="text"
  name="educationRequirements"
  value={jobData.educationRequirements}
  onChange={handleChange}
/>

<label>Work Mode</label>
<select
  name="workMode"
  value={jobData.workMode}
  onChange={handleChange}
  required
>
  <option value="">Select Work Mode</option>
  <option value="Remote">Remote</option>
  <option value="On-site">On-site</option>
  <option value="Hybrid">Hybrid</option>
</select>
<label>Status</label>
<select name="status" value={jobData.status} onChange={handleChange}>
  <option value="Open">Open</option>
  <option value="Closed">Closed</option>
</select>

        <button type="submit">Save changes</button>
      </form>
    </div>
  );
};

export default EditJob;
