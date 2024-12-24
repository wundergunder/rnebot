import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { UserCircle, Building2 } from 'lucide-react';
import { Profile, Company } from '../../../types/database';

interface DashboardHeaderProps {
  profile: Profile | null;
  company: Company | null;
}

export default function DashboardHeader({ profile, company }: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <UserCircle className="w-8 h-8 text-cyan-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Your Profile</h3>
        <p className="text-gray-400 mb-4">
          {profile?.full_name || 'Complete your profile'}
          <br />
          {profile?.role.charAt(0).toUpperCase() + profile?.role.slice(1)}
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
          {(profile?.role === 'manager' || profile?.role === 'admin') && (
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
  );
}