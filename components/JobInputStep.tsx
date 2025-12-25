
import React, { useState } from 'react';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface JobInputStepProps {
  onNext: (description: string) => void;
  jobDescription: string;
}

const JobInputStep: React.FC<JobInputStepProps> = ({ onNext, jobDescription: initialJobDescription }) => {
  const [description, setDescription] = useState(initialJobDescription);
  const [error, setError] = useState('');

  const isDescriptionValid = (desc: string) => {
    return desc.trim().length > 50; // Simple validation: at least 50 characters
  };

  const handleNext = () => {
    if (!isDescriptionValid(description)) {
      setError('Please paste the full job description (at least 50 characters).');
      return;
    }
    setError('');
    onNext(description);
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-12 fade-in">
      <h2 className="text-3xl font-bold mb-2" style={{color: 'var(--on-surface-color)'}}>Step 1: Provide the Job Description</h2>
      <p className="mb-8" style={{color: 'var(--on-surface-variant-color)'}}>
        Paste the full text of the job description below. Our AI will analyze it to tailor your resume.
      </p>
      <div className="w-full">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="text-field text-left h-64 resize-none"
          style={{textAlign: 'left'}}
        />
        {error && <p style={{color: 'var(--error-color)'}} className="text-sm mt-2">{error}</p>}
      </div>
      <button
        onClick={handleNext}
        disabled={!isDescriptionValid(description)}
        className="mt-8 btn btn-filled w-full sm:w-auto"
      >
        Analyze Job Description
        <ArrowRightIcon />
      </button>
    </div>
  );
};

export default JobInputStep;
