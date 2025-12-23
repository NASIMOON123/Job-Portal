import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ManageAdmins.css';
import API from "../api/api";
const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const res = await API.get("/api/admin/all");
      setAdmins(res.data);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open modal for adding new admin
  const handleAdd = () => {
    setEditingAdmin(null);
    setFormData({ name: '', email: '', phone: '', password: '' });
    setShowModal(true);
  };

  // Open modal for editing admin
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ name: admin.name, email: admin.email, phone: admin.phone, password: '' });
    setShowModal(true);
  };

  // Delete admin
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await API.delete(`/api/admin/${id}`);
        fetchAdmins();
      } catch (err) {
        console.error('Failed to delete admin:', err);
      }
    }
  };

  // Submit add/edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await API.put(`/api/admin/${editingAdmin._id}`, formData);
      } else {
        await API.post('/api/admin/register', formData);
      }
      setShowModal(false);
      fetchAdmins();
    } catch (err) {
      console.error('Failed to save admin:', err);
      alert(err.response?.data?.message || 'Error saving admin');
    }
  };

  return (
    <div className="manage-admins">
      <div className="header">
        <h2>Manage Admins</h2>
        <button className="add-btn" onClick={handleAdd}>Add Admin</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {admins.map((admin) => (
    <tr key={admin._id}>
      <td>{admin.name}</td>
      <td>{admin.email}</td>
      <td>
        {admin.email === 'admin@gmail.com' ? '—' : admin.phone}
      </td>
      <td>
        {admin.email === 'admin@gmail.com' ? (
          <span className="super-admin-label">Super Admin</span>
        ) : (
          <>
            <button className="edit-btn" onClick={() => handleEdit(admin)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDelete(admin._id)}>Delete</button>
          </>
        )}
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingAdmin ? 'Edit Admin' : 'Add Admin'}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
              {!editingAdmin && <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />}
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
