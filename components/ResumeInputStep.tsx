
import React, { useState, useCallback } from 'react';
// Fix: Use Firebase v8 namespaced API for storage and auth types to resolve import errors.
import { storage } from '../firebaseConfig';
// Fix: Update imports to use the v9 compat library for v8 syntax support.
// Fix: Corrected firebase import to use compat library for v8 namespaced API.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { DocumentArrowUpIcon } from './icons/DocumentArrowUpIcon';

interface ResumeInputStepProps {
  onNext: (storagePath: string, fileName: string) => void;
  onBack: () => void;
  // Fix: Use User type from v8 SDK.
  user: firebase.User;
}

const ResumeInputStep: React.FC<ResumeInputStepProps> = ({ onNext, onBack, user }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [storagePath, setStoragePath] = useState('');

  const handleFileChange = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile) return;
    if (!user) {
        setError("You must be logged in to upload a resume.");
        return;
    }

    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File is too large. Please upload a PDF under 5MB.');
      return;
    }

    setError('');
    setFile(selectedFile);
    setIsUploading(true);
    setUploadComplete(false);

    const filePath = `resumes/${user.uid}/${Date.now()}_${selectedFile.name}`;
    // Fix: Use v8 storage ref method.
    const storageRef = storage.ref(filePath);

    try {
      // Fix: Use v8 storage upload method.
      await storageRef.put(selectedFile);
      setStoragePath(filePath);
      setUploadComplete(true);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Could not upload the file. Please check your connection and try again.');
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFileChange(files[0]);
  };
  const handleNext = () => {
    if (!uploadComplete || !storagePath || !file) {
      setError('Please wait for the upload to complete before proceeding.');
      return;
    }
    setError('');
    onNext(storagePath, file.name);
  };
  
  const handleRemoveFile = () => { 
      // Note: This doesn't delete from storage, assumes user will upload a new file.
      // A production app might want to delete the file from storage here.
      setFile(null); 
      setError('');
      setUploadComplete(false);
      setStoragePath('');
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12 fade-in">
      <h2 className="text-3xl font-bold mb-2" style={{color: 'var(--on-surface-color)'}}>Step 4: Upload Your Current Resume</h2>
      <p className="mb-8" style={{color: 'var(--on-surface-variant-color)'}}>
        Upload your resume in PDF format. This will be the source material our AI uses to craft your new, tailored resume based on the template you selected.
      </p>
      
      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative block w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors"
          style={{ borderColor: isDragging ? 'var(--primary-color)' : 'var(--outline-color)'}}
        >
          <DocumentArrowUpIcon className="mx-auto h-12 w-12" style={{color: 'var(--on-surface-variant-color)'}} />
          <span className="mt-2 block text-sm font-semibold" style={{color: 'var(--on-surface-color)'}}>
            Drag and drop a PDF file here, or click to select a file
          </span>
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            accept=".pdf"
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
          />
        </div>
      ) : (
        <div className="text-left p-4 rounded-lg" style={{backgroundColor: 'var(--surface-bright-color)'}}>
            <h4 className="font-semibold" style={{color: 'var(--on-surface-color)'}}>Selected File:</h4>
            <div className="flex items-center justify-between mt-2">
                <p className="text-sm truncate" style={{color: 'var(--on-surface-variant-color)'}}>{file.name}</p>
                {!isUploading &&
                    <button onClick={handleRemoveFile} className="ml-4 text-sm font-medium" style={{color: 'var(--error-color)'}}>Remove</button>
                }
            </div>
            {isUploading && <p className="text-sm mt-2" style={{color: 'var(--primary-color)'}}>Uploading...</p>}
            {uploadComplete && <p className="text-sm mt-2" style={{color: 'var(--success-color)'}}>Upload successful!</p>}
        </div>
      )}
      
      {error && <p className="text-sm mt-4" style={{color: 'var(--error-color)'}}>{error}</p>}

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
         <button
          onClick={onBack}
          className="btn btn-outlined w-full sm:w-auto"
        >
          <ArrowLeftIcon />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={isUploading || !uploadComplete}
          className="btn btn-filled w-full sm:w-auto"
        >
          Next Step
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default ResumeInputStep;
