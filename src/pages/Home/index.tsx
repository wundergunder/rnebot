import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../../lib/supabase';
import { Bot } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { authTheme } from '../../utils/authTheme';

export default function Home() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Bot className="w-24 h-24 text-cyan-400" />
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

      <div className="mt-8 text-center">
        <p className="text-gray-400 italic">
          "I'll be back... with your perfect schedule!" - Arnie
        </p>
      </div>
    </div>
  );
}