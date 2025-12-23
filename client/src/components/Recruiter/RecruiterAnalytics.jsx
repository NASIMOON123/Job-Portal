
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import API from '../../api/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './css/RecruiterAnalytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const RecruiterAnalytics = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    applicationStatus: {},
    jobsByApplicants: [],
    jobsPosted: 0,
    scheduledInterviews: 0,
    totalUsers: 0,
    totalRecruiters: 0,
    totalJobsPosted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await API.get(`/api/recruiter/analytics/${user._id}`);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch recruiter analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  const applicationStatusData = {
    labels: ['Pending', 'Accepted', 'Rejected'],
    datasets: [
      {
        label: 'Applications',
        data: [
          stats.applicationStatus.pending || 0,
          stats.applicationStatus.accepted || 0,
          stats.applicationStatus.rejected || 0,
        ],
        backgroundColor: ['#fbbf24', '#10b981', '#ef4444'],
      },
    ],
  };

  const jobsByApplicantsData = {
    labels: stats.jobsByApplicants.map(job => job.title),
    datasets: [
      {
        label: 'No. of Applicants',
        data: stats.jobsByApplicants.map(job => job.count),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  return (
    <div className="recruiter-analytics">
      <h3>Recruiter Analytics</h3>

      <div className="stats-cards">
        <div className="card">
          <h4>Total Applications</h4>
          <p>{stats.totalApplications}</p>
        </div>
        <div className="card">
          <h4>Pending</h4>
          <p>{stats.applicationStatus.pending || 0}</p>
        </div>
        <div className="card">
          <h4>Accepted</h4>
          <p>{stats.applicationStatus.accepted || 0}</p>
        </div>
        <div className="card">
          <h4>Rejected</h4>
          <p>{stats.applicationStatus.rejected || 0}</p>
        </div>
        <div className="card">
          <h4>Jobs Posted</h4>
          <p>{stats.jobsPosted}</p>
        </div>
        <div className="card">
          <h4>Scheduled Interviews</h4>
          <p>{stats.scheduledInterviews}</p>
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
          <h4>Total Jobs Posted</h4>
          <p>{stats.totalJobsPosted}</p>
        </div>
      </div>

      <div className="pie-chart-container" style={{ width: '250px', height: '250px', margin: '0 auto' }}>
        <h4>Applications by Status</h4>
        <Pie data={applicationStatusData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
      <br></br><br></br>
      <div className="chart-card">
        <h4>Jobs with Most Applicants</h4>
        <Bar data={jobsByApplicantsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
};

export default RecruiterAnalytics;
