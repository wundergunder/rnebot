import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Profile } from '../../../types/database';
import { validateEmail, validatePhoneNumber, validateRequired } from '../../../utils/validation';
import { updateProfile } from '../../../services/api';
import toast from 'react-hot-toast';

interface ProfileFormProps {
  initialData: Profile | null;
}

interface FormData {
  full_name: string;
  email: string;
  cell_phone: string;
  home_address: string;
  max_travel_distance: number;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    full_name: initialData?.full_name || '',
    email: initialData?.email || '',
    cell_phone: initialData?.cell_phone || '',
    home_address: initialData?.home_address || '',
    max_travel_distance: initialData?.max_travel_distance || 50,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.full_name)) {
      newErrors.full_name = 'Full name is required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!validatePhoneNumber(formData.cell_phone)) {
      newErrors.cell_phone = 'Valid phone number is required';
    }
    if (!validateRequired(formData.home_address)) {
      newErrors.home_address = 'Home address is required';
    }
    if (formData.max_travel_distance <= 0) {
      newErrors.max_travel_distance = 'Must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !initialData?.id) return;

    setIsLoading(true);
    try {
      await updateProfile(initialData.id, formData);
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
      
      <Input
        label="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
        error={errors.full_name}
        placeholder="Enter your full name"
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        error={errors.email}
        placeholder="Enter your email"
      />

      <Input
        label="Cell Phone"
        value={formData.cell_phone}
        onChange={(e) => setFormData((prev) => ({ ...prev, cell_phone: e.target.value }))}
        error={errors.cell_phone}
        placeholder="Enter your cell phone number"
      />

      <Input
        label="Home Address"
        value={formData.home_address}
        onChange={(e) => setFormData((prev) => ({ ...prev, home_address: e.target.value }))}
        error={errors.home_address}
        placeholder="Enter your home address"
      />

      <Input
        label="Maximum Travel Distance (km)"
        type="number"
        value={formData.max_travel_distance}
        onChange={(e) => setFormData((prev) => ({ ...prev, max_travel_distance: parseInt(e.target.value) }))}
        error={errors.max_travel_distance}
        min="1"
      />

      <Button type="submit" isLoading={isLoading}>
        Save Changes
      </Button>
    </form>
  );
}