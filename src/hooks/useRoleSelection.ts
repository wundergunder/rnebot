import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function useRoleSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async (role: 'manager' | 'worker') => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);

      if (error) throw error;
      
      if (role === 'manager') {
        navigate('/onboarding');
      } else {
        navigate('/join-company');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to set role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRoleSelection
  };
}