import React from 'react';
import { Project } from '../../types/database';
import { Card } from '../ui/Card';
import ProjectStageIndicator from './ProjectStageIndicator';
import { Clock, Wrench, MapPin, Calendar } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="hover:border-cyan-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Work Order #{project.work_order}</div>
              <h3 className="text-lg font-medium text-white">{project.client_name}</h3>
            </div>
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${project.project_type === 'shop' ? 'bg-blue-500/20 text-blue-400' :
                project.project_type === 'site' ? 'bg-green-500/20 text-green-400' :
                'bg-purple-500/20 text-purple-400'}
            `}>
              {project.project_type.charAt(0).toUpperCase() + project.project_type.slice(1)}
            </span>
          </div>

          <ProjectStageIndicator stage={project.stage} />

          <div className="mt-4 space-y-3">
            <p className="text-gray-300 text-sm">{project.description}</p>

            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {project.expected_hours ? `${project.expected_hours} hours` : 'Ongoing'}
              </span>
            </div>

            {project.tools_needed?.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-400">
                  <Wrench className="w-4 h-4" />
                  <span className="text-sm">Tools needed:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tools_needed.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-1 rounded-full bg-gray-700 text-gray-300 text-xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.project_type === 'site' && project.address && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{project.address}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}