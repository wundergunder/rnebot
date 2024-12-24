import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface RoleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  isLoading: boolean;
  variant?: 'primary' | 'secondary';
}

export default function RoleCard({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
  isLoading,
  variant = 'primary'
}: RoleCardProps) {
  return (
    <Card className="p-8 text-center hover:border-cyan-500/50 transition-colors">
      <Icon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <p className="text-gray-400 mb-6">{description}</p>
      <Button 
        isLoading={isLoading} 
        variant={variant}
        className="w-full"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </Card>
  );
}