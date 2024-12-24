import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';

interface BranchesStepProps {
  companyId: string;
  onBack: () => void;
  onComplete: () => void;
}

export default function BranchesStep({ companyId, onBack, onComplete }: BranchesStepProps) {
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    try {
      // Simulate API call or other finalization logic
      await onComplete();
      setError(null);
    } catch (e) {
      setError('Failed to complete onboarding. Please try again.');
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between">
        <Button onClick={onBack}>Back</Button>
        <Button onClick={handleComplete}>Complete</Button>
      </div>
    </div>
  );
}
