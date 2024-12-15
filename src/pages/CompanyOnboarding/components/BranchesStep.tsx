import React from 'react';
import { Button } from '../../../components/ui/Button';
import BranchForm from '../../../components/branches/BranchForm';
import BranchList from '../../../components/branches/BranchList';
import { useBranches } from '../../../hooks/useBranches';

interface BranchesStepProps {
  companyId: string;
  onBack: () => void;
  onComplete: () => void;
}

export default function BranchesStep({
  companyId,
  onBack,
  onComplete,
}: BranchesStepProps) {
  const { branches, loading } = useBranches(companyId);

  return (
    <div className="space-y-6">
      <BranchForm companyId={companyId} />
      {!loading && branches.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-white mb-4">Added Branches</h3>
          <BranchList branches={branches} />
        </div>
      )}
      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete}>
          Complete Setup
        </Button>
      </div>
    </div>
  );
}