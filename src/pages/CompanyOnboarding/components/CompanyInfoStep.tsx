import React from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface CompanyInfoStepProps {
  companyName: string;
  onChange: (value: string) => void;
  onNext: () => void;
  error?: string;
}

export default function CompanyInfoStep({
  companyName,
  onChange,
  onNext,
  error,
}: CompanyInfoStepProps) {
  return (
    <div className="space-y-6">
      <Input
        label="Company Name"
        value={companyName}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        placeholder="Enter your company name"
      />
      <div className="flex justify-end">
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}