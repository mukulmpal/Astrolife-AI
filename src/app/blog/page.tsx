import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AstroLife Blog',
  description: 'Learn more about Vedic astrology, birth charts, dasha, and AI-powered insights.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-20 md:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold" style={{ color: '#f0e8d0' }}>
          AstroLife Blog
        </h1>
        <p className="mb-12 text-lg" style={{ color: '#a79fbd' }}>
          Insights on Vedic astrology, birth charts, planetary timing, and guidance.
        </p>

        <div className="rounded-xl border border-purple-900/30 p-12 text-center">
          <div className="mb-4 text-5xl">📚</div>
          <h2 className="mb-2 text-2xl font-semibold" style={{ color: '#f0e8d0' }}>
            Coming Soon
          </h2>
          <p style={{ color: '#a79fbd' }}>
            We're preparing articles on dasha timing, yogas, compatibility, remedies, and more.
          </p>
          <p className="mt-4 text-sm" style={{ color: '#8880a8' }}>
            Check back soon for deep dives into Vedic astrology.
          </p>
        </div>

        <div className="mt-12">
          <a
            href="/"
            className="inline-block rounded-full px-8 py-3 text-sm font-semibold transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, #f4d03f, #c8a030)',
              color: '#060410',
            }}
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
