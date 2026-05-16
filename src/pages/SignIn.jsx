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
  ArrowRight
} from 'lucide-react';
import { signInWithEmail, signInWithApple } from '../utils/authService';

function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError('');

    try {
      const result = await signInWithEmail(formData.email, formData.password);

      if (!result.success) {
        setSubmitError(result.error);
        setIsLoading(false);
        return;
      }

      login(result.user);
      navigate('/');
    } catch (error) {
      setSubmitError('Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
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
      navigate('/');
    } catch (error) {
      setSubmitError('Apple sign in failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_25%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent_30%)]" />

      <div className="relative mx-auto w-full max-w-md">
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
              🏨
            </div>
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="mt-2 text-sm leading-6 text-primary-100">Sign in to your HotelBook account</p>
          </div>

          <div className="px-8 py-8">
            <div className="space-y-3 mb-6">
              <GoogleAuth />

              <button
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Apple className="h-5 w-5" />
                Continue with Apple
              </button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-gray-500">OR</span>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="you@example.com"
                    className={`w-full rounded-2xl border px-12 py-3 text-sm text-gray-900 outline-none transition ${
                      errors.email
                        ? 'border-danger-500 focus:border-danger-600'
                        : 'border-gray-200 focus:border-primary-500'
                    } disabled:bg-gray-50 disabled:text-gray-500`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-danger-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className={`w-full rounded-2xl border px-12 py-3 text-sm text-gray-900 outline-none transition ${
                      errors.password
                        ? 'border-danger-500 focus:border-danger-600'
                        : 'border-gray-200 focus:border-primary-500'
                    } disabled:bg-gray-50 disabled:text-gray-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-danger-600">{errors.password}</p>
                )}
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {submitError && (
                <div className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign Up
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-primary-100 text-sm">Having trouble? Contact our support team</p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
