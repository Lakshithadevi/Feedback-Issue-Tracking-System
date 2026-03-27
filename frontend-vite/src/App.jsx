import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ForgotPasswordPage from "./pages/forgotPasswordPage";
import Onboarding from "./pages/Onboarding";
import AdminDashboard from "./pages/AdminDashboard";

function App() {

  const isConfigured = localStorage.getItem("config");

  return (
    <Router>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
<Route path="/create" element={<Dashboard />} />
<Route path="/my-issues" element={<Dashboard />} />
<Route path="/reports" element={<Dashboard />} />


<Route
  path="/admin"
  element={
    localStorage.getItem("role") === "admin"
      ? <AdminDashboard />
      : <Navigate to="/" />
  }
/>
        {/* ONBOARDING */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* DASHBOARD PROTECTED */}
        <Route
          path="/dashboard"
          element={
            isConfigured ? <Dashboard /> : <Navigate to="/onboarding" />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;