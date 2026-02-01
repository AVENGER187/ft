import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film, Mail, Lock, User, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    full_name: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear field-specific error
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
    setError('');
  };

  const validateStep1 = () => {
    const errors = {};
    
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateStep1()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('📤 Sending OTP for:', formData.email);
      await authService.sendOTP(formData.email, formData.password);
      console.log('✅ OTP sent successfully');
      setOtpSent(true);
      setStep(2);
      setError('');
    } catch (err) {
      console.error('❌ OTP send error:', err);
      
      let errorMessage = err.message || 'Failed to send OTP. Please try again.';
      
      // Handle email already exists
      if (errorMessage.toLowerCase().includes('already') || 
          errorMessage.toLowerCase().includes('exist') ||
          errorMessage.toLowerCase().includes('registered')) {
        errorMessage = 'Email already registered. Please login instead.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Verifying OTP...');
      const authResponse = await authService.verifyOTP(formData.email, formData.otp);
      
      console.log('✅ OTP verified, tokens received');

      if (!authResponse.access_token) {
        throw new Error('No access token received from server');
      }

      const { access_token, refresh_token } = authResponse;

      // Clear any existing data first
      localStorage.clear();
      sessionStorage.clear();

      // Create user data
      const userData = {
        email: formData.email,
        full_name: formData.full_name,
        authenticated: true,
        signup_time: new Date().toISOString()
      };

      console.log('🔄 Calling AuthContext login...');
      login(access_token, refresh_token, userData);

      console.log('✅ Signup successful, navigating to dashboard');
      
      // Navigate to dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error('❌ Verification error:', err);
      
      let errorMessage = err.message || 'Verification failed. Please check your OTP.';
      
      // Handle invalid OTP
      if (errorMessage.toLowerCase().includes('invalid') || 
          errorMessage.toLowerCase().includes('wrong') ||
          errorMessage.toLowerCase().includes('expired')) {
        errorMessage = 'Invalid or expired OTP. Please try again or request a new one.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      await authService.sendOTP(formData.email, formData.password);
      setOtpSent(true);
      setError('✅ New OTP has been sent to your email!');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => step === 1 ? navigate('/') : setStep(1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {step === 1 ? 'Back to Home' : 'Back to Email'}
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mb-4">
              <Film className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-2">
              {step === 1 ? 'Start your filmmaking journey' : 'Verify your email'}
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-orange-400' : 'bg-gray-300'}`} />
            <div className="w-12 h-1 bg-gray-300 rounded">
              <div className={`h-full rounded transition-all ${step >= 2 ? 'bg-orange-400 w-full' : 'w-0'}`} />
            </div>
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-orange-400' : 'bg-gray-300'}`} />
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg ${error.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`text-sm ${error.includes('✅') ? 'text-green-700' : 'text-red-700'}`}>{error}</p>
            </div>
          )}

          {/* Step 1: Email + Password */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                      validationErrors.full_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {validationErrors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                      validationErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                      validationErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {validationErrors.password ? (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                      validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Verification Code
                  </span>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  {otpSent ? '✅ Code sent to ' + formData.email : 'Enter the 6-digit code sent to your email'}
                </p>
              </div>

              <button
                type="button"
                onClick={resendOTP}
                disabled={isLoading}
                className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm font-medium disabled:opacity-50"
              >
                Didn't receive code? <span className="text-orange-600 hover:underline">Resend OTP</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  'Verify & Continue'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-600 font-semibold hover:text-orange-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;