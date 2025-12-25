
import React, { useState, useEffect } from 'react';
import type { AIResponse, ScoreBreakdown, QuantificationSuggestion, UserProfile } from '../types';
import ResumePreview, { type Theme } from './ResumePreview';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';

// Declare globals for libraries loaded via CDN
declare const html2canvas: any;
declare const jspdf: any;

const resumeToText = (resumeData: UserProfile): string => {
    let text = `${resumeData.fullName}\n`;
    text += `${resumeData.resumeHeadline}\n`;
    text += `Contact: ${resumeData.phone} | ${resumeData.email} | ${resumeData.location}\n\n`;
    text += `--- PROFESSIONAL SUMMARY ---\n${resumeData.careerSummary}\n\n`;

    text += `--- EDUCATION ---\n`;
    resumeData.education.forEach(edu => {
        text += `${edu.degree}, ${edu.institution}, ${edu.location} (${edu.graduationYear})\n`;
    });
    text += '\n';

    text += `--- SKILLS ---\n`;
    resumeData.skills.forEach(skillCat => {
        text += `${skillCat.category}: ${skillCat.skillsList.join(', ')}\n`;
    });
    text += '\n';

    text += `--- WORK EXPERIENCE ---\n`;
    resumeData.experience.forEach(job => {
        text += `${job.jobTitle} at ${job.organization} (${job.location}) | ${job.startDate} - ${job.endDate}\n`;
        text += `${job.description}\n`;
        text += `Responsibilities:\n${job.responsibilities.map(r => `  - ${r}`).join('\n')}\n`;
        text += `Achievement: ${job.achievement}\n\n`;
    });

    text += `--- CERTIFICATIONS & DEVELOPMENT ---\n`;
    resumeData.certificationsAndDevelopment.certifications.forEach(cert => {
        text += `${cert.name}, ${cert.issuingBody} (${cert.date})\n`;
    });
    resumeData.certificationsAndDevelopment.trainings.forEach(train => {
        text += `${train.name}, ${train.provider} (${train.year})\n`;
    });

    return text;
};

interface ResultsStepProps {
  response: AIResponse;
  onStartOver: () => void;
  initialTheme: Theme;
  setError: (msg: string | null) => void;
}

interface ScoreCardProps {
  title: string;
  score: number;
  analysis: string;
  explanation?: React.ReactNode;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, analysis, explanation }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="p-4 rounded-lg" style={{backgroundColor: 'var(--surface-bright-color)'}}>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <h4 className="font-bold" style={{ color: 'var(--on-surface-color)'}}>{title}</h4>
                    {explanation && (
                        <button onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded} aria-label={`More info about ${title}`} className="p-0 bg-transparent border-none cursor-pointer">
                            <InformationCircleIcon className="w-4 h-4" style={{color: 'var(--on-surface-variant-color)', transition: 'color 0.2s'}} />
                        </button>
                    )}
                </div>
                <span className={`font-bold text-lg ${score >= 75 ? 'text-green-400' : 'text-amber-400'}`}>{score}%</span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{backgroundColor: 'var(--outline-color)'}}>
                <div 
                    className={`h-1.5 rounded-full ${score >= 75 ? 'bg-green-400' : 'bg-amber-400'}`} 
                    style={{ width: `${score}%`, transition: 'width 0.5s ease-out' }}
                ></div>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--on-surface-variant-color)'}}>{analysis}</p>
            {isExpanded && explanation && (
                <div className="mt-3 p-3 text-xs rounded-md" style={{backgroundColor: 'var(--bg-color)', color: 'var(--on-surface-variant-color)', border: '1px solid var(--outline-color)'}}>
                    {explanation}
                </div>
            )}
        </div>
    );
};

const QuantificationSuggestionCard: React.FC<{ suggestion: QuantificationSuggestion }> = ({ suggestion }) => {
    return (
        <div className="p-4 rounded-lg text-sm" style={{backgroundColor: 'var(--surface-bright-color)'}}>
            <p className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--on-surface-variant-color)' }}>Original:</p>
            <p className="italic pl-2 border-l-2" style={{borderColor: 'var(--error-color)', color: 'var(--on-surface-color)'}}>{suggestion.originalText}</p>
            <p className="font-semibold text-xs uppercase tracking-wider mt-3 mb-2" style={{ color: 'var(--success-color)' }}>Suggested Rewrite:</p>
            <p className="pl-2 border-l-2" style={{borderColor: 'var(--success-color)', color: 'var(--on-surface-color)'}} dangerouslySetInnerHTML={{ __html: suggestion.suggestedRewrite.replace(/\[(.*?)\]/g, '<strong style="color: var(--primary-color)">[$1]</strong>') }}></p>
        </div>
    );
};

const themeOptions = [
  { id: 'modern', name: 'Modern', previewClass: 'bg-purple-600' },
  { id: 'sidebar', name: 'Sidebar', previewClass: 'bg-slate-800' },
  { id: 'classic', name: 'Classic', previewClass: 'bg-gray-800' },
  { id: 'structured', name: 'Structured', previewClass: 'bg-gray-500' },
  { id: 'creative', name: 'Creative', previewClass: 'bg-teal-600' },
  { id: 'metropolis', name: 'Metropolis', previewClass: 'bg-slate-700' },
  { id: 'chronicle', name: 'Chronicle', previewClass: 'bg-red-900' },
  { id: 'matrix', name: 'Matrix', previewClass: 'bg-blue-900' },
  { id: 'executive', name: 'Executive', previewClass: 'bg-blue-800' },
  { id: 'quantum', name: 'Quantum', previewClass: 'bg-gray-900' },
  { id: 'garamond', name: 'Garamond', previewClass: 'bg-gray-200' },
  { id: 'vibrant', name: 'Vibrant', previewClass: 'bg-pink-500' },
];

const ResultsStep: React.FC<ResultsStepProps> = ({ response, onStartOver, initialTheme, setError }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [activeResume, setActiveResume] = useState<UserProfile>(response.tailoredResume);

  const { evaluation, headlineSuggestions } = response;
  const overallScore = evaluation.overallScore;
  const scoreBreakdown: ScoreBreakdown = evaluation.scoreBreakdown;
  const circumference = 2 * Math.PI * 52; // For the SVG gauge

  useEffect(() => {
    setActiveResume(response.tailoredResume);
  }, [response]);

  const handleDownloadPdf = async () => {
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) {
        setError("Resume preview could not be found for PDF generation.");
        return;
    }
    setError(null);
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(resumeElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${activeResume.fullName.replace(' ', '_')}_Resume.pdf`);
    } catch (error) {
      console.error('[ResultsStep] PDF generation error:', error);
      setError("Failed to generate PDF. Your browser might be blocking the download or the document is too large.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyToClipboard = () => {
    const textToCopy = resumeToText(activeResume);
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500); 
    }, (err) => {
      console.error('[ResultsStep] Copy to clipboard failed:', err);
      setError("Failed to copy text. Please try selecting the text manually.");
    });
  };

  const swapHeadline = (newHeadline: string) => {
    setActiveResume(prev => ({ ...prev, resumeHeadline: newHeadline }));
  };
  
  const atsExplanation = (
      <>
          <p className="font-bold mb-1">What is this score?</p>
          <p>
              Applicant Tracking Systems (ATS) are automated bots that scan your resume before a human sees it.
              This score reflects how easily the ATS can parse your resume's layout, headings, and keywords.
          </p>
      </>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 fade-in">
       <style>{`
        .btn-success-indicator {
            border-color: var(--success-color) !important;
            color: var(--success-color) !important;
        }
        .btn-success-indicator:hover {
            background-color: rgba(3, 218, 197, 0.1) !important;
        }
      `}</style>
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold mb-2" style={{ color: 'var(--on-surface-color)' }}>Congratulations! Your New Resume is Ready.</h2>
        <p className="text-lg" style={{ color: 'var(--on-surface-variant-color)' }}>
          We've tailored your experience and provided a detailed analysis to help you land the interview.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6 sticky top-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--on-surface-color)' }}>Resume Analysis</h3>
            
            <div className="text-center p-6 rounded-lg" style={{backgroundColor: 'var(--surface-bright-color)'}}>
                <p className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--on-surface-variant-color)' }}>Overall Match Score</p>
                <div className="relative inline-block my-2">
                    <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" style={{ stroke: 'var(--outline-color)' }} />
                        <circle
                            cx="60"
                            cy="60"
                            r="52"
                            fill="none"
                            strokeWidth="10"
                            strokeLinecap="round"
                            style={{ stroke: 'var(--primary-color)', strokeDasharray: circumference, strokeDashoffset: circumference - (overallScore / 100) * circumference, transition: 'stroke-dashoffset 0.5s ease-out' }}
                        />
                    </svg>
                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold" style={{ color: 'var(--on-surface-color)'}}>{overallScore}%</p>
                </div>
                <p className="text-sm" style={{ color: 'var(--on-surface-variant-color)' }}>{evaluation.overallAnalysis}</p>
                 {overallScore < 75 && <p className="text-xs font-semibold mt-2" style={{ color: 'var(--error-color)'}}>Recommended score is 75% or higher.</p>}
            </div>

            <div className="mt-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--on-surface-variant-color)' }}>
                    <SparklesIcon className="w-5 h-5" style={{ color: 'var(--primary-color)'}} />
                    Alternative Headlines
                </h4>
                <div className="space-y-2">
                    {headlineSuggestions.map((headline, idx) => (
                        <button 
                            key={idx}
                            onClick={() => swapHeadline(headline)}
                            className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${activeResume.resumeHeadline === headline ? 'border-purple-500 bg-purple-500/10' : 'border-outline-color hover:border-purple-500/50 bg-surface-bright-color'}`}
                        >
                            {headline}
                        </button>
                    ))}
                    <p className="text-[10px] italic mt-1" style={{ color: 'var(--on-surface-variant-color)' }}>
                        Click a headline to swap it in the preview.
                    </p>
                </div>
            </div>
            
            <div className="mt-6 space-y-4">
                <h4 className="font-semibold" style={{ color: 'var(--on-surface-variant-color)' }}>Analysis Breakdown:</h4>
                <ScoreCard title="Hard Skills Match" {...scoreBreakdown.hardSkillsMatch} />
                <ScoreCard title="Soft Skills & Action Verbs" {...scoreBreakdown.softSkillsAndVerbsMatch} />
                <ScoreCard title="Quantifiable Achievements" {...scoreBreakdown.quantifiableAchievements} />
                <ScoreCard title="ATS Readability & Formatting" {...scoreBreakdown.atsReadabilityAndFormatting} explanation={atsExplanation} />
            </div>

            {evaluation.quantificationSuggestions && evaluation.quantificationSuggestions.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--on-surface-variant-color)' }}>
                        <SparklesIcon className="w-5 h-5" style={{ color: 'var(--primary-color)'}} />
                        Improve Your Impact
                    </h4>
                    <div className="space-y-3">
                        {evaluation.quantificationSuggestions.map((suggestion, index) => (
                            <QuantificationSuggestionCard key={index} suggestion={suggestion} />
                        ))}
                    </div>
                </div>
            )}
            
             <div className="mt-6">
                 <h4 className="font-semibold mb-2" style={{ color: 'var(--on-surface-variant-color)' }}>Actionable Feedback:</h4>
                 <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: 'var(--on-surface-color)' }}>
                    {evaluation.actionableFeedback.map((tip, index) => (
                        <li key={index}>{tip}</li>
                    ))}
                 </ul>
             </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="btn btn-filled w-full">
              <ArrowDownTrayIcon />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download as PDF'}
            </button>
            <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleCopyToClipboard} 
                  className={`btn btn-outlined w-full transition-colors ${isCopied ? 'btn-success-indicator' : ''}`}
                >
                  {isCopied ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
                  {isCopied ? 'Copied!' : 'Copy as Text'}
                </button>
                <button onClick={onStartOver} className="btn btn-outlined w-full">
                  Start Over
                </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
            <div className="card p-4 mb-6">
              <h3 className="text-lg font-semibold text-center mb-3" style={{ color: 'var(--on-surface-color)' }}>Choose a Theme</h3>
              <div className="flex justify-center gap-2 flex-wrap">
                {themeOptions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as Theme)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all`}
                    style={{
                        borderColor: theme === t.id ? 'var(--primary-color)' : 'transparent',
                        backgroundColor: theme === t.id ? 'rgba(187, 134, 252, 0.2)' : 'var(--surface-bright-color)'
                    }}
                    aria-pressed={theme === t.id}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded-full ${t.previewClass}`}></span>
                      <span className="font-semibold text-sm" style={{ color: 'var(--on-surface-color)' }}>{t.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <ResumePreview resumeData={activeResume} theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default ResultsStep;
