import React from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface Manager {
  name: string;
  email: string;
}

interface ManagersStepProps {
  managers: Manager[];
  onManagerChange: (index: number, field: keyof Manager, value: string) => void;
  onAddManager: () => void;
  onBack: () => void;
  onNext: () => void;
  errors: Record<string, string>;
  isLoading: boolean;
}

export default function ManagersStep({
  managers,
  onManagerChange,
  onAddManager,
  onBack,
  onNext,
  errors,
  isLoading,
}: ManagersStepProps) {
  return (
    <div className="space-y-6">
      {managers.map((manager, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-medium text-white">
            Manager {index + 1}
          </h3>
          <Input
            label="Full Name"
            value={manager.name}
            onChange={(e) => onManagerChange(index, 'name', e.target.value)}
            error={errors[`manager${index}Name`]}
            placeholder="Enter manager's full name"
          />
          <Input
            label="Email Address"
            type="email"
            value={manager.email}
            onChange={(e) => onManagerChange(index, 'email', e.target.value)}
            error={errors[`manager${index}Email`]}
            placeholder="Enter manager's email"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={onAddManager}
        className="w-full"
      >
        Add Another Manager
      </Button>
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} isLoading={isLoading}>
          Create Company
        </Button>
      </div>
    </div>
  );
}