
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
          setError("Could not load your profile. Please try refreshing the page.");
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
      setStep('JOB_SEARCH');
      try {
          await saveUserProfile(user.uid, profile);
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
    if (!jobDescription) {
      setStep('JOB_INPUT');
      return;
    }
    setStep('ANALYZING_JOB');
    setError(null);
    try {
      const analysis = await callAnalyzeJobDescriptionFunction(jobDescription);
      setJobAnalysis(analysis);
      setStep('JOB_VERIFICATION');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStep('JOB_SEARCH');
    }
  }, []);

  const handleJobVerificationNext = () => setStep('TEMPLATE_SELECTION');
  const handleJobAnalysisUpdate = (updatedAnalysis: JobAnalysis) => setJobAnalysis(updatedAnalysis);
  const handleTemplateSelectionNext = (template: Theme) => {
    setSelectedTemplate(template);
    setStep('FINAL_VERIFICATION');
  };

  const handleVerificationConfirm = useCallback(async () => {
    if (!jobAnalysis || !userProfile) {
        setError("Missing job analysis or profile.");
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
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
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
      setError("Failed to sign out.");
    }
  };

  const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
    <div className="max-w-4xl mx-auto -mb-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(207, 102, 121, 0.2)', border: '1px solid var(--error-color)' }} role="alert">
      <strong className="font-bold" style={{ color: 'var(--error-color)'}}>Error: </strong>
      <span className="block sm:inline" style={{ color: 'var(--on-surface-color)'}}>{message}</span>
    </div>
  );
  
  const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-16">
        <SparklesIcon className="w-12 h-12 mx-auto animate-pulse" style={{ color: 'var(--primary-color)' }} />
        <p className="mt-4" style={{ color: 'var(--on-surface-variant-color)' }}>{message}</p>
    </div>
  );

  const renderStep = () => {
    if (isProfileLoading) return <LoadingScreen message="Loading your profile..." />;
    if (!user) return <LoginStep />;
    switch (step) {
      case 'LOGIN': return <LoadingScreen message="Authenticating..." />;
      case 'PROFILE_SETUP': return <ProfileSetupStep onSave={handleProfileSave} initialProfile={userProfile} user={user} />;
      case 'JOB_SEARCH':
        return (
          <>
            {error && <ErrorAlert message={error} />}
            <JobSearchStep onSearch={handleJobSearch} onSelect={handleJobSelection} isSearching={isSearching} results={searchResults} />
          </>
        );
      case 'JOB_INPUT':
        return <JobInputStep jobDescription="" onNext={handleJobSelection} />;
      case 'ANALYZING_JOB': return <AnalyzingStep />;
      case 'JOB_VERIFICATION':
        return <JobVerificationStep analysis={jobAnalysis} onNext={handleJobVerificationNext} onBack={() => setStep('JOB_SEARCH')} onUpdate={handleJobAnalysisUpdate} />;
      case 'TEMPLATE_SELECTION':
        return <TemplateSelectionStep onNext={handleTemplateSelectionNext} onBack={() => setStep('JOB_VERIFICATION')} initialTemplate={selectedTemplate} />;
      case 'FINAL_VERIFICATION':
        return (
          <>
            {error && <ErrorAlert message={error} />}
            <VerificationStep jobTitle={jobAnalysis?.jobTitle || 'the selected job'} onConfirm={handleVerificationConfirm} onBack={() => setStep('TEMPLATE_SELECTION')} />
          </>
        );
      case 'GENERATION': return <GenerationStep />;
      case 'RESULTS':
        if (!aiResponse) return <div>Error: No response data. <button onClick={() => handleStartOver()}>Start Over</button></div>
        return <ResultsStep response={aiResponse} onStartOver={() => handleStartOver()} initialTheme={selectedTemplate} />;
      default: return <LoginStep />;
    }
  };

  return (
    <div className="min-h-screen">
      <header style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--outline-color)'}}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
           <h1 className="text-2xl font-bold" style={{ color: 'var(--on-surface-color)'}}>AI Resume Tailor</h1>
           {user && (
              <div className="flex items-center gap-4">
                 <span className="text-sm hidden sm:inline" style={{ color: 'var(--on-surface-variant-color)'}}>Welcome, {user.displayName || user.email}</span>
                  {step !== 'PROFILE_SETUP' && <button onClick={() => setStep('PROFILE_SETUP')} className="text-sm font-medium" style={{color: 'var(--primary-color)'}}>Edit Profile</button>}
                 <button onClick={handleSignOut} className="text-sm font-medium" style={{color: 'var(--primary-color)'}}>Sign Out</button>
              </div>
            )}
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStep()}
      </main>
      <footer className="text-center py-4">
        <p className="text-sm" style={{color: 'var(--on-surface-variant-color)'}}>&copy; {new Date().getFullYear()} AI Resume Tailor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
