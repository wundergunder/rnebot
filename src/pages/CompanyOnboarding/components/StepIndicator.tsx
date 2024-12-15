import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: { number: number; label: string }[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`flex-1 text-center ${
            currentStep === step.number
              ? 'text-cyan-400'
              : currentStep > step.number
              ? 'text-gray-400'
              : 'text-gray-600'
          }`}
        >
          <div className="relative">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${
                currentStep === step.number
                  ? 'border-cyan-400 bg-gray-800'
                  : currentStep > step.number
                  ? 'border-gray-400 bg-gray-400'
                  : 'border-gray-600 bg-gray-800'
              }`}
            >
              {step.number}
            </div>
            {step.number < steps.length && (
              <div
                className={`absolute top-4 w-full h-0.5 ${
                  currentStep > step.number ? 'bg-gray-400' : 'bg-gray-600'
                }`}
              />
            )}
          </div>
          <div className="mt-2">{step.label}</div>
        </div>
      ))}
    </div>
  );
}