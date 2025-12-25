

import React, { useState } from 'react';
// Fix: Use Firebase v8 namespaced API for authentication to resolve import errors.
// Fix: Update imports to use the v9 compat library for v8 syntax support.
// Fix: Corrected firebase import to use compat library for v8 namespaced API.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../firebaseConfig';

const LoginStep: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        // Fix: Use v8 GoogleAuthProvider.
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            // Fix: Use v8 signInWithPopup method.
            await auth.signInWithPopup(provider);
            // onAuthStateChanged in App.tsx will handle navigation
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during sign-in.';
            setError(errorMessage);
            setIsLoading(false);
        }
    };
    
    const GoogleIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.23 0 5.45.98 7.2 2.62l5.66-5.66C33.3 3.16 29.09 1.5 24 1.5 14.52 1.5 6.87 7.37 4.13 15.9l6.18 4.82C11.5 15.62 17.22 9.5 24 9.5z"></path>
            <path fill="#34A853" d="M46.17 25.5c0-1.72-.15-3.37-.43-4.95H24v9.38h12.44c-.54 3.03-2.1 5.6-4.59 7.38l6.01 4.65C42.36 38.38 46.17 32.62 46.17 25.5z"></path>
            <path fill="#FBBC05" d="M10.31 20.72c-.6-1.8-.94-3.71-.94-5.72s.34-3.92.94-5.72l-6.18-4.82C1.55 8.78.5 12.84.5 17c0 4.16 1.05 8.22 2.68 11.9l6.13-4.78z"></path>
            <path fill="#EA4335" d="M24 46.5c5.33 0 9.79-1.75 13.04-4.71l-6.01-4.65c-1.75 1.18-3.99 1.86-6.94 1.86-6.78 0-12.5-6.12-13.69-14.58l-6.18 4.82C6.87 40.63 14.52 46.5 24 46.5z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
    );

    return (
        <div className="max-w-md mx-auto text-center py-16 fade-in">
            <h2 className="text-3xl font-bold mb-2" style={{color: 'var(--on-surface-color)'}}>Welcome to AI Resume Tailor</h2>
            <p className="mb-8" style={{color: 'var(--on-surface-variant-color)'}}>
                Please sign in to continue. We use your account to securely save and manage your resumes.
            </p>
            
            <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="btn btn-filled w-full sm:w-auto"
            >
                <GoogleIcon />
                {isLoading ? 'Signing In...' : 'Sign In with Google'}
            </button>
            
            {error && <p className="text-sm mt-4" style={{color: 'var(--error-color)'}}>{error}</p>}
        </div>
    );
};

export default LoginStep;