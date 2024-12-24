import { supabase } from '../../lib/supabase';
import { Company } from '../../types/database';

export async function createCompany(data: Partial<Company>) {
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(`Failed to create company: ${error.message}`);
    return company;
  } catch (err) {
    throw new Error(err.message || 'An unexpected error occurred');
  }
}

export async function updateCompany(id: string, data: Partial<Company>) {
  try {
    const { data: company, error } = await supabase
      .from('companies')
      .update(data)
      .eq('id', id)
      .single();

    if (error) throw new Error(`Failed to update company: ${error.message}`);
    return company;
  } catch (err) {
    throw new Error(err.message || 'An unexpected error occurred');
  }
}
