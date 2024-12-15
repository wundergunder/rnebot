import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .single();

        if (error) throw error;
        setCompany(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [profile?.company_id]);

  return { company, loading, error };
}