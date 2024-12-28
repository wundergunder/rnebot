import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useLogout() {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error
  };
}