import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Building2, Briefcase } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRoleSelection = async (role: 'manager' | 'worker') => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);

      if (error) throw error;
      
      if (role === 'manager') {
        navigate('/onboarding');
      } else {
        navigate('/join-company');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to set role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to RNEbot!</h1>
        <p className="text-gray-400">Tell us how you'll be using RNEbot</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 text-center hover:border-cyan-500/50 transition-colors">
          <Building2 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">I'm Setting Up a Company</h2>
          <p className="text-gray-400 mb-6">
            Create a new company profile and manage your workforce scheduling
          </p>
          <Button 
            isLoading={isLoading} 
            className="w-full"
            onClick={() => handleRoleSelection('manager')}
          >
            Set Up Company
          </Button>
        </Card>

        <Card className="p-8 text-center hover:border-cyan-500/50 transition-colors">
          <Briefcase className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">I'm a Worker</h2>
          <p className="text-gray-400 mb-6">
            Join an existing company and manage your work schedule
          </p>
          <Button 
            isLoading={isLoading} 
            variant="secondary" 
            className="w-full"
            onClick={() => handleRoleSelection('worker')}
          >
            Create Worker Profile
          </Button>
        </Card>
      </div>
    </div>
  );
}