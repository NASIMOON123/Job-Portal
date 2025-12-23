import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/DashboardOverview.css';
import API from "../../api/api";
const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalUsers: 0,
    totalRecruiters: 0,
    totalJobPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/api/admin/stats");
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-overview">
      <h3>Dashboard Overview</h3>
      <div className="stats-cards">
        <div className="card">
          <h4>Total Admins</h4>
          <p>{stats.totalAdmins}</p>
        </div>
        <div className="card">
          <h4>Total JobSeekers</h4>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="card">
          <h4>Total Recruiters</h4>
          <p>{stats.totalRecruiters}</p>
        </div>
        <div className="card">
          <h4>Total Job Posts</h4>
          <p>{stats.totalJobPosts}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
