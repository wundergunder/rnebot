import React, { useState } from 'react';
import { Profile, Project } from '../../../types/database';
import { Card } from '../../../components/ui/Card';
import { UserCircle, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDateTime } from '../../../utils/formatDate';
import ExpertiseSelect from './ExpertiseSelect';
import WorkerSkills from './WorkerSkills';

interface WorkerCardProps {
  worker: Profile & { projects: Project[] };
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentProjects = worker.projects.filter(project => 
    new Date(project.end_time) >= new Date()
  );

  return (
    <Card className="hover:border-cyan-500/50 transition-colors">
      <div 
        className="flex items-start gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <UserCircle className="w-12 h-12 text-cyan-400 flex-shrink-0" />
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-white">
                {worker.full_name || 'Unnamed Worker'}
              </h3>
              <p className="text-gray-400 text-sm">{worker.email}</p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-6">
          <ExpertiseSelect worker={worker} />
          <WorkerSkills worker={worker} />
        </div>
      )}

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