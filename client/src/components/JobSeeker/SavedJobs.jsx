
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/SavedJobs.css'; // We'll create this file next
import ApplyModal from './ApplyModal'; 

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
const [selectedJobId, setSelectedJobId] = useState(null);
const [selectedJobTitle, setSelectedJobTitle] = useState(null);
const [appliedJobIds, setAppliedJobIds] = useState([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/jobseeker/saved', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobs(res.data);
      } catch (err) {
        setError('Failed to fetch saved jobs');
        console.error(err);
      }
    };
    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/jobseeker/applied', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appliedIds = res.data.map(item => item.job._id);
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error('Failed to fetch applied jobs:', err);
      }
    };
    

    fetchSavedJobs();
    fetchAppliedJobs();
  }, []);
 
  const unsaveJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/jobseeker/unsave',
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      alert('Failed to unsave job');
    }
  };
  const openApplyModal = (jobId) => {
    setSelectedJobId(jobId);
    const job = savedJobs.find(j => j._id === jobId);
    setSelectedJobTitle(job ? job.title : null);
    setShowApplyModal(true);
  };
  
  const closeApplyModal = () => {
    setSelectedJobId(null);
    setSelectedJobTitle(null);
    setShowApplyModal(false);
  };
  
  const toggleExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  if (error) return <p className="error-msg">{error}</p>;

  if (savedJobs.length === 0) return <p className="empty-msg">You have no saved jobs.</p>;


  return (
    <div className="saved-jobs-container">
      <h2>Saved Jobs</h2>
  
      {/* ✅ Add this wrapper */}
      <div className="jobs-grid">
        {savedJobs.map((job) => (
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
              </div>
            )}
  
            <button className="view-more-btn" onClick={() => toggleExpand(job._id)}>
              {expandedJobId === job._id ? 'View Less' : 'View More'}
            </button>
  
            <button
              className="apply-btn"
              disabled={job.status === 'Expired' || appliedJobIds.includes(job._id)}
              onClick={() => openApplyModal(job._id)}
              style={{ marginLeft: '10px' }}
            >
              {appliedJobIds.includes(job._id)
                ? 'Applied'
                : job.status === 'Expired'
                ? 'Closed'
                : 'Apply Now'}
            </button>
  
            <button className="unsave-btn" onClick={() => unsaveJob(job._id)}>
              Unsave
            </button>
          </div>
        ))}
      </div>
  
      {showApplyModal && (
        <ApplyModal
          jobId={selectedJobId}
          jobTitle={selectedJobTitle}
          isOpen={showApplyModal}
          onClose={closeApplyModal}
          onApplySuccess={() => {
            setAppliedJobIds((prev) => [...prev, selectedJobId]);
            // re-fetch applied jobs if needed
          }}
        />
      )}
    </div>
  );
  
  
};

export default SavedJobs;
