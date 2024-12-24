import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface CompanyInfoStepProps {
  companyName: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export default function CompanyInfoStep({ companyName, onChange, onNext }: CompanyInfoStepProps) {
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!companyName.trim()) {
      setError('Company name is required.');
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="space-y-6">
      <Input
        label="Company Name"
        value={companyName}
        onChange={(e) => onChange(e.target.value)}
        error={error}
      />
      <Button onClick={handleNext}>Next</Button>
    </div>
  );
}
