import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './useProfile';
import { useCompany } from './useCompany';

export function useCompanyCheck() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile();
  const { company, loading: companyLoading } = useCompany();

  useEffect(() => {
    if (profileLoading || companyLoading) return;

    // If no role is set, redirect to role selection
    if (!profile?.role) {
      navigate('/role-selection');
      return;
    }

    // If no company is set, redirect to appropriate page
    if (!company) {
      if (profile.role === 'manager') {
        navigate('/onboarding');
      } else if (profile.role === 'worker') {
        navigate('/join-company');
      }
    }
  }, [profile, company, profileLoading, companyLoading, navigate]);

  return {
    profile,
    company,
    loading: profileLoading || companyLoading,
  };
}