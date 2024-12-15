import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Branch } from '../types/database';

export function useBranches(companyId: string | null) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBranches() {
      if (!companyId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('company_branches')
          .select('*')
          .eq('company_id', companyId)
          .order('name');

        if (error) throw error;
        setBranches(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching branches:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBranches();
  }, [companyId]);

  return { branches, loading, error };
}