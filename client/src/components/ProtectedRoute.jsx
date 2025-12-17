import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    // Not logged in
    return <Navigate to="/user-login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not allowed
    return <Navigate to="/user-login" replace />;
  }
  
  // Authorized, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
