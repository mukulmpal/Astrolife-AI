'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function normalizeIndianPhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);
  return digits.length === 10 ? `+91${digits}` : null;
}

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState(() => {
    const nameParam = searchParams.get('name');
    return nameParam ? decodeURIComponent(nameParam) : '';
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'init' | 'otp'>('init');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  // Send OTP
  const handleSendOtp = async () => {
    if (!name.trim()) {
      setError('Naam likho');
      return;
    }

    const normalizedPhone = normalizeIndianPhone(phone);
    if (!normalizedPhone) {
      setError('Valid phone number daalo');
      return;
    }

    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
      options: {
        data: { name }, // Store name in user metadata
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setStep('otp');
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('6-digit OTP daalo');
      return;
    }

    const normalizedPhone = normalizeIndianPhone(phone);
    if (!normalizedPhone) {
      setError('Phone number invalid');
      return;
    }

    setLoading(true);
    setError('');

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: otp,
      type: 'sms',
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
    } else {
      // Update user profile with name
      try {
        await supabase.auth.updateUser({
          data: { name },
        });
      } catch (err) {
        console.error('Error updating profile:', err);
      }

      // Check if coming from homepage with birth data
      const birthData = searchParams.get('dob');
      if (birthData) {
        router.push('/onboarding?' + new URLSearchParams(Object.fromEntries(searchParams)));
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="-12 -12 24 24" style={{ color: '#c8a030' }}>
              <circle r="10.5" stroke="currentColor" strokeWidth="0.7" fill="none" />
              <polygon points="0,-6 5,3 -5,3" fill="none" stroke="currentColor" strokeWidth="0.7" />
              <polygon points="0,6 5,-3 -5,-3" fill="none" stroke="currentColor" strokeWidth="0.7" />
              <circle r="1.9" fill="#f4d03f" />
            </svg>
            <span className="font-serif text-2xl font-bold" style={{ color: '#f0e8d0' }}>
              AstroLife
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: '#f0e8d0' }}>
            Create Account
          </h1>
          <p style={{ color: '#a79fbd' }}>
            Free Vedic kundli · Save your charts forever
          </p>
        </div>

        {step === 'init' ? (
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wider" style={{ color: '#c8a030' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Aapka naam"
                disabled={loading}
                className="w-full rounded-lg border px-4 py-3 text-sm disabled:opacity-50"
                style={{
                  borderColor: '#1c1840',
                  background: '#0d0a22',
                  color: '#f0e8d0',
                }}
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wider" style={{ color: '#c8a030' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError('');
                }}
                placeholder="10-digit number"
                disabled={loading}
                maxLength={13}
                className="w-full rounded-lg border px-4 py-3 text-sm disabled:opacity-50"
                style={{
                  borderColor: '#1c1840',
                  background: '#0d0a22',
                  color: '#f0e8d0',
                }}
              />
            </div>

            {error && (
              <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-transform hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: 'linear-gradient(180deg, #f4d03f, #c8a030)',
                color: '#060410',
              }}
            >
              {loading ? 'OTP bhej raha hoon...' : 'Send OTP'}
            </button>



            <p className="text-center text-sm" style={{ color: '#a79fbd' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: '#c8a030' }}>
                Sign In
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium mb-2 uppercase tracking-wider" style={{ color: '#c8a030' }}>
                Enter OTP
              </label>
              <p className="text-sm mb-3" style={{ color: '#8880a8' }}>
                +91 {phone.replace(/\D/g, '').slice(-10)}
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full rounded-lg border px-4 py-3 text-sm text-center font-mono text-2xl tracking-widest"
                style={{
                  borderColor: '#1c1840',
                  background: '#0d0a22',
                  color: '#f0e8d0',
                }}
              />
            </div>

            {error && (
              <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-transform hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: 'linear-gradient(180deg, #f4d03f, #c8a030)',
                color: '#060410',
              }}
            >
              {loading ? 'Verify ho raha hai...' : 'Verify OTP'}
            </button>

            <button
              onClick={() => {
                setStep('init');
                setOtp('');
                setError('');
              }}
              className="w-full py-2 text-sm font-medium"
              style={{ color: '#c8a030' }}
            >
              ← Back
            </button>
          </div>
        )}

        {/* Terms */}
        <p className="text-center text-9px mt-8" style={{ color: '#8880a8' }}>
          By signing up, you agree to our{' '}
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>{' '}
          &{' '}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
