import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { toast } from 'react-hot-toast';

const EmailVerification: React.FC = () => {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);

  if (!user || user.emailVerified) {
    return null;
  }

  const handleSendVerification = async () => {
    if (!user.firebaseUser) return;
    
    try {
      setSending(true);
      await sendEmailVerification(user.firebaseUser);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error('Failed to send verification email. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700 dark:text-yellow-200">
            Please verify your email address to ensure full access to all features.
          </p>
          <button
            onClick={handleSendVerification}
            disabled={sending}
            className="mt-2 text-sm font-medium text-yellow-700 dark:text-yellow-200 underline hover:text-yellow-600 disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Resend verification email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;