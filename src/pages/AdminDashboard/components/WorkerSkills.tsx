import React, { useState, useEffect } from 'react';
import { Profile, Skill } from '../../../types/database';
import { supabase } from '../../../lib/supabase';
import { Spinner } from '../../../components/ui/Spinner';
import toast from 'react-hot-toast';

interface WorkerSkillsProps {
  worker: Profile;
}

export default function WorkerSkills({ worker }: WorkerSkillsProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const [skillsResponse, userSkillsResponse] = await Promise.all([
          supabase.from('skills').select('*'),
          supabase.from('profile_skills')
            .select('skill_id')
            .eq('profile_id', worker.id)
        ]);

        if (skillsResponse.error) throw skillsResponse.error;
        if (userSkillsResponse.error) throw userSkillsResponse.error;

        setSkills(skillsResponse.data || []);
        setUserSkills(userSkillsResponse.data.map(ps => ps.skill_id));
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills');
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [worker.id]);

  const toggleSkill = async (skillId: string) => {
    try {
      if (userSkills.includes(skillId)) {
        // Remove skill
        await supabase
          .from('profile_skills')
          .delete()
          .eq('profile_id', worker.id)
          .eq('skill_id', skillId);

        setUserSkills(prev => prev.filter(id => id !== skillId));
        toast.success('Skill removed');
      } else {
        // Add skill
        await supabase
          .from('profile_skills')
          .insert({ profile_id: worker.id, skill_id: skillId });

        setUserSkills(prev => [...prev, skillId]);
        toast.success('Skill added');
      }
    } catch (error) {
      console.error('Error toggling skill:', error);
      toast.error('Failed to update skill');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-white">Skills & Certifications</h4>
      <div className="grid grid-cols-2 gap-2">
        {skills.map((skill) => (
          <button
            key={skill.id}
            onClick={() => toggleSkill(skill.id)}
            className={`
              p-2 rounded text-sm text-left transition-colors
              ${userSkills.includes(skill.id)
                ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span>{skill.name}</span>
              {userSkills.includes(skill.id) && (
                <span className="text-xs">✓</span>
              )}
            </div>
            {skill.requires_license && (
              <span className="text-xs text-yellow-500 block mt-1">
                License Required
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}