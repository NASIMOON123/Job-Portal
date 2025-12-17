import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const ScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // track which interview is being edited
  const [editData, setEditData] = useState({ date: '', platform: '', link: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/interviews/scheduled', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setInterviews(res.data);
    } catch (error) {
      toast.error('❌ Failed to fetch scheduled interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return;

    try {
      await axios.delete(`/api/interviews/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('✅ Interview deleted');
      fetchInterviews();
    } catch {
      toast.error('❌ Failed to delete interview');
    }
  };

  const startEditing = (intv) => {
    setEditingId(intv._id);
    setEditData({
      date: new Date(intv.date).toISOString().slice(0,16), // for input type="datetime-local"
      platform: intv.platform || '',
      link: intv.link || '',
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ date: '', platform: '', link: '' });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitEdit = async (id) => {
    try {
      await axios.put(`/api/interviews/${id}`, {
        date: new Date(editData.date),
        platform: editData.platform,
        link: editData.link,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('✅ Interview updated');
      cancelEditing();
      fetchInterviews();
    } catch {
      toast.error('❌ Failed to update interview');
    }
  };

  return (
    <div>
      <h2>📋 Scheduled Interviews</h2>
      <button onClick={() => navigate('/recruiter-dashboard/schedule-interview')} style={{ marginBottom: '20px' }}>
        🔙 Back to Schedule Interview
      </button>

      {loading ? (
        <p>Loading interviews...</p>
      ) : interviews.length === 0 ? (
        <p>No interviews scheduled.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {interviews.map((intv) => (
            <li key={intv._id} style={{ 
              marginBottom: '20px', 
              border: '1px solid #ccc', 
              padding: '15px', 
              borderRadius: '8px', 
              backgroundColor: '#f9f9f9' 
            }}>
              <p><strong>Job:</strong> {intv.jobTitle}</p>
              <p><strong>Candidate:</strong> {intv.jobSeekerName}</p>

              {editingId === intv._id ? (
                <>
                  <label>
                    <strong>Date & Time:</strong><br />
                    <input 
                      type="datetime-local" 
                      name="date" 
                      value={editData.date} 
                      onChange={handleEditChange} 
                    />
                  </label>
                  <br />
                  <label>
                    <strong>Platform:</strong><br />
                    <input 
                      type="text" 
                      name="platform" 
                      value={editData.platform} 
                      onChange={handleEditChange} 
                    />
                  </label>
                  <br />
                  <label>
                    <strong>Meeting Link:</strong><br />
                    <input 
                      type="text" 
                      name="link" 
                      value={editData.link} 
                      onChange={handleEditChange} 
                    />
                  </label>
                  <br />
                  <button onClick={() => submitEdit(intv._id)}>💾 Save</button>
                  <button onClick={cancelEditing} style={{ marginLeft: '10px' }}>✖ Cancel</button>
                </>
              ) : (
                <>
                  <p><strong>Date:</strong> {new Date(intv.date).toLocaleString()}</p>
                  <p><strong>Platform:</strong> {intv.platform}</p>
                  <p><strong>Meeting Link:</strong> {intv.link ? <a href={intv.link} target="_blank" rel="noopener noreferrer">{intv.link}</a> : 'N/A'}</p>
                  <p><strong>Notes:</strong> {intv.notes}</p>

                  <button onClick={() => startEditing(intv)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(intv._id)} style={{ marginLeft: '10px', color: 'red' }}>🗑️ Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ScheduledInterviews;
