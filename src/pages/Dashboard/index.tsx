import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProfile } from '../../hooks/useProfile';
import { useCompany } from '../../hooks/useCompany';
import { Bot, Building2, UserCircle, Plus } from 'lucide-react';
import { Project } from '../../types/database';
import { supabase } from '../../lib/supabase';
import ProjectList from '../../components/projects/ProjectList';
import ProjectForm from '../../components/projects/ProjectForm';
import { Spinner } from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const { company, loading: companyLoading } = useCompany();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      if (!company?.id) return;

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setLoadingProjects(false);
      }
    }

    if (company?.id) {
      fetchProjects();
    } else {
      setLoadingProjects(false);
    }
  }, [company?.id]);

  if (profileLoading || companyLoading || loadingProjects) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to role selection if no role is set
  if (!profile?.role) {
    navigate('/role-selection');
    return null;
  }

  // Redirect to onboarding if no company is set
  if (!company) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Company Required</h2>
        <p className="text-gray-400 mb-6">
          {profile.role === 'manager' 
            ? "Let's set up your company to get started."
            : "Please contact your manager to be added to a company."}
        </p>
        {profile.role === 'manager' && (
          <Button onClick={() => navigate('/onboarding')}>
            Set Up Company
          </Button>
        )}
      </Card>
    );
  }

  const canManageProjects = profile.role === 'manager' || profile.role === 'admin';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <UserCircle className="w-8 h-8 text-cyan-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Your Profile</h3>
          <p className="text-gray-400 mb-4">
            {profile.full_name || 'Complete your profile'}
            <br />
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/profile')}
          >
            View Profile
          </Button>
        </Card>

        <Card>
          <Building2 className="w-8 h-8 text-cyan-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Company</h3>
          <p className="text-gray-400 mb-4">{company.name}</p>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          {canManageProjects && (
            <Button onClick={() => setShowProjectForm(!showProjectForm)}>
              <Plus className="w-4 h-4 mr-2" />
              {showProjectForm ? 'Hide Form' : 'Add Project'}
            </Button>
          )}
        </div>

        {showProjectForm && (
          <Card>
            <ProjectForm 
              companyId={company.id}
              onSuccess={() => {
                setShowProjectForm(false);
                window.location.reload();
              }}
            />
          </Card>
        )}

        <Card>
          <ProjectList projects={projects} />
        </Card>
      </div>
    </div>
  );
}