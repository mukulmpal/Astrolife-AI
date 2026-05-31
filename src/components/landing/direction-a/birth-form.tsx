'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      // Format the data for URL params
      const params = new URLSearchParams({
        name: formData.name,
        dob: formData.dob,
        tob: formData.time,
        city: formData.city,
        from: 'homepage',
      });

      // Redirect to signup with pre-filled birth data
      router.push(`/auth/signup?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium uppercase tracking-wider" style={{ color: '#c8a030' }}>
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          disabled={loading}
          className="w-full rounded-lg border px-4 py-3 text-sm disabled:opacity-50"
          style={{
            borderColor: '#1c1840',
            background: '#0d0a22',
            color: '#f0e8d0',
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-sm font-medium uppercase tracking-wider" style={{ color: '#c8a030' }}>
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-lg border px-4 py-3 text-sm disabled:opacity-50"
            style={{
              borderColor: '#1c1840',
              background: '#0d0a22',
              color: '#f0e8d0',
            }}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium uppercase tracking-wider" style={{ color: '#c8a030' }}>
            Time (IST)
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-lg border px-4 py-3 text-sm disabled:opacity-50"
            style={{
              borderColor: '#1c1840',
              background: '#0d0a22',
              color: '#f0e8d0',
            }}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium uppercase tracking-wider" style={{ color: '#c8a030' }}>
          City, Country
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g., Mumbai, India"
          disabled={loading}
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
        type="submit"
        disabled={loading}
        className="mt-6 w-full cursor-pointer rounded-lg py-3 text-sm font-semibold tracking-wide transition-transform hover:scale-[1.02] disabled:opacity-50"
        style={{
          background: 'linear-gradient(180deg, #f4d03f, #c8a030)',
          color: '#060410',
        }}
      >
        {loading ? 'Getting you started...' : 'Generate My Free Kundli →'}
      </button>

      <p className="text-center text-10px uppercase tracking-wider" style={{ color: '#8880a8' }}>
        ✓ Free forever · No card required · Encrypted
      </p>
    </form>
  );
}
