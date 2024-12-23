import React, { useState, useEffect } from 'react';
import { Profile, Skill } from '../../../types/database';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { FileUpload } from '../../../components/ui/FileUpload';
import { supabase } from '../../../lib/supabase';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface WorkerSkillsProps {
  worker: Profile;
}

interface UserSkill {
  skill_id: string;
  license_number?: string;
  license_expiry_date?: string;
  license_image_path?: string;
}

interface LicenseForm {
  license_number: string;
  license_expiry_date: string;
}

export default function WorkerSkills({ worker }: WorkerSkillsProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingSkills, setUpdatingSkills] = useState<Set<string>>(new Set());
  const [licenseForms, setLicenseForms] = useState<Record<string, LicenseForm>>({});

  useEffect(() => {
    fetchSkills();
  }, [worker.id]);

  const fetchSkills = async () => {
    try {
      const [skillsResponse, userSkillsResponse] = await Promise.all([
        supabase.from('skills').select('*').order('name'),
        supabase
          .from('profile_skills')
          .select('skill_id, license_number, license_expiry_date, license_image_path')
          .eq('profile_id', worker.id)
      ]);

      if (skillsResponse.error) throw skillsResponse.error;
      if (userSkillsResponse.error) throw userSkillsResponse.error;

      setSkills(skillsResponse.data || []);
      setUserSkills(userSkillsResponse.data || []);

      // Initialize license forms with existing data
      const forms: Record<string, LicenseForm> = {};
      userSkillsResponse.data?.forEach(skill => {
        forms[skill.skill_id] = {
          license_number: skill.license_number || '',
          license_expiry_date: skill.license_expiry_date || ''
        };
      });
      setLicenseForms(forms);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (skillId: string, field: keyof LicenseForm, value: string) => {
    setLicenseForms(prev => ({
      ...prev,
      [skillId]: {
        ...(prev[skillId] || { license_number: '', license_expiry_date: '' }),
        [field]: value
      }
    }));
  };

  const handleSubmitLicense = async (skillId: string) => {
    const form = licenseForms[skillId];
    if (!form?.license_number || !form?.license_expiry_date) {
      toast.error('Please fill in all license details');
      return;
    }

    setUpdatingSkills(prev => new Set(prev).add(skillId));

    try {
      const { error } = await supabase
        .from('profile_skills')
        .upsert({
          profile_id: worker.id,
          skill_id: skillId,
          license_number: form.license_number,
          license_expiry_date: form.license_expiry_date
        });

      if (error) throw error;

      // Update local state
      setUserSkills(prev => {
        const index = prev.findIndex(s => s.skill_id === skillId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...form };
          return updated;
        } else {
          return [...prev, { skill_id: skillId, ...form }];
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
      const filePath = `${worker.id}/${skillId}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('license_images')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profile_skills')
        .upsert({
          profile_id: worker.id,
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const isLicenseComplete = (skillId: string) => {
    const userSkill = userSkills.find(us => us.skill_id === skillId);
    return !!(userSkill?.license_number && userSkill?.license_expiry_date);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Skills & Licenses</h3>
      
      {skills.map((skill) => {
        const userSkill = userSkills.find(us => us.skill_id === skill.id);
        const isUpdating = updatingSkills.has(skill.id);
        const hasLicense = isLicenseComplete(skill.id);
        const form = licenseForms[skill.id] || { license_number: '', license_expiry_date: '' };

        return (
          <div
            key={skill.id}
            className="p-4 rounded-lg bg-gray-800 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-white">{skill.name}</h4>
                {hasLicense ? (
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
                value={form.license_number}
                onChange={(e) => handleFormChange(skill.id, 'license_number', e.target.value)}
                placeholder="Enter license number"
                disabled={isUpdating}
              />

              <Input
                type="date"
                label="License Expiry"
                value={form.license_expiry_date}
                onChange={(e) => handleFormChange(skill.id, 'license_expiry_date', e.target.value)}
                disabled={isUpdating}
              />

              <div className="flex gap-4">
                <Button
                  onClick={() => handleSubmitLicense(skill.id)}
                  disabled={isUpdating || !form.license_number || !form.license_expiry_date}
                  className="flex-1"
                >
                  Save License Details
                </Button>

                <FileUpload
                  label="Upload License Image"
                  onFileSelect={(file) => handleFileUpload(skill.id, file)}
                  accept="image/*"
                  maxSize={5}
                  disabled={isUpdating}
                  className="flex-1"
                />
              </div>

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