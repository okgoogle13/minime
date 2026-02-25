import React from 'react';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface VerificationStepProps {
  jobTitle: string;
  onConfirm: () => void;
  onBack: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ jobTitle, onConfirm, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{color: 'var(--on-surface-color)'}}>Step 4: Final Confirmation</h2>
        <p className="mb-8" style={{color: 'var(--on-surface-variant-color)'}}>
          You're ready to go! We'll use your saved professional profile to generate a resume tailored for this role.
        </p>
      </div>
      
      <div className="card max-w-lg mx-auto p-6 space-y-4 text-center">
        <div>
            <p className="text-sm font-medium uppercase" style={{color: 'var(--on-surface-variant-color)'}}>Target Role</p>
            <p className="text-lg font-semibold" style={{color: 'var(--on-surface-color)'}}>{jobTitle}</p>
        </div>
         <div>
            <p className="text-sm font-medium uppercase" style={{color: 'var(--on-surface-variant-color)'}}>Source Material</p>
            <div className="flex items-center justify-center gap-2 mt-1">
                 <UserCircleIcon className="w-6 h-6" style={{color: 'var(--primary-color)'}}/>
                 <p className="text-lg font-semibold" style={{color: 'var(--on-surface-color)'}}>Your Saved Profile</p>
            </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={onBack}
          className="btn btn-outlined w-full sm:w-auto"
        >
          <ArrowLeftIcon />
          Back
        </button>
        <button
          onClick={onConfirm}
          className="btn btn-filled w-full sm:w-auto"
        >
          Generate My Resume
          <SparklesIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VerificationStep;
