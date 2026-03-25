import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import SectionDetails from './pages/SectionDetails';
import Credentials from './pages/Credentials';
import Notes from './pages/Notes';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:projectId" element={<ProjectDetails />} />
                  <Route path="/projects/:projectId/sections/:sectionId" element={<SectionDetails />} />
                  <Route path="/credentials" element={<Credentials />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/settings" element={<div>Settings Page</div>} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
