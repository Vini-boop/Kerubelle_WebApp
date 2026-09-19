import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

let API = import.meta.env.VITE_API_URL || '/api';
if (API !== '/api' && !API.endsWith('/api')) {
  API = API.replace(/\/$/, '') + '/api';
}

export function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUserEmailVerified, setAuthSession } = useAuth();

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(location.state?.email || sessionStorage.getItem('unverifiedEmail') || user?.email || '');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setMessage('Enter the 6-digit code from your email.'); setStatus('error'); return; }

    setStatus('verifying');
    setMessage('');
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to your dashboard...');
        if (data.user && data.token && setAuthSession) {
          setAuthSession(data.user, data.token);
        }
        if (updateUserEmailVerified) updateUserEmailVerified(true);
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setStatus('error');
        setMessage(
          data.code === 'OTP_EXPIRED' ? 'Code expired. Request a new one below.' :
            data.code === 'OTP_INVALID' ? 'Incorrect code. Check your email and try again.' :
              data.error || 'Verification failed.'
        );
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  const handleResend = async () => {
    if (!email.trim()) { setMessage('Enter your email address first.'); setStatus('error'); return; }
    setResendLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtp('');
        setStatus('idle');
        setMessage('New code sent — check your inbox.');
        startCooldown();
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to resend.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F9] to-white dark:from-gray-950 dark:to-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-[#F8C8DC]/20 dark:border-gray-700 p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Email Verified!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Redirecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F9] to-white dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-[#F8C8DC]/20 dark:border-gray-700 p-8 max-w-md w-full">

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
            <Mail className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Verify Your Email</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the 6-digit code we sent to <span className="font-medium text-[#D4A5B8]">{email || 'your email'}</span>
          </p>
        </div>

        {/* Error / info message */}
        {message && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm border ${status === 'error'
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400'
            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400'
            }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          {/* Email field (editable if not pre-filled) */}


          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">6-Digit Code</label>
            <input
              type="text" inputMode="numeric" maxLength={6} required
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={status === 'verifying'} placeholder="• • • • • •"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center text-2xl tracking-[0.5em] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F8C8DC]/50 focus:border-[#F8C8DC] transition-all font-mono disabled:opacity-60"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 text-center">Expires in 60 minutes</p>
          </div>

          <button type="submit" disabled={status === 'verifying' || otp.length !== 6}
            className="w-full py-3 rounded-full text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #F8C8DC, #D4A5B8)' }}>
            {status === 'verifying'
              ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Verifying...</span>
              : 'Verify Email'}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-4 text-center">
          <button onClick={handleResend} disabled={resendLoading || resendCooldown > 0}
            className="inline-flex items-center gap-1.5 text-sm text-[#D4A5B8] hover:text-[#F8C8DC] disabled:opacity-50 transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
          </button>
        </div>

        <div className="mt-5 text-center">
          <button onClick={() => navigate('/login')} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
