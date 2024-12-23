import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useProfile } from '../../hooks/useProfile';
import WorkersList from './components/WorkersList';
import { Spinner } from '../../components/ui/Spinner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile?.role || profile.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage workers and project assignments</p>
      </div>

      <Card>
        <WorkersList />
      </Card>
    </div>
  );
}