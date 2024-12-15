import React, { useState } from 'react';
import { Company, ExpertiseLevel, ProjectLocationType } from '../../../types/database';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { expertiseLevels } from '../../../utils/expertise';
import { createProject } from '../../../services/api';
import toast from 'react-hot-toast';

interface ProjectFormProps {
  company: Company;
}

interface ProjectRequirement {
  expertise_level: ExpertiseLevel;
  hours_required: number;
}

interface FormData {
  client_name: string;
  project_name: string;
  location_type: ProjectLocationType;
  address: string;
  start_time: string;
  end_time: string;
  requirements: ProjectRequirement[];
}

const initialFormData: FormData = {
  client_name: '',
  project_name: '',
  location_type: 'shop',
  address: '',
  start_time: '',
  end_time: '',
  requirements: [{ expertise_level: 'labourer', hours_required: 8 }],
};

export default function ProjectForm({ company }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Client name is required';
    }
    if (!formData.project_name.trim()) {
      newErrors.project_name = 'Project name is required';
    }
    if (formData.location_type === 'field' && !formData.address.trim()) {
      newErrors.address = 'Address is required for field projects';
    }
    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }
    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }
    if (new Date(formData.end_time) <= new Date(formData.start_time)) {
      newErrors.end_time = 'End time must be after start time';
    }

    formData.requirements.forEach((req, index) => {
      if (req.hours_required <= 0) {
        newErrors[`hours_${index}`] = 'Hours must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createProject({
        company_id: company.id,
        ...formData,
      });
      toast.success('Project created successfully!');
      setFormData(initialFormData);
    } catch (error) {
      toast.error('Failed to create project');
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [
        ...prev.requirements,
        { expertise_level: 'labourer', hours_required: 8 }
      ],
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Create New Project</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Client Name"
          value={formData.client_name}
          onChange={e => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
          error={errors.client_name}
          placeholder="Enter client name"
        />

        <Input
          label="Project Name"
          value={formData.project_name}
          onChange={e => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
          error={errors.project_name}
          placeholder="Enter project name"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">Location Type</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-cyan-500"
                checked={formData.location_type === 'shop'}
                onChange={() => setFormData(prev => ({ ...prev, location_type: 'shop' }))}
              />
              <span className="ml-2 text-gray-200">Shop</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-cyan-500"
                checked={formData.location_type === 'field'}
                onChange={() => setFormData(prev => ({ ...prev, location_type: 'field' }))}
              />
              <span className="ml-2 text-gray-200">Field</span>
            </label>
          </div>
        </div>

        {formData.location_type === 'field' && (
          <Input
            label="Project Address"
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            error={errors.address}
            placeholder="Enter project address"
          />
        )}

        <Input
          label="Start Time"
          type="datetime-local"
          value={formData.start_time}
          onChange={e => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
          error={errors.start_time}
        />

        <Input
          label="End Time"
          type="datetime-local"
          value={formData.end_time}
          onChange={e => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
          error={errors.end_time}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Worker Requirements</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addRequirement}
          >
            Add Requirement
          </Button>
        </div>

        {formData.requirements.map((req, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Expertise Level
              </label>
              <select
                value={req.expertise_level}
                onChange={e => {
                  const newReqs = [...formData.requirements];
                  newReqs[index].expertise_level = e.target.value as ExpertiseLevel;
                  setFormData(prev => ({ ...prev, requirements: newReqs }));
                }}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
              >
                {expertiseLevels.map(level => (
                  <option key={level} value={level}>
                    {level.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                value={req.hours_required}
                onChange={e => {
                  const newReqs = [...formData.requirements];
                  newReqs[index].hours_required = parseInt(e.target.value);
                  setFormData(prev => ({ ...prev, requirements: newReqs }));
                }}
                error={errors[`hours_${index}`]}
                min="1"
                placeholder="Hours"
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Project
      </Button>
    </form>
  );
}