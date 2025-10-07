import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Protectedroute({ children, allowedRoles }) {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" replace />;
  
  try {
    const user = JSON.parse(userStr);
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (e) {
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
}