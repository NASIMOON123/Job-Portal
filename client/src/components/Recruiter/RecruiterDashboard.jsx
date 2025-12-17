import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FaUserTie, FaPlusCircle, FaTasks, FaUsers, FaEdit, FaCalendarAlt, FaChartBar } from 'react-icons/fa';

import './css/RecruiterDashboard.css';

import RecruiterProfile from './RecruiterProfile';
import EditProfile from './EditProfile';
import PostJob from './PostJob';
import ManageJobs from './ManageJobs';
import EditJob from './EditJob';
import Applications from './Applications';
import SearchJobSeekers from './SearchJobSeekers';
import ScheduleInterview from './ScheduleInterview';
import ScheduledInterviews from './ScheduledInterviews';
import RecruiterAnalytics from './RecruiterAnalytics';

const RecruiterDashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/user-login');
      return;
    }
    setUserName(user.name);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/combined-login');
  };

  return (
    <div className="dashboard-wrapper">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Recruiter</h2>
        <button className="close-btn" onClick={() => {
  document.querySelector(".sidebar").classList.remove("open");
}}>
  ✖
</button>

        <nav>
          <ul>
            <li>
              <NavLink to="/recruiter-dashboard/profile" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                <FaUserTie /> Profile
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/edit-profile" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                <FaEdit /> Edit Profile
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/post-job" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                <FaPlusCircle /> Post Job
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/manage-jobs" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                <FaTasks /> Manage Jobs
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/applications" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                <FaUsers /> Applications
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/search-jobseekers" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                <FaUsers /> Search Job Seekers
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/schedule-interview" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                <FaCalendarAlt /> Schedule Interview
              </NavLink>
            </li>

            <li>
              <NavLink to="/recruiter-dashboard/analytics" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                <FaChartBar /> Recruiter Analytics
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="top-navbar">
        <button className="hamburger" onClick={() => {
  document.querySelector(".sidebar").classList.toggle("open");
}}>
  ☰
</button>

          <div>
            Welcome, <strong>{userName}</strong>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <section className="dashboard-content">
          <Routes>
            <Route path="/" element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<RecruiterProfile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="edit-job/:id" element={<EditJob />} />
            <Route path="applications" element={<Applications />} />
            <Route path="search-jobseekers" element={<SearchJobSeekers />} />
            <Route path="schedule-interview" element={<ScheduleInterview />} />
            <Route path="scheduled-interviews" element={<ScheduledInterviews />} />
            <Route path="analytics" element={<RecruiterAnalytics />} />
            <Route path="*" element={<Navigate to="profile" replace />} />
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default RecruiterDashboard;
