import React from 'react';
import { Profile, Project } from '../../../types/database';
import { Card } from '../../../components/ui/Card';
import { UserCircle, MapPin, Calendar } from 'lucide-react';
import { formatDateTime } from '../../../utils/formatDate';

interface WorkerCardProps {
  worker: Profile & { projects: Project[] };
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const currentProjects = worker.projects.filter(project => 
    new Date(project.end_time) >= new Date()
  );

  return (
    <Card className="hover:border-cyan-500/50 transition-colors">
      <div className="flex items-start gap-4">
        <UserCircle className="w-12 h-12 text-cyan-400 flex-shrink-0" />
        <div className="flex-grow">
          <h3 className="text-lg font-medium text-white">
            {worker.full_name || 'Unnamed Worker'}
          </h3>
          <p className="text-gray-400 text-sm">{worker.email}</p>
          {worker.expertise_level && (
            <span className="inline-block mt-1 px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full">
              {worker.expertise_level}
            </span>
          )}
        </div>
      </div>

      {currentProjects.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-white mb-2">Current Projects</h4>
          <div className="space-y-3">
            {currentProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-gray-800 rounded-lg p-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-white font-medium">{project.project_name}</h5>
                    <p className="text-gray-400 text-sm">{project.client_name}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {project.location_type === 'field' ? project.address : 'Shop'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateTime(project.start_time)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}