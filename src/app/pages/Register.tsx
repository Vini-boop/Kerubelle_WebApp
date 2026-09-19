import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { Eye, EyeOff, Check, X, ArrowRight, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register } = useAuth();

  // Password requirements state
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Update password requirements as user types
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordRequirements({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check all password requirements
    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
    if (!allRequirementsMet) {
      setError('Password does not meet all requirements (8+ chars, uppercase, lowercase, number, special character)');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(name, email, password);
      if (result.success) {
        // Show the success state and navigate to verify-email immediately
        setRegisteredEmail(email);
        navigate('/verify-email', { state: { email } });
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message after registration
  if (registeredEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F9] to-white px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">Account Created!</h2>
            <p className="text-gray-600 mb-2">Welcome to KeruBelle Luxury Handbags</p>
            <p className="text-sm text-gray-500 mb-6">
              We've sent a verification link to:
            </p>
            <p className="text-lg font-semibold text-[#D4A5B8] mb-8 px-4 py-3 bg-[#FFF5F9] rounded-lg">
              {registeredEmail}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                What's next?
              </h3>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Check your email inbox</li>
                <li>Click the verification link</li>
                <li>Return and log in to start shopping</li>
              </ol>
            </div>

            <button
              onClick={() => navigate('/verify-email', { state: { email: registeredEmail } })}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#F8C8DC] to-[#D4A5B8] hover:shadow-lg hover:scale-[1.02] transition-all duration-200 mb-4"
            >
              Continue to Verification
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-sm text-gray-500">
              <Link to="/verify-code" className="text-[#D4A5B8] hover:text-[#D4A5B8]/80 font-medium">
                Enter verification code
              </Link>
              {' '}or{' '}
              <Link to="/login" className="text-[#D4A5B8] hover:text-[#D4A5B8]/80 font-medium">
                Go to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="w-full max-w-md space-y-8 py-12">
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

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us and start shopping</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-4">
              <div className="text-sm text-red-700">{error}</div>
              {error.toLowerCase().includes('already exists') && (
                <div className="mt-2">
                  <Link to="/login" className="text-sm font-semibold text-[#D4A5B8] hover:text-[#F8C8DC] underline">
                    Sign in to your existing account →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent transition-all sm:text-sm shadow-sm"
                placeholder="Enter your full name"
              />
            </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="appearance-none block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent transition-all sm:text-sm pr-12 shadow-sm"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Segments */}
              {password.length > 0 && (() => {
                const met = Object.values(passwordRequirements).filter(Boolean).length;
                // Map 0-5 requirements into 3 levels: weak (1-2), fair (3-4), strong (5)
                const level = met <= 2 ? 1 : met <= 4 ? 2 : 3;
                const getColor = (idx: number) => {
                  if (idx >= level) return 'bg-gray-200';
                  if (level === 1) return 'bg-red-500';
                  if (level === 2) return 'bg-orange-400';
                  return 'bg-green-500';
                };
                const label = level === 1 ? 'Weak' : level === 2 ? 'Fair' : 'Strong';
                const labelColor = level === 1 ? 'text-red-500' : level === 2 ? 'text-orange-500' : 'text-green-600';
                return (
                  <div className="mt-3">
                    <div className="flex gap-1.5 mb-1.5">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${getColor(i)}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-semibold ${labelColor}`}>{label}</p>
                  </div>
                );
              })()}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC] focus:border-transparent transition-all sm:text-sm pr-12 shadow-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#F8C8DC] hover:text-[#D4A5B8] transition-colors">
                Sign in
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
          {/* Hero Bag Image - Larger */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-125"></div>
            <img
              src="/hero-bag.png"
              alt="Luxury Handbag"
              className="w-[450px] h-[450px] object-contain drop-shadow-2xl relative z-10"
            />
          </div>

          <h2 className="text-5xl font-bold mb-3 text-center">KeruBelle</h2>
          <p className="text-3xl mb-6 text-center text-white/90 font-light" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic' }}>
            Luxury Bags
          </p>
          <p className="text-xl text-center text-white/90 max-w-lg">
            Join us and discover exclusive handbag collections designed for elegance and style.
          </p>
        </div>
      </div>
    </div>
  );
}
