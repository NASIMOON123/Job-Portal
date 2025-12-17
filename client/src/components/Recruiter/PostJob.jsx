import React, { useState } from 'react';
import axios from 'axios';
import './css/PostJob.css'; // Optional: create styling

const PostJob = () => {
  const initialJobData = {
    title: '',
    description: '',
    location: '',
    salary: '',
    skills: '',
    type: '', // Full-Time, Part-Time, etc.
    openings: '', 
    applicationDeadline: '',
    experienceLevel: '',
    educationRequirements: '',
    workMode: '',
  };

  const [jobData, setJobData] = useState(initialJobData);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/recruiter/jobs", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert("Job posted successfully!");
      // Reset form fields after successful submission
      setJobData(initialJobData);
    } catch (error) {
      console.error("Post job failed:", error);
      alert(error.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div>
      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <label>Job Title</label>
        <input name="title" value={jobData.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={jobData.description} onChange={handleChange} required />

        <label>Location</label>
        <input name="location" value={jobData.location} onChange={handleChange} required />

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

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
