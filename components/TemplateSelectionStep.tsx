
import React, { useState } from 'react';
import ResumePreview, { type Theme } from './ResumePreview';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { MOCK_AI_RESPONSE } from '../services/geminiService';

interface TemplateSelectionStepProps {
  onNext: (template: Theme) => void;
  onBack: () => void;
  initialTemplate: Theme;
}

const templateOptions: { id: Theme; name: string; description: string }[] = [
  { id: 'modern', name: 'Modern', description: 'Clean and stylish, ideal for tech and design roles.' },
  { id: 'sidebar', name: 'Sidebar', description: 'A bold, two-column executive layout for a modern edge.' },
  { id: 'classic', name: 'Classic', description: 'A timeless, professional look for corporate and academic fields.' },
  { id: 'structured', name: 'Structured', description: 'A highly organized, text-focused layout ideal for formal applications.' },
  { id: 'creative', name: 'Creative', description: 'Vibrant and unique, perfect for artists and marketing professionals.' },
  { id: 'metropolis', name: 'Metropolis', description: 'Bold and dark, makes a strong statement in urban industries.' },
  { id: 'chronicle', name: 'Chronicle', description: 'An elegant, serif-based template for writers and journalists.' },
  { id: 'matrix', name: 'Matrix', description: 'Structured and organized, excellent for data-driven professions.' },
  { id: 'executive', name: 'Executive', description: 'A sophisticated and formal layout for leadership positions.' },
  { id: 'quantum', name: 'Quantum', description: 'A futuristic, dark-mode theme for tech professionals.' },
  { id: 'garamond', name: 'Garamond', description: 'A classic, academic style perfect for CVs and formal applications.' },
  { id: 'vibrant', name: 'Vibrant', description: 'A bold and colorful layout for creative industries.' },
];

