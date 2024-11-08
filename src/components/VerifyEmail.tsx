import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const actionCode = searchParams.get('oobCode');
    
    if (!actionCode) {
      setError('Invalid verification link');
      setVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(actionCode);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setError('Failed to verify email. The link may have expired.');
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [searchParams, verifyEmail, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {error ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Email Verified!</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your email has been verified successfully. You will be redirected to the login page shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;