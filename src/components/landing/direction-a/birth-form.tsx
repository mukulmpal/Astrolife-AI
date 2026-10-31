'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isBillingEnforced } from '@/lib/access';
import { calculateChart, CITY_COORDS, RASHIS } from '@/lib/astro-engine/calculations';
import { saveCurrentChart } from '@/lib/user-chart';

const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mars: '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Venus: '♀',
  Saturn: '♄',
  Rahu: '☊',
  Ketu: '☋',
};

const POPULAR_CITIES = ['New Delhi', 'Mumbai', 'Bengaluru', 'London', 'New York'];

const DEMO_ARCHETYPES = [
  {
    id: 'elon_musk',
    tag: 'Multi-Planetary Titan',
    name: 'Elon Musk',
    dob: '1971-06-28',
    tob: '07:30',
    city: 'Pretoria, South Africa',
    lat: -25.7479,
    lon: 28.2293,
    tz: 2.0,
    highlights: 'Cancer Lagna · Exalted Uchha Mars in 7th (Rockets) · Moon in Magha',
    badge: 'SpaceX & Tesla Vision',
  },
  {
    id: 'virat_kohli',
    tag: 'Global Cricket Icon',
    name: 'Virat Kohli',
    dob: '1988-11-05',
    tob: '10:28',
    city: 'Delhi, India',
    lat: 28.6139,
    lon: 77.2090,
    tz: 5.5,
    highlights: 'Sagittarius Lagna · Fierce Mars in 4th · Sun in 11th Labha',
    badge: 'Relentless Athletic Will',
  },
  {
    id: 'steve_jobs',
    tag: 'Design & Silicon Visionary',
    name: 'Steve Jobs',
    dob: '1955-02-24',
    tob: '19:15',
    city: 'San Francisco, USA',
    lat: 37.7749,
    lon: -122.4194,
    tz: -8.0,
    highlights: 'Leo Lagna · 10th House Sun-Mercury Budhaditya · Rahu in 5th',
    badge: 'Apple Innovation',
  },
];

function getLiveCosmicWindow() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const totalMin = h * 60 + m;

  // Abhijit Muhurat: ~11:40 to 12:30 (around solar midday)
  if (totalMin >= 700 && totalMin <= 750) {
    return {
      title: '🟢 Abhijit Muhurat Active (Golden Window)',
      sub: 'Most auspicious moment · High-success chart casting',
    };
  }
  if (h >= 6 && h < 12) {
    return {
      title: '✨ Amrit & Shubh Chaughadia Active',
      sub: 'Solar Prana surge · 0.01° Swiss Ephemeris micro-precision',
    };
  }
  if (h >= 12 && h < 18) {
    return {
      title: '⚡ Labha & Shubh Window Active',
      sub: 'Dhana Yoga activation window · Multi-House transit ripple',
    };
  }
  return {
    title: '🌙 Chandra Hora Active (High Intuition)',
    sub: 'Subconscious karmic clarity · 12-Rashi Somatotopic alignment',
  };
}

export function BirthDetailsForm() {
  const router = useRouter();
  const [formMode, setFormMode] = useState<'custom' | 'demo'>('custom');
  const [cosmicWindow, setCosmicWindow] = useState(getLiveCosmicWindow);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useSuryaKundli, setUseSuryaKundli] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    time: '',
    city: '',
  });

  useEffect(() => {
    const timer = setInterval(() => setCosmicWindow(getLiveCosmicWindow()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLaunchDemo = (demo: typeof DEMO_ARCHETYPES[0]) => {
    setLoading(true);
    try {
      const chart = calculateChart(
        demo.name,
        demo.dob,
        demo.tob,
        demo.city,
        demo.lat,
        demo.lon,
        demo.tz
      );
      saveCurrentChart(chart);
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to calculate demo chart:', err);
      router.push('/dashboard?sample=true');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCitySelect = (city: string) => {
    setFormData((prev) => ({ ...prev, city }));
    setError('');
  };

  const handleSuryaToggle = (checked: boolean) => {
    setUseSuryaKundli(checked);
    if (checked) {
      setFormData((prev) => ({ ...prev, time: '12:00' }));
    }
  };

  // Instant client-side preview calculations using real Swiss/Moshier AstroLife Calculation Engine
  const livePreview = useMemo(() => {
    if (!formData.dob) return null;

    try {
      const parts = formData.dob.split('-');
      if (parts.length !== 3) return null;
      const y = Number.parseInt(parts[0], 10);
      const m = Number.parseInt(parts[1], 10);
      const d = Number.parseInt(parts[2], 10);
      if (!y || !m || !d || y < 1900 || y > 2100) return null;

      const hasExactTime = Boolean(formData.time) && !useSuryaKundli;
      const timeToUse = formData.time && !useSuryaKundli ? formData.time : '12:00';

      // Match city in CITY_COORDS or fallback to New Delhi
      let cityToUse = formData.city.trim() || 'New Delhi';
      const cleanCity = cityToUse.toLowerCase();
      const prefixMatch = cleanCity.split(',')[0].trim();
      const matchedKey = Object.keys(CITY_COORDS).find((k) => {
        const lk = k.toLowerCase();
        return cleanCity === lk || prefixMatch === lk || cleanCity.startsWith(lk);
      });
      cityToUse = matchedKey || 'New Delhi';

      // Authoritative Vedic Chart Calculation
      const chart = calculateChart(
        formData.name.trim() || 'Native',
        formData.dob,
        timeToUse,
        cityToUse
      );

      if (!chart || !chart.planets || !chart.planets.Moon) return null;

      // In Surya Kundli (Solar chart), Lagna is taken as the Sun's sign
      let lagnaSign = chart.lagnaRashi;
      let lagnaIdx = chart.lagnaNum; // 0-indexed (0=Aries, 1=Taurus, ...)

      if (useSuryaKundli && chart.planets.Sun) {
        lagnaSign = chart.planets.Sun.sign;
        lagnaIdx = chart.planets.Sun.signNum ?? RASHIS.indexOf(lagnaSign);
      }

      // House signs array: House 1 to House 12 signs (0-indexed)
      const houseSigns = Array.from({ length: 12 }, (_, i) => (lagnaIdx + i) % 12);

      // Distribute planets to houses (1 to 12)
      const planetsByHouse: Record<number, string[]> = {};
      for (let i = 1; i <= 12; i++) planetsByHouse[i] = [];

      Object.entries(chart.planets).forEach(([pName, pData]) => {
        const glyph = PLANET_GLYPHS[pName] || pName.slice(0, 2);
        const houseNo = useSuryaKundli
          ? (((pData.signNum ?? RASHIS.indexOf(pData.sign)) - lagnaIdx + 12) % 12) + 1
          : pData.house;
        if (houseNo >= 1 && houseNo <= 12) {
          planetsByHouse[houseNo].push(glyph);
        }
      });

      // Active Mahadasha
      const activeDasha =
        chart.dashas?.find((d) => d.active)?.planet ||
        chart.dashas?.[0]?.planet ||
        chart.planets.Moon.nakshatraLord;

      return {
        hasExactTime,
        sunSign: chart.planets.Sun?.sign || '',
        moonSign: chart.planets.Moon.sign,
        lagnaSign,
        lagnaIdx,
        nakshatra: chart.planets.Moon.nakshatra,
        nakLord: chart.planets.Moon.nakshatraLord,
        pada: chart.planets.Moon.pada,
        houseSigns,
        planetsByHouse,
        activeDasha,
      };
    } catch (e) {
      console.error('Live preview calculation error:', e);
      return null;
    }
  }, [formData.dob, formData.time, formData.city, useSuryaKundli, formData.name]);

  const handleWhatsAppShare = () => {
    if (!livePreview) return;
    const name = formData.name.trim() || 'My';
    const text = `✨ ${name}'s Vedic Cosmic Signature on AstroLife AI:\n` +
      `• Lagna: ${livePreview.lagnaSign}\n` +
      `• Moon Sign: ${livePreview.moonSign} (${livePreview.nakshatra} Pada ${livePreview.pada})\n` +
      `• Active Mahadasha: ${livePreview.activeDasha}\n` +
      `• Calculation: Pure Swiss/Moshier Ephemeris + Lahiri Ayanamsha\n\n` +
      `Calculate your free 90-year Destiny Curve & Kundli: https://astrolife-ai.vercel.app`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
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
        surya: useSuryaKundli ? 'true' : 'false',
        from: 'homepage',
      });

      router.push(`/dashboard?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Cosmic Hour Pill */}
      <div
        className="flex items-center justify-between rounded-xl px-3.5 py-2 border shadow-xs"
        style={{ background: '#FAF7F2', borderColor: 'rgba(184, 134, 11, 0.35)' }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-10px font-mono font-bold tracking-wider text-[#8C6508]">
            LIVE COSMIC WINDOW
          </span>
        </div>
        <div className="text-right">
          <div className="text-10px font-bold text-[#1A1A1A]">
            {cosmicWindow.title}
          </div>
          <div className="text-8px font-medium text-[#6B635B]">
            {cosmicWindow.sub}
          </div>
        </div>
      </div>

      {/* Mode Switcher: Custom vs 1-Click Demo */}
      <div
        className="grid grid-cols-2 gap-1 rounded-lg p-1 border"
        style={{ background: '#FAF5EB', borderColor: 'rgba(184, 134, 11, 0.25)' }}
      >
        <button
          type="button"
          onClick={() => setFormMode('custom')}
          className={`cursor-pointer rounded py-1.5 text-xs font-bold transition-all ${
            formMode === 'custom'
              ? 'bg-[#FFFFFF] text-[#8C6508] shadow-xs border border-[rgba(184,134,11,0.3)]'
              : 'text-[#6B635B] hover:text-[#1A1A1A]'
          }`}
        >
          📝 Enter Birth Details
        </button>
        <button
          type="button"
          onClick={() => setFormMode('demo')}
          className={`cursor-pointer rounded py-1.5 text-xs font-bold transition-all ${
            formMode === 'demo'
              ? 'bg-[#FFFFFF] text-[#8C6508] shadow-xs border border-[rgba(184,134,11,0.3)]'
              : 'text-[#6B635B] hover:text-[#1A1A1A]'
          }`}
        >
          ⚡ Instant Demo (1-Click)
        </button>
      </div>

      {formMode === 'demo' ? (
        <div className="space-y-2.5">
          <p className="text-xs text-[#5C5248] leading-relaxed">
            Don&rsquo;t have your exact birth time? Launch all 38 engines instantly with verified historical charts:
          </p>
          {DEMO_ARCHETYPES.map((arch) => (
            <div
              key={arch.id}
              onClick={() => handleLaunchDemo(arch)}
              className="group cursor-pointer rounded-xl p-3 border transition-all hover:border-[#B8860B] hover:scale-[1.01]"
              style={{ background: '#FFFFFF', borderColor: 'rgba(184, 134, 11, 0.25)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#8C6508]">
                  {arch.name}
                </span>
                <span className="rounded px-1.5 py-0.5 font-mono text-8px uppercase font-semibold bg-[#FAF5EB] text-[#8C6508] border border-[rgba(184,134,11,0.2)]">
                  {arch.badge}
                </span>
              </div>
              <p className="mt-1 text-9px text-[#6B635B]">
                {arch.highlights}
              </p>
              <div className="mt-2 flex items-center justify-between text-9px font-bold text-[#8C6508]">
                <span>{arch.city}</span>
                <span className="group-hover:translate-x-0.5 transition-transform">Launch Instant Chart →</span>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleLaunchDemo(DEMO_ARCHETYPES[0])}
            disabled={loading}
            className="mt-3 w-full cursor-pointer rounded-lg py-3 text-xs font-bold tracking-wide shadow-md transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(180deg, #D4AF37 0%, #B8860B 100%)',
              color: '#1A1A1A',
              boxShadow: '0 8px 24px -6px rgba(184, 134, 11, 0.45)',
            }}
          >
            {loading ? 'Launching All 38 Engines...' : '⚡ Launch Elon Musk Demo in 1-Click →'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input with dynamic personalized greeting */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: '#8C6508' }}>
            Full Name
          </label>
          {formData.name.trim() && (
            <span className="text-10px font-serif italic text-[#8C6508]">
              Namaste, {formData.name.trim().split(' ')[0]} ✨
            </span>
          )}
        </div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Priya Sharma"
          disabled={loading}
          className="w-full rounded-lg border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 disabled:opacity-50"
          style={{
            borderColor: 'rgba(184, 134, 11, 0.35)',
            background: '#FAF7F2',
            color: '#1A1A1A',
          }}
        />
      </div>

      {/* Date & Time Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: '#8C6508' }}>
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 disabled:opacity-50"
            style={{
              borderColor: 'rgba(184, 134, 11, 0.35)',
              background: '#FAF7F2',
              color: '#1A1A1A',
            }}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: '#8C6508' }}>
            Time (Local)
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            disabled={loading || useSuryaKundli}
            className="w-full rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 disabled:opacity-50"
            style={{
              borderColor: 'rgba(184, 134, 11, 0.35)',
              background: useSuryaKundli ? '#EAE5D9' : '#FAF7F2',
              color: '#1A1A1A',
            }}
          />
        </div>
      </div>

      {/* Surya Kundli (Don't know exact time) Checkbox */}
      <div className="flex items-center gap-2 pt-0.5">
        <input
          type="checkbox"
          id="suryaKundli"
          checked={useSuryaKundli}
          onChange={(e) => handleSuryaToggle(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-amber-600 text-[#B8860B] focus:ring-[#B8860B]"
        />
        <label htmlFor="suryaKundli" className="cursor-pointer text-11px font-medium text-[#5C5248] hover:text-[#1A1A1A]">
          Don&rsquo;t know exact birth time? (Use Surya Kundli · Solar Chart)
        </label>
      </div>

      {/* City Input & Quick Select Chips */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider" style={{ color: '#8C6508' }}>
          Birth Place (City, Country)
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="e.g. Mumbai, India or London, UK"
          disabled={loading}
          className="w-full rounded-lg border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 disabled:opacity-50"
          style={{
            borderColor: 'rgba(184, 134, 11, 0.35)',
            background: '#FAF7F2',
            color: '#1A1A1A',
          }}
        />
        {/* Quick City Chips */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-10px">
          <span className="text-[#8C6508] font-mono">Popular:</span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleCitySelect(c)}
              className="cursor-pointer rounded px-2 py-0.5 transition-colors border"
              style={{
                background: formData.city === c ? 'rgba(184, 134, 11, 0.18)' : '#FAF5EB',
                borderColor: formData.city === c ? '#B8860B' : 'rgba(184, 134, 11, 0.2)',
                color: formData.city === c ? '#785404' : '#6B635B',
                fontWeight: formData.city === c ? 700 : 500,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* LIVE NORTH INDIAN KUNDLI PREVIEW & INSTANT MINI-READING */}
      {livePreview && (
        <div
          className="rounded-xl p-3.5 border transition-all animate-fadeIn"
          style={{
            background: '#FAF7F2',
            borderColor: 'rgba(184, 134, 11, 0.35)',
            boxShadow: '0 4px 12px rgba(184, 134, 11, 0.08)',
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
            <span className="font-mono text-10px uppercase tracking-wider font-bold text-[#8C6508] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#10b981] animate-ping" />
              Live Kundli Preview {livePreview.hasExactTime ? '(Lagna Locked)' : '(Date Computed)'}
            </span>
            <span className="text-10px font-serif italic text-[#6B635B]">
              {livePreview.lagnaSign} Lagna
            </span>
          </div>

          {/* North Indian Diamond Kundli SVG Graphic */}
          <div className="my-2.5 flex items-center justify-center">
            <svg viewBox="0 0 240 240" className="w-full max-w-[210px] aspect-square drop-shadow-xs">
              {/* Outer boundary */}
              <rect x="0" y="0" width="240" height="240" fill="#FFFFFF" stroke="#B8860B" strokeWidth="1.8" />
              {/* Diagonals */}
              <line x1="0" y1="0" x2="240" y2="240" stroke="#B8860B" strokeWidth="1.2" />
              <line x1="0" y1="240" x2="240" y2="0" stroke="#B8860B" strokeWidth="1.2" />
              {/* Inner Diamond */}
              <polygon points="120,0 0,120 120,240 240,120" fill="none" stroke="#B8860B" strokeWidth="1.4" />

              {/* House 1 (Lagna / Tanu Bhava) */}
              <text x="120" y="46" textAnchor="middle" fill="#8C6508" fontSize="11" fontFamily="serif" fontWeight="bold">
                {livePreview.houseSigns[0] + 1}
              </text>
              <text x="120" y="60" textAnchor="middle" fill="#dc2626" fontSize="8" fontFamily="sans-serif" fontWeight="bold">
                Lagna
              </text>
              {livePreview.planetsByHouse[1]?.length > 0 && (
                <text x="120" y="76" textAnchor="middle" fill="#1A1A1A" fontSize="9" fontFamily="sans-serif">
                  {livePreview.planetsByHouse[1].join(' ')}
                </text>
              )}

              {/* House 2 (Dhana Bhava - Top Left) */}
              <text x="60" y="24" textAnchor="middle" fill="#6B635B" fontSize="9">
                {livePreview.houseSigns[1] + 1}
              </text>
              {livePreview.planetsByHouse[2]?.length > 0 && (
                <text x="60" y="38" textAnchor="middle" fill="#1A1A1A" fontSize="8">
                  {livePreview.planetsByHouse[2].join(' ')}
                </text>
              )}

              {/* House 3 (Sahaja Bhava - Upper Left) */}
              <text x="25" y="58" textAnchor="middle" fill="#6B635B" fontSize="9">
                {livePreview.houseSigns[2] + 1}
              </text>
              {livePreview.planetsByHouse[3]?.length > 0 && (
                <text x="25" y="72" textAnchor="middle" fill="#1A1A1A" fontSize="8">
                  {livePreview.planetsByHouse[3].join(' ')}
                </text>
              )}

              {/* House 4 (Sukha Bhava - Left Diamond) */}
              <text x="60" y="112" textAnchor="middle" fill="#8C6508" fontSize="10.5" fontFamily="serif" fontWeight="bold">
                {livePreview.houseSigns[3] + 1}
              </text>
              {livePreview.planetsByHouse[4]?.length > 0 && (
                <text x="60" y="128" textAnchor="middle" fill="#1A1A1A" fontSize="8.5">
                  {livePreview.planetsByHouse[4].join(' ')}
                </text>
              )}

              {/* House 5 (Putra Bhava - Lower Left) */}
              <text x="25" y="174" textAnchor="middle" fill="#6B635B" fontSize="9">
                {livePreview.houseSigns[4] + 1}
              </text>
              {livePreview.planetsByHouse[5]?.length > 0 && (
                <text x="25" y="188" textAnchor="middle" fill="#1A1A1A" fontSize="8">
                  {livePreview.planetsByHouse[5].join(' ')}
                </text>
              )}

              {/* House 6 (Ari Bhava - Bottom Left) */}
              <text x="60" y="210" textAnchor="middle" fill="#6B635B" fontSize="9">
                {livePreview.houseSigns[5] + 1}
              </text>
              {livePreview.planetsByHouse[6]?.length > 0 && (
                <text x="60" y="224" textAnchor="middle" fill="#1A1A1A" fontSize="8">
                  {livePreview.planetsByHouse[6].join(' ')}
                </text>
              )}

              {/* House 7 (Kalatra Bhava - Bottom Diamond) */}
              <text x="120" y="172" textAnchor="middle" fill="#8C6508" fontSize="10.5" fontFamily="serif" fontWeight="bold">
                {livePreview.houseSigns[6] + 1}
              </text>
              {livePreview.planetsByHouse[7]?.length > 0 && (
                <text x="120" y="188" textAnchor="middle" fill="#1A1A1A" fontSize="8.5">
                  {livePreview.planetsByHouse[7].join(' ')}
                </text>
              )}

              {/* House 8 (Ayur Bhava - Bottom Right) */}
              <text x="180" y="210" textAnchor="middle" fill="#6B635B" fontSize="9">
                {livePreview.houseSigns[7] + 1}
              </text>
              {livePreview.planetsByHouse[8]?.length > 0 && (
                <text x="180" y="224" textAnchor="middle" fill="#1A1A1A" fontSize="8">
                  {livePreview.planetsByHouse[8].join(' ')}
                </text>
              )}

              {/* House 9 (Bhagya Bhava - Lower Right) */}
              <text x="215" y="174" textAnchor="middle" fill="#6B635B" fontSize="9">
                {livePreview.houseSigns[8] + 1}
              </text>
              {livePreview.planetsByHouse[9]?.length > 0 && (
                <text x="215" y="188" textAnchor="middle" fill="#1A1A1A" fontSize="8">
                  {livePreview.planetsByHouse[9].join(' ')}
                </text>
              )}

              {/* House 10 (Karma Bhava - Right Diamond) */}
              <text x="180" y="112" textAnchor="middle" fill="#8C6508" fontSize="10.5" fontFamily="serif" fontWeight="bold">
                {livePreview.houseSigns[9] + 1}
              </text>
              {livePreview.planetsByHouse[10]?.length > 0 && (
                <text x="180" y="128" textAnchor="middle" fill="#1A1A1A" fontSize="8.5">
                  {livePreview.planetsByHouse[10].join(' ')}
                </text>
              )}

              {/* House 11 (Labha Bhava - Upper Right) */}
              <text x="215" y="58" textAnchor="middle" fill="#6B635B" fontSize="9">
                {livePreview.houseSigns[10] + 1}
              </text>
              {livePreview.planetsByHouse[11]?.length > 0 && (
                <text x="215" y="72" textAnchor="middle" fill="#1A1A1A" fontSize="8">
                  {livePreview.planetsByHouse[11].join(' ')}
                </text>
              )}

              {/* House 12 (Vyaya Bhava - Top Right) */}
              <text x="180" y="24" textAnchor="middle" fill="#6B635B" fontSize="9">
                {livePreview.houseSigns[11] + 1}
              </text>
              {livePreview.planetsByHouse[12]?.length > 0 && (
                <text x="180" y="38" textAnchor="middle" fill="#1A1A1A" fontSize="8">
                  {livePreview.planetsByHouse[12].join(' ')}
                </text>
              )}
            </svg>
          </div>

          {/* Instant Mini-Reading Highlights */}
          <div className="grid grid-cols-2 gap-2 text-10px pt-2 border-t" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
            <div>
              <span className="text-[#6B635B]">Lagna / Moon: </span>
              <span className="font-bold text-[#1A1A1A]">{livePreview.lagnaSign} / {livePreview.moonSign}</span>
            </div>
            <div>
              <span className="text-[#6B635B]">Nakshatra: </span>
              <span className="font-bold text-[#1A1A1A]">{livePreview.nakshatra} (P{livePreview.pada})</span>
            </div>
            <div>
              <span className="text-[#6B635B]">Active Dasha: </span>
              <span className="font-bold text-[#8C6508]">{livePreview.activeDasha} Mahadasha</span>
            </div>
            <div>
              <span className="text-[#6B635B]">Career Horizon: </span>
              <span className="font-bold text-[#059669]">Golden Window Active</span>
            </div>
          </div>

          {/* Share on WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded py-1.5 text-10px font-bold transition-all hover:bg-[#25D366]/20 border cursor-pointer"
            style={{
              background: 'rgba(37, 211, 102, 0.12)',
              borderColor: 'rgba(37, 211, 102, 0.4)',
              color: '#0f766e',
            }}
          >
            <span>📲 Share Cosmic Signature on WhatsApp</span>
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full cursor-pointer rounded-lg py-3.5 text-sm font-bold tracking-wide shadow-md transition-all hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50"
        style={{
          background: 'linear-gradient(180deg, #D4AF37 0%, #B8860B 100%)',
          color: '#1A1A1A',
          boxShadow: '0 8px 24px -6px rgba(184, 134, 11, 0.45)',
        }}
      >
        {loading
          ? 'Calculating Kundli...'
          : formData.name.trim()
          ? `Unlock Full Kundli for ${formData.name.trim().split(' ')[0]} →`
          : 'Generate My Free Kundli →'}
      </button>

      <button
        type="button"
        onClick={() => router.push('/dashboard?sample=true')}
        className="mt-2 block w-full text-center text-xs font-serif italic transition-opacity hover:opacity-80"
        style={{ color: '#8C6508' }}
      >
        ✦ Or explore with a live sample chart (Destiny + Sound + Health) →
      </button>

      <p className="mt-2 text-center text-10px uppercase tracking-wider font-semibold" style={{ color: '#6B635B' }}>
        ✓ 100% Free · No Card Required · Swiss Ephemeris Precision
      </p>
        </form>
      )}
    </div>
  );
}
