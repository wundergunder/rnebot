import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProfile } from '../../hooks/useProfile';
import { useCompany } from '../../hooks/useCompany';
import { Bot, Building2, UserCircle } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const { company, loading: companyLoading } = useCompany();

  // Show loading state while checking profile
  if (profileLoading || companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // If no role is set, redirect to role selection
  if (!profile?.role) {
    navigate('/role-selection');
    return null;
  }

  // If manager without company, redirect to onboarding
  if (profile.role === 'manager' && !company) {
    navigate('/onboarding');
    return null;
  }

  // If worker without complete profile, redirect to profile setup
  if (profile.role === 'worker' && !profile.full_name) {
    navigate('/profile');
    return null;
  }

  return (
    <div className="space-y-6">
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