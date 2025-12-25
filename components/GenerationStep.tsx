
import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const loadingStages = [
  { threshold: 0, message: 'Initializing Gemini 3 Pro reasoning engine...' },
  { threshold: 10, message: 'Analyzing job description requirements...' },
  { threshold: 25, message: 'Deconstructing your professional profile...' },
  { threshold: 40, message: 'Cross-referencing hard skills with ATS keywords...' },
  { threshold: 55, message: 'Generating achievement-oriented bullet points...' },
  { threshold: 70, message: 'Rewriting career summary for maximum impact...' },
  { threshold: 85, message: 'Running final ATS compatibility check...' },
  { threshold: 95, message: 'Polishing layout and formatting...' },
];

const GenerationStep: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(loadingStages[0].message);

  useEffect(() => {
    // Artificial progress logic: starts fast, slows down significantly as it nears 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return prev; // Hold at 98% until completion
        
        // Non-linear increment
        const increment = prev < 30 ? 1.5 : prev < 60 ? 0.8 : prev < 85 ? 0.4 : 0.1;
        const next = Math.min(prev + increment, 98);
        
        // Update message based on thresholds
        const stage = [...loadingStages].reverse().find(s => next >= s.threshold);
        if (stage && stage.message !== currentMessage) {
          setCurrentMessage(stage.message);
        }
        
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [currentMessage]);

  return (
    <div className="max-w-2xl mx-auto text-center py-20 fade-in">
      <div className="relative inline-block mb-10">
        {/* Pulsing Glow Effect */}
        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
        
        <div className="relative z-10 flex justify-center items-center">
          <SparklesIcon className="w-20 h-20" style={{ color: 'var(--primary-color)' }} />
        </div>
      </div>

      <h2 className="text-4xl font-black mb-4 tracking-tight" style={{ color: 'var(--on-surface-color)' }}>
        Generating Your Resume
      </h2>
      <p className="text-lg mb-10" style={{ color: 'var(--on-surface-variant-color)' }}>
        Our advanced AI is tailoring every word for your next big role.
      </p>

      <div className="space-y-4">
        {/* Progress Info */}
        <div className="flex justify-between items-end mb-2 px-1">
          <span className="text-sm font-bold uppercase tracking-widest text-purple-400">
            {currentMessage}
          </span>
          <span className="text-2xl font-mono font-bold text-white">
            {Math.floor(progress)}%
          </span>
        </div>

        {/* The Progress Bar */}
        <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
          <div 
            className="h-full transition-all duration-300 ease-out relative"
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #6200EE 0%, #BB86FC 100%)',
              boxShadow: '0 0 20px rgba(187, 134, 252, 0.4)'
            }}
          >
            {/* Animated Highlight Stripe */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 animate-shimmer"></div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
        <div className="p-4 rounded-xl border border-white/5 bg-white/5">
            <p className="text-[10px] uppercase font-bold text-purple-300 mb-1">Model</p>
            <p className="text-xs font-semibold">Gemini 3 Pro</p>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/5">
            <p className="text-[10px] uppercase font-bold text-purple-300 mb-1">Process</p>
            <p className="text-xs font-semibold">Deep Thinking Mode</p>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/5">
            <p className="text-[10px] uppercase font-bold text-purple-300 mb-1">Optimization</p>
            <p className="text-xs font-semibold">ATS-Grade Rewriting</p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default GenerationStep;
