import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { Branch } from '../../types/database';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface BranchListProps {
  branches: Branch[];
  onEdit?: (branch: Branch) => void;
  onDelete?: (branchId: string) => void;
}

export default function BranchList({ branches, onEdit, onDelete }: BranchListProps) {
  if (branches.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400">No branches added yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {branches.map((branch) => (
        <Card key={branch.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-white">{branch.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{branch.address}</span>
                </div>
                {branch.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{branch.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(branch)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(branch.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}