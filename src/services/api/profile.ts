import { supabase } from '../../lib/supabase';
import { Profile } from '../../types/database';

export async function updateProfile(id: string, data: Partial<Profile>) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .upsert([{ id, ...data }])
    .select()
    .single();

  if (error) throw error;
  return profile;
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}