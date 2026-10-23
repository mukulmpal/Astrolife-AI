'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignupForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const next = nextParam?.startsWith('/') ? nextParam : '/onboarding';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'google' | 'otp' | 'password'>('google');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          window.location.assign(next);
        }
      });
    } catch {
      // ignore
    }
  }, [next]);

  const handleGoogle = () => {
    window.location.assign(`/auth/google?next=${encodeURIComponent(next)}`);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          shouldCreateUser: true,
        },
      });

      if (otpError) throw otpError;

      setOtpSent(true);
      setMessage('Login code sent! Please check your email inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send login code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setError('Please enter the 6-digit code received in your email.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: 'email',
      });

      if (verifyError) throw verifyError;
      if (data?.session) {
        window.location.assign(next);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        window.location.assign(next);
      } else {
        setMessage('Account created! Please check your email inbox to confirm.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex items-center justify-center px-6 py-12 font-sans">
      <div className="w-full max-w-md bg-white border border-[#EAE3D5] rounded-3xl p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3c2880] to-[#c8a030] flex items-center justify-center text-[#FAF7F2] text-xl shadow-md">
              ✦
            </div>
            <span className="font-serif text-2xl font-bold text-[#c8a030]">
              AstroLife
            </span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl font-bold mb-2 text-[#1A1A1A]">
            Create Account
          </h1>
          <p className="text-sm text-[#6B635B]">
            Save your Kundli charts forever and unlock AI astrological insights
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-xs text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca]">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 rounded-xl text-xs text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0]">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {/* Google Button */}
          <button
            onClick={handleGoogle}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm border border-[#D6CEBE] bg-white text-[#1A1A1A] hover:bg-[#FAF7F2] hover:border-[#c8a030] flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center my-4 text-xs text-[#9E9689] uppercase tracking-wider">
            <div className="flex-1 h-px bg-[#EAE3D5]" />
            <span className="px-3">or continue with email</span>
            <div className="flex-1 h-px bg-[#EAE3D5]" />
          </div>

          {/* Email Options */}
          {mode === 'google' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('otp')}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#D6CEBE] text-xs font-semibold hover:border-[#c8a030] hover:text-[#c8a030] cursor-pointer"
              >
                ✉ Email Code (OTP)
              </button>
              <button
                type="button"
                onClick={() => setMode('password')}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#D6CEBE] text-xs font-semibold hover:border-[#c8a030] hover:text-[#c8a030] cursor-pointer"
              >
                🔒 Email + Password
              </button>
            </div>
          )}

          {mode === 'otp' && (
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D6CEBE] bg-[#FAF7F2] text-sm focus:border-[#c8a030] outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#c8a030] to-[#a07820] text-white cursor-pointer hover:opacity-90"
                >
                  {loading ? 'Sending Code...' : 'Send Signup Code'}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('google')}
                  className="text-xs text-[#c8a030] block mx-auto cursor-pointer"
                >
                  ← Back to other options
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D6CEBE] bg-[#FAF7F2] text-sm focus:border-[#c8a030] outline-none text-center tracking-widest text-lg font-bold"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#c8a030] to-[#a07820] text-white cursor-pointer hover:opacity-90"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtpCode(''); }}
                  className="text-xs text-[#c8a030] block mx-auto cursor-pointer"
                >
                  ← Resend code
                </button>
              </form>
            )
          )}

          {mode === 'password' && (
            <form onSubmit={handlePasswordSignUp} className="space-y-3">
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full h-11 px-3.5 rounded-xl border border-[#D6CEBE] bg-[#FAF7F2] text-sm focus:border-[#c8a030] outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Choose a strong password"
                className="w-full h-11 px-3.5 rounded-xl border border-[#D6CEBE] bg-[#FAF7F2] text-sm focus:border-[#c8a030] outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#c8a030] to-[#a07820] text-white cursor-pointer hover:opacity-90"
              >
                {loading ? 'Creating...' : 'Create Account with Password'}
              </button>
              <button
                type="button"
                onClick={() => setMode('google')}
                className="text-xs text-[#c8a030] block mx-auto cursor-pointer"
              >
                ← Back to other options
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#6B635B] pt-2">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#c8a030] hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] mt-6 text-[#9E9689]">
          By continuing, you agree to AstroLife&apos;s{' '}
          <Link href="/terms" className="hover:underline text-[#c8a030]">
            Terms
          </Link>{' '}
          &{' '}
          <Link href="/privacy" className="hover:underline text-[#c8a030]">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