const TemplatePreview: React.FC<{ theme: Theme }> = ({ theme }) => {
    const previewBase = "w-full h-36 rounded-t-lg p-3 flex flex-col overflow-hidden";
    switch (theme) {
        case 'sidebar':
            return (
                <div className={`${previewBase} flex-row p-0`} style={{backgroundColor: '#fff'}}>
                    <div className="w-1/3 bg-slate-800 p-2 flex flex-col gap-2">
                      <div className="h-4 w-full bg-slate-600 rounded"></div>
                      <div className="h-1.5 w-3/4 bg-slate-500 rounded"></div>
                      <div className="mt-4 h-1.5 w-full bg-slate-500 rounded"></div>
                      <div className="h-1.5 w-full bg-slate-500 rounded"></div>
                      <div className="h-1.5 w-full bg-slate-500 rounded"></div>
                    </div>
                    <div className="w-2/3 p-3 space-y-3">
                      <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                      <div className="h-2 w-full bg-slate-100 rounded"></div>
                      <div className="h-2 w-full bg-slate-100 rounded"></div>
                      <div className="mt-4 h-3 w-2/3 bg-slate-200 rounded"></div>
                      <div className="h-2 w-full bg-slate-100 rounded"></div>
                    </div>
                </div>
            );
        case 'modern':
            return (
                <div className={previewBase} style={{backgroundColor: '#f3e8ff'}}>
                    <div className="h-7 w-full rounded bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"></div>
                    <div className="h-3 w-1/2 rounded bg-purple-200 mt-4"></div>
                    <div className="h-3 w-3/4 rounded bg-gray-300 mt-2"></div>
                    <div className="h-3 w-full rounded bg-gray-300 mt-2"></div>
                </div>
            );
        case 'classic':
            return (
                <div className={`${previewBase} items-center`} style={{backgroundColor: '#f7f7f7'}}>
                    <div className="h-4 w-1/3 rounded bg-gray-600 mt-2"></div>
                    <div className="h-2 w-1/2 rounded bg-gray-400 mt-2"></div>
                    <div className="w-full h-px bg-black my-4"></div>
                    <div className="h-3 w-full rounded bg-gray-300 mt-1"></div>
                    <div className="h-3 w-full rounded bg-gray-300 mt-2"></div>
                </div>
            );
        case 'structured':
             return (
                <div className={`${previewBase} items-center`} style={{backgroundColor: '#f8f8f8'}}>
                    <div className="h-4 w-1/3 rounded bg-gray-600 mt-2"></div>
                    <div className="w-full h-px bg-gray-400 my-2"></div>
                    <div className="flex w-full gap-4">
                        <div className="w-1/2 h-16 rounded bg-gray-300"></div>
                        <div className="w-1/2 h-20 rounded bg-gray-300"></div>
                    </div>
                </div>
            );
        case 'creative':
            return (
                <div className={previewBase} style={{backgroundColor: '#e0f7fa'}}>
                    <div className="h-7 w-full rounded bg-gradient-to-r from-cyan-200 to-blue-300"></div>
                    <div className="h-3 w-1/2 rounded bg-teal-200 mt-4"></div>
                    <div className="h-3 w-3/4 rounded bg-gray-300 mt-2"></div>
                    <div className="h-3 w-full rounded bg-gray-300 mt-2"></div>
                </div>
            );
        case 'metropolis':
            return (
                 <div className={previewBase} style={{backgroundColor: '#e2e8f0'}}>
                    <div className="h-8 w-full rounded bg-slate-800"></div>
                    <div className="h-1 w-1/4 rounded bg-teal-400 mt-1"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-400 mt-3"></div>
                    <div className="h-3 w-3/4 rounded bg-gray-400 mt-2"></div>
                </div>
            );
        case 'chronicle':
            return (
                <div className={`${previewBase} flex-row gap-3`} style={{backgroundColor: '#fef2f2'}}>
                    <div className="w-1 h-full rounded bg-red-900"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-3 w-2/3 rounded bg-gray-600 mt-2"></div>
                        <div className="h-2 w-full rounded bg-gray-400"></div>
                        <div className="h-2 w-full rounded bg-gray-400"></div>
                         <div className="h-2 w-3/4 rounded bg-gray-400"></div>
                    </div>
                </div>
            );
        case 'matrix':
            return (
                <div className={previewBase} style={{backgroundColor: '#eef2ff'}}>
                    <div className="h-6 w-full rounded bg-blue-100"></div>
                     <div className="grid grid-cols-2 gap-2 mt-4">
                         <div className="h-8 border border-gray-300 rounded p-1 space-y-1"><div className="h-1.5 w-full bg-gray-300 rounded"></div><div className="h-1.5 w-2/3 bg-gray-300 rounded"></div></div>
                         <div className="h-8 border border-gray-300 rounded p-1 space-y-1"><div className="h-1.5 w-full bg-gray-300 rounded"></div><div className="h-1.5 w-2/3 bg-gray-300 rounded"></div></div>
                         <div className="h-8 border border-gray-300 rounded p-1 space-y-1"><div className="h-1.5 w-full bg-gray-300 rounded"></div><div className="h-1.5 w-2/3 bg-gray-300 rounded"></div></div>
                         <div className="h-8 border border-gray-300 rounded p-1 space-y-1"><div className="h-1.5 w-full bg-gray-300 rounded"></div><div className="h-1.5 w-2/3 bg-gray-300 rounded"></div></div>
                     </div>
                </div>
            );
        case 'executive':
            return (
                <div className={previewBase} style={{backgroundColor: '#f8fafc'}}>
                    <div className="h-3 w-2/3 rounded bg-gray-700 mt-2"></div>
                    <div className="h-2 w-1/2 rounded bg-gray-500 mt-2"></div>
                    <div className="w-1/4 h-0.5 bg-blue-900 my-4"></div>
                    <div className="h-3 w-full rounded bg-gray-300 mt-1"></div>
                    <div className="h-3 w-5/6 rounded bg-gray-300 mt-2"></div>
                </div>
            );
        case 'quantum':
            return (
                <div className={previewBase} style={{backgroundColor: '#111827'}}>
                    <div className="h-8 w-full rounded" style={{backgroundColor: '#1f2937'}}></div>
                    <div className="h-3 w-1/2 rounded bg-cyan-700 mt-4"></div>
                    <div className="h-3 w-3/4 rounded bg-gray-600 mt-2"></div>
                    <div className="h-3 w-full rounded bg-gray-600 mt-2"></div>
                </div>
            );
        case 'garamond':
            return (
                <div className={`${previewBase} items-center`} style={{backgroundColor: '#f9f9f9'}}>
                    <div className="h-3 w-1/2 rounded bg-gray-600 mt-2"></div>
                    <div className="h-2 w-2/3 rounded bg-gray-400 mt-2"></div>
                    <div className="w-1/2 h-px bg-black my-3"></div>
                    <div className="h-2 w-full rounded bg-gray-300 mt-1"></div>
                    <div className="h-2 w-full rounded bg-gray-300 mt-1"></div>
                    <div className="h-2 w-full rounded bg-gray-300 mt-1"></div>
                    <div className="h-2 w-full rounded bg-gray-300 mt-1"></div>
                </div>
            );
        case 'vibrant':
            return (
                <div className={previewBase} style={{backgroundColor: '#fff'}}>
                    <div className="h-8 w-full rounded bg-gradient-to-r from-orange-400 to-pink-500"></div>
                    <div className="h-3 w-1/2 rounded bg-pink-300 mt-4"></div>
                    <div className="h-3 w-3/4 rounded bg-gray-300 mt-2"></div>
                    <div className="h-3 w-full rounded bg-gray-300 mt-2"></div>
                </div>
            );
        default:
            return <div className="w-full h-36 bg-gray-200 rounded-t-lg"></div>;
    }
}


