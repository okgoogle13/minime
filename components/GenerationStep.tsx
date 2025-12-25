
import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const loadingMessages = [
  'Analyzing the job description for key criteria...',
  'Matching your experience to the role requirements...',
  'Rewriting your career summary for maximum impact...',
  'Optimizing your skills section for ATS scanners...',
  'Crafting achievement-oriented experience points...',
  'Calculating your resume match score...',
  'Finalizing your new resume...',
];

const GenerationStep: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center py-16 fade-in">
      <div className="flex justify-center items-center mb-6">
        <SparklesIcon className="w-16 h-16 animate-pulse" style={{ color: 'var(--primary-color)' }} />
      </div>
      <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--on-surface-color)' }}>Your New Resume is Brewing...</h2>
      <p className="text-lg" style={{ color: 'var(--on-surface-variant-color)' }}>Our AI is working its magic. This may take a moment.</p>
      <div className="mt-8 h-8">
         <p className="font-medium transition-opacity duration-500" style={{ color: 'var(--primary-color)' }}>
             {loadingMessages[messageIndex]}
         </p>
      </div>
      <div className="relative w-full max-w-sm mx-auto mt-4 rounded-full h-2.5 overflow-hidden" style={{ backgroundColor: 'var(--surface-bright-color)'}}>
        <div className="h-2.5 rounded-full animate-progress" style={{backgroundImage: 'linear-gradient(to right, #BB86FC, #6200EE)'}}></div>
      </div>
       <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 17.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GenerationStep;