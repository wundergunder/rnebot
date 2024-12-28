import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../lib/supabase';
import { Bot } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { authTheme } from '../utils/authTheme';
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
          appearance={authTheme}
          providers={[]}
          redirectTo={`${window.location.origin}/account-setup`}
        />
      </Card>
    </div>
  );
}