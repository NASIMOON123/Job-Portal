
  import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#FFBB28', '#00C49F', '#FF8042']; // Pending, Accepted, Rejected

const JobSeekerAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token'); // get token from localStorage
        if (!token) {
          console.error('No token found');
          return;
        }

        const res = await axios.get(
          'http://localhost:5000/api/jobseeker/analytics',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!data) return <p>Loading...</p>;

  const pieData = [
    { name: 'Pending', value: data.pendingApplications },
    { name: 'Accepted', value: data.acceptedApplications },
    { name: 'Rejected', value: data.rejectedApplications },
  ];

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Job Seeker Analytics</h1>

      {/* Numbers */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <div style={cardStyle}>
          <h3>Total Jobs Present</h3>
          <p>{data.totalJobs}</p>
        </div>
        <div style={cardStyle}>
          <h3>Jobs Applied</h3>
          <p>{data.jobsApplied}</p>
        </div>
        <div style={cardStyle}>
          <h3>Pending Applications</h3>
          <p>{data.pendingApplications}</p>
        </div>
        <div style={cardStyle}>
          <h3>Accepted Applications</h3>
          <p>{data.acceptedApplications}</p>
        </div>
        <div style={cardStyle}>
          <h3>Rejected Applications</h3>
          <p>{data.rejectedApplications}</p>
        </div>
        <div style={cardStyle}>
          <h3>Total Job Seekers</h3>
          <p>{data.totalJobSeekers}</p>
        </div>
        <div style={cardStyle}>
          <h3>Total Recruiters</h3>
          <p>{data.totalRecruiters}</p>
        </div>
      </div>

      {/* Pie Chart Heading */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Application Tracking</h2>

      {/* Pie Chart */}
      <div style={{ width: '100%', maxWidth: '600px', height: '400px', margin: '0 auto' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const cardStyle = {
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '10px',
  minWidth: '200px',
  textAlign: 'center',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

export default JobSeekerAnalytics;
