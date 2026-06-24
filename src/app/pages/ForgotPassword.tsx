import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, Lock, CheckCircle2, Eye, EyeOff, RefreshCw } from 'lucide-react';

type Step = 'email' | 'otp' | 'newPassword' | 'done';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to send code. Try again.'); return; }
      setStep('otp');
      startCooldown();
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) { setError('Enter the 6-digit code from your email.'); return; }

    setLoading(true);
    try {
      // Just validate length client-side, move to password step
      // Actual OTP check happens on step 3 submit to avoid double-use
      setStep('newPassword');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset password ────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'OTP_EXPIRED') {
          setError('Your code expired. Please request a new one.');
          setStep('email');
          setOtp('');
        } else if (data.code === 'OTP_INVALID') {
          setError('Invalid code. Please go back and re-enter it.');
          setStep('otp');
          setOtp('');
        } else {
          setError(data.error || 'Something went wrong.');
        }
        return;
      }
      setStep('done');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to resend.'); return; }
      setOtp('');
      startCooldown();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const t = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const stepConfig = {
    email: { icon: Mail, title: 'Forgot Password?', subtitle: 'Enter your email and we\'ll send you a 6-digit reset code.' },
    otp: { icon: KeyRound, title: 'Enter Reset Code', subtitle: `We sent a 6-digit code to ${email}` },
    newPassword: { icon: Lock, title: 'New Password', subtitle: 'Create a strong new password for your account.' },
    done: { icon: CheckCircle2, title: 'Password Reset!', subtitle: 'Your password has been updated successfully.' },
  };

  const { icon: Icon, title, subtitle } = stepConfig[step];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F9] via-white to-[#F8E8EE] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-[#F8C8DC]/20 dark:border-gray-700 p-8">

          {/* Step indicator */}
          {step !== 'done' && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {(['email', 'otp', 'newPassword'] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s ? 'text-white shadow-md' :
                    ['email', 'otp', 'newPassword'].indexOf(step) > i ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`} style={step === s ? { background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' } : {}}>
                    {['email', 'otp', 'newPassword'].indexOf(step) > i ? '✓' : i + 1}
                  </div>
                  {i < 2 && <div className={`w-8 h-0.5 rounded-full ${['email', 'otp', 'newPassword'].indexOf(step) > i ? 'bg-green-300' : 'bg-gray-200 dark:bg-gray-600'}`} />}
                </div>
              ))}
            </div>
          )}

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${step === 'done' ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
              style={step !== 'done' ? { background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' } : {}}>
              <Icon className={`w-6 h-6 ${step === 'done' ? 'text-green-600 dark:text-green-400' : 'text-white'}`} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{subtitle}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3">
              <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* ── Step 1: Email ── */}
          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  disabled={loading} placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/50 focus:border-[#F8C8DC] transition-all disabled:opacity-60"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-full text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending...</span> : 'Send Reset Code'}
              </button>
            </form>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">6-Digit Code</label>
                <input
                  type="text" inputMode="numeric" maxLength={6} required
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={loading} placeholder="• • • • • •"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center text-2xl tracking-[0.5em] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/50 focus:border-[#F8C8DC] transition-all font-mono disabled:opacity-60"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 text-center">Check your inbox — the code expires in 60 minutes</p>
              </div>
              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full py-3 rounded-full text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Verifying...</span> : 'Continue'}
              </button>
              <div className="text-center">
                <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || loading}
                  className="inline-flex items-center gap-1.5 text-sm text-[#D4A5B8] hover:text-[#F8C8DC] disabled:opacity-50 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}

          {/* ── Step 3: New password ── */}
          {step === 'newPassword' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} required value={newPassword}
                    onChange={e => setNewPassword(e.target.value)} disabled={loading}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 pr-11 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/50 focus:border-[#F8C8DC] transition-all disabled:opacity-60"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'} required value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} disabled={loading}
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/50 focus:border-[#F8C8DC] transition-all disabled:opacity-60"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-full text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
                {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Resetting...</span> : 'Reset Password'}
              </button>
            </form>
          )}

          {/* ── Step 4: Done ── */}
          {step === 'done' && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 text-center">
                <p className="text-sm text-green-700 dark:text-green-400">You can now log in with your new password.</p>
              </div>
              <button onClick={() => navigate('/login')}
                className="w-full py-3 rounded-full text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all"
                style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
                Go to Login
              </button>
            </div>
          )}

          {/* Back link */}
          {step !== 'done' && (
            <div className="mt-5 text-center">
              {step === 'email' ? (
                <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-[#D4A5B8] hover:text-[#F8C8DC] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              ) : (
                <button onClick={() => { setStep(step === 'otp' ? 'email' : 'otp'); setError(''); }}
                  className="inline-flex items-center gap-1.5 text-sm text-[#D4A5B8] hover:text-[#F8C8DC] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
