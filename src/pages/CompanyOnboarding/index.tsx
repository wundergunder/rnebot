import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validateRequired } from '../../utils/validation';
import { createCompany, updateProfile } from '../../services/api';
import StepIndicator from './components/StepIndicator';
import CompanyInfoStep from './components/CompanyInfoStep';
import ManagersStep from './components/ManagersStep';
import BranchesStep from './components/BranchesStep';
import toast from 'react-hot-toast';

interface Manager {
  name: string;
  email: string;
}

interface FormData {
  companyName: string;
  managers: Manager[];
}

const STEPS = [
  { number: 1, label: 'Company Info' },
  { number: 2, label: 'Managers' },
  { number: 3, label: 'Branches' },
];

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

  const handleManagerChange = (index: number, field: keyof Manager, value: string) => {
    setFormData((prev) => ({
      ...prev,
      managers: prev.managers.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
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
      const company = await createCompany({
        name: formData.companyName,
      });

      setCompanyId(company.id);

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

      <StepIndicator currentStep={currentStep} steps={STEPS} />

      <Card>
        {currentStep === 1 && (
          <CompanyInfoStep
            companyName={formData.companyName}
            onChange={(value) => setFormData((prev) => ({ ...prev, companyName: value }))}
            onNext={handleNext}
            error={errors.companyName}
          />
        )}

        {currentStep === 2 && (
          <ManagersStep
            managers={formData.managers}
            onManagerChange={handleManagerChange}
            onAddManager={handleAddManager}
            onBack={handleBack}
            onNext={handleCreateCompany}
            errors={errors}
            isLoading={isLoading}
          />
        )}

        {currentStep === 3 && companyId && (
          <BranchesStep
            companyId={companyId}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        )}
      </Card>
    </div>
  );
}