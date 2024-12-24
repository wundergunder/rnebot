import React from 'react';
import { Card } from '../components/ui/Card';
import { Bot, Building2 } from 'lucide-react';

export default function JoinCompany() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Join a Company</h1>
        <p className="text-gray-400">Contact your manager to be added to a company</p>
      </div>

      <Card className="p-6 text-center">
        <Building2 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-4">Company Required</h2>
        <p className="text-gray-400">
          You need to be part of a company to use RNEbot. Please contact your manager
          to be added to your company's workspace.
        </p>
      </Card>
    </div>
  );
}