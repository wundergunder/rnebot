import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useCompany } from '../../hooks/useCompany';
import ProjectList from '../../components/projects/ProjectList';
import ProjectForm from '../../components/projects/ProjectForm';
import { Spinner } from '../../components/ui/Spinner';

export default function ProjectManagement() {
  const navigate = useNavigate();
  const { company, loading } = useCompany();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
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

      <div className="flex justify-end">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Hide Form' : 'Add Project'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <ProjectForm 
            companyId={company.id} 
            onSuccess={() => setShowForm(false)}
          />
        </Card>
      )}

      <Card>
        <ProjectList company={company} />
      </Card>
    </div>
  );
}