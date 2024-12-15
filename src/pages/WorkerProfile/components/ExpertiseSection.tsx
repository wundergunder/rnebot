import React from 'react';
import { Profile } from '../../../types/database';
import { Button } from '../../../components/ui/Button';
import { expertiseLevels, formatExpertiseLevel } from '../../../utils/expertise';
import { updateProfile } from '../../../services/api';
import toast from 'react-hot-toast';

interface ExpertiseSectionProps {
  profile: Profile | null;
}

export default function ExpertiseSection({ profile }: ExpertiseSectionProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedLevel, setSelectedLevel] = React.useState(profile?.expertise_level || null);

  const handleExpertiseUpdate = async (level: string) => {
    if (!profile?.id) return;

    setIsLoading(true);
    try {
      await updateProfile(profile.id, { expertise_level: level });
      setSelectedLevel(level);
      toast.success('Expertise level updated!');
    } catch (error) {
      toast.error('Failed to update expertise level');
      console.error('Error updating expertise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Expertise Level</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expertiseLevels.map((level) => (
          <Button
            key={level}
            variant={selectedLevel === level ? 'primary' : 'secondary'}
            onClick={() => handleExpertiseUpdate(level)}
            disabled={isLoading}
            className="justify-start"
          >
            {formatExpertiseLevel(level)}
          </Button>
        ))}
      </div>
    </div>
  );
}