import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateRequired } from '../../utils/validation';
import { createBranch } from '../../services/api';
import toast from 'react-hot-toast';

interface BranchFormProps {
  companyId: string;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  address: string;
  phone: string;
}

const initialFormData: FormData = {
  name: '',
  address: '',
  phone: '',
};

export default function BranchForm({ companyId, onSuccess }: BranchFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Branch name is required';
    }
    if (!validateRequired(formData.address)) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createBranch({
        company_id: companyId,
        name: formData.name,
        address: formData.address,
        phone: formData.phone || null,
      });
      
      toast.success('Branch created successfully!');
      setFormData(initialFormData);
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to create branch');
      console.error('Error creating branch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Branch Name"
        value={formData.name}
        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        placeholder="Enter branch name"
      />

      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
        error={errors.address}
        placeholder="Enter branch address"
      />

      <Input
        label="Phone Number (Optional)"
        value={formData.phone}
        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
        error={errors.phone}
        placeholder="Enter branch phone number"
      />

      <Button type="submit" isLoading={isLoading}>
        Add Branch
      </Button>
    </form>
  );
}