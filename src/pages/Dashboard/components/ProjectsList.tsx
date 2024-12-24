import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Plus } from 'lucide-react';
import { Company, Project } from '../../../types/database';
import { supabase } from '../../../lib/supabase';
import ProjectList from '../../../components/projects/ProjectList';
import ProjectForm from '../../../components/projects/ProjectForm';
import { Spinner } from '../../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { useProfile } from '../../../hooks/useProfile';

interface ProjectsListProps {
  company: Company | null;
}

export default function ProjectsList({ company }: ProjectsListProps) {
  const { profile } = useProfile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
        setLoading(false);
      }
    }

    fetchProjects();
  }, [company?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  const canManageProjects = profile?.role === 'manager' || profile?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        {canManageProjects && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? 'Hide Form' : 'Add Project'}
          </Button>
        )}
      </div>

      {showForm && company && (
        <Card>
          <ProjectForm
            companyId={company.id}
            onSuccess={() => {
              setShowForm(false);
              window.location.reload();
            }}
          />
        </Card>
      )}

      <Card>
        <ProjectList projects={projects} />
      </Card>
    </div>
  );
}