


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ManageUsers.css';
import API from "../../api/api";

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState('jobSeekers');
  const [jobSeekers, setJobSeekers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const [seekersRes, recruitersRes] = await Promise.all([
        API.get("/api/admin/jobseekers", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        
        API.get("/api/admin/recruiters", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      // Directly use DB values
      setJobSeekers(seekersRes.data);
      setRecruiters(recruitersRes.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // View profile modal
  const handleViewProfile = async (user, role) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/api/admin/${role}/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUser(res.data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (userId, role, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/api/admin/${role}/${userId}/status`,
        { active: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update frontend state immediately
      if (role === "jobseekers") {
        setJobSeekers(prev => prev.map(u => u._id === userId ? { ...u, active: !currentStatus } : u));
      } else if (role === "recruiters") {
        setRecruiters(prev => prev.map(u => u._id === userId ? { ...u, active: !currentStatus } : u));
      }

    } catch (err) {
      console.error('Failed to update user status', err);
    }
  };

  // Render table rows
  const renderRows = (users, role) => (
    users.map((u, index) => (
      <tr key={u._id}>
        <td>{index + 1}</td>
        <td>{u.name}</td>
        <td>{u.email}</td>
        <td>{u.phone}</td>
        <td>{u.active ? "Active" : "Disabled"}</td>
        <td>
          <button onClick={() => handleViewProfile(u, role)}>View Profile</button>
          <button onClick={() => toggleUserStatus(u._id, role, u.active)}>
            {u.active ? "Disable" : "Enable"}
          </button>
        </td>
      </tr>
    ))
  );

  return (
    <div className="manage-users">
      <div className="tabs">
        <button className={activeTab === 'jobSeekers' ? 'active' : ''} onClick={() => setActiveTab('jobSeekers')}>
          Job Seekers
        </button>
        <button className={activeTab === 'recruiters' ? 'active' : ''} onClick={() => setActiveTab('recruiters')}>
          Recruiters
        </button>
      </div>

      {activeTab === 'jobSeekers' && (
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderRows(jobSeekers, 'jobseekers')}
          </tbody>
        </table>
      )}

      {activeTab === 'recruiters' && (
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderRows(recruiters, 'recruiters')}
          </tbody>
        </table>
      )}

      {/* Profile modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>User Profile</h3>
            {Object.entries(selectedUser).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value?.toString()}
              </p>
            ))}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
