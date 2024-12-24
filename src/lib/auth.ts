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

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }

  return data;
}

/**
 * Determines the appropriate redirect path based on the user's profile state.
 */
export async function checkAuthRedirect(): Promise<string> {
  const profile = await getCurrentProfile();

  // If no profile exists, redirect to signup
  if (!profile) {
    return '/signup';
  }

  // If role is not set, redirect to role selection
  if (!profile.role) {
    return '/role-selection';
  }

  // If no company is linked, determine the path based on role
  if (!profile.company_id) {
    return profile.role === 'manager' ? '/onboarding' : '/join-company';
  }

  // If all conditions are satisfied, redirect to dashboard
  return '/dashboard';
}

/**
 * Logs the user out by clearing the session.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error during sign out:', error.message);
    throw new Error('Failed to sign out');
  }
}
