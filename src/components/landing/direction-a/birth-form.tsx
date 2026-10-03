'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isBillingEnforced } from '@/lib/access';

export function BirthDetailsForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    time: '',
    city: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.dob || !formData.time || !formData.city) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      if (isBillingEnforced()) {
        router.push('/login?next=/dashboard/upgrade');
        return;
      }

      const params = new URLSearchParams({
        name: formData.name,
        dob: formData.dob,
        tob: formData.time,
        city: formData.city,
        from: 'homepage',
      });

      router.push(`/dashboard?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#8C6508' }}>
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Aarav Sharma"
          disabled={loading}
          className="w-full rounded-lg border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 disabled:opacity-50"
          style={{
            borderColor: 'rgba(184, 134, 11, 0.35)',
            background: '#FAF7F2',
            color: '#1A1A1A',
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#8C6508' }}>
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-lg border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 disabled:opacity-50"
            style={{
              borderColor: 'rgba(184, 134, 11, 0.35)',
              background: '#FAF7F2',
              color: '#1A1A1A',
            }}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#8C6508' }}>
            Time (Local)
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-lg border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 disabled:opacity-50"
            style={{
              borderColor: 'rgba(184, 134, 11, 0.35)',
              background: '#FAF7F2',
              color: '#1A1A1A',
            }}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#8C6508' }}>
          Birth Place (City, Country)
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g. Mumbai, India or London, UK"
          disabled={loading}
          className="w-full rounded-lg border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 disabled:opacity-50"
          style={{
            borderColor: 'rgba(184, 134, 11, 0.35)',
            background: '#FAF7F2',
            color: '#1A1A1A',
          }}
        />
      </div>

      {error && (
        <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full cursor-pointer rounded-lg py-3.5 text-sm font-bold tracking-wide shadow-md transition-all hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50"
        style={{
          background: 'linear-gradient(180deg, #D4AF37 0%, #B8860B 100%)',
          color: '#1A1A1A',
          boxShadow: '0 8px 24px -6px rgba(184, 134, 11, 0.45)',
        }}
      >
        {loading ? 'Calculating Kundli...' : 'Generate My Free Kundli →'}
      </button>

      <button
        type="button"
        onClick={() => router.push('/dashboard?sample=true')}
        className="mt-3 block w-full text-center text-xs font-serif italic transition-opacity hover:opacity-80"
        style={{ color: '#8C6508' }}
      >
        ✦ Or explore with a live sample chart (Destiny + Sound + Health) →
      </button>

      <p className="mt-3 text-center text-10px uppercase tracking-wider" style={{ color: '#6B635B' }}>
        ✓ 100% Free · No Card Required · Swiss Ephemeris Precision
      </p>
    </form>
  );
}
