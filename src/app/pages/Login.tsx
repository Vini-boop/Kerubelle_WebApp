import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [adminWelcome, setAdminWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        const resultWithReset = result as any;
        if (resultWithReset.requiresPasswordReset) {
          navigate('/reset-password', { replace: true });
          return;
        }

        if (result.role === 'admin') {
          // Show admin welcome screen, then redirect
          setAdminWelcome(true);
          setTimeout(() => navigate('/admin', { replace: true }), 2200);
        } else {
          navigate(from, { replace: true });
        }
      } else {
        const resultWithErrors = result as any;
        if (resultWithErrors.errorType === 'email') {
          setError(resultWithErrors.message || 'Email not found');
        } else if (resultWithErrors.errorType === 'password') {
          setError(resultWithErrors.message || 'Incorrect password');
        } else if (resultWithErrors.errorType === 'deactivated') {
          setError(resultWithErrors.message || 'Account deactivated');
        } else if (resultWithErrors.errorType === 'email_not_verified') {
          setError(resultWithErrors.message || 'Please verify your email before logging in.');
        } else if (resultWithErrors.errorType === 'network') {
          setError(resultWithErrors.message || 'Network error. Please try again.');
        } else {
          setError(resultWithErrors.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Admin welcome overlay
  if (adminWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8]">
        <div className="text-center text-white animate-fade-in">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-xl text-white/90 mb-1"
            style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic' }}>
            Kerubelle Admin
          </p>
          <p className="text-white/70 text-sm mt-4">Taking you to your dashboard…</p>
          <div className="mt-6 flex justify-center gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-2xl font-bold bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] bg-clip-text text-transparent"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic' }}
                >
                  KeruBelle
                </span>
                <span className="text-xs text-[#D4A5B8] -mt-1">Luxury Handbags</span>
              </div>
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue your shopping</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-4">
              <div className="text-sm text-red-700">{error}</div>
              {error.includes('verify your email') && (
                <div className="mt-2 text-sm text-red-700 space-y-2">
                  <div>
                    <Link to="/verify-email" className="underline hover:text-red-800 block">
                      Resend verification email
                    </Link>
                  </div>
                  <div>
                    <Link to="/verify-code" className="underline hover:text-red-800 block">
                      Enter verification code
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent transition-all sm:text-sm shadow-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent transition-all sm:text-sm pr-12 shadow-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-sm text-[#F8C8DC] hover:text-[#D4A5B8] font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] transition-all duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F8C8DC]'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors">
                Create account
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-4 border-t border-gray-100">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#F8C8DC] to-[#D4A5B8]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
          {/* Hero Bag Image - Large */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-125"></div>
            <img
              src="/hero-bag.png"
              alt="Luxury Handbag"
              className="w-[480px] h-[480px] object-contain drop-shadow-2xl relative z-10"
            />
          </div>

          <h2 className="text-5xl font-bold mb-3 text-center">KeruBelle</h2>
          <p className="text-3xl text-center text-white/90 font-light" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic' }}>
            Luxury Bags
          </p>
        </div>
      </div>
    </div>
  );
}
