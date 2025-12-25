import React, { useState } from 'react';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface UrlInputStepProps {
  onNext: (url: string) => void;
  jobUrl: string;
}

const UrlInputStep: React.FC<UrlInputStepProps> = ({ onNext, jobUrl: initialJobUrl }) => {
  const [url, setUrl] = useState(initialJobUrl);
  const [error, setError] = useState('');

  const isValidUrl = (urlString: string) => {
    try {
      // Basic check for protocol and some content after it
      const newUrl = new URL(urlString);
      return newUrl.protocol === "http:" || newUrl.protocol === "https:";
    } catch (e) {
      return false;
    }
  };

  const handleNext = () => {
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com/job/123).');
      return;
    }
    setError('');
    onNext(url);
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-12 fade-in">
      <h2 className="text-3xl font-bold mb-2" style={{color: 'var(--on-surface-color)'}}>Step 1: Provide the Job Posting URL</h2>
      <p className="mb-8" style={{color: 'var(--on-surface-variant-color)'}}>
        Paste the URL to the job opportunity below. Our AI will analyze it to tailor your resume.
      </p>
      <div className="w-full">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.linkedin.com/jobs/view/..."
          className="text-field"
        />
        {error && <p style={{color: 'var(--error-color)'}} className="text-sm mt-2">{error}</p>}
      </div>
      <button
        onClick={handleNext}
        disabled={!isValidUrl(url)}
        className="mt-8 btn btn-filled w-full sm:w-auto"
      >
        Analyze Job URL
        <ArrowRightIcon />
      </button>
    </div>
  );
};

export default UrlInputStep;
