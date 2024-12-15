import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Building2, MapPin, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validateRequired } from '../../utils/validation';
import { createCompany, updateProfile } from '../../services/api';
import BranchForm from '../../components/branches/BranchForm';
import BranchList from '../../components/branches/BranchList';
import { useBranches } from '../../hooks/useBranches';
import toast from 'react-hot-toast';

interface Manager {
  name: string;
  email: string;
}

interface FormData {
  companyName: string;
  managers: Manager[];
}

const initialFormData: FormData = {
  companyName: '',
  managers: [{ name: '', email: '' }],
};

export default function CompanyOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [companyId, setCompanyId] = useState<string | null>(null);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!validateRequired(formData.companyName)) {
        newErrors.companyName = 'Company name is required';
      }
    } else if (step === 2) {
      formData.managers.forEach((manager, index) => {
        if (!validateRequired(manager.name)) {
          newErrors[`manager${index}Name`] = 'Manager name is required';
        }
        if (!validateEmail(manager.email)) {
          newErrors[`manager${index}Email`] = 'Valid email is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleAddManager = () => {
    setFormData((prev) => ({
      ...prev,
      managers: [...prev.managers, { name: '', email: '' }],
    }));
  };

  const handleCreateCompany = async () => {
    if (!validateStep(2) || !user) return;

    setIsLoading(true);
    try {
      // Create company
      const company = await createCompany({
        name: formData.companyName,
      });

      setCompanyId(company.id);

      // Update current user's profile
      await updateProfile(user.id, {
        role: 'manager',
        company_id: company.id,
      });

      setCurrentStep(3);
    } catch (error) {
      toast.error('Failed to create company. Please try again.');
      console.error('Error creating company:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    toast.success('Company setup completed!');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Building2 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Company Setup</h1>
        <p className="text-gray-400">Let's get your company set up in RNEbot</p>
      </div>

      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex-1 text-center ${
              currentStep === step
                ? 'text-cyan-400'
                : currentStep > step
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            <div className="relative">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${
                  currentStep === step
                    ? 'border-cyan-400 bg-gray-800'
                    : currentStep > step
                    ? 'border-gray-400 bg-gray-400'
                    : 'border-gray-600 bg-gray-800'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`absolute top-4 w-full h-0.5 ${
                    currentStep > step ? 'bg-gray-400' : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
            <div className="mt-2">
              {step === 1 && 'Company Info'}
              {step === 2 && 'Managers'}
              {step === 3 && 'Branches'}
            </div>
          </div>
        ))}
      </div>

      <Card>
        {currentStep === 1 && (
          <div className="space-y-6">
            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
              error={errors.companyName}
              placeholder="Enter your company name"
            />
            <div className="flex justify-end">
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            {formData.managers.map((manager, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-medium text-white">
                  Manager {index + 1}
                </h3>
                <Input
                  label="Full Name"
                  value={manager.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      managers: prev.managers.map((m, i) =>
                        i === index ? { ...m, name: e.target.value } : m
                      ),
                    }))
                  }
                  error={errors[`manager${index}Name`]}
                  placeholder="Enter manager's full name"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={manager.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      managers: prev.managers.map((m, i) =>
                        i === index ? { ...m, email: e.target.value } : m
                      ),
                    }))
                  }
                  error={errors[`manager${index}Email`]}
                  placeholder="Enter manager's email"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddManager}
              className="w-full"
            >
              Add Another Manager
            </Button>
            <div className="flex justify-between">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleCreateCompany} isLoading={isLoading}>
                Create Company
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && companyId && (
          <div className="space-y-6">
            <BranchForm companyId={companyId} />
            <div className="flex justify-between mt-6">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleComplete}>
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}