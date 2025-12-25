
import React, { useState } from 'react';
import type { Job } from '../types';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface JobSearchStepProps {
  onSearch: (query: string) => void;
  onSelect: (description: string) => void;
  isSearching: boolean;
  results: Job[] | null;
}

const JobSearchStep: React.FC<JobSearchStepProps> = ({ onSearch, onSelect, isSearching, results }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--on-surface-color)' }}>Find Your Next Opportunity</h2>
        <p className="mb-8" style={{ color: 'var(--on-surface-variant-color)' }}>
          Search for a job title or paste a direct description. Our AI will analyze the requirements to tailor your resume perfectly.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Senior Product Designer in New York"
              className="text-field pl-10 w-full"
              aria-label="Search jobs"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="btn btn-filled whitespace-nowrap"
          >
            {isSearching ? 'Searching...' : 'Search Jobs'}
          </button>
        </form>
      </div>

      {isSearching && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-dashed rounded-full animate-spin mb-4" style={{ borderColor: 'var(--primary-color)' }}></div>
          <p style={{ color: 'var(--on-surface-variant-color)' }}>Gemini is scanning for matching opportunities...</p>
        </div>
      )}

      {results && results.length > 0 && !isSearching && (
        <div className="grid grid-cols-1 gap-4 fade-in">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--on-surface-variant-color)' }}>Search Results</h3>
          {results.map((job, index) => (
            <div key={index} className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-purple-500/50 border border-transparent transition-all">
              <div className="flex-grow">
                <h4 className="text-xl font-bold" style={{ color: 'var(--on-surface-color)' }}>{job.jobTitle}</h4>
                <div className="flex flex-wrap gap-4 mt-2 text-sm" style={{ color: 'var(--on-surface-variant-color)' }}>
                  <span className="flex items-center gap-1.5">
                    <BuildingOfficeIcon className="w-4 h-4" />
                    {job.companyName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="w-4 h-4" />
                    {job.location}
                  </span>
                </div>
                <p className="mt-3 text-sm line-clamp-2" style={{ color: 'var(--on-surface-variant-color)' }}>
                  {job.jobDescription}
                </p>
              </div>
              <button
                onClick={() => onSelect(job.jobDescription)}
                className="btn btn-outlined whitespace-nowrap"
              >
                Tailor Resume
                <SparklesIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {results && results.length === 0 && !isSearching && (
        <div className="text-center py-20 card">
          <p style={{ color: 'var(--on-surface-variant-color)' }}>No jobs found matching "{query}". Try a different search term.</p>
        </div>
      )}

      <div className="mt-12 p-8 rounded-xl border-2 border-dashed text-center" style={{ borderColor: 'var(--outline-color)' }}>
        <h3 className="text-lg font-bold mb-2">Have a specific job description already?</h3>
        <p className="text-sm mb-6" style={{ color: 'var(--on-surface-variant-color)' }}>
          If you've already found a job, you can skip the search and paste the text directly.
        </p>
        <button 
          onClick={() => onSelect('')} 
          className="btn btn-outlined"
        >
          Paste Description Manually
        </button>
      </div>
    </div>
  );
};

export default JobSearchStep;
