
import React, { useState, useEffect } from 'react';
import type { UserProfile, Experience, Education, SkillCategory, Certification, Training } from '../types';
import firebase from 'firebase/compat/app';
import { SparklesIcon } from './icons/SparklesIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ProfileSetupStepProps {
  onSave: (profile: UserProfile) => void;
  initialProfile: UserProfile | null;
  user: firebase.User;
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

const ProfileSetupStep: React.FC<ProfileSetupStepProps> = ({ onSave, initialProfile, user }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || createEmptyProfile(user));
  const [isSaving, setIsSaving] = useState(false);

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
    onSave(profile);
  };

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

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
      <div className="card p-6">
          <h3 className="text-xl font-bold mb-4 border-b pb-2" style={{borderColor: 'var(--outline-color)'}}>{title}</h3>
          <div className="space-y-4">{children}</div>
      </div>
  );
  
  const InputField = ({ label, name, value, onChange, type = 'text', required = false, placeholder = '' }: { label: string, name: string, value: string, onChange: any, type?: string, required?: boolean, placeholder?: string }) => (
      <div>
          <label htmlFor={name} className="block text-sm font-medium mb-1" style={{color: 'var(--on-surface-variant-color)'}}>{label}</label>
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
              />
              <p className="text-[10px] mt-1 italic" style={{color: 'var(--on-surface-variant-color)'}}>This acts as your primary title on generated resumes.</p>
            </div>
        </Section>
        
        <Section title="Career Summary">
            <TextAreaField label="Professional Summary" name="careerSummary" value={profile.careerSummary} onChange={handleInputChange} rows={5} required />
        </Section>
        
        <Section title="Work Experience">
            {profile.experience.map((exp, index) => (
                <div key={index} className="p-4 rounded-lg relative" style={{backgroundColor: 'var(--surface-bright-color)'}}>
                    <button type="button" onClick={() => removeItem('experience', index)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20"><TrashIcon className="w-5 h-5" style={{color: 'var(--error-color)'}} /></button>
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
            <button type="button" onClick={() => addItem<Experience>('experience', { jobTitle: '', organization: '', location: '', startDate: '', endDate: '', description: '', responsibilities: [], achievement: '' })} className="btn btn-outlined w-full">Add Experience</button>
        </Section>

         <Section title="Education">
            {profile.education.map((edu, index) => (
                <div key={index} className="p-4 rounded-lg relative" style={{backgroundColor: 'var(--surface-bright-color)'}}>
                     <button type="button" onClick={() => removeItem('education', index)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-500/20"><TrashIcon className="w-5 h-5" style={{color: 'var(--error-color)'}} /></button>
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

        <div className="text-center mt-8">
            <button type="submit" disabled={isSaving} className="btn btn-filled w-full sm:w-auto">
                {isSaving ? 'Saving...' : 'Save Profile & Continue'}
                <SparklesIcon className="w-5 h-5" />
            </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetupStep;
