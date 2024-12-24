import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkAuthRedirect } from '../lib/auth';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function redirect() {
      const path = await checkAuthRedirect();
      navigate(path);
    }

    redirect();
  }, [user, navigate]);
}