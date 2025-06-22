import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CheckCircle, AlertCircle } from 'lucide-react';

const AuthCallbackPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for auth state to settle
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (user) {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting...');
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate('/onboarding');
          }, 2000);
        } else if (!loading) {
          setStatus('error');
          setMessage('Email verification failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification.');
      }
    };

    if (!loading) {
      handleAuthCallback();
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <>
            <LoadingSpinner size={32} className="mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Your Email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;