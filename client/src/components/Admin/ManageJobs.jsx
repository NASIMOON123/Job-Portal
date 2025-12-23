
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/ManageJobs.css"; // Import CSS
import API from "../../api/api";
const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/api/admin/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/api/admin/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);
  };

  const closeModal = () => {
    setEditingJob(null);
  };

  const handleEditChange = (e) => {
    setEditingJob({ ...editingJob, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      await API.put(
        `/api/admin/jobs/${editingJob._id}`,
        editingJob
      );
      fetchJobs();
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const viewApplicants = async (job) => {
    setSelectedJob(job);
    try {
      const res = await API.get(
        `/api/admin/jobs/${job._id}/applications`
      );
      setApplicants(res.data); // list of applications with populated jobSeekerId
      setShowApplicantsModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase()) ||
      j.recruiterId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-jobs-container">
      <h2 className="manage-jobs-title">Manage Job Posts</h2>
      <input
        type="text"
        placeholder="Search by title, recruiter, location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="manage-jobs-search"
      />

      <div className="jobs-grid">
        {filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3 className="job-title">{job.title}</h3>
            <p>
              <strong>Recruiter:</strong> {job.recruiterId?.name || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {job.location || "N/A"}
            </p>
           <p>
  <strong>No. of Applicants:</strong> {job.applicantCount || 0}
</p>


            <div className="job-actions">
              <button className="edit-btn" onClick={() => openEditModal(job)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => deleteJob(job._id)}>
                Delete
              </button>
              <button
                className="view-btn"
                onClick={() => viewApplicants(job)}
              >
                View Applicants
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingJob && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <h3>Edit Job</h3>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={editingJob.title}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={editingJob.location || ""}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={editingJob.description || ""}
                onChange={handleEditChange}
              />
            </label>

            <div className="modal-actions">
              <button className="save-btn" onClick={saveEdit}>
                Save
              </button>
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    
      {showApplicantsModal && selectedJob && (
  <div className="modal-overlay">
    <div className="modal applicants-modal">
      <button
        className="modal-close"
        onClick={() => setShowApplicantsModal(false)}
      >
        &times;
      </button>
      <h3 className="modal-title">Applicants for {selectedJob.title}</h3>

      {applicants.length === 0 ? (
        <p className="no-applicants">No applicants yet.</p>
      ) : (
        <div className="applicants-grid">
          {applicants.map((app) => (
            <div key={app._id} className="applicant-card">
              <p><strong>Name:</strong> {app.jobSeekerId?.name}</p>
              <p><strong>Email:</strong> {app.jobSeekerId?.email}</p>
              <p><strong>Phone:</strong> {app.jobSeekerId?.phone}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${app.status?.toLowerCase()}`}>
                  {app.status || "Pending"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      <button
        className="cancel-btn mt-3"
        onClick={() => setShowApplicantsModal(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ManageJobs;