const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({ onNext, onBack, initialTemplate }) => {
  const [selected, setSelected] = useState<Theme>(initialTemplate);
  const [previewingTheme, setPreviewingTheme] = useState<Theme | null>(null);

  return (
    <div className="max-w-4xl mx-auto text-center py-12 fade-in">
      <h2 className="text-3xl font-bold mb-2" style={{color: 'var(--on-surface-color)'}}>Step 3: Choose a Resume Template</h2>
      <p className="mb-8" style={{color: 'var(--on-surface-variant-color)'}}>
        Each template offers a unique layout and style. Choose one that best fits your personality and the industry you're applying to.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templateOptions.map((template) => (
          <div
            key={template.id}
            role="group"
            className="card text-left p-0 transition-all transform hover:-translate-y-1 duration-200 flex flex-col"
            style={{
              boxShadow: selected === template.id ? `0 0 0 3px var(--primary-color)` : '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--outline-color)'
            }}
          >
            <button
              onClick={() => setSelected(template.id)}
              className="text-left w-full h-full p-0"
              aria-pressed={selected === template.id}
              aria-label={`Select ${template.name} theme`}
            >
              <TemplatePreview theme={template.id} />
              <div className="p-4">
                <h3 className="font-bold" style={{color: 'var(--on-surface-color)'}}>{template.name}</h3>
                <p className="text-sm mt-1" style={{color: 'var(--on-surface-variant-color)'}}>{template.description}</p>
              </div>
            </button>
            <div className="p-4 pt-0 mt-auto">
              <button
                onClick={() => setPreviewingTheme(template.id)}
                className="btn btn-outlined w-full !py-2 !text-sm"
                aria-label={`Preview full resume with ${template.name} theme`}
              >
                Preview Full Resume
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
         <button
          onClick={onBack}
          className="btn btn-outlined w-full sm:w-auto"
        >
          <ArrowLeftIcon />
          Back
        </button>
        <button
          onClick={() => onNext(selected)}
          disabled={!selected}
          className="btn btn-filled w-full sm:w-auto"
        >
          Next Step
          <ArrowRightIcon />
        </button>
      </div>

      {previewingTheme && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-start p-4 z-50 overflow-y-auto"
          onClick={() => setPreviewingTheme(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-title"
        >
          <div 
            className="card w-full max-w-4xl my-8 relative" 
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'fadeInAnimation 0.3s ease' }}
          >
            <header className="sticky top-0 p-4 border-b flex justify-between items-center z-10" style={{backgroundColor: 'var(--surface-color)', borderColor: 'var(--outline-color)'}}>
                <h3 id="preview-title" className="text-lg font-bold" style={{ color: 'var(--on-surface-color)'}}>
                  Preview: {templateOptions.find(t => t.id === previewingTheme)?.name}
                </h3>
                <button onClick={() => setPreviewingTheme(null)} className="p-1 rounded-full hover:bg-white/10" aria-label="Close preview">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </header>
            <div className="max-h-[80vh] overflow-y-auto">
                <ResumePreview resumeData={MOCK_AI_RESPONSE.tailoredResume} theme={previewingTheme} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelectionStep;
