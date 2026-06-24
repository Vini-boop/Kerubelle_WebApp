import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Mail, RefreshCw, ArrowLeft } from 'lucide-react';

export function VerifyCode() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const startCooldown = () => {
    setResendCooldown(60);
    const t = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!email.trim() || !otp.trim()) {
      setMessage('Please enter both email and verification code.');
      setStatus('error');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setMessage('Verification code must be exactly 6 digits.');
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('verifying');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setStatus('error');
        if (data.code === 'OTP_EXPIRED') {
          setMessage('Code expired. Please request a new one.');
        } else if (data.code === 'OTP_INVALID') {
          setMessage('Invalid code. Please check and try again.');
        } else {
          setMessage(data.error || 'Verification failed. Please try again.');
        }
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email.trim()) {
      setMessage('Please enter your email address first.');
      setStatus('error');
      return;
    }
    if (resendCooldown > 0) return;

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('idle');
        setOtp('');
        setMessage('A new verification code has been sent to your email.');
        startCooldown();
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to resend code. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F9] via-white to-[#F8E8EE] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-[#F8C8DC]/20 dark:border-gray-700 p-8">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${status === 'success' ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
              style={status !== 'success' ? { background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' } : {}}>
              {status === 'success'
                ? <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                : <Mail className="w-6 h-6 text-white" />}
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {status === 'success' ? 'Email Verified!' : 'Verify Your Email'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {status === 'success'
                ? 'Your account is now active. Taking you to login...'
                : 'Enter the 6-digit code we sent to your email address.'}
            </p>
          </div>

          {/* Error */}
          {status === 'error' && message && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{message}</p>
            </div>
          )}

          {/* Resend success */}
          {status === 'idle' && message && (
            <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-3">
              <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>
            </div>
          )}

          {/* Success state */}
          {status === 'success' ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 text-center">
                <p className="text-sm text-green-700 dark:text-green-400">You can now log in with your account.</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-full text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all"
                style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {/* Email field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading} placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/50 focus:border-[#F8C8DC] transition-all disabled:opacity-60"
                />
              </div>

              {/* OTP field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  6-Digit Verification Code
                </label>
                <input
                  type="text" inputMode="numeric" maxLength={6} required
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={loading} placeholder="• • • • • •"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center text-2xl tracking-[0.5em] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/50 focus:border-[#F8C8DC] transition-all font-mono disabled:opacity-60"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 text-center">
                  Check your inbox — the code expires in 60 minutes
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 rounded-full text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                  : 'Verify Email'}
              </button>

              {/* Resend */}
              <div className="text-center">
                <button
                  type="button" onClick={handleResendCode}
                  disabled={resendCooldown > 0 || loading}
                  className="inline-flex items-center gap-1.5 text-sm text-[#D4A5B8] hover:text-[#F8C8DC] disabled:opacity-50 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          )}

          {/* Back to login */}
          <div className="mt-5 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-[#D4A5B8] hover:text-[#F8C8DC] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
