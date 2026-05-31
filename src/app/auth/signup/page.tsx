'use client';

import { Suspense } from 'react';
import SignupForm from './signup-form';

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupForm />
    </Suspense>
  );
}

function SignupLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 opacity-50">
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
            Loading...
          </h1>
        </div>
      </div>
    </div>
  );
}
