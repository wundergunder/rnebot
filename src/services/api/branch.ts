import { supabase } from '../../lib/supabase';
import { Branch } from '../../types/database';

export async function createBranch(data: {
  company_id: string;
  name: string;
  address: string;
  phone: string | null;
}) {
  const { data: branch, error } = await supabase
    .from('company_branches')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return branch;
}

export async function updateBranch(id: string, data: {
  name?: string;
  address?: string;
  phone?: string | null;
}) {
  const { data: branch, error } = await supabase
    .from('company_branches')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return branch;
}

export async function deleteBranch(id: string) {
  const { error } = await supabase
    .from('company_branches')
    .delete()
    .eq('id', id);

  if (error) throw error;
}