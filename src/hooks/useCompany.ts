import { useEffect, useState } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { Company } from '../types/database';
import { useProfile } from './useProfile';

export function useCompany() {
  const { profile } = useProfile();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      if (!profile?.company_id) {
        setLoading(false);
        return;
      }

      try {
        const data = await handleSupabaseError(
          supabase
            .from('companies')
            .select('*')
            .eq('id', profile.company_id)
            .single()
        );
        
        setCompany(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching company:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [profile?.company_id]);

  return { company, loading, error };
}