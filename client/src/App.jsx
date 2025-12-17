import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './components/Home/HomePage';
import './App.css';
import { Outlet } from 'react-router-dom'; // add if needed
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './components/Authentication/AdminLogin';
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './components/Admin/AdminDashboard';
import RecruiterDashboard from './components/Recruiter/RecruiterDashboard';
import JobSeekerDashboard from './components/JobSeeker/JobSeekerDashboard';
import CombinedLogin from './components/Authentication/combinedLogin';
import ForgotPassword  from './components/Authentication/ForgotPassword';
import Chatbot from './components/Home/Chatbot';



const App = () => {
  return (
    <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Chatbot floating component */}
     

    <Routes>
  
      <Route path="/" element={<HomePage />} />
     

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/user-login" element={<Login />} />
      <Route path="/register" element={<Register />} />   
      <Route path="/combined-login" element={<CombinedLogin/>} />
      
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
        <Route path="/recruiter-dashboard/*" element={<RecruiterDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['jobseeker']} />}>
        <Route path="/jobseeker-dashboard/*" element={<JobSeekerDashboard />} />
      </Route>
        
     

    </Routes>
     <Chatbot />
  </Router>
  );
};

export default App;
