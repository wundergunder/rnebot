import React from 'react';
import { Building2, Briefcase } from 'lucide-react';
import { Bot } from 'lucide-react';
import RoleCard from './components/RoleCard';
import { useRoleSelection } from '../../hooks/useRoleSelection';

export default function RoleSelection() {
  const { isLoading, handleRoleSelection } = useRoleSelection();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to RNEbot!</h1>
        <p className="text-gray-400">Tell us how you'll be using RNEbot</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RoleCard
          icon={Building2}
          title="I'm Setting Up a Company"
          description="Create a new company profile and manage your workforce scheduling"
          buttonText="Set Up Company"
          onClick={() => handleRoleSelection('manager')}
          isLoading={isLoading}
        />

        <RoleCard
          icon={Briefcase}
          title="I'm a Worker"
          description="Join an existing company and manage your work schedule"
          buttonText="Create Worker Profile"
          onClick={() => handleRoleSelection('worker')}
          isLoading={isLoading}
          variant="secondary"
        />
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 italic">
          "I'll be back... with your perfect schedule!" - Arnie
        </p>
      </div>
    </div>
  );
}