import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { Bot } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate('/role-selection');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#06b6d4',
                  brandAccent: '#0891b2',
                }
              }
            }
          }}
          providers={['google']}
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