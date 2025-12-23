// DashboardAnalytics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./css/DashboardAnalytics.css";
import API from "../api/api";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardAnalytics = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    applicationStatus: {},
    jobsByApplicants: [],
    newUsers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get(
          "/api/admin/analytics"
        );
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading Analytics...</div>;

  // Prepare data for charts
  const applicationStatusData = {
    labels: ["Pending", "Accepted", "Rejected"],
    datasets: [
      {
        label: "Applications",
        data: [
          stats.applicationStatus.pending || 0,
          stats.applicationStatus.accepted || 0,
          stats.applicationStatus.rejected || 0,
        ],
        backgroundColor: ["#fbbf24", "#10b981", "#ef4444"],
      },
    ],
  };

  const jobsByApplicantsData = {
    labels: stats.jobsByApplicants.map((job) => job.title),
    datasets: [
      {
        label: "No. of Applicants",
        data: stats.jobsByApplicants.map((job) => job.count),
        backgroundColor: "#3b82f6",
      },
    ],
  };
const jobsByApplicantsOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true, // numeric scale starting from 0
      ticks: { precision: 0 }, // no decimals
    },
    x: {
      ticks: { autoSkip: false }, // show all labels
    },
  },
};

  const newUsersData = {
    labels: stats.newUsers.map((u) => u.date),
    datasets: [
      {
        label: "New Users",
        data: stats.newUsers.map((u) => u.count),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.3,
      },
    ],
  };
const newUsersOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  elements: {
    point: { radius: 0 }, // remove points
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
    x: {
      ticks: { autoSkip: true },
    },
  },
};

  return (
    <div className="dashboard-analytics">
      <h3>Dashboard Analytics</h3>
      <div className="stats-cards">
        <div className="card">
          <h4>Total Job Applications</h4>
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
      </div>

     <div className="chart-card">
  <h4>Applications by Status</h4>
  <div className="pie-chart-container">
    <Pie data={applicationStatusData} options={{ responsive: true, maintainAspectRatio: false }} />
  </div>

        <div className="chart-card">
          <h4>Jobs with Most Applicants</h4>
          {/* <Bar data={jobsByApplicantsData} /> */}
          <Bar data={jobsByApplicantsData} options={jobsByApplicantsOptions} />

        </div>

        <div className="chart-card">
          <h4>New Users Over Time</h4>
          {/* <Line data={newUsersData} /> */}
          <Line data={newUsersData} options={newUsersOptions} />

        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
