import { supabase } from '../../lib/supabase';
import { Company } from '../../types/database';

export async function createCompany(data: Partial<Company>) {
  const { data: company, error } = await supabase
    .from('companies')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return company;
}

export async function updateCompany(id: string, data: Partial<Company>) {
  const { data: company, error } = await supabase
    .from('companies')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return company;
}

export async function getCompany(id: string) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}