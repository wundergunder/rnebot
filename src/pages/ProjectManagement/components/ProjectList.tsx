import React, { useEffect, useState } from 'react';
import { Company, Project } from '../../../types/database';
import { getCompanyProjects } from '../../../services/api';
import { formatDateTime } from '../../../utils/formatDate';
import { Card } from '../../../components/ui/Card';
import { MapPin, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProjectListProps {
  company: Company;
}

export default function ProjectList({ company }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getCompanyProjects(company.id);
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [company.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No projects found. Create your first project above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Current Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:border-cyan-500/50 transition-colors">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white">{project.project_name}</h3>
                <p className="text-gray-400">{project.client_name}</p>
              </div>

              <div className="flex items-start gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {project.location_type === 'field' ? project.address : 'Shop'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDateTime(project.start_time)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <h4 className="text-sm font-medium text-white mb-2">Worker Requirements</h4>
                {/* Add worker requirements list here */}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}