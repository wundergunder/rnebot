import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkUserStatus } from '../services/api/auth';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function handleRedirect() {
      if (!user?.email) return;

      try {
        const { hasCompany } = await checkUserStatus(user.email);
        
        if (hasCompany) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Auth redirect error:', error);
        navigate('/onboarding');
      }
    }

    handleRedirect();
  }, [user, navigate]);
}