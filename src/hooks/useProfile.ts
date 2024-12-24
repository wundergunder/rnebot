import { useEffect, useState } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { Profile } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await handleSupabaseError(
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
        );
        
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.id]);

  return { profile, loading, error };
}