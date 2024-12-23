import React, { useState } from 'react';
import { Profile } from '../../../types/database';
import { Select } from '../../../components/ui/Select';
import { expertiseLevels, formatExpertiseLevel } from '../../../utils/expertise';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface ExpertiseSelectProps {
  worker: Profile;
}

export default function ExpertiseSelect({ worker }: ExpertiseSelectProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExpertiseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = e.target.value;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ expertise_level: newLevel })
        .eq('id', worker.id);

      if (error) throw error;
      toast.success('Expertise level updated');
    } catch (error) {
      console.error('Error updating expertise:', error);
      toast.error('Failed to update expertise level');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        Expertise Level
      </label>
      <Select
        value={worker.expertise_level || ''}
        onChange={handleExpertiseChange}
        disabled={isLoading}
      >
        <option value="">Select Level</option>
        {expertiseLevels.map((level) => (
          <option key={level} value={level}>
            {formatExpertiseLevel(level)}
          </option>
        ))}
      </Select>
    </div>
  );
}