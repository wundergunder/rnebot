import { supabase } from '../../lib/supabase';

export async function checkEmailInCompany(email: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('company_id, role')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error checking email:', err);
    return null;
  }
}