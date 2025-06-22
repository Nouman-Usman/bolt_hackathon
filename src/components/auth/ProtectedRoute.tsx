import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { AlertCircle, Mail, RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireEmailVerification = false 
}) => {
  const { user: authUser, loading, emailVerified, resendVerification } = useAuth();
  const { authUser: userContextAuthUser } = useUser();
  const navigate = useNavigate();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    console.log('ProtectedRoute - loading:', loading, 'authUser:', !!authUser);
    
    if (!loading && !authUser) {
      console.log('No authenticated user found, redirecting to auth');
      navigate('/auth');
    }
  }, [authUser, loading, navigate]);

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendMessage('');
    
    const { error } = await resendVerification();
    
    if (error) {
      setResendMessage('Failed to send verification email. Please try again.');
    } else {
      setResendMessage('Verification email sent! Please check your inbox.');
    }
    
    setResendLoading(false);
  };

  // Show loading spinner while auth is loading
  if (loading) {
    console.log('ProtectedRoute - showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  // If no authenticated user after loading is complete, return null (will redirect in useEffect)
  if (!authUser) {
    console.log('ProtectedRoute - no authenticated user, returning null');
    return null;
  }

  // Show email verification screen if required and not verified
  if (requireEmailVerification && !emailVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="text-yellow-600" size={24} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verify Your Email
          </h2>
          
          <p className="text-gray-600 mb-6">
            Please verify your email address to access all features. We've sent a verification link to{' '}
            <strong>{authUser.email}</strong>.
          </p>

          {resendMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              resendMessage.includes('Failed') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <div className="flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {resendMessage}
              </div>
            </div>
          )}

          <button
            onClick={handleResendVerification}
            disabled={resendLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4"
          >
            {resendLoading ? (
              <LoadingSpinner size={16} />
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                Resend Verification Email
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/auth')}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute - rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;