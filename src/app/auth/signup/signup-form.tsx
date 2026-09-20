'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SignupForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const next = nextParam?.startsWith('/') ? nextParam : '/onboarding';

  const handleGoogle = () => {
    window.location.assign(`/auth/google?next=${encodeURIComponent(next)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
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

        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2" style={{ color: '#f0e8d0' }}>
            Create Account
          </h1>
          <p style={{ color: '#a79fbd' }}>
            Google-only signup · Save your kundli charts forever
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogle}
            className="w-full py-3 rounded-lg font-semibold text-sm transition-transform hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(180deg, #f4d03f, #c8a030)',
              color: '#060410',
            }}
          >
            Continue with Google
          </button>

          <div className="rounded-lg p-3 text-sm leading-relaxed" style={{ background: 'rgba(200,160,48,0.08)', color: '#c8c0a8', border: '1px solid rgba(200,160,48,0.18)' }}>
            Phone login is disabled. We only support Google auth to keep user accounts, onboarding, and saved charts consistent.
          </div>

          <p className="text-center text-sm" style={{ color: '#a79fbd' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: '#c8a030' }}>
              Sign In
            </Link>
          </p>
        </div>

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
