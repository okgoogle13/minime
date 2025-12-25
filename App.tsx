
import React, { useState, useCallback, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from './firebaseConfig';
import LoginStep from './components/LoginStep';
import JobSearchStep from './components/JobSearchStep';
import JobInputStep from './components/JobInputStep';
import ProfileSetupStep from './components/ProfileSetupStep';
import VerificationStep from './components/VerificationStep';
import GenerationStep from './components/GenerationStep';
import ResultsStep from './components/ResultsStep';
import AnalyzingStep from './components/AnalyzingStep';
import JobVerificationStep from './components/JobVerificationStep';
import TemplateSelectionStep from './components/TemplateSelectionStep';
import { callAnalyzeJobDescriptionFunction, callGenerateResumeFunction, callSearchJobsFunction } from './services/geminiService';
import { getUserProfile, saveUserProfile } from './services/firestoreService';
import type { AIResponse, JobAnalysis, Job, UserProfile } from './types';
import type { Theme } from './components/ResumePreview';
import { SparklesIcon } from './components/icons/SparklesIcon';

type Step = 'LOGIN' | 'PROFILE_SETUP' | 'JOB_SEARCH' | 'JOB_INPUT' | 'ANALYZING_JOB' | 'JOB_VERIFICATION' | 'TEMPLATE_SELECTION' | 'FINAL_VERIFICATION' | 'GENERATION' | 'RESULTS';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('LOGIN');
  const [user, setUser] = useState<firebase.User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<Job[] | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Theme>('modern');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsProfileLoading(true);
        setError(null);
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
          if (profile) {
            setStep(prev => prev === 'LOGIN' || prev === 'PROFILE_SETUP' ? 'JOB_SEARCH' : prev);
          } else {
            setStep('PROFILE_SETUP');
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : "Could not load your profile. Please try refreshing the page.");
        } finally {
          setIsProfileLoading(false);
        }
      } else {
        handleStartOver(true);
        setIsProfileLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);
  
  const handleProfileSave = useCallback(async (profile: UserProfile) => {
      if (!user) {
          setError("You must be logged in to save a profile.");
          return;
      }
      setError(null);
      setUserProfile(profile);
      try {
          await saveUserProfile(user.uid, profile);
          setStep('JOB_SEARCH');
      } catch(err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred while saving.');
          setStep('PROFILE_SETUP');
      }
  }, [user]);

  const handleJobSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setError(null);
    setSearchResults(null);
    try {
        const results = await callSearchJobsFunction(query);
        setSearchResults(results);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during job search.');
        setSearchResults([]);
    } finally {
        setIsSearching(false);
    }
  }, []);

  const handleJobSelection = useCallback(async (jobDescription: string) => {
    setError(null);
    if (!jobDescription) {
      setStep('JOB_INPUT');
      return;
    }
    setStep('ANALYZING_JOB');
    try {
      const analysis = await callAnalyzeJobDescriptionFunction(jobDescription);
      setJobAnalysis(analysis);
      setStep('JOB_VERIFICATION');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
      setStep('JOB_SEARCH');
    }
  }, []);

  const handleJobVerificationNext = () => {
      setError(null);
      setStep('TEMPLATE_SELECTION');
  };
  
  const handleJobAnalysisUpdate = (updatedAnalysis: JobAnalysis) => setJobAnalysis(updatedAnalysis);
  
  const handleTemplateSelectionNext = (template: Theme) => {
    setError(null);
    setSelectedTemplate(template);
    setStep('FINAL_VERIFICATION');
  };

  const handleVerificationConfirm = useCallback(async () => {
    if (!jobAnalysis || !userProfile) {
        setError("Missing job analysis or profile context.");
        setStep('JOB_SEARCH');
        return;
    }
    setStep('GENERATION');
    setError(null);
    try {
      const response = await callGenerateResumeFunction(jobAnalysis, userProfile);
      setAiResponse(response);
      setStep('RESULTS');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
      setStep('FINAL_VERIFICATION');
    }
  }, [jobAnalysis, userProfile]);

  const handleStartOver = (isLogout: boolean = false) => {
    setStep(isLogout ? 'LOGIN' : 'JOB_SEARCH');
    setSearchResults(null);
    setIsSearching(false);
    setJobAnalysis(null);
    setSelectedTemplate('modern');
    setAiResponse(null);
    setError(null);
    if (isLogout) setUserProfile(null);
  };
  
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      setError("Failed to sign out. Please try again.");
    }
  };

  const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
    <div className="max-w-4xl mx-auto mb-6 p-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'rgba(207, 102, 121, 0.15)', border: '1px solid var(--error-color)' }} role="alert">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{color: 'var(--error-color)'}}>
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium" style={{ color: 'var(--on-surface-color)'}}>{message}</span>
      </div>
      <button onClick={() => setError(null)} className="text-xs uppercase font-bold tracking-widest opacity-70 hover:opacity-100 transition-opacity" style={{ color: 'var(--on-surface-color)'}}>Dismiss</button>
    </div>
  );
  
  const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-16">
        <SparklesIcon className="w-12 h-12 mx-auto animate-pulse" style={{ color: 'var(--primary-color)' }} />
        <p className="mt-4" style={{ color: 'var(--on-surface-variant-color)' }}>{message}</p>
    </div>
  );

  const renderStep = () => {
    if (isProfileLoading) return <LoadingScreen message="Accessing your career data..." />;
    if (!user) return <LoginStep setError={setError} />;
    
    switch (step) {
      case 'LOGIN': return <LoadingScreen message="Finalizing authentication..." />;
      case 'PROFILE_SETUP': return <ProfileSetupStep onSave={handleProfileSave} initialProfile={userProfile} user={user} jobAnalysis={jobAnalysis} setError={setError} />;
      case 'JOB_SEARCH':
        return <JobSearchStep onSearch={handleJobSearch} onSelect={handleJobSelection} isSearching={isSearching} results={searchResults} />;
      case 'JOB_INPUT':
        return <JobInputStep jobDescription="" onNext={handleJobSelection} />;
      case 'ANALYZING_JOB': return <AnalyzingStep />;
      case 'JOB_VERIFICATION':
        return <JobVerificationStep analysis={jobAnalysis} onNext={handleJobVerificationNext} onBack={() => { setError(null); setStep('JOB_SEARCH'); }} onUpdate={handleJobAnalysisUpdate} />;
      case 'TEMPLATE_SELECTION':
        return <TemplateSelectionStep onNext={handleTemplateSelectionNext} onBack={() => { setError(null); setStep('JOB_VERIFICATION'); }} initialTemplate={selectedTemplate} />;
      case 'FINAL_VERIFICATION':
        return <VerificationStep jobTitle={jobAnalysis?.jobTitle || 'the selected job'} onConfirm={handleVerificationConfirm} onBack={() => { setError(null); setStep('TEMPLATE_SELECTION'); }} />;
      case 'GENERATION': return <GenerationStep />;
      case 'RESULTS':
        if (!aiResponse) return <div className="text-center py-12">Error: No tailored resume data found. <button onClick={() => handleStartOver()} className="btn btn-filled mt-4">Return Home</button></div>
        return <ResultsStep response={aiResponse} onStartOver={() => handleStartOver()} initialTheme={selectedTemplate} setError={setError} />;
      default: return <LoginStep setError={setError} />;
    }
  };

  return (
    <div className="min-h-screen">
      <header style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--outline-color)'}}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleStartOver()}>
              <SparklesIcon className="w-8 h-8" style={{color: 'var(--primary-color)'}} />
              <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--on-surface-color)'}}>Resume Copilot</h1>
           </div>
           {user && (
              <div className="flex items-center gap-4">
                 <span className="text-sm hidden sm:inline" style={{ color: 'var(--on-surface-variant-color)'}}>Hello, {user.displayName || user.email?.split('@')[0]}</span>
                  {step !== 'PROFILE_SETUP' && (
                    <button onClick={() => { setError(null); setStep('PROFILE_SETUP'); }} className="text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-opacity" style={{color: 'var(--primary-color)'}}>
                      Profile
                    </button>
                  )}
                 <button onClick={handleSignOut} className="text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-opacity" style={{color: 'var(--primary-color)'}}>
                   Sign Out
                 </button>
              </div>
            )}
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorAlert message={error} />}
        {renderStep()}
      </main>
      <footer className="text-center py-8 border-t border-white/5">
        <p className="text-xs uppercase tracking-widest font-bold" style={{color: 'var(--on-surface-variant-color)'}}>&copy; {new Date().getFullYear()} Resume Copilot &bull; Powered by Gemini 3 Pro</p>
      </footer>
    </div>
  );
};

export default App;
