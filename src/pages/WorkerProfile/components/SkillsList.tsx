import React, { useState, useEffect } from 'react';
import { Profile, Skill } from '../../../types/database';
import { Spinner } from '../../../components/ui/Spinner';
import { Input } from '../../../components/ui/Input';
import { FileUpload } from '../../../components/ui/FileUpload';
import { supabase } from '../../../lib/supabase';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserSkill {
  skill_id: string;
  license_number?: string;
  license_expiry_date?: string;
  license_image_path?: string;
}

interface SkillsListProps {
  profile: Profile | null;
}

export default function SkillsList({ profile }: SkillsListProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingSkills, setUpdatingSkills] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchSkills() {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        // Get all skills that require licenses
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .eq('requires_license', true)
          .order('name');

        if (skillsError) throw skillsError;

        // Get user's skills
        const { data: userSkillsData, error: userSkillsError } = await supabase
          .from('profile_skills')
          .select('skill_id, license_number, license_expiry_date, license_image_path')
          .eq('profile_id', profile.id);

        if (userSkillsError) throw userSkillsError;

        setSkills(skillsData || []);
        setUserSkills(userSkillsData || []);
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to load skills');
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [profile?.id]);

  const handleLicenseUpdate = async (skillId: string, data: { license_number?: string; license_expiry_date?: string }) => {
    setUpdatingSkills(prev => new Set(prev).add(skillId));

    try {
      const existingSkill = userSkills.find(s => s.skill_id === skillId);
      const updatedData = {
        ...data,
        profile_id: profile?.id,
        skill_id: skillId
      };

      const { error } = existingSkill
        ? await supabase
            .from('profile_skills')
            .update(data)
            .eq('profile_id', profile?.id)
            .eq('skill_id', skillId)
        : await supabase
            .from('profile_skills')
            .insert([updatedData]);

      if (error) throw error;

      // Update local state
      setUserSkills(prev => {
        const index = prev.findIndex(s => s.skill_id === skillId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...data };
          return updated;
        } else {
          return [...prev, { skill_id: skillId, ...data }];
        }
      });

      toast.success('License details updated');
    } catch (error) {
      console.error('Error updating license details:', error);
      toast.error('Failed to update license details');
    } finally {
      setUpdatingSkills(prev => {
        const next = new Set(prev);
        next.delete(skillId);
        return next;
      });
    }
  };

  const handleFileUpload = async (skillId: string, file: File) => {
    setUpdatingSkills(prev => new Set(prev).add(skillId));

    try {
      const filePath = `${profile?.id}/${skillId}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('license_images')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profile_skills')
        .upsert({
          profile_id: profile?.id,
          skill_id: skillId,
          license_image_path: filePath
        });

      if (updateError) throw updateError;

      setUserSkills(prev => {
        const index = prev.findIndex(s => s.skill_id === skillId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], license_image_path: filePath };
          return updated;
        } else {
          return [...prev, { skill_id: skillId, license_image_path: filePath }];
        }
      });

      toast.success('License image uploaded');
    } catch (error) {
      console.error('Error uploading license image:', error);
      toast.error('Failed to upload license image');
    } finally {
      setUpdatingSkills(prev => {
        const next = new Set(prev);
        next.delete(skillId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Skills & Licenses</h3>
      
      {skills.map((skill) => {
        const userSkill = userSkills.find(us => us.skill_id === skill.id);
        const isUpdating = updatingSkills.has(skill.id);
        const hasSkill = !!userSkill?.license_number;

        return (
          <div
            key={skill.id}
            className="p-4 rounded-lg bg-gray-800 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-white">{skill.name}</h4>
                {hasSkill ? (
                  <span className="flex items-center gap-1 text-sm text-green-500">
                    <Check className="w-4 h-4" />
                    Licensed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-red-500">
                    <X className="w-4 h-4" />
                    Not Licensed
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="License Number"
                value={userSkill?.license_number || ''}
                onChange={(e) => handleLicenseUpdate(skill.id, { 
                  ...userSkill,
                  license_number: e.target.value 
                })}
                placeholder="Enter license number"
                disabled={isUpdating}
              />

              <Input
                type="date"
                label="License Expiry"
                value={userSkill?.license_expiry_date || ''}
                onChange={(e) => handleLicenseUpdate(skill.id, {
                  ...userSkill,
                  license_expiry_date: e.target.value
                })}
                disabled={isUpdating}
              />

              <FileUpload
                label="Upload License Image"
                onFileSelect={(file) => handleFileUpload(skill.id, file)}
                accept="image/*"
                maxSize={5}
                disabled={isUpdating}
              />

              {userSkill?.license_image_path && (
                <div className="mt-2">
                  <a
                    href={`${supabase.storage.from('license_images').getPublicUrl(userSkill.license_image_path).data.publicUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-400 hover:underline"
                  >
                    View License Image
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}