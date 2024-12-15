import React from 'react';
import { useProfile } from '../../hooks/useProfile';
import { Card } from '../../components/ui/Card';
import ProfileForm from './components/ProfileForm';
import SkillsList from './components/SkillsList';
import ExpertiseSection from './components/ExpertiseSection';
import { Bot } from 'lucide-react';

export default function WorkerProfile() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Worker Profile</h1>
        <p className="text-gray-400">Manage your profile and skills</p>
      </div>

      <Card>
        <ProfileForm initialData={profile} />
      </Card>

      <Card>
        <ExpertiseSection profile={profile} />
      </Card>

      <Card>
        <SkillsList profile={profile} />
      </Card>
    </div>
  );
}