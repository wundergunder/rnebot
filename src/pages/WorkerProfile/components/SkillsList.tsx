import React from 'react';
import { Profile, Skill } from '../../../types/database';
import { Button } from '../../../components/ui/Button';
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
      if (!profile?.company_id) return;

      try {
        // Fetch company skills
        const { data: companySkills, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .eq('company_id', profile.company_id);

        if (skillsError) throw skillsError;
        setSkills(companySkills);

        // Fetch user's skills
        const { data: profileSkills, error: profileSkillsError } = await supabase
          .from('profile_skills')
          .select('skill_id')
          .eq('profile_id', profile.id);

        if (profileSkillsError) throw profileSkillsError;
        setUserSkills(profileSkills.map((ps) => ps.skill_id));
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills');
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [profile]);

  const toggleSkill = async (skillId: string) => {
    if (!profile?.id) return;

    try {
      if (userSkills.includes(skillId)) {
        // Remove skill
        await supabase
          .from('profile_skills')
          .delete()
          .eq('profile_id', profile.id)
          .eq('skill_id', skillId);

        setUserSkills((prev) => prev.filter((id) => id !== skillId));
      } else {
        // Add skill
        await supabase
          .from('profile_skills')
          .insert({ profile_id: profile.id, skill_id: skillId });

        setUserSkills((prev) => [...prev, skillId]);
      }
    } catch (error) {
      console.error('Error toggling skill:', error);
      toast.error('Failed to update skills');
    }
  };

  if (loading) {
    return <div>Loading skills...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white mb-4">Skills & Licenses</h2>
      
      {skills.length === 0 ? (
        <p className="text-gray-400">No skills have been defined for your company yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <Button
              key={skill.id}
              variant={userSkills.includes(skill.id) ? 'primary' : 'secondary'}
              onClick={() => toggleSkill(skill.id)}
              className="justify-start"
            >
              {skill.name}
              {skill.requires_license && (
                <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-0.5 rounded">
                  License Required
                </span>
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}