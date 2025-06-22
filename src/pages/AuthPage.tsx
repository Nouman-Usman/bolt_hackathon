import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Shield, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthPage = () => {
  const { signIn, signUp, resetPassword, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset' | 'verify'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    if (mode !== 'reset' && formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        const { error, needsVerification } = await signUp(formData.email, formData.password, {
          name: formData.name,
          languagePreference: 'english'
        });

        if (error) {
          setError(error.message || 'Failed to create account');
        } else if (needsVerification) {
          setSuccess('Account created! Please check your email to verify your account before signing in.');
          setMode('verify');
        } else {
          navigate('/onboarding');
        }
      } else if (mode === 'signin') {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setError(error.message || 'Failed to sign in');
        } else {
          navigate(from, { replace: true });
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(formData.email);
        
        if (error) {
          setError(error.message || 'Failed to send reset email');
        } else {
          setSuccess('Password reset email sent! Check your inbox for instructions.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    const { error } = await resendVerification();
    
    if (error) {
      setError(error.message || 'Failed to resend verification email');
    } else {
      setSuccess('Verification email sent! Please check your inbox.');
    }
    setLoading(false);
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup': return 'Create your account';
      case 'reset': return 'Reset your password';
      case 'verify': return 'Verify your email';
      default: return 'Welcome back';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup': return 'Start your AI-powered learning journey';
      case 'reset': return 'Enter your email to receive reset instructions';
      case 'verify': return 'Check your email for verification link';
      default: return 'Sign in to continue your studies';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="text-blue-600 mr-2" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">StudyGenius</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {getTitle()}
          </h2>
          <p className="text-gray-600">
            {getSubtitle()}
          </p>
        </div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
            >
              <AlertCircle size={16} className="text-red-500 mr-2 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
            >
              <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Verification Mode */}
        {mode === 'verify' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-blue-600" size={24} />
            </div>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <strong>{formData.email}</strong>. 
              Please check your email and click the link to verify your account.
            </p>
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="flex items-center justify-center w-full py-2 px-4 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size={16} /> : <RefreshCw size={16} className="mr-2" />}
              Resend verification email
            </button>
            <button
              onClick={() => setMode('signin')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to sign in
            </button>
          </div>
        )}

        {/* Form */}
        {mode !== 'verify' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <div className="mt-2 text-xs text-gray-500">
                      Password must be at least 8 characters with uppercase, lowercase, and number
                    </div>
                  )}
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size={20} />
              ) : (
                <>
                  <Shield size={18} className="mr-2" />
                  {mode === 'signup' ? 'Create Account' : mode === 'reset' ? 'Send Reset Email' : 'Sign In'}
                </>
              )}
            </button>
          </form>
        )}

        {/* Mode Toggle */}
        {mode !== 'verify' && (
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setMode('signup');
                      setError('');
                      setSuccess('');
                    }}
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </p>
                <button
                  onClick={() => {
                    setMode('reset');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </>
            )}
            
            {mode === 'signup' && (
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signin');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
                >
                  Sign In
                </button>
              </p>
            )}
            
            {mode === 'reset' && (
              <button
                onClick={() => {
                  setMode('signin');
                  setError('');
                  setSuccess('');
                }}
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
              >
                Back to Sign In
              </button>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center text-xs text-gray-600">
            <Shield size={14} className="mr-2 flex-shrink-0" />
            <span>
              Your data is protected with bank-level security. We never share your personal information.
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;