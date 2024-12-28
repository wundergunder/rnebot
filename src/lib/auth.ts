import { supabase } from './supabase';
import { Profile } from '../types/database';

/**
 * Fetches the current user's session from Supabase.
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error fetching session:', error.message);
    return null;
  }
  return data?.session;
}

/**
 * Fetches the current user's profile from Supabase.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const session = await getSession();
  if (!session?.user) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Determines the appropriate redirect path based on the user's profile state.
 */
export async function checkAuthRedirect(): Promise<string> {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    return '/account-setup';
  }

  if (!profile.company_id) {
    return profile.role === 'manager' ? '/onboarding' : '/join-company';
  }

  return '/dashboard';
}