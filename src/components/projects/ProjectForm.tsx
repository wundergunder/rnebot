import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { ProjectStage, ProjectType } from '../../types/database';
import toast from 'react-hot-toast';

interface ProjectFormProps {
  companyId: string;
  onSuccess?: () => void;
}

interface FormData {
  work_order: string;
  client_name: string;
  project_type: ProjectType;
  stage: ProjectStage;
  description: string;
  expected_hours: string;
  tools_needed: string[];
  address?: string;
}

const initialFormData: FormData = {
  work_order: '',
  client_name: '',
  project_type: 'shop',
  stage: 'estimate',
  description: '',
  expected_hours: '',
  tools_needed: [],
};

const projectTypes: ProjectType[] = ['shop', 'site', 'service'];
const projectStages: ProjectStage[] = [
  'estimate',
  'parts_ordered',
  'appointment_booked',
  'onsite',
  'complete',
];

export default function ProjectForm({ companyId, onSuccess }: ProjectFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [toolInput, setToolInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.work_order) {
      newErrors.work_order = 'Work order is required';
    }
    if (!formData.client_name) {
      newErrors.client_name = 'Client name is required';
    }
    if (formData.project_type === 'site' && !formData.address) {
      newErrors.address = 'Address is required for site projects';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          company_id: companyId,
          ...formData,
          expected_hours: formData.expected_hours ? parseInt(formData.expected_hours) : null,
        }])
        .select()
        .single();

      if (projectError) throw projectError;

      // Insert tools
      if (formData.tools_needed.length > 0) {
        const { error: toolsError } = await supabase
          .from('project_tools')
          .insert(
            formData.tools_needed.map(tool => ({
              project_id: project.id,
              name: tool
            }))
          );

        if (toolsError) throw toolsError;
      }

      toast.success('Project created successfully');
      setFormData(initialFormData);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const addTool = () => {
    if (toolInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tools_needed: [...prev.tools_needed, toolInput.trim()]
      }));
      setToolInput('');
    }
  };

  const removeTool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tools_needed: prev.tools_needed.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Work Order #"
          value={formData.work_order}
          onChange={e => setFormData(prev => ({ ...prev, work_order: e.target.value }))}
          error={errors.work_order}
        />

        <Input
          label="Client Name"
          value={formData.client_name}
          onChange={e => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
          error={errors.client_name}
        />

        <Select
          label="Project Type"
          value={formData.project_type}
          onChange={e => setFormData(prev => ({ ...prev, project_type: e.target.value as ProjectType }))}
        >
          {projectTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </Select>

        <Select
          label="Stage"
          value={formData.stage}
          onChange={e => setFormData(prev => ({ ...prev, stage: e.target.value as ProjectStage }))}
        >
          {projectStages.map(stage => (
            <option key={stage} value={stage}>
              {stage.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </Select>

        {formData.project_type === 'site' && (
          <Input
            label="Site Address"
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            error={errors.address}
          />
        )}

        <Input
          label="Expected Hours (Optional)"
          type="number"
          value={formData.expected_hours}
          onChange={e => setFormData(prev => ({ ...prev, expected_hours: e.target.value }))}
          min="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Tools Needed
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={toolInput}
            onChange={e => setToolInput(e.target.value)}
            placeholder="Enter tool name"
            className="flex-1"
          />
          <Button type="button" onClick={addTool}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tools_needed.map((tool, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-full bg-gray-700 text-gray-300 text-sm flex items-center gap-1"
            >
              {tool}
              <button
                type="button"
                onClick={() => removeTool(index)}
                className="text-gray-400 hover:text-gray-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          rows={4}
        />
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Project
      </Button>
    </form>
  );
}