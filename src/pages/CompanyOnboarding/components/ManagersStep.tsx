import React, { useState } from 'react';
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
}

export default function ManagersStep({
  managers,
  onManagerChange,
  onAddManager,
  onBack,
  onNext,
}: ManagersStepProps) {
  const [errors, setErrors] = useState<Record<number, string | null>>({});

  const handleNext = () => {
    const newErrors: Record<number, string | null> = {};
    let hasError = false;

    managers.forEach((manager, index) => {
      if (!manager.name || !manager.email) {
        newErrors[index] = 'Both name and email are required.';
        hasError = true;
      }
    });

    setErrors(newErrors);
    if (hasError) return;

    onNext();
  };

  return (
    <div>
      {managers.map((manager, index) => (
        <div key={index} className="space-y-4">
          <Input
            label="Manager Name"
            value={manager.name}
            onChange={(e) => onManagerChange(index, 'name', e.target.value)}
            error={errors[index]}
          />
          <Input
            label="Manager Email"
            value={manager.email}
            onChange={(e) => onManagerChange(index, 'email', e.target.value)}
            error={errors[index]}
          />
        </div>
      ))}
      <Button onClick={onAddManager}>Add Manager</Button>
      <div className="flex justify-between">
        <Button onClick={onBack}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
