import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Home, Briefcase, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';

export default function Navigation() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">RNEbot.com</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-300 hover:text-white">
              <Home className="w-6 h-6" />
            </Link>
            <Link to="/projects" className="text-gray-300 hover:text-white">
              <Briefcase className="w-6 h-6" />
            </Link>
            {profile?.role === 'admin' && (
              <Link to="/admin" className="text-gray-300 hover:text-white">
                <Shield className="w-6 h-6" />
              </Link>
            )}
            <Link to="/profile" className="text-gray-300 hover:text-white">
              <User className="w-6 h-6" />
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}