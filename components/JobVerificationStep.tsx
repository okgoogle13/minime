import React, { useState, useEffect, useRef } from 'react';
import type { JobAnalysis } from '../types';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';


type ListKey = 'keywords' | 'minimumRequirements' | 'keyResponsibilitiesAndKpis' | 'valuedOutcomes' | 'roleSpecificHardSkills' | 'companyNicheAndValues' | 'desirableAttributes';

interface JobVerificationStepProps {
  analysis: JobAnalysis | null;
  onNext: () => void;
  onBack: () => void;
  onUpdate: (updatedAnalysis: JobAnalysis) => void;
}

const tooltips = {
  keyResponsibilitiesAndKpis: "This helps us use the right action verbs and frame your experience in the context of the job's daily tasks.",
  minimumRequirements: "These are must-haves. We'll ensure your resume clearly highlights these qualifications to pass initial screenings.",
  desirableAttributes: "Including these 'nice-to-have' skills can make you stand out from other qualified candidates.",
  valuedOutcomes: "This tells us what success looks like in this role. We'll use this to frame your achievements in terms of impact (e.g., saved money, increased efficiency).",
  keywords: "Crucial for passing Applicant Tracking Systems (ATS). We'll weave these throughout your resume to maximize your match score.",
  roleSpecificHardSkills: "These are the specific technical abilities for the role. We'll create a dedicated section to showcase your proficiency.",
  companyNicheAndValues: "Using the company's own language helps build rapport and show you're a good cultural fit.",
};

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="relative group flex items-center">
    <InformationCircleIcon className="w-4 h-4" style={{ color: 'var(--on-surface-variant-color)' }} />
    <div 
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2 text-xs text-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
      style={{ backgroundColor: 'var(--surface-bright-color)', color: 'var(--on-surface-color)', border: '1px solid var(--outline-hover-color)'}}
      role="tooltip"
    >
      {text}
    </div>
  </div>
);

const SkillChip: React.FC<{ text: string, colorStyle: 'primary' | 'secondary' | 'neutral', isEditing?: boolean, onDelete?: () => void }> = ({ text, colorStyle, isEditing, onDelete }) => {
    const styles = {
        primary: {
            backgroundColor: 'rgba(187, 134, 252, 0.15)',
            color: 'var(--primary-color)'
        },
        secondary: {
            backgroundColor: 'rgba(3, 218, 197, 0.15)',
            color: 'var(--success-color)'
        },
        neutral: {
            backgroundColor: 'var(--surface-bright-color)',
            color: 'var(--on-surface-variant-color)',
            border: '1px solid var(--outline-color)'
        }
    };
    return (
        <span style={styles[colorStyle]} className="flex items-center text-sm font-medium px-3 py-1.5 rounded-full">
            {text}
            {isEditing && onDelete && (
                <button 
                    onClick={onDelete} 
                    className="ml-2 -mr-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', color: 'var(--on-surface-color)'}}
                    aria-label={`Remove skill ${text}`}
                >
                    &times;
                </button>
            )}
        </span>
    );
};

const SkillSection: React.FC<{ 
    title: string; 
    tooltipText: string;
    items: string[]; 
    chipStyle: 'primary' | 'secondary' | 'neutral';
    isEditing: boolean;
    onItemAdd: (item: string) => void;
    onItemDelete: (index: number) => void;
}> = ({ title, tooltipText, items, chipStyle, isEditing, onItemAdd, onItemDelete }) => {
  const [newItem, setNewItem] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
      if (newItem.trim()) {
          onItemAdd(newItem.trim());
          setNewItem('');
          inputRef.current?.focus();
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleAdd();
    }
  };

  if (!isEditing && (!items || items.length === 0)) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h4 className="text-lg font-semibold" style={{ color: 'var(--on-surface-color)' }}>{title}</h4>
        <Tooltip text={tooltipText} />
      </div>
      <div className="flex flex-wrap gap-2">
        {items && items.map((item, index) => (
          <SkillChip key={index} text={item} colorStyle={chipStyle} isEditing={isEditing} onDelete={() => onItemDelete(index)} />
        ))}
        {isEditing && items && items.length === 0 && <p className="text-sm" style={{color: 'var(--on-surface-variant-color)'}}>No items listed. Add one below.</p>}
      </div>
      {isEditing && (
          <div className="mt-4 flex items-center rounded-lg overflow-hidden" style={{border: '1px solid var(--outline-color)', backgroundColor: 'var(--surface-bright-color)'}}>
              <input 
                ref={inputRef}
                type="text" 
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Add a new item...`}
                className="flex-grow px-3 py-2 text-sm bg-transparent focus:outline-none"
                style={{ color: 'var(--on-surface-color)' }}
                aria-label={`Add new item to ${title}`}
              />
              <button 
                onClick={handleAdd} 
                className="px-4 py-2 text-sm font-semibold transition-colors"
                style={{backgroundColor: 'var(--primary-color)', color: 'var(--on-primary-color)'}}
              >
                Add
              </button>
          </div>
      )}
    </div>
  );
};


const EditableListSection: React.FC<{ 
    title: string;
    tooltipText: string;
    items: string[]; 
    isEditing: boolean;
    onItemAdd: (item: string) => void;
    onItemDelete: (index: number) => void;
    onItemEdit: (index: number, value: string) => void;
}> = ({ title, tooltipText, items, isEditing, onItemAdd, onItemDelete, onItemEdit }) => {
    const [newItem, setNewItem] = useState('');
    const handleAdd = () => {
        if (newItem.trim()) {
            onItemAdd(newItem.trim());
            setNewItem('');
        }
    };

    if (!isEditing && (!items || items.length === 0)) return null;

    return (
        <div>
            <div className="flex items-center gap-2 border-b pb-3 mb-4" style={{ borderColor: 'var(--outline-color)' }}>
              <h3 className="text-xl font-bold" style={{ color: 'var(--on-surface-color)' }}>{title}</h3>
              <Tooltip text={tooltipText} />
            </div>
            <div className="space-y-3">
                {isEditing ? (
                   <>
                     {items.map((item, index) => (
                         <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => onItemEdit(index, e.target.value)}
                                className="text-field text-sm"
                                style={{textAlign: 'left', padding: '0.5rem 0.75rem'}}
                            />
                            <button onClick={() => onItemDelete(index)} className="p-2 rounded-full transition-colors hover:bg-red-500/20" aria-label={`Delete item`}>
                                <TrashIcon className="w-5 h-5" style={{color: 'var(--error-color)'}} />
                            </button>
                         </div>
                     ))}
                      <div className="mt-4 flex items-center rounded-lg overflow-hidden" style={{border: '1px solid var(--outline-color)', backgroundColor: 'var(--surface-bright-color)'}}>
                        <input 
                            type="text" 
                            value={newItem}
                            onChange={e => setNewItem(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                            placeholder="Add a new item..."
                            className="flex-grow px-3 py-2 text-sm bg-transparent focus:outline-none"
                            style={{ color: 'var(--on-surface-color)' }}
                        />
                        <button onClick={handleAdd} className="px-4 py-2 text-sm font-semibold transition-colors" style={{backgroundColor: 'var(--primary-color)', color: 'var(--on-primary-color)'}}>Add</button>
                    </div>
                   </>
                ) : (
                    <ul className="list-disc list-inside space-y-2" style={{color: 'var(--on-surface-variant-color)'}}>
                       {items.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                )}
            </div>
        </div>
    )
}

const JobVerificationStep: React.FC<JobVerificationStepProps> = ({ analysis, onNext, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableAnalysis, setEditableAnalysis] = useState<JobAnalysis | null>(analysis);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  
  useEffect(() => {
    setEditableAnalysis(analysis);
  }, [analysis]);

  const handleFieldChange = (field: keyof JobAnalysis, value: string) => {
    setEditableAnalysis(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleListChange = (field: ListKey, action: 'add' | 'delete' | 'edit', value: string | number, index?: number) => {
    setEditableAnalysis(prev => {
        if (!prev) return null;
        const currentList = prev[field] || [];
        let newList;
        if (action === 'add' && typeof value === 'string') {
            newList = [...currentList, value];
        } else if (action === 'delete' && typeof value === 'number') {
            newList = currentList.filter((_, i) => i !== value);
        } else if (action === 'edit' && typeof value === 'string' && typeof index === 'number') {
            newList = [...currentList];
            newList[index] = value;
        }
        else {
            return prev;
        }
        return { ...prev, [field]: newList };
    });
  };

  const handleSave = () => {
      if (editableAnalysis) {
          onUpdate(editableAnalysis);
      }
      setIsEditing(false);
  };

  const handleCancel = () => {
      setEditableAnalysis(analysis);
      setIsEditing(false);
  };
  
  if (!editableAnalysis) {
    return (
      <div className="text-center py-12">
        <p className="mb-4" style={{ color: 'var(--on-surface-variant-color)' }}>No job analysis data available. Please go back and try again.</p>
        <button onClick={onBack} className="btn btn-outlined mx-auto"><ArrowLeftIcon /> Back</button>
      </div>
    );
  }

  const ConfirmationDialog = () => (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
    >
        <div className="card max-w-sm w-full p-6 text-center fade-in">
            <h2 id="dialog-title" className="text-xl font-bold mb-2">Enable Editing?</h2>
            <p className="text-sm mb-6" style={{color: 'var(--on-surface-variant-color)'}}>
                The AI's extraction is usually accurate. Only edit if you notice a significant error or missing information.
            </p>
            <div className="flex justify-center gap-4">
                <button onClick={() => setShowConfirmationDialog(false)} className="btn btn-outlined">Cancel</button>
                <button 
                    onClick={() => {
                        setIsEditing(true);
                        setShowConfirmationDialog(false);
                    }} 
                    className="btn btn-filled"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 fade-in">
      {showConfirmationDialog && <ConfirmationDialog />}

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--on-surface-color)' }}>Step 2: Verify Extracted Job Details</h2>
        <p className="mb-8" style={{ color: 'var(--on-surface-variant-color)' }}>
          Review the AI-extracted details. If anything is incorrect, click "Edit" to make changes.
        </p>
      </div>

      <div className="card p-6 sm:p-8 space-y-8">
        <div className="flex justify-between items-start">
            <div className="text-center flex-grow border-b pb-6" style={{ borderColor: 'var(--outline-color)' }}>
              {isEditing ? (
                  <div className="space-y-2">
                      <div>
                          <label htmlFor="jobTitleInput" className="sr-only">Job Title</label>
                          <input
                              id="jobTitleInput"
                              type="text"
                              value={editableAnalysis.jobTitle}
                              onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                              className="text-field text-2xl font-bold"
                              style={{ padding: '0.5rem' }}
                              aria-label="Job Title"
                          />
                      </div>
                      <div>
                          <label htmlFor="companyNameInput" className="sr-only">Company Name</label>
                          <input
                              id="companyNameInput"
                              type="text"
                              value={editableAnalysis.companyName}
                              onChange={(e) => handleFieldChange('companyName', e.target.value)}
                              className="text-field text-lg"
                              style={{ padding: '0.5rem', color: 'var(--on-surface-variant-color)' }}
                              aria-label="Company Name"
                          />
                      </div>
                  </div>
              ) : (
                  <>
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--on-surface-color)' }}>{editableAnalysis.jobTitle || 'Job Title Not Found'}</h3>
                    <p className="text-lg mt-1" style={{ color: 'var(--on-surface-variant-color)' }}>{editableAnalysis.companyName || 'Company Not Found'}</p>
                  </>
              )}
            </div>
            {!isEditing && (
              <button onClick={() => setShowConfirmationDialog(true)} className="btn btn-outlined ml-4"><PencilIcon className="w-5 h-5" /> Edit</button>
            )}
        </div>
        
        <div className="space-y-6">
            <EditableListSection 
                title="Key Responsibilities & KPIs"
                tooltipText={tooltips.keyResponsibilitiesAndKpis}
                items={editableAnalysis.keyResponsibilitiesAndKpis}
                isEditing={isEditing}
                onItemAdd={(item) => handleListChange('keyResponsibilitiesAndKpis', 'add', item)}
                onItemDelete={(index) => handleListChange('keyResponsibilitiesAndKpis', 'delete', index)}
                onItemEdit={(index, value) => handleListChange('keyResponsibilitiesAndKpis', 'edit', value, index)}
            />

            <EditableListSection 
                title="Minimum Job Requirements"
                tooltipText={tooltips.minimumRequirements}
                items={editableAnalysis.minimumRequirements}
                isEditing={isEditing}
                onItemAdd={(item) => handleListChange('minimumRequirements', 'add', item)}
                onItemDelete={(index) => handleListChange('minimumRequirements', 'delete', index)}
                onItemEdit={(index, value) => handleListChange('minimumRequirements', 'edit', value, index)}
            />

            <EditableListSection 
                title="Desirable Attributes"
                tooltipText={tooltips.desirableAttributes}
                items={editableAnalysis.desirableAttributes}
                isEditing={isEditing}
                onItemAdd={(item) => handleListChange('desirableAttributes', 'add', item)}
                onItemDelete={(index) => handleListChange('desirableAttributes', 'delete', index)}
                onItemEdit={(index, value) => handleListChange('desirableAttributes', 'edit', value, index)}
            />

            <EditableListSection 
                title="Valued Outcomes & Deliverables"
                tooltipText={tooltips.valuedOutcomes}
                items={editableAnalysis.valuedOutcomes}
                isEditing={isEditing}
                onItemAdd={(item) => handleListChange('valuedOutcomes', 'add', item)}
                onItemDelete={(index) => handleListChange('valuedOutcomes', 'delete', index)}
                onItemEdit={(index, value) => handleListChange('valuedOutcomes', 'edit', value, index)}
            />

            <div className="border-b" style={{ borderColor: 'var(--outline-color)' }}></div>
            
            <SkillSection title="Keywords" tooltipText={tooltips.keywords} items={editableAnalysis.keywords} chipStyle='primary' isEditing={isEditing} onItemAdd={(s) => handleListChange('keywords', 'add', s)} onItemDelete={(i) => handleListChange('keywords', 'delete', i)} />
            <SkillSection title="Role-Specific Hard Skills" tooltipText={tooltips.roleSpecificHardSkills} items={editableAnalysis.roleSpecificHardSkills} chipStyle='secondary' isEditing={isEditing} onItemAdd={(s) => handleListChange('roleSpecificHardSkills', 'add', s)} onItemDelete={(i) => handleListChange('roleSpecificHardSkills', 'delete', i)} />
            <SkillSection title="Company Niche & Values" tooltipText={tooltips.companyNicheAndValues} items={editableAnalysis.companyNicheAndValues} chipStyle='neutral' isEditing={isEditing} onItemAdd={(s) => handleListChange('companyNicheAndValues', 'add', s)} onItemDelete={(i) => handleListChange('companyNicheAndValues', 'delete', i)} />
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        {isEditing ? (
            <>
              <button onClick={handleCancel} className="btn btn-outlined w-full sm:w-auto">Cancel</button>
              <button onClick={handleSave} className="btn btn-filled w-full sm:w-auto">Save Changes</button>
            </>
        ) : (
            <>
              <button onClick={onBack} className="btn btn-outlined w-full sm:w-auto"><ArrowLeftIcon /> Back</button>
              <button onClick={onNext} className="btn btn-filled w-full sm:w-auto">Looks Good, Next <ArrowRightIcon /></button>
            </>
        )}
      </div>
    </div>
  );
};

export default JobVerificationStep;