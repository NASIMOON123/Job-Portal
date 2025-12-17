
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

const ScheduleInterview = () => {
  const navigate = useNavigate();

  const [jobSeekers, setJobSeekers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    jobSeekerId: '',
    jobId: '',
    date: new Date(),
    platform: '',
    link: '',
    notes: '',
  });

  useEffect(() => {
    // Fetch job seekers who applied
    axios.get('/api/applications/jobseekers', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setJobSeekers(res.data.jobSeekers || res.data);
      })
      .catch(err => console.error('Error fetching job seekers', err));

    // Fetch recruiter's jobs
    axios.get('/api/recruiter/jobs', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setJobs(res.data))
      .catch(err => console.error('Error fetching jobs', err));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = date => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    if (new Date(formData.date) < twoHoursLater) {
      toast.warning('⏰ Interview must be scheduled at least 2 hours in the future.');
      return;
    }

    try {
      const response = await axios.post('/api/interviews/schedule', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`✅ ${response.data.message}`);
    } catch (error) {
      const msg = error.response?.data?.message || 'Error scheduling interview';
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <div className="schedule-interview-container">
      <h2>📅 Schedule Interview</h2>

      <form onSubmit={handleSubmit}>
        <label>Job Seeker:</label>
        <select name="jobSeekerId" value={formData.jobSeekerId} onChange={handleChange} required>
          <option value="">Select Job Seeker</option>
          {jobSeekers.map(js => (
            <option key={js._id} value={js._id}>{js.name}</option>
          ))}
        </select>

        <label>Job:</label>
        <select name="jobId" value={formData.jobId} onChange={handleChange} required>
          <option value="">Select Job</option>
          {jobs.map(job => (
            <option key={job._id} value={job._id}>{job.title}</option>
          ))}
        </select>

        <label>Date & Time:</label>
        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={new Date()}
        />

        <label>Platform:</label>
        <input type="text" name="platform" value={formData.platform} onChange={handleChange} required />

        <label>Meeting Link:</label>
        <input type="text" name="link" value={formData.link} onChange={handleChange} />

        <label>Notes:</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>

        <button type="submit" style={{ marginTop: '10px' }}>✅ Schedule</button>
      </form>

      <button
        onClick={() => navigate('/recruiter-dashboard/scheduled-interviews')}
        style={{ marginTop: '20px' }}
      >
        📖 View Scheduled Interviews
      </button>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ScheduleInterview;
