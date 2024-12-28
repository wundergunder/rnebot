import { supabase } from '../../lib/supabase';
import { Profile } from '../../types/database';

export async function checkUserStatus(email: string): Promise<{
  hasCompany: boolean;
  profile: Profile | null;
}> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;

    return {
      hasCompany: !!profile?.company_id,
      profile
    };
  } catch (err) {
    console.error('Error checking user status:', err);
    return { hasCompany: false, profile: null };
  }
}