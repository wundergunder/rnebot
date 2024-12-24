import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { Bot } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

export default function Login() {
  useAuthRedirect();

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
                  inputText: 'white',
                  inputBackground: '#374151',
                  inputBorder: '#4B5563',
                  inputLabelText: '#E5E7EB',
                  inputPlaceholder: '#9CA3AF'
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full',
              input: 'rounded-md bg-gray-700 border-gray-600 text-white',
              label: 'text-gray-300',
            }
          }}
          providers={['google']}
          redirectTo={`${window.location.origin}/role-selection`}
        />
      </Card>
    </div>
  );
}