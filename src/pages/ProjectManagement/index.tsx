import React from 'react';
import { useCompany } from '../../hooks/useCompany';
import { Card } from '../../components/ui/Card';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import { Bot } from 'lucide-react';

export default function ProjectManagement() {
  const { company, loading } = useCompany();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">No Company Found</h2>
        <p className="text-gray-400">
          Please complete the company onboarding process first.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Project Management</h1>
        <p className="text-gray-400">Manage your company's projects and assignments</p>
      </div>

      <Card>
        <ProjectForm company={company} />
      </Card>

      <Card>
        <ProjectList company={company} />
      </Card>
    </div>
  );
}