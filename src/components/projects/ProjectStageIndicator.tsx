import React from 'react';
import { ProjectStage } from '../../types/database';
import { CheckCircle2, Clock, Package, Calendar, Hammer } from 'lucide-react';

interface ProjectStageIndicatorProps {
  stage: ProjectStage;
}

const stages: { stage: ProjectStage; label: string; icon: React.ReactNode }[] = [
  { stage: 'estimate', label: 'Estimate', icon: <Clock className="w-4 h-4" /> },
  { stage: 'parts_ordered', label: 'Parts Ordered', icon: <Package className="w-4 h-4" /> },
  { stage: 'appointment_booked', label: 'Booked', icon: <Calendar className="w-4 h-4" /> },
  { stage: 'onsite', label: 'Onsite', icon: <Hammer className="w-4 h-4" /> },
  { stage: 'complete', label: 'Complete', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function ProjectStageIndicator({ stage }: ProjectStageIndicatorProps) {
  const currentStageIndex = stages.findIndex(s => s.stage === stage);

  return (
    <div className="flex items-center justify-between w-full">
      {stages.map((s, index) => {
        const isComplete = index <= currentStageIndex;
        const isCurrent = index === currentStageIndex;

        return (
          <div
            key={s.stage}
            className={`flex flex-col items-center ${
              index < stages.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div className="relative flex items-center justify-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${isComplete ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'}
                  ${isCurrent ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-gray-900' : ''}
                `}
              >
                {s.icon}
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`
                    absolute left-1/2 w-full h-0.5
                    ${isComplete ? 'bg-cyan-500' : 'bg-gray-700'}
                  `}
                />
              )}
            </div>
            <span
              className={`
                mt-2 text-xs
                ${isComplete ? 'text-cyan-500' : 'text-gray-400'}
              `}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}