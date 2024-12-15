import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import { Bot } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {!isAuthPage && <Navigation />}
      <main className="container mx-auto px-4 py-8">
        {isAuthPage && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <Bot className="w-12 h-12 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white">RNEbot.com</h1>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}