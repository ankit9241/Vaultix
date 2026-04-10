import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MainLayout from "./layouts/MainLayout";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import SectionDetails from "./pages/SectionDetails";
import Credentials from "./pages/Credentials";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <GoogleOAuthProvider clientId="727112219571-o69ulfv6erlsm152g0qhath629rb720p.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route
                        path="/projects/:projectId"
                        element={<ProjectDetails />}
                      />
                      <Route
                        path="/projects/:projectId/sections/:sectionId"
                        element={<SectionDetails />}
                      />
                      <Route path="/credentials" element={<Credentials />} />
                      <Route path="/notes" element={<Notes />} />
                      <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                      />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
