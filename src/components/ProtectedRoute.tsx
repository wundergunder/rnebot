import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Spinner } from './ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user } = useAuth();
  const { profile, loading } = useProfile();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to role selection if no role is set
  if (!profile?.role) {
    return <Navigate to="/role-selection" replace />;
  }

  // Redirect to appropriate page if no company is set
  if (!profile.company_id) {
    if (profile.role === 'manager') {
      return <Navigate to="/onboarding" replace />;
    }
    if (profile.role === 'worker') {
      return <Navigate to="/join-company" replace />;
    }
  }

  // Admin only routes check
  if (adminOnly && profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}