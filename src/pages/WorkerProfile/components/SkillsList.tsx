import React from 'react';
import { Profile, Skill } from '../../../types/database';
import { Spinner } from '../../../components/ui/Spinner';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface SkillsListProps {
  profile: Profile | null;
}

export default function SkillsList({ profile }: SkillsListProps) {
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [userSkills, setUserSkills] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchSkills() {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        const [skillsResponse, userSkillsResponse] = await Promise.all([
          supabase.from('skills').select('*'),
          supabase.from('profile_skills')
            .select('skill_id')
            .eq('profile_id', profile.id)
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
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Skills & Licenses</h2>
      
      {skills.length === 0 ? (
        <p className="text-gray-400">No skills have been defined yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`p-4 rounded-lg border ${
                userSkills.includes(skill.id)
                  ? 'bg-cyan-500/10 border-cyan-500/50'
                  : 'bg-gray-800 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">{skill.name}</h3>
                  {skill.requires_license && (
                    <span className="text-xs text-yellow-500">
                      License Required
                    </span>
                  )}
                </div>
                {userSkills.includes(skill.id) && (
                  <span className="text-cyan-400 text-sm">✓ Certified</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}