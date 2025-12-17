import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FaUser, FaBriefcase, FaFolderOpen, FaUpload , FaSave, FaChartBar } from 'react-icons/fa';

import ViewJobs from './ViewJobs';
import SavedJobs from './SavedJobs';
import AppliedJobs from './AppliedJobs';
import UploadDocuments from './UploadDocuments';
import JobSeekerProfile from './JobSeekerProfile';
import EditJobSeekerProfile from './EditJobSeekerprofile';
import RecommendedJobs from './RecommendedJobs';
import SkillAssessment from './SkillAssessment';
import JobSeekerAnalytics from './JobSeekerAnalytics';
import './css/JobSeekerDashboard.css'; // Adjust if needed
// Dummy page components (replace with your real components / API calls)
const ProfileSummary = () => (
  <div>
    <h3>Profile Summary</h3>
    <p>Display user's profile details here.</p>
  </div>
);
// const viewJobs = () =>( <div><h2>View Jobs Page</h2><p>Display jobs.</p></div>);
const savedJobs = () => <h2>Saved Jobs Page</h2>;
const recommendedJobs = () => (
  <div>
    <h3>Recommended Jobs</h3>
    <p>List of recommended jobs will appear here.</p>
  </div>
);
const appliedJobs = () => (
  <div>
    <h3>Applied Jobs</h3>
    <p>Jobs the user has applied to will appear here.</p>
  </div>
);
const UploadResume = () => (
  <div>
    <h3>Upload Resume</h3>
    <p>Resume upload form goes here.</p>
  </div>
);


const JobSeekerDashboard = () => {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null); // store full user, not just name
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/user-login');
      return;
    }
    setUserName(user.name);
    setUser(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/combined-login');
  };

  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Apply theme to body
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkTheme]);
  
  // Toggle function
  const toggleTheme = () => setIsDarkTheme(prev => !prev);
  

  return (
    <div className="dashboard-wrapper">
        <div
    className={`overlay ${isSidebarOpen ? 'active' : ''}`}
    onClick={toggleSidebar}
  ></div>
     <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

        <h2 className="sidebar-title">JobSeeker</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/jobseeker-dashboard/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaUser /> Profile Summary
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobseeker-dashboard/view-jobs" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaBriefcase /> View Jobs
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobseeker-dashboard/saved-jobs" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaSave /> Saved Jobs
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobseeker-dashboard/recommended-jobs" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaBriefcase /> Recommended Jobs
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobseeker-dashboard/applied-jobs" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaFolderOpen /> Applied Jobs
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobseeker-dashboard/upload-resume" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FaUpload /> Upload Resume
              </NavLink>
            </li>
            <li>
  <NavLink to="/jobseeker-dashboard/skill-assessment" className={({ isActive }) => (isActive ? 'active' : '')}>
    🧠 Skill Assessment
  </NavLink>
</li>
<li>
  <NavLink
    to="/jobseeker-dashboard/analytics"
    className={({ isActive }) => (isActive ? 'active' : '')}
  >
    <FaChartBar /> Analytics
  </NavLink>
</li>





          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-navbar">
        <div className="left-section">
    <div className={`hamburger ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
      <span></span>
      <span></span>
      <span></span>
    </div>
    </div>
          <div>Welcome, <strong>{userName}</strong></div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <section className="dashboard-content">
          <Routes>
            <Route path="/" element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<JobSeekerProfile />} />
            <Route path="edit-profile" element={<EditJobSeekerProfile />} />
            <Route path="view-jobs" element={<ViewJobs />} />
            <Route path="saved-jobs" element={<SavedJobs />} />
            <Route path="recommended-jobs" element={<RecommendedJobs />} />
            <Route path="applied-jobs" element={<AppliedJobs />} />
            <Route path="upload-resume" element={<UploadDocuments />} />

            {/* <Route path="skill-assessment" element={<SkillAssessment />} /> */}
            <Route path="skill-assessment" element={<SkillAssessment user={user} />} />
            <Route path="analytics" element={<JobSeekerAnalytics user={user} />} />

            {/* Add more routes/pages here */}
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;
