
import React from 'react';

const AnalyzingStep: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-16 fade-in">
      <div className="flex justify-center items-center mb-6">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin" style={{ borderColor: 'var(--primary-color)' }} role="status" aria-label="Loading">
            <span className="sr-only">Analyzing...</span>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--on-surface-color)' }}>Analyzing Job Description...</h2>
      <p className="text-lg" style={{ color: 'var(--on-surface-variant-color)' }}>The AI is deconstructing the role requirements.</p>
    </div>
  );
};

export default AnalyzingStep;