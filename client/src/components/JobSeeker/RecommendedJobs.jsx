import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/ViewJobs.css'; // reuse styles if suitable
import ApplyModal from './ApplyModal';
import API from '../../api/api';
const RecommendedJobs = () => {
  const [filters, setFilters] = useState({});
  const [jobs, setJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [error, setError] = useState('');
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);

  // Filter jobs based on filters state
  const filteredJobs = jobs.filter((job) => {
    const {
      keyword = '',
      location = '',
      jobType = '',
      minSalary = '',
      maxSalary = '',
      experienceLevel = ''
    } = filters;

    const matchesKeyword = keyword === '' || job.title.toLowerCase().includes(keyword.toLowerCase());
    const matchesLocation = location === '' || job.location.toLowerCase().includes(location.toLowerCase());
    const matchesJobType = jobType === '' || job.type.toLowerCase() === jobType.toLowerCase();
    const jobSalary = parseInt(job.salary?.split('-')[0]); // Lower range of salary
    const matchesSalary = (!minSalary || jobSalary >= parseInt(minSalary)) &&
                          (!maxSalary || jobSalary <= parseInt(maxSalary));
    const matchesExperience = experienceLevel === '' || job.experienceLevel?.toLowerCase() === experienceLevel.toLowerCase();

    return matchesKeyword && matchesLocation && matchesJobType && matchesSalary && matchesExperience;
  });

  // Fetch recommended jobs from your backend API
  const fetchRecommendedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/jobseeker/recommended-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch recommended jobs:', err);
      setError('Failed to fetch recommended jobs');
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/jobseeker/saved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobIds(res.data.map(job => job._id));
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/jobseeker/applied', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appliedIds = res.data.map(item => item.job._id);
      setAppliedJobIds(appliedIds);
    } catch (err) {
      console.error('Failed to fetch applied jobs:', err);
    }
  };

  const saveJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await API.post('/api/jobseeker/save', { jobId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobIds(prev => [...prev, jobId]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save job');
    }
  };

  const unsaveJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await API.post('/api/jobseeker/unsave', { jobId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedJobIds(prev => prev.filter(id => id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unsave job');
    }
  };

  const toggleSaveJob = (jobId) => {
    if (savedJobIds.includes(jobId)) {
      unsaveJob(jobId);
    } else {
      saveJob(jobId);
    }
  };

  const openApplyModal = (jobId) => {
    setSelectedJobId(jobId);
    const job = jobs.find(j => j._id === jobId);
    setSelectedJobTitle(job ? job.title : '');
    setShowApplyModal(true);
  };

  const closeApplyModal = () => {
    setSelectedJobId(null);
    setSelectedJobTitle(null);
    setShowApplyModal(false);
  };

  const handleApplySuccess = () => {
    setAppliedJobIds(prev => [...prev, selectedJobId]);
    fetchAppliedJobs();
    closeApplyModal();
  };

  useEffect(() => {
    fetchRecommendedJobs();
    fetchSavedJobs();
    fetchAppliedJobs();
  }, []);

  const toggleExpand = (id) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="view-jobs-container">
      <h2>Recommended Jobs For You</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by title or keyword"
          value={filters.keyword || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
        />
        <select
          value={filters.jobType || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
        >
          <option value="">All Job Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>
        <input
          type="text"
          placeholder="Experience Level"
          value={filters.experienceLevel || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Min Salary"
          value={filters.minSalary || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, minSalary: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Max Salary"
          value={filters.maxSalary || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, maxSalary: e.target.value }))}
        />
        <button
          className="clear-btn"
          onClick={() =>
            setFilters({
              keyword: '',
              location: '',
              jobType: '',
              minSalary: '',
              maxSalary: '',
              experienceLevel: ''
            })
          }
        >
          Clear Filters
        </button>
      </div>

      <div className="jobs-grid">
        {filteredJobs.length === 0 && <p>No recommended jobs found.</p>}

        {filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> ₹{job.salary}</p>
            <p><strong>Type:</strong> {job.type}</p>
            <p><strong>Status:</strong> {job.status === 'Expired' ? '❌ Expired' : '✅ Open'}</p>

            {expandedJobId === job._id && (
              <>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Skills Required:</strong> {job.skills?.join(', ')}</p>
                <p><strong>Openings:</strong> {job.openings}</p>
                <p><strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
                <p><strong>Education:</strong> {job.educationRequirements}</p>
                <p><strong>Work Mode:</strong> {job.workMode}</p>
                <p><strong>Posted by:</strong> {job.recruiterId?.name} ({job.recruiterId?.email})</p>
              </>
            )}

            <button className="view-more-btn" onClick={() => toggleExpand(job._id)}>
              {expandedJobId === job._id ? 'View Less' : 'View More'}
            </button>

            <button
              className="apply-btn"
              disabled={job.status === 'Expired' || appliedJobIds.includes(job._id)}
              onClick={() => openApplyModal(job._id)}
              style={{ marginLeft: '2px' }}
            >
              {appliedJobIds.includes(job._id)
                ? 'Applied'
                : job.status === 'Expired'
                ? 'Closed'
                : 'Apply Now'}
            </button>

            <button
              className="apply-btn"
              onClick={() => toggleSaveJob(job._id)}
            >
              {savedJobIds.includes(job._id) ? 'Unsave' : 'Save'}
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
          onApplySuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default RecommendedJobs;
