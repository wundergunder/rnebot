import React from 'react';
import { Card } from '../../components/ui/Card';
import { Bot, Building2, Mail, ArrowRight } from 'lucide-react';

export default function JoinCompany() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Join Your Company</h1>
        <p className="text-gray-400">Follow these steps to get started with RNEbot</p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-cyan-500/10 rounded-lg p-3">
              <Building2 className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">1. Contact Your Manager</h2>
              <p className="text-gray-400">
                Let your manager know that you've created an RNEbot account and need to be added to your company's workspace.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-cyan-500/10 rounded-lg p-3">
              <Mail className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">2. Wait for Access</h2>
              <p className="text-gray-400">
                Your manager will add you to the company. You'll receive an email notification when access is granted.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-cyan-500/10 rounded-lg p-3">
              <ArrowRight className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">3. Get Started</h2>
              <p className="text-gray-400">
                Once added, you'll have access to your work schedule, project assignments, and more through the RNEbot platform.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center text-gray-400">
          <p>Need help? Contact support at support@rnebot.com</p>
        </div>
      </div>
    </div>
  );
}