import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useProfile } from '../hooks/useProfile';
import { useCompany } from '../hooks/useCompany';
import { Bot, Building2, UserCircle } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const { company, loading: companyLoading } = useCompany();

  if (profileLoading || companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="max-w-md mx-auto text-center">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to RNEbot!</h2>
        <p className="text-gray-400 mb-6">Let's set up your profile to get started.</p>
        <Button onClick={() => navigate('/profile')}>
          Set Up Profile
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <UserCircle className="w-8 h-8 text-cyan-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Your Profile</h3>
          <p className="text-gray-400 mb-4">
            {profile.full_name}
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

        {company && (
          <Card>
            <Building2 className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Company</h3>
            <p className="text-gray-400 mb-4">{company.name}</p>
            {profile.role === 'manager' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/projects')}
              >
                Manage Projects
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}