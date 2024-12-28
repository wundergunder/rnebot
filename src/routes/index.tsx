import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import AccountSetup from '../pages/AccountSetup';
import JoinCompany from '../pages/JoinCompany';
import CompanyOnboarding from '../pages/CompanyOnboarding';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account-setup" element={<AccountSetup />} />
        <Route path="/join-company" element={<JoinCompany />} />
        <Route path="/onboarding" element={<CompanyOnboarding />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}