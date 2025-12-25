
import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../firebaseConfig';

interface LoginStepProps {
    setError: (msg: string | null) => void;
}

const LoginStep: React.FC<LoginStepProps> = ({ setError }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await auth.signInWithPopup(provider);
        } catch (err) {
            console.error("[LoginStep] Sign-in error:", err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during sign-in.';
            setError("Sign-in failed. Please ensure you are using a valid Google account.");
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
        <div className="max-w-md mx-auto text-center py-24 fade-in">
            <div className="mb-8 flex justify-center">
                <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-4xl font-black mb-4" style={{color: 'var(--on-surface-color)'}}>Welcome to Resume Copilot</h2>
            <p className="text-lg mb-10" style={{color: 'var(--on-surface-variant-color)'}}>
                Securely build, tailor, and manage your resumes with the power of AI. Sign in to start your journey.
            </p>
            
            <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="btn btn-filled w-full h-14"
            >
                <GoogleIcon />
                {isLoading ? 'Authenticating...' : 'Sign In with Google'}
            </button>
        </div>
    );
};

export default LoginStep;
