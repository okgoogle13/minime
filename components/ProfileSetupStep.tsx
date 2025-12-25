
import React, { useState, useEffect } from 'react';
import type { UserProfile, Experience, Education, SkillCategory, Certification, Training, JobAnalysis } from '../types';
import firebase from 'firebase/compat/app';
import { SparklesIcon } from './icons/SparklesIcon';
import { TrashIcon } from './icons/TrashIcon';
import { callGenerateProfileHeadlines } from '../services/geminiService';

interface ProfileSetupStepProps {
  onSave: (profile: UserProfile) => void;
  initialProfile: UserProfile | null;
  user: firebase.User;
  jobAnalysis?: JobAnalysis | null;
  setError: (msg: string | null) => void;
}

const createEmptyProfile = (user: firebase.User): UserProfile => ({
  fullName: user.displayName || '',
  email: user.email || '',
  phone: '',
  location: '',
  resumeHeadline: '',
  careerSummary: '',
  education: [],
  experience: [],
  skills: [],
  certificationsAndDevelopment: { certifications: [], trainings: [] },
});

const ProfileSetupStep: React.FC<ProfileSetupStepProps> = ({ onSave, initialProfile, user, jobAnalysis, setError }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || createEmptyProfile(user));
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState(false);
  const [headlineSuggestions, setHeadlineSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!initialProfile) {
        setProfile(createEmptyProfile(user));
    } else {
        setProfile(initialProfile);
    }
  }, [initialProfile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    onSave(profile);
  };

  const handleSuggestHeadlines = async () => {
    if (!profile.careerSummary || profile.experience.length === 0) {
        setError("Please add work experience and a career summary first to generate relevant headlines.");
        return;
    }
    setError(null);
    setIsGeneratingHeadlines(true);
    try {
        const suggestions = await callGenerateProfileHeadlines(profile, jobAnalysis);
        setHeadlineSuggestions(suggestions);
    } catch (err) {
        console.error("[ProfileSetupStep] Headline generation failed:", err);
        setError("AI headline generation failed. Please try again or type manually.");
    } finally {
        setIsGeneratingHeadlines(false);
    }
  };

  const selectHeadline = (headline: string) => {
    setProfile(prev => ({ ...prev, resumeHeadline: headline }));
    setHeadlineSuggestions([]);
  };

  // Generic Top-Level Array Helpers
  const addItem = <T,>(field: keyof UserProfile, newItem: T) => {
    setProfile(prev => ({
        ...prev,
        [field]: [...(prev[field] as T[]), newItem]
    }));
  };
  
  const updateItem = <T,>(field: keyof UserProfile, index: number, updatedItem: T) => {
      setProfile(prev => {
          const items = [...(prev[field] as T[])];
          items[index] = updatedItem;
          return { ...prev, [field]: items };
      });
  };

  const removeItem = (field: keyof UserProfile, index: number) => {
    setProfile(prev => ({
        ...prev,
        [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  // Specialized Nested Helpers for Certifications and Trainings
  const addCertOrTraining = (subField: 'certifications' | 'trainings', newItem: any) => {
    setProfile(prev => ({
      ...prev,
      certificationsAndDevelopment: {
        ...prev.certificationsAndDevelopment,
        [subField]: [...prev.certificationsAndDevelopment[subField], newItem]
      }
    }));
  };

  const updateCertOrTraining = (subField: 'certifications' | 'trainings', index: number, updatedItem: any) => {
    setProfile(prev => {
      const list = [...prev.certificationsAndDevelopment[subField]];
      list[index] = updatedItem;
      return {
        ...prev,
        certificationsAndDevelopment: {
          ...prev.certificationsAndDevelopment,
          [subField]: list
        }
      };
    });
  };

  const removeCertOrTraining = (subField: 'certifications' | 'trainings', index: number) => {
    setProfile(prev => ({
      ...prev,
      certificationsAndDevelopment: {
        ...prev.certificationsAndDevelopment,
        [subField]: prev.certificationsAndDevelopment[subField].filter((_, i) => i !== index)
      }
    }));
  };

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
      <div className="card p-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2" style={{borderColor: 'var(--outline-color)'}}>{title}</h3>
          <div className="space-y-4">{children}</div>
      </div>
  );
  
  const InputField = ({ label, name, value, onChange, type = 'text', required = false, placeholder = '', action }: { label: string, name: string, value: string, onChange: any, type?: string, required?: boolean, placeholder?: string, action?: React.ReactNode }) => (
      <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="block text-sm font-medium" style={{color: 'var(--on-surface-variant-color)'}}>{label}</label>
            {action}
          </div>
          <input id={name} name={name} value={value} onChange={onChange} type={type} required={required} placeholder={placeholder} className="text-field" />
      </div>
  );
  
  const TextAreaField = ({ label, name, value, onChange, rows = 3, required = false }: { label: string, name: string, value: string, onChange: any, rows?: number, required?: boolean }) => (
      <div>
          <label htmlFor={name} className="block text-sm font-medium mb-1" style={{color: 'var(--on-surface-variant-color)'}}>{label}</label>
          <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} required={required} className="text-field" />
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--on-surface-color)' }}>
            {initialProfile ? 'Edit Your Professional Profile' : 'Create Your Professional Profile'}
        </h2>
        <p className="mb-8" style={{ color: 'var(--on-surface-variant-color)' }}>
          This will be your central career database. The AI will use this information to tailor documents for each job application.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Section title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Full Name" name="fullName" value={profile.fullName} onChange={handleInputChange} required />
                <InputField label="Email Address" name="email" value={profile.email} onChange={handleInputChange} type="email" required />
                <InputField label="Phone Number" name="phone" value={profile.phone} onChange={handleInputChange} type="tel" />
                <InputField label="Location (City, State)" name="location" value={profile.location} onChange={handleInputChange} />
            </div>
            
            <div className="mt-4 pt-4 border-t" style={{borderColor: 'var(--outline-color)'}}>
              <InputField 
                label="Professional Resume Headline" 
                name="resumeHeadline" 
                value={profile.resumeHeadline} 
                onChange={handleInputChange} 
                required 
                placeholder="e.g. Senior Software Engineer with 10+ Years Experience"
                action={
                    <button 
                        type="button" 
                        onClick={handleSuggestHeadlines} 
                        disabled={isGeneratingHeadlines}
                        className="text-[10px] font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                        {isGeneratingHeadlines ? (
                            <span className="w-3 h-3 border border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <SparklesIcon className="w-3 h-3" />
                        )}
                        Suggest Headlines
                    </button>
                }
              />
              
              {headlineSuggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 fade-in">
                    {headlineSuggestions.map((h, i) => (
                        <button 
                            key={i} 
                            type="button" 
                            onClick={() => selectHeadline(h)}
                            className="px-3 py-1.5 text-xs rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all"
                        >
                            {h}
                        </button>
                    ))}
                    <button 
                        type="button" 
                        onClick={() => { setHeadlineSuggestions([]); setError(null); }}
                        className="px-2 py-1.5 text-[10px] font-bold text-gray-500 uppercase"
                    >
                        Dismiss
                    </button>
                </div>
              )}
              
              <p className="text-[10px] mt-1 italic" style={{color: 'var(--on-surface-variant-color)'}}>
                This acts as your primary title. Use AI to generate suggestions based on your experience and summary.
              </p>
            </div>
        </Section>
        
        <Section title="Career Summary">
            <TextAreaField label="Professional Summary" name="careerSummary" value={profile.careerSummary} onChange={handleInputChange} rows={5} required />
        </Section>
        
        <Section title="Work Experience">
            {profile.experience.map((exp, index) => (
                <div key={index} className="p-4 rounded-lg relative border border-white/5" style={{backgroundColor: 'var(--surface-bright-color)'}}>
                    <button type="button" onClick={() => removeItem('experience', index)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20 transition-colors"><TrashIcon className="w-5 h-5" style={{color: 'var(--error-color)'}} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Job Title" name="jobTitle" value={exp.jobTitle} onChange={(e: any) => updateItem('experience', index, {...exp, jobTitle: e.target.value})} />
                        <InputField label="Company" name="organization" value={exp.organization} onChange={(e: any) => updateItem('experience', index, {...exp, organization: e.target.value})} />
                         <InputField label="Location" name="location" value={exp.location} onChange={(e: any) => updateItem('experience', index, {...exp, location: e.target.value})} />
                        <div className="flex items-center gap-2">
                             <InputField label="Start Date" name="startDate" value={exp.startDate} onChange={(e: any) => updateItem('experience', index, {...exp, startDate: e.target.value})} />
                             <InputField label="End Date" name="endDate" value={exp.endDate} onChange={(e: any) => updateItem('experience', index, {...exp, endDate: e.target.value})} />
                        </div>
                    </div>
                     <TextAreaField label="Description" name="description" value={exp.description} onChange={(e: any) => updateItem('experience', index, {...exp, description: e.target.value})} />
                    <TextAreaField label="Key Achievement" name="achievement" value={exp.achievement} onChange={(e: any) => updateItem('experience', index, {...exp, achievement: e.target.value})} />
                </div>
            ))}
            <button type="button" onClick={() => addItem<Experience>('experience', { jobTitle: '', organization: '', location: '', startDate: '', endDate: '', description: '', responsibilities: [], achievement: '' })} className="btn btn-outlined w-full">Add Work Experience</button>
        </Section>

        <Section title="Education">
            {profile.education.map((edu, index) => (
                <div key={index} className="p-4 rounded-lg relative border border-white/5" style={{backgroundColor: 'var(--surface-bright-color)'}}>
                     <button type="button" onClick={() => removeItem('education', index)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20 transition-colors"><TrashIcon className="w-5 h-5" style={{color: 'var(--error-color)'}} /></button>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Degree" name="degree" value={edu.degree} onChange={(e: any) => updateItem('education', index, {...edu, degree: e.target.value})} />
                        <InputField label="Institution" name="institution" value={edu.institution} onChange={(e: any) => updateItem('education', index, {...edu, institution: e.target.value})} />
                        <InputField label="Location" name="location" value={edu.location} onChange={(e: any) => updateItem('education', index, {...edu, location: e.target.value})} />
                        <InputField label="Graduation Year" name="graduationYear" value={edu.graduationYear} onChange={(e: any) => updateItem('education', index, {...edu, graduationYear: e.target.value})} />
                     </div>
                </div>
            ))}
             <button type="button" onClick={() => addItem<Education>('education', { degree: '', institution: '', location: '', graduationYear: '' })} className="btn btn-outlined w-full">Add Education</button>
         </Section>

        <Section title="Skills (Categorized)">
          {profile.skills.map((skillCat, index) => (
            <div key={index} className="p-4 rounded-lg relative border border-white/5" style={{backgroundColor: 'var(--surface-bright-color)'}}>
              <button type="button" onClick={() => removeItem('skills', index)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20 transition-colors"><TrashIcon className="w-5 h-5" style={{color: 'var(--error-color)'}} /></button>
              <InputField 
                label="Category Name" 
                name="category" 
                value={skillCat.category} 
                onChange={(e: any) => updateItem('skills', index, { ...skillCat, category: e.target.value })} 
                placeholder="e.g. Programming Languages, Tools, Soft Skills" 
              />
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1" style={{color: 'var(--on-surface-variant-color)'}}>Skills List (Comma separated)</label>
                <textarea 
                  className="text-field text-sm" 
                  value={skillCat.skillsList.join(', ')} 
                  onChange={(e) => {
                    const list = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                    updateItem('skills', index, { ...skillCat, skillsList: list });
                  }}
                  placeholder="React, TypeScript, Node.js..."
                  rows={2}
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addItem<SkillCategory>('skills', { category: '', skillsList: [] })} className="btn btn-outlined w-full">Add Skill Category</button>
        </Section>

        <Section title="Certifications">
          {profile.certificationsAndDevelopment.certifications.map((cert, index) => (
            <div key={index} className="p-4 rounded-lg relative border border-white/5" style={{backgroundColor: 'var(--surface-bright-color)'}}>
              <button type="button" onClick={() => removeCertOrTraining('certifications', index)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20 transition-colors"><TrashIcon className="w-5 h-5" style={{color: 'var(--error-color)'}} /></button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Name" name="name" value={cert.name} onChange={(e: any) => updateCertOrTraining('certifications', index, { ...cert, name: e.target.value })} required />
                <InputField label="Issuing Body" name="issuingBody" value={cert.issuingBody} onChange={(e: any) => updateCertOrTraining('certifications', index, { ...cert, issuingBody: e.target.value })} />
                <InputField label="Date" name="date" value={cert.date} onChange={(e: any) => updateCertOrTraining('certifications', index, { ...cert, date: e.target.value })} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addCertOrTraining('certifications', { name: '', issuingBody: '', date: '' })} className="btn btn-outlined w-full">Add Certification</button>
        </Section>

        <Section title="Professional Training & Workshops">
          {profile.certificationsAndDevelopment.trainings.map((train, index) => (
            <div key={index} className="p-4 rounded-lg relative border border-white/5" style={{backgroundColor: 'var(--surface-bright-color)'}}>
              <button type="button" onClick={() => removeCertOrTraining('trainings', index)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20 transition-colors"><TrashIcon className="w-5 h-5" style={{color: 'var(--error-color)'}} /></button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Workshop/Course Name" name="name" value={train.name} onChange={(e: any) => updateCertOrTraining('trainings', index, { ...train, name: e.target.value })} required />
                <InputField label="Provider" name="provider" value={train.provider} onChange={(e: any) => updateCertOrTraining('trainings', index, { ...train, provider: e.target.value })} />
                <InputField label="Year" name="year" value={train.year} onChange={(e: any) => updateCertOrTraining('trainings', index, { ...train, year: e.target.value })} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addCertOrTraining('trainings', { name: '', provider: '', year: '' })} className="btn btn-outlined w-full">Add Training</button>
        </Section>

        <div className="text-center mt-8 pb-10">
            <button type="submit" disabled={isSaving} className="btn btn-filled w-full sm:w-auto h-12">
                {isSaving ? 'Saving...' : 'Save Profile & Continue'}
                {!isSaving && <ArrowRightIcon className="w-5 h-5" />}
            </button>
        </div>
      </form>
    </div>
  );
};

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

export default ProfileSetupStep;
