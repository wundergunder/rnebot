import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { Bot } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useProfile } from '../hooks/useProfile';

export default function Home() {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Let the profile check handle navigation
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // If user is already logged in and has a role, redirect to dashboard
  useEffect(() => {
    if (!loading && profile?.role) {
      navigate('/dashboard');
    }
  }, [loading, profile, navigate]);

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Bot className="w-24 h-24 text-cyan-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome to RNEbot
        </h2>
        <p className="text-gray-400">
          Your AI-powered workforce scheduling assistant
        </p>
      </div>

      <Card>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#06b6d4',
                  brandAccent: '#0891b2',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full',
              input: 'rounded-md bg-gray-700 border-gray-600',
              label: 'text-gray-300',
            }
          }}
          providers={['google']}
          redirectTo={`${window.location.origin}/dashboard`}
        />
      </Card>

      <div className="mt-8 text-center">
        <p className="text-gray-400 italic">
          "I'll be back... with your perfect schedule!" - Arnie
        </p>
      </div>
    </div>
  );
}