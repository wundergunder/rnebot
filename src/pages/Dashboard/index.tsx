import React from 'react';
import DashboardHeader from './components/DashboardHeader';
import ProjectsList from './components/ProjectsList';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { useCompanyCheck } from '../../hooks/useCompanyCheck';

export default function Dashboard() {
  const { profile, company, loading } = useCompanyCheck();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!company || !profile) {
    return null; // useCompanyCheck will handle the redirection
  }

  return (
    <div className="space-y-6">
      <DashboardHeader profile={profile} company={company} />
      <ProjectsList company={company} />
    </div>
  );
}