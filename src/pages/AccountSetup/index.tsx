import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { checkUserStatus } from '../../services/api/auth';
import { Spinner } from '../../components/ui/Spinner';
import SetupOptions from './components/SetupOptions';

export default function AccountSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      if (!user?.email) {
        navigate('/');
        return;
      }

      try {
        const { hasCompany } = await checkUserStatus(user.email);
        
        if (hasCompany) {
          navigate('/dashboard');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setLoading(false);
      }
    }

    checkStatus();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to RNEbot!</h1>
        <p className="text-gray-400">Choose how you want to get started</p>
      </div>

      <SetupOptions />
    </div>
  );
}