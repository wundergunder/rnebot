import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, UserPlus } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function SetupOptions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-8 text-center hover:border-cyan-500/50 transition-colors">
        <Building2 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Set Up New Company</h2>
        <p className="text-gray-400 mb-6">
          Create a new company profile and manage your workforce scheduling
        </p>
        <Button 
          className="w-full"
          onClick={() => navigate('/onboarding')}
        >
          Create Company
        </Button>
      </Card>

      <Card className="p-8 text-center hover:border-cyan-500/50 transition-colors">
        <UserPlus className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Join Existing Company</h2>
        <p className="text-gray-400 mb-6">
          Contact your company manager to be added to your organization
        </p>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => navigate('/join-company')}
        >
          Join Company
        </Button>
      </Card>
    </div>
  );
}