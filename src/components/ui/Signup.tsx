import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Signup() {
  const navigate = useNavigate();
  const [choice, setChoice] = useState<string | null>(null);

  const handleNext = () => {
    if (choice === 'new') {
      navigate('/onboarding');
    } else if (choice === 'existing') {
      navigate('/join-company');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
      <p className="text-center mb-4">
        Are you part of an existing company or creating a new one?
      </p>
      <div className="space-y-4">
        <Button onClick={() => setChoice('existing')} className={choice === 'existing' ? 'bg-blue-500' : ''}>
          Join an Existing Company
        </Button>
        <Button onClick={() => setChoice('new')} className={choice === 'new' ? 'bg-blue-500' : ''}>
          Create a New Company
        </Button>
      </div>
      <div className="mt-6">
        <Button onClick={handleNext} disabled={!choice}>
          Next
        </Button>
      </div>
    </div>
  );
}
