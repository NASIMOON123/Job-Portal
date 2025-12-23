

import React, { useEffect, useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaUserShield, FaSignOutAlt, FaChartBar } from 'react-icons/fa';
import './css/AdminDashboard.css';
import DashboardOverview from './DashboardOverview';
import ManageAdmins from './ManageAdmins';
import ManageUsers from './ManageUsers';
import ManageJobs from './ManageJobs';
import DashboardAnalytics from './DashboardAnalytics';

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/admin-login');
      return;
    }
    setAdminName(storedUser.name);
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/combined-login');
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav>
          <ul>
            <li onClick={closeSidebar}>
              <NavLink to="/admin-dashboard/overview" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaClipboardList /> Dashboard Overview
              </NavLink>
            </li>
            <li onClick={closeSidebar}>
              <NavLink to="/admin-dashboard/manage-admins" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaUserShield /> Manage Admins
              </NavLink>
            </li>
            <li onClick={closeSidebar}>
              <NavLink to="/admin-dashboard/manage-users" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaUsers /> Manage Users
              </NavLink>
            </li>
            <li onClick={closeSidebar}>
              <NavLink to="/admin-dashboard/manage-job-posts" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaClipboardList /> Manage Job Posts
              </NavLink>
            </li>
            <li onClick={closeSidebar}>
              <NavLink to="/admin-dashboard/analytics" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaChartBar /> Job Analytics
              </NavLink>
            </li>
         
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Main */}
      <main className="main-content">
        <header className="top-navbar">
          {/* <div className={`hamburger ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </div> */}

          <div>Welcome, <strong>{adminName}</strong></div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <div className="navbar-right">
    
    <div className={`hamburger ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
        </header>

        <section className="dashboard-content">
          <Routes>
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="manage-admins" element={<ManageAdmins />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-job-posts" element={<ManageJobs />} />
            <Route path="analytics" element={<DashboardAnalytics />} />
            <Route path="*" element={<DashboardOverview />} /> {/* fallback */}
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
