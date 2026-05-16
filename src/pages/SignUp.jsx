import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GoogleAuth from '../components/GoogleAuth';
import {
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  Apple,
  ArrowRight,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import { signUpWithEmail, signInWithApple } from '../utils/authService';

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');

    try {
      const result = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (!result.success) {
        setSubmitError(result.error);
        setIsLoading(false);
        return;
      }

      // Log in the user after successful sign-up
      login(result.user);
      
      // Show success message
      setSignUpSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setSubmitError('Failed to create account. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setIsLoading(true);
    setSubmitError('');

    try {
      const result = await signInWithApple();

      if (!result.success) {
        setSubmitError(result.error);
        setIsLoading(false);
        return;
      }

      login(result.user);
      setSignUpSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setSubmitError('Apple sign up failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (signUpSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-success-600 to-success-700 px-8 py-12 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
              <p className="text-success-100">Your account has been created successfully</p>
            </div>

            <div className="px-8 py-8 text-center">
              <p className="text-gray-600 mb-6">
                Welcome {formData.fullName}! You&apos;re all set to start booking amazing hotel rooms.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to home page in a moment...
              </p>
              <div className="mt-6 flex justify-center">
                <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <span className="text-2xl">🏨</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-primary-100">Join HotelBook and start booking today</p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <GoogleAuth />

              <button
                onClick={handleAppleSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Apple className="w-5 h-5" />
                <span className="font-medium">Continue with Apple</span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600 font-medium">OR</span>
              </div>
            </div>

            {/* Full Name Field */}
            <div className="mb-5">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg transition-all placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.fullName
                      ? 'border-danger-500 focus:border-danger-600 focus:outline-none'
                      : 'border-gray-200 focus:border-primary-500 focus:outline-none'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-danger-600 flex items-center gap-1">
                  <span>•</span>
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg transition-all placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.email
                      ? 'border-danger-500 focus:border-danger-600 focus:outline-none'
                      : 'border-gray-200 focus:border-primary-500 focus:outline-none'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-danger-600 flex items-center gap-1">
                  <span>•</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg transition-all placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.password
                      ? 'border-danger-500 focus:border-danger-600 focus:outline-none'
                      : 'border-gray-200 focus:border-primary-500 focus:outline-none'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-danger-600 flex items-center gap-1">
                  <span>•</span>
                  {errors.password}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                At least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg transition-all placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.confirmPassword
                      ? 'border-danger-500 focus:border-danger-600 focus:outline-none'
                      : 'border-gray-200 focus:border-primary-500 focus:outline-none'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-danger-600 flex items-center gap-1">
                  <span>•</span>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {submitError && (
              <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-sm text-danger-700">{submitError}</p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-primary-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-primary-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Support Text */}
        <div className="text-center mt-6">
          <p className="text-primary-100 text-sm">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
