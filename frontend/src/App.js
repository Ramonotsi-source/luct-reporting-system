import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/Protectedroute';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentReports from './pages/student/StudentReports';

// Lecturer
import LecturerReports from './pages/lecturer/LecturerReports';
import ReportForm from './pages/lecturer/ReportForm';
import LecturerDashboard from './pages/lecturer/LecturerDashboard';

// PRL
import PRLDashboard from './pages/prl/PRLDashboard';
import PRLReports from './pages/prl/PRLReports';

// PL
import PLDashboard from './pages/pl/PLDashboard';
import PLCourseForm from './pages/pl/PLCourseForm';
import PLReports from './pages/pl/PLReports';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student Routes */}
        <Route path="/student/*" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Routes>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="reports" element={<StudentReports />} />
              <Route index element={<Navigate to="dashboard" />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Lecturer Routes */}
        <Route path="/lecturer/*" element={
          <ProtectedRoute allowedRoles={['lecturer']}>
            <Routes>
              <Route path="dashboard" element={<LecturerDashboard />} />
              <Route path="report/new" element={<ReportForm />} />
              <Route path="reports" element={<LecturerReports />} />
              <Route index element={<Navigate to="dashboard" />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* PRL Routes */}
        <Route path="/prl/*" element={
          <ProtectedRoute allowedRoles={['prl']}>
            <Routes>
              <Route path="dashboard" element={<PRLDashboard />} />
              <Route path="reports" element={<PRLReports />} />
              <Route index element={<Navigate to="dashboard" />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* PL Routes */}
        <Route path="/pl/*" element={
          <ProtectedRoute allowedRoles={['pl']}>
            <Routes>
              <Route path="dashboard" element={<PLDashboard />} />
              <Route path="course/add" element={<PLCourseForm />} />
              <Route path="reports" element={<PLReports />} />
              <Route index element={<Navigate to="dashboard" />} />
            </Routes>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}