'use client';

import { useState, useEffect } from 'react';
import { CelestialInstrument, FolioMarker, OrnamentDivider } from './celestial';

const TINT = (pct: number) =>
  `color-mix(in srgb, var(--al-surface) ${pct}%, transparent)`;
const GOLD_TINT = (pct: number) =>
  `color-mix(in srgb, var(--al-gold) ${pct}%, transparent)`;

function useAudioPreview() {
  const [playing, setPlaying] = useState(false);

  const playTone = () => {
    if (typeof window === 'undefined' || playing) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Meditative acoustic Tanpura drone: Sa (C#3: 138.59 Hz), Pa (G#3: 207.65 Hz), Sa octave (C#4: 277.18 Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(138.59, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(207.65, ctx.currentTime);

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(277.18, ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.8);

      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();
      setPlaying(true);

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          osc3.stop();
          ctx.close();
        } catch (_) {}
        setPlaying(false);
      }, 5000);
    } catch (e) {
      console.error(e);
      setPlaying(false);
    }
  };

  return { playing, playTone };
}

/* ============================ I · PROBLEM ============================ */
export function DirectionAProblem() {
  const items = [
    { g: '☉', t: 'Sun-sign horoscopes', d: 'One of twelve scripts, handed to a billion people. Comfort, not truth.' },
    { g: '☄', t: 'Fear as a business model', d: '“Saturn will ruin you.” Dread sells subscriptions; it does not prepare you.' },
    { g: '☷', t: 'Reports no one reads', d: 'Forty-eight pages of Sanskrit jargon, and not one thing you can act on by Monday.' },
  ];
  return (
    <section className="relative px-6 py-24 md:px-10" style={{ background: 'var(--al-bg)' }}>
      <div className="mx-auto max-w-5xl">
        <FolioMarker numeral="I" label="The Problem" />
        <h2 className="dira-display-sm max-w-2xl" style={{ color: 'var(--al-ivory)' }}>
          Astrology has been{' '}
          <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>
            flattering
          </span>{' '}
          you, not reading you.
        </h2>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl md:grid-cols-3"
          style={{ border: '1px solid var(--al-line)', background: 'var(--al-line)' }}>
          {items.map((it) => (
            <div key={it.t} className="p-7" style={{ background: 'var(--al-bg)' }}>
              <div className="mb-4 text-3xl" style={{ color: 'var(--al-gold)' }}>{it.g}</div>
              <div className="mb-2 font-serif text-xl" style={{ color: 'var(--al-ivory)' }}>{it.t}</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ====================== ASTRO-DATA DEFINITIONS ====================== */
const DESTINY_ANCHORS = [
  { age: 0, score: 45, dasha: 'Mars-Rahu', title: 'Foundational Roots', desc: 'Early childhood vitality, physical growth & maternal emotional anchoring.' },
  { age: 10, score: 58, dasha: 'Mars-Mercury', title: 'Cognitive Awakening', desc: 'Schooling, curiosity surge, foundational skill acquisition & peer bonds.' },
  { age: 18, score: 72, dasha: 'Jupiter-Jupiter', title: 'Higher Calling & Vidya', desc: 'Entry into Jupiter Mahadasha. University learning, philosophy & calling exploration.' },
  { age: 24, score: 78, dasha: 'Jupiter-Saturn', title: 'First Career Ascent', desc: 'Early enterprise launch, building craft reputation & first serious leadership ambitions.' },
  { age: 28, score: 54, dasha: 'Jupiter-Saturn', title: '⚡ Saturn Return Pivot', desc: 'Pruning fragile ventures, karmic testing, structuring long-term discipline and emotional resilience.' },
  { age: 34, score: 82, dasha: 'Jupiter-Venus', title: 'Strategic Partnerships', desc: 'Creative surge, alliance formations, marital stability & rapid network elevation.' },
  { age: 38, score: 94, dasha: 'Jupiter-Sun', title: '★ Golden Zenith Peak', desc: 'Jupiter Mahadasha + Sun Antardasha in 10th house. Peak career elevation, public recognition & executive authority.' },
  { age: 44, score: 76, dasha: 'Saturn-Saturn', title: 'Executive Stewardship', desc: 'Transition into Saturn Mahadasha. Heavy organizational duty, institutional scaling & systemic focus.' },
  { age: 50, score: 71, dasha: 'Saturn-Mercury', title: 'Mid-Life Restructuring', desc: 'Refining operational paradigms, strategic pivots, balancing stamina with long-term vision.' },
  { age: 58, score: 89, dasha: 'Mercury-Venus', title: '💎 Dhana Expansion Harvest', desc: '2nd & 11th house synergy. Major multi-asset compounding, legacy harvest & high security.' },
  { age: 68, score: 76, dasha: 'Mercury-Mars', title: 'Advisory Mentorship', desc: 'Senior advisory roles, transmission of expertise, philanthropic initiatives & wisdom sharing.' },
  { age: 78, score: 82, dasha: 'Ketu-Jupiter', title: 'Spiritual Awakening', desc: 'Ketu Mahadasha inward turn. Philosophical peace, meditation & timeless clarity.' },
  { age: 90, score: 70, dasha: 'Ketu-Venus', title: 'Moksha Serenity', desc: 'Complete karmic resolution, spiritual liberation and transcendent contentment.' },
];

function getDestinyAtAge(age: number) {
  const clamped = Math.max(0, Math.min(90, age));
  let lower = DESTINY_ANCHORS[0];
  let upper = DESTINY_ANCHORS[DESTINY_ANCHORS.length - 1];

  for (let i = 0; i < DESTINY_ANCHORS.length - 1; i++) {
    if (clamped >= DESTINY_ANCHORS[i].age && clamped <= DESTINY_ANCHORS[i + 1].age) {
      lower = DESTINY_ANCHORS[i];
      upper = DESTINY_ANCHORS[i + 1];
      break;
    }
  }

  const span = upper.age - lower.age;
  const ratio = span === 0 ? 0 : (clamped - lower.age) / span;
  const score = Math.round(lower.score + (upper.score - lower.score) * ratio);

  // SVG coordinates: width = 540, x from 30 to 520 (span 490)
  const cursorX = Math.round(30 + (clamped / 90) * 490);
  // height = 160, y from 145 (score 0) to 20 (score 100), span = 125
  const cursorY = Math.round(145 - (score / 100) * 125);

  const activeAnchor = ratio > 0.5 ? upper : lower;

  return {
    age: clamped,
    score,
    dasha: activeAnchor.dasha,
    title: activeAnchor.title,
    desc: activeAnchor.desc,
    cursorX,
    cursorY,
  };
}

const TRANSIT_DATA = {
  saturn: {
    name: 'Saturn in Pisces (Karmic Restructuring)',
    cycle: '30-Month Shani Cycle',
    tagline: 'Karmic foundation-testing across self, initiative, partnerships & duty',
    houses: [
      {
        tag: 'Epicenter · House 1 (Pisces)',
        title: 'Lagna Restructuring',
        desc: 'Saturn transit through your 1st house. Demands radical physical discipline, strips away false vanity, and anchors self-identity.',
        impact: 'High Gravity',
      },
      {
        tag: 'Ripple A · House 3 (Taurus)',
        title: '3rd Drishti on Initiative',
        desc: '3rd house aspect compels bold entrepreneurial decisions, renegotiated contracts, and fearless strategic communication.',
        impact: 'Action Vector',
      },
      {
        tag: 'Ripple B · House 7 (Virgo)',
        title: '7th Drishti on Alliances',
        desc: 'Direct aspect onto 7th house. Tests business partnerships and marital bonds; dissolves superficial ties while cementing loyal alliances.',
        impact: 'Karmic Mirror',
      },
      {
        tag: 'Ripple C · House 10 (Sagittarius)',
        title: '10th Drishti on Profession',
        desc: 'Aspect onto 10th house of karma. Professional culmination, executive scrutiny, promotion earned through steady resilience.',
        impact: 'Culmination',
      },
    ],
  },
  jupiter: {
    name: 'Jupiter in Taurus / Gemini (Dharma Expansion)',
    cycle: '12-Month Guru Cycle',
    tagline: 'Expansive trikona blessings multiplying wealth, relationships & wisdom',
    houses: [
      {
        tag: 'Epicenter · House 3 (Taurus)',
        title: 'Enterprise & Innovation',
        desc: 'Jupiter transit illuminates intellectual ventures, creative publishing, sibling alliances, and profitable commercial initiatives.',
        impact: 'Expansion',
      },
      {
        tag: 'Ripple A · House 7 (Virgo)',
        title: '5th Drishti on Marital Harmony',
        desc: 'Benefic 5th trine aspect blesses marital prospects, resolves relationship friction, and attracts ethical business collaborators.',
        impact: 'Golden Trine',
      },
      {
        tag: 'Ripple B · House 9 (Scorpio)',
        title: '7th Drishti on Higher Wisdom',
        desc: 'Direct aspect onto Bhagya Bhava. Foreign travels, mentor blessings, spiritual initiation, and sudden unearned fortune.',
        impact: 'Bhagya Udaya',
      },
      {
        tag: 'Ripple C · House 11 (Pisces)',
        title: '9th Drishti on Financial Gains',
        desc: '9th trine aspect into 11th Labha house. Acceleration of large financial gains, expansive high-trust network, and wish-fulfillment.',
        impact: 'Liquid Dhana',
      },
    ],
  },
  rahu: {
    name: 'Rahu in Pisces / Ketu in Virgo (Nodal Metamorphosis)',
    cycle: '18-Month Nodal Axis',
    tagline: 'Karmic axis shift sparking visionary hunger and spiritual detachment',
    houses: [
      {
        tag: 'Epicenter · House 1 / 7 Axis',
        title: 'Identity vs Relationship Shift',
        desc: 'Rahu in 1st triggers intense desire for self-reinvention; Ketu in 7th sheds past co-dependent patterns to foster sovereign intimacy.',
        impact: 'Metamorphosis',
      },
      {
        tag: 'Ripple A · House 5 (Cancer)',
        title: '5th Drishti on Creative Genius',
        desc: 'Rahu 5th aspect unlocks unconventional artistic intuition, speculative breakthroughs, and unorthodox algorithmic problem-solving.',
        impact: 'Genius Surge',
      },
      {
        tag: 'Ripple B · House 9 (Scorpio)',
        title: '9th Drishti on Occult Research',
        desc: 'Rahu 9th aspect sparks fascination with esoteric sciences, foreign knowledge, and disruptive non-traditional paradigms.',
        impact: 'Esoteric Shift',
      },
      {
        tag: 'Ripple C · House 11 (Capricorn)',
        title: 'Ketu 5th Trine on Networks',
        desc: 'Ketu aspect purifies your social circle, filtering out transactional acquaintances and focusing only on soul-aligned mission partners.',
        impact: 'Network Clarity',
      },
    ],
  },
};

const PRAHARS = [
  {
    key: 'bhairav',
    prahar: 'Pratham Prahar · Dawn (04:00 – 07:00)',
    name: 'Raag Bhairav',
    mood: 'Dawn awakening, cognitive clarity & Surya solar vitality',
    hours: [4, 5, 6],
    spotify: 'https://open.spotify.com/search/Raag%20Bhairav',
    youtube: 'https://www.youtube.com/results?search_query=Raag+Bhairav+Indian+Classical',
  },
  {
    key: 'sarang',
    prahar: 'Madhyahna Prahar · Midday (10:00 – 16:00)',
    name: 'Raag Brindavani Sarang',
    mood: 'Midday equilibrium, sustained focus & metabolic Pitta balance',
    hours: [10, 11, 12, 13, 14, 15],
    spotify: 'https://open.spotify.com/search/Raag%20Brindavani%20Sarang',
    youtube: 'https://www.youtube.com/results?search_query=Raag+Brindavani+Sarang+Classical',
  },
  {
    key: 'yaman',
    prahar: 'Sandhya Prahar · Twilight (16:00 – 19:00)',
    name: 'Raag Yaman',
    mood: 'Twilight calmness, emotional warmth & Venus-Jupiter harmony',
    hours: [16, 17, 18],
    spotify: 'https://open.spotify.com/search/Raag%20Yaman',
    youtube: 'https://www.youtube.com/results?search_query=Raag+Yaman+Indian+Classical',
  },
  {
    key: 'darbari',
    prahar: 'Nishitha Prahar · Midnight (22:00 – 04:00)',
    name: 'Raag Darbari Kanada',
    mood: 'Midnight stillness, deep restorative sleep & Saturn grounding',
    hours: [22, 23, 0, 1, 2, 3],
    spotify: 'https://open.spotify.com/search/Raag%20Darbari%20Kanada',
    youtube: 'https://www.youtube.com/results?search_query=Raag+Darbari+Kanada+Classical',
  },
];

/* ========================== II · COMPLETE SYSTEM ===================== */
export function DirectionAFeatures() {
  const { playing, playTone } = useAudioPreview();

  // 1. Interactive Destiny Curve: continuous scrub Age (0 to 90)
  const [scrubAge, setScrubAge] = useState<number>(38);
  const currentDestiny = getDestinyAtAge(scrubAge);

  // 2. Interactive Planetary Transit Ripple Engine
  const [activeTransit, setActiveTransit] = useState<'saturn' | 'jupiter' | 'rahu'>('saturn');

  // 3. AstroSound: Auto-detect local hour and active Prahar
  const [currentHour, setCurrentHour] = useState<number>(() => new Date().getHours());
  useEffect(() => {
    setCurrentHour(new Date().getHours());
    const interval = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(interval);
  }, []);

  const activePraharObj =
    PRAHARS.find((p) => p.hours.includes(currentHour)) ||
    (currentHour >= 7 && currentHour < 10 ? PRAHARS[0] : PRAHARS[2]);

  // 4. Interactive AI Palmistry Scanner line selection & scan animation state
  const [palmLine, setPalmLine] = useState<'heart' | 'head' | 'life' | 'fate'>('fate');
  const [isScanningPalm, setIsScanningPalm] = useState(false);

  const triggerPalmScan = () => {
    setIsScanningPalm(true);
    setTimeout(() => {
      setIsScanningPalm(false);
    }, 1200);
  };

  // 5. Interactive Card Active Tabs for Tier 2 (keyed by card id)
  const [tier2Tabs, setTier2Tabs] = useState<Record<string, number>>({
    marriage: 0,
    yogas: 0,
    numerology: 0,
    muhurat: 0,
    vastu: 0,
    jung: 0,
  });

  const setCardTab = (cardId: string, tabIndex: number) => {
    setTier2Tabs((prev) => ({ ...prev, [cardId]: tabIndex }));
  };

  const isDashaActive = (min: number, max: number) =>
    scrubAge >= min && (scrubAge < max || (max === 90 && scrubAge <= 90));

  return (
    <section id="features" className="relative overflow-hidden px-6 py-24 md:px-10"
      style={{ background: 'var(--al-bg)' }}>
      <div className="relative mx-auto max-w-6xl space-y-20">
        
        {/* SECTION HEADER */}
        <div>
          <FolioMarker numeral="II" label="The Complete Vedic Ecosystem" />
          <h2 className="dira-display-sm mb-4" style={{ color: '#1A1A1A' }}>
            25+ specialized engines.
            <span className="italic" style={{ color: '#8C6508' }}> One Unified OS.</span>
          </h2>
          <p className="max-w-3xl text-sm md:text-base leading-relaxed" style={{ color: '#3D3834' }}>
            Beyond simple sun signs and fear-based predictions. AstroLife unifies ancient astronomical shastras,
            Ayurvedic medicine, and Indian classical sound theory with sub-arcsecond Swiss Ephemeris precision.
          </p>
        </div>

        {/* TIER 1: THE 5 HERO / VIRAL WOW ENGINES */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.4)' }}>
              Tier 1 · Flagship Breakthroughs
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#6B635B' }}>
              Core Predictive & Therapeutic Engines
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* 1. DESTINY CURVE */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 4px 20px -4px rgba(184, 134, 11, 0.12)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">📈</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider font-semibold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    0–90 Yrs Continuous Scrubber
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                  Interactive Destiny Curve
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#3D3834' }}>
                  Never wonder when your golden phase begins. Drag the timeline cursor along the 90-year life curve
                  to reveal your dynamic score, active Vimshottari Dasha, and the exact planetary forces guiding each chapter.
                </p>
              </div>

              {/* Draggable & Scrubbable Graph Canvas */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'rgba(184, 134, 11, 0.25)', background: '#FAF7F2' }}>
                {/* Milestone Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-9px uppercase tracking-wider font-bold" style={{ color: '#8C6508' }}>
                      Scrub 90-Yr Timeline:
                    </span>
                    <span className="rounded-full px-2 py-0.5 font-mono text-10px font-bold" style={{ background: '#FFFFFF', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.3)' }}>
                      Age {currentDestiny.age}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setScrubAge(28)}
                      className={`cursor-pointer rounded px-2 py-1 text-9px font-medium transition-colors ${
                        scrubAge === 28
                          ? 'bg-[#d97706]/15 text-[#92400e] border border-[#d97706] font-bold'
                          : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                      }`}
                    >
                      ⚡ Age 28 Pivot
                    </button>
                    <button
                      type="button"
                      onClick={() => setScrubAge(38)}
                      className={`cursor-pointer rounded px-2 py-1 text-9px font-medium transition-colors ${
                        scrubAge === 38
                          ? 'bg-[#B8860B]/20 text-[#785404] border border-[#B8860B] font-bold shadow-sm'
                          : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                      }`}
                    >
                      ★ Age 38 Zenith
                    </button>
                    <button
                      type="button"
                      onClick={() => setScrubAge(58)}
                      className={`cursor-pointer rounded px-2 py-1 text-9px font-medium transition-colors ${
                        scrubAge === 58
                          ? 'bg-[#059669]/15 text-[#065f46] border border-[#059669] font-bold'
                          : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                      }`}
                    >
                      💎 Age 58 Wealth
                    </button>
                    <button
                      type="button"
                      onClick={() => setScrubAge(78)}
                      className={`cursor-pointer rounded px-2 py-1 text-9px font-medium transition-colors ${
                        scrubAge === 78
                          ? 'bg-[#7c3aed]/15 text-[#6d28d9] border border-[#7c3aed] font-bold'
                          : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                      }`}
                    >
                      🕉️ Age 78 Moksha
                    </button>
                  </div>
                </div>

                {/* SVG Graph Canvas with Dynamic Cursor Tracker */}
                <div className="relative mt-3 h-36 w-full overflow-hidden">
                  <svg className="h-full w-full" viewBox="0 0 540 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="destinyArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#B8860B" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#B8860B" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="curveLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#64748b" />
                        <stop offset="35%" stopColor="#d97706" />
                        <stop offset="55%" stopColor="#B8860B" />
                        <stop offset="85%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#64748b" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Score Gridlines */}
                    <line x1="30" y1="20" x2="520" y2="20" stroke="rgba(184, 134, 11, 0.22)" strokeDasharray="3 3" />
                    <line x1="30" y1="55" x2="520" y2="55" stroke="rgba(184, 134, 11, 0.22)" strokeDasharray="3 3" />
                    <line x1="30" y1="90" x2="520" y2="90" stroke="rgba(184, 134, 11, 0.22)" strokeDasharray="3 3" />
                    <line x1="30" y1="125" x2="520" y2="125" stroke="rgba(184, 134, 11, 0.22)" strokeDasharray="3 3" />

                    {/* Y-Axis Score Labels */}
                    <text x="5" y="24" fill="#8C6508" fontSize="10" fontFamily="monospace" fontWeight="bold">100</text>
                    <text x="10" y="59" fill="#6B635B" fontSize="9" fontFamily="monospace">75</text>
                    <text x="10" y="94" fill="#6B635B" fontSize="9" fontFamily="monospace">50</text>
                    <text x="10" y="129" fill="#6B635B" fontSize="9" fontFamily="monospace">25</text>

                    {/* Gradient Area Fill */}
                    <path
                      d="M 30 115 C 75 105, 110 80, 150 68 C 175 60, 195 110, 215 116 C 245 124, 260 26, 290 22 C 325 18, 350 82, 380 78 C 410 74, 430 38, 455 42 C 485 46, 505 70, 520 74 L 520 145 L 30 145 Z"
                      fill="url(#destinyArea)"
                    />

                    {/* Continuous Destiny Curve */}
                    <path
                      d="M 30 115 C 75 105, 110 80, 150 68 C 175 60, 195 110, 215 116 C 245 124, 260 26, 290 22 C 325 18, 350 82, 380 78 C 410 74, 430 38, 455 42 C 485 46, 505 70, 520 74"
                      fill="none"
                      stroke="url(#curveLine)"
                      strokeWidth="3.2"
                    />

                    {/* Milestone Reference Anchors */}
                    <circle cx="215" cy="116" r="4" fill="#d97706" opacity="0.6" />
                    <circle cx="290" cy="22" r="4.5" fill="#B8860B" opacity="0.6" />
                    <circle cx="455" cy="42" r="4" fill="#059669" opacity="0.6" />

                    {/* Dynamic Vertical Tracker Line */}
                    <line
                      x1={currentDestiny.cursorX}
                      y1="16"
                      x2={currentDestiny.cursorX}
                      y2="145"
                      stroke="#B8860B"
                      strokeWidth="1.6"
                      strokeDasharray="3 3"
                    />

                    {/* Glowing Live Tracker Node */}
                    <circle
                      cx={currentDestiny.cursorX}
                      cy={currentDestiny.cursorY}
                      r="6.5"
                      fill="#B8860B"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={currentDestiny.cursorX}
                      cy={currentDestiny.cursorY}
                      r="11"
                      fill="none"
                      stroke="#B8860B"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      className="animate-pulse"
                    />

                    {/* Floating Value Tag */}
                    <rect
                      x={Math.max(10, Math.min(450, currentDestiny.cursorX - 42))}
                      y={Math.max(4, currentDestiny.cursorY - 22)}
                      width="84"
                      height="16"
                      rx="4"
                      fill="#1A1A1A"
                      opacity="0.92"
                    />
                    <text
                      x={Math.max(10, Math.min(450, currentDestiny.cursorX - 42)) + 42}
                      y={Math.max(4, currentDestiny.cursorY - 22) + 11}
                      textAnchor="middle"
                      fill="#D4AF37"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Age {currentDestiny.age} · {currentDestiny.score} Pts
                    </text>

                    {/* X-Axis Baseline and Age Markers */}
                    <line x1="30" y1="145" x2="520" y2="145" stroke="rgba(184, 134, 11, 0.35)" strokeWidth="1" />
                    <text x="30" y="156" fill="#6B635B" fontSize="9" fontFamily="monospace">Age 0</text>
                    <text x="135" y="156" fill="#6B635B" fontSize="9" fontFamily="monospace">Age 18</text>
                    <text x="205" y="156" fill="#d97706" fontSize="9" fontFamily="monospace" fontWeight="bold">Age 28</text>
                    <text x="278" y="156" fill="#8C6508" fontSize="9" fontFamily="monospace" fontWeight="bold">★ Age 38</text>
                    <text x="368" y="156" fill="#6B635B" fontSize="9" fontFamily="monospace">Age 48</text>
                    <text x="445" y="156" fill="#059669" fontSize="9" fontFamily="monospace" fontWeight="bold">Age 58</text>
                    <text x="505" y="156" fill="#6B635B" fontSize="9" fontFamily="monospace">Age 90</text>
                  </svg>
                </div>

                {/* Draggable HTML Range Slider Input */}
                <div className="mt-3.5 px-2">
                  <div className="flex items-center justify-between text-9px font-mono text-[#6B635B] mb-1">
                    <span>Birth (0 Yrs)</span>
                    <span className="font-bold text-[#8C6508]">← Drag or scrub to explore any age →</span>
                    <span>Longevity (90 Yrs)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={scrubAge}
                    onChange={(e) => setScrubAge(Number(e.target.value))}
                    className="w-full cursor-ew-resize accent-[#B8860B] h-2 rounded-lg bg-[#E5DEC9]"
                    aria-label="Scrub Destiny Curve Age"
                  />
                </div>

                {/* Real-time Dynamic Guidance Card */}
                <div className="mt-3.5 rounded-lg p-3 text-xs transition-all" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-2 mb-2" style={{ borderColor: 'rgba(184, 134, 11, 0.15)' }}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: '#1A1A1A' }}>
                        Age {currentDestiny.age} Horizon
                      </span>
                      <span className="rounded px-2 py-0.5 text-9px font-mono font-bold"
                        style={{
                          background: currentDestiny.score >= 85 ? 'rgba(184, 134, 11, 0.15)' : currentDestiny.score >= 75 ? 'rgba(5, 150, 105, 0.15)' : currentDestiny.score >= 65 ? 'rgba(37, 99, 235, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                          color: currentDestiny.score >= 85 ? '#785404' : currentDestiny.score >= 75 ? '#065f46' : currentDestiny.score >= 65 ? '#1e40af' : '#92400e',
                          border: `1px solid ${currentDestiny.score >= 85 ? '#B8860B' : currentDestiny.score >= 75 ? '#059669' : currentDestiny.score >= 65 ? '#2563EB' : '#D97706'}`,
                        }}>
                        Score {currentDestiny.score} / 100 · {currentDestiny.score >= 85 ? '★ Zenith Auspicious Window' : currentDestiny.score >= 75 ? 'High Momentum Period' : currentDestiny.score >= 65 ? 'Consolidation Phase' : '⚡ Karmic Testing & Pivot'}
                      </span>
                    </div>
                    <div className="font-mono text-10px text-[#8C6508]">
                      Active: <span className="font-bold text-[#1A1A1A]">{currentDestiny.dasha} Dasha</span>
                    </div>
                  </div>

                  <div className="text-11px leading-relaxed" style={{ color: '#3D3834' }}>
                    <span className="font-bold text-[#1A1A1A]">{currentDestiny.title}: </span>
                    {currentDestiny.desc}
                  </div>
                </div>

                {/* Mahadasha Track Ribbon (Highlights matching scrubbed age) */}
                <div className="mt-2.5 grid grid-cols-5 text-center text-8px sm:text-9px uppercase font-mono tracking-wider gap-1">
                  <div className={`rounded py-1 px-0.5 transition-colors ${isDashaActive(0, 16) ? 'bg-[#B8860B]/20 border border-[#B8860B] text-[#785404] font-bold shadow-xs' : 'bg-[#FFFFFF] border border-[rgba(184,134,11,0.2)] text-[#3D3834]'}`}>
                    0–16 Mars
                  </div>
                  <div className={`rounded py-1 px-0.5 transition-colors ${isDashaActive(16, 34) ? 'bg-[#B8860B]/20 border border-[#B8860B] text-[#785404] font-bold shadow-xs' : 'bg-[#FFFFFF] border border-[rgba(184,134,11,0.2)] text-[#3D3834]'}`}>
                    16–34 Jupiter
                  </div>
                  <div className={`rounded py-1 px-0.5 transition-colors ${isDashaActive(34, 53) ? 'bg-[#B8860B]/20 border border-[#B8860B] text-[#785404] font-bold shadow-xs' : 'bg-[#FFFFFF] border border-[rgba(184,134,11,0.2)] text-[#3D3834]'}`}>
                    34–53 Saturn
                  </div>
                  <div className={`rounded py-1 px-0.5 transition-colors ${isDashaActive(53, 70) ? 'bg-[#B8860B]/20 border border-[#B8860B] text-[#785404] font-bold shadow-xs' : 'bg-[#FFFFFF] border border-[rgba(184,134,11,0.2)] text-[#3D3834]'}`}>
                    53–70 Mercury
                  </div>
                  <div className={`rounded py-1 px-0.5 transition-colors ${isDashaActive(70, 90) ? 'bg-[#B8860B]/20 border border-[#B8860B] text-[#785404] font-bold shadow-xs' : 'bg-[#FFFFFF] border border-[rgba(184,134,11,0.2)] text-[#3D3834]'}`}>
                    70–90 Ketu
                  </div>
                </div>
              </div>
            </div>

            {/* 2. MEDICAL ASTROLOGY */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 4px 20px -4px rgba(184, 134, 11, 0.12)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🩺</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider font-semibold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    Charaka & Parashari Shastra
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                  Medical Kundli & Astro-Chikitsa
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#3D3834' }}>
                  Preventive lifestyle intelligence rooted in classical Ayurveda. Cross-verifies your 6th house (Roga), 8th house (Ayushya),
                  and Nakshatra organ rulers with planetary affiliations to compute your Tridosha constitution and detect transit medical vulnerabilities before symptoms arise.
                </p>
              </div>

              {/* Explicit Legal & Medical Disclaimer Callout */}
              <div className="mt-5 rounded-xl p-3.5 border text-xs" style={{ borderColor: 'rgba(184, 134, 11, 0.45)', background: '#FFFDF5' }}>
                <div className="flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <div className="space-y-0.5">
                    <span className="font-mono text-10px uppercase tracking-wider font-bold block" style={{ color: '#8C6508' }}>
                      Spiritual & Informational Wellness Notice
                    </span>
                    <p className="text-11px leading-relaxed" style={{ color: '#3D3834' }}>
                      For informational and spiritual purposes only. Not a substitute for professional medical advice, clinical diagnosis, or medical treatment.
                      Tridosha and Nakshatra organ mapping are classical Ayurvedic and astrological concepts, not clinical proof. Always consult a licensed medical physician.
                    </p>
                  </div>
                </div>
              </div>

              {/* Constitutional Tridosha Breakdown */}
              <div className="mt-4 rounded-xl p-4 border" style={{ borderColor: 'rgba(184, 134, 11, 0.25)', background: '#FAF7F2' }}>
                <div className="flex items-center justify-between text-xs font-bold" style={{ color: '#1A1A1A' }}>
                  <span>Constitutional Tridosha Breakdown</span>
                  <span className="text-9px font-semibold px-2 py-0.5 rounded" style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    Vata-Pitta Dominant
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-10px font-medium" style={{ color: '#1A1A1A' }}>
                      <span>Vata (Air / Nervous System)</span>
                      <span className="font-bold">46%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-[#E5DEC9] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '46%', background: '#2563EB' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-10px font-medium" style={{ color: '#1A1A1A' }}>
                      <span>Pitta (Fire / Metabolic Agni)</span>
                      <span className="font-bold">36%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-[#E5DEC9] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '36%', background: '#D97706' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-10px font-medium" style={{ color: '#1A1A1A' }}>
                      <span>Kapha (Earth / Fluid Lubrication)</span>
                      <span className="font-bold">18%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-[#E5DEC9] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '18%', background: '#059669' }} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-9px uppercase tracking-wider flex items-center gap-1.5 font-medium" style={{ color: '#8C6508' }}>
                  <span className="font-bold">✦ Early Advisory:</span>
                  <span style={{ color: '#3D3834' }}>Saturn transit activating 6th lord · Astrological advisory: prioritize lumbar spine ergonomics & nervous recovery</span>
                </div>
              </div>
            </div>

            {/* 3. ASTROSOUND THERAPY */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 4px 20px -4px rgba(184, 134, 11, 0.12)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🎵</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider font-semibold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    Raagas & Circadian Prahar
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                  AstroSound & Circadian Raaga Therapy
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#3D3834' }}>
                  In Indian classical shastra, melody scales (Raagas) are attuned to the 8 diurnal Prahar cycles and the 9 emotional Rasas. AstroLife correlates your active Vimshottari Mahadasha and Antardasha with authentic Raagas to cultivate emotional balance, cognitive focus, and restorative sleep.
                </p>
              </div>

              {/* Curated Classical Engine Raagas with Real Links */}
              <div className="mt-6 rounded-xl p-4 border space-y-3" style={{ borderColor: 'rgba(184, 134, 11, 0.25)', background: '#FAF7F2' }}>
                {/* Live Circadian Timing Banner */}
                <div className="rounded-lg p-2.5 flex items-center justify-between text-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)' }}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#059669]"></span>
                    </span>
                    <span className="font-mono text-9px uppercase tracking-wider font-bold" style={{ color: '#8C6508' }}>
                      ● Active Now for Local Time ({String(currentHour).padStart(2, '0')}:00):
                    </span>
                    <span className="text-10px font-semibold" style={{ color: '#1A1A1A' }}>
                      {activePraharObj.prahar}
                    </span>
                  </div>
                  <span className="hidden sm:inline font-mono text-9px text-[#059669] font-bold">
                    Suggested: {activePraharObj.name}
                  </span>
                </div>

                <div className="grid gap-2 text-xs">
                  {PRAHARS.map((p) => {
                    const isNow = p.key === activePraharObj.key;
                    return (
                      <div
                        key={p.key}
                        className={`rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs transition-all ${
                          isNow ? 'bg-[#FFFDF5] border-2 border-[#B8860B]' : 'bg-[#FFFFFF] border border-[rgba(184,134,11,0.2)]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-11px" style={{ color: '#1A1A1A' }}>
                              {p.name}
                            </span>
                            <span className="text-9px font-mono text-[#8C6508]">
                              ({p.prahar.split('·')[0].trim()})
                            </span>
                            {isNow && (
                              <span className="rounded-full px-2 py-0.5 text-8px font-mono font-bold uppercase tracking-wider bg-[#059669]/15 text-[#065f46] border border-[#059669]">
                                ● Active Now
                              </span>
                            )}
                          </div>
                          <div className="text-9px text-[#5C5248] mt-0.5">{p.mood}</div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <a
                            href={p.spotify}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded px-2.5 py-1 text-9px font-bold bg-[#1DB954]/12 text-[#15803d] border border-[#1DB954]/30 hover:bg-[#1DB954]/25 transition-colors"
                          >
                            Spotify ↗
                          </a>
                          <a
                            href={p.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded px-2.5 py-1 text-9px font-bold bg-[#FF0000]/12 text-[#b91c1c] border border-[#FF0000]/30 hover:bg-[#FF0000]/25 transition-colors"
                          >
                            YouTube ↗
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Acoustic Tanpura Drone Test */}
                <div className="pt-2 border-t flex items-center justify-between" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                  <div>
                    <div className="text-11px font-bold" style={{ color: '#1A1A1A' }}>
                      Acoustic Tanpura Harmonic Drone
                    </div>
                    <div className="text-9px text-[#5C5248]">
                      Sa-Pa Meditative Tuning (C#3 / G#3 Natural Harmonics)
                    </div>
                  </div>
                  <button
                    onClick={playTone}
                    disabled={playing}
                    className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-75 flex-shrink-0 shadow-sm"
                    style={{
                      background: 'linear-gradient(180deg, #D4AF37, #B8860B)',
                      color: '#FFFFFF',
                    }}
                  >
                    {playing ? 'Playing Tanpura (5s)...' : '▶ Listen (Tanpura Drone)'}
                  </button>
                </div>
              </div>
            </div>

            {/* 4. AI PALMISTRY VISION SCANNER - WITH INTERACTIVE HAND SVG & SPECIMEN REPORT */}
            <div className="flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 4px 20px -4px rgba(184, 134, 11, 0.12)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">✋</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider font-semibold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    Experimental Research Feature
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                  AI Palmistry Vision Scanner
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#3D3834' }}>
                  Snap a photo of your palm. Our computer-vision neural pipeline traces key anatomical landmarks and contour line vectors (Heart, Head, Life, and Fate lines). Fuses physical line signatures with your natal chart for experimental cross-verification with birth chart indications (exploratory research, not deterministic fortune prediction).
                </p>
              </div>

              {/* Interactive Palm Diagram & Live Specimen Box */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'rgba(184, 134, 11, 0.25)', background: '#FAF7F2' }}>
                {/* Line Selector Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 pb-3 border-b" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { key: 'heart', label: '❤️ Heart Line', color: '#DC2626' },
                      { key: 'head', label: '🧠 Head Line', color: '#2563EB' },
                      { key: 'life', label: '🌿 Life Line', color: '#059669' },
                      { key: 'fate', label: '⚡ Fate Line', color: '#B8860B' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setPalmLine(item.key as any)}
                        className={`cursor-pointer rounded px-2 py-1 text-9px font-bold transition-all ${
                          palmLine === item.key
                            ? 'bg-[#FFFFFF] border-2 shadow-xs'
                            : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                        }`}
                        style={{
                          borderColor: palmLine === item.key ? item.color : undefined,
                          color: palmLine === item.key ? item.color : undefined,
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={triggerPalmScan}
                    className="cursor-pointer rounded-full px-2.5 py-1 text-9px font-bold transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: isScanningPalm ? '#059669' : 'linear-gradient(180deg, #D4AF37, #B8860B)',
                      color: '#FFFFFF',
                    }}
                  >
                    {isScanningPalm ? 'Scanning...' : '▶ Simulate Scan'}
                  </button>
                </div>

                {/* Hand Palm SVG Illustration */}
                <div className="relative mt-3 h-44 w-full flex items-center justify-center overflow-hidden rounded-lg bg-[#FAF5EB] border" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                  <svg className="h-full max-w-[280px]" viewBox="0 0 320 220" fill="none">
                    {/* Hand Palm Silhouette */}
                    <path
                      d="M 60 190 C 50 160, 52 110, 65 95 C 68 85, 78 40, 85 45 C 92 50, 95 85, 105 85 C 112 55, 120 20, 130 22 C 140 25, 142 80, 150 80 C 158 50, 170 15, 182 18 C 192 20, 190 80, 200 85 C 208 55, 220 35, 230 40 C 238 45, 230 95, 235 110 C 248 135, 255 170, 240 195 C 220 215, 100 215, 60 190 Z"
                      fill="#FFFFFF"
                      stroke="rgba(184, 134, 11, 0.45)"
                      strokeWidth="2"
                    />

                    {/* MediaPipe 21 Landmark Keypoints */}
                    {[
                      [65, 190], [150, 205], [240, 195], // wrist
                      [70, 135], [78, 90], [85, 45], // thumb
                      [105, 110], [112, 75], [120, 45], [130, 22], // index
                      [150, 110], [158, 70], [170, 40], [182, 18], // middle
                      [190, 115], [198, 75], [208, 50], [220, 35], // ring
                      [225, 125], [232, 95], [238, 70], // pinky
                    ].map(([cx, cy], idx) => (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r={isScanningPalm ? 3.5 : 2}
                        fill="#B8860B"
                        opacity={isScanningPalm ? 0.9 : 0.4}
                        className={isScanningPalm ? 'animate-ping' : ''}
                      />
                    ))}

                    {/* 1. Heart Line */}
                    <path
                      d="M 85 92 C 120 88, 175 92, 225 65"
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth={palmLine === 'heart' ? 4 : 1.8}
                      strokeOpacity={palmLine === 'heart' ? 1 : 0.4}
                      strokeLinecap="round"
                    />

                    {/* 2. Head Line */}
                    <path
                      d="M 95 115 C 140 118, 185 130, 230 148"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth={palmLine === 'head' ? 4 : 1.8}
                      strokeOpacity={palmLine === 'head' ? 1 : 0.4}
                      strokeLinecap="round"
                    />

                    {/* 3. Life Line */}
                    <path
                      d="M 95 115 C 115 140, 125 175, 115 198"
                      fill="none"
                      stroke="#059669"
                      strokeWidth={palmLine === 'life' ? 4 : 1.8}
                      strokeOpacity={palmLine === 'life' ? 1 : 0.4}
                      strokeLinecap="round"
                    />

                    {/* 4. Fate Line */}
                    <path
                      d="M 152 200 C 154 155, 158 110, 155 70"
                      fill="none"
                      stroke="#B8860B"
                      strokeWidth={palmLine === 'fate' ? 4.5 : 2}
                      strokeOpacity={palmLine === 'fate' ? 1 : 0.4}
                      strokeLinecap="round"
                    />

                    {/* Active Line Indicator Ring */}
                    {palmLine === 'heart' && <circle cx="155" cy="89" r="6" fill="none" stroke="#DC2626" strokeWidth="2" className="animate-pulse" />}
                    {palmLine === 'head' && <circle cx="165" cy="124" r="6" fill="none" stroke="#2563EB" strokeWidth="2" className="animate-pulse" />}
                    {palmLine === 'life' && <circle cx="118" cy="155" r="6" fill="none" stroke="#059669" strokeWidth="2" className="animate-pulse" />}
                    {palmLine === 'fate' && <circle cx="156" cy="135" r="7" fill="none" stroke="#B8860B" strokeWidth="2.5" className="animate-pulse" />}

                    {/* Scanning Beam Animation */}
                    {isScanningPalm && (
                      <line x1="40" y1="20" x2="280" y2="20" stroke="#059669" strokeWidth="3" opacity="0.8">
                        <animate attributeName="y1" values="20;200;20" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="y2" values="20;200;20" dur="1.2s" repeatCount="indefinite" />
                      </line>
                    )}
                  </svg>
                </div>

                {/* Live Specimen Report Card */}
                <div className="mt-3 rounded-lg p-3 text-xs" style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.25)', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span style={{
                      color: palmLine === 'heart' ? '#DC2626' : palmLine === 'head' ? '#2563EB' : palmLine === 'life' ? '#059669' : '#8C6508'
                    }}>
                      ✦ Live Analysis: {palmLine === 'heart' ? 'Heart Line (Emotional Depth)' : palmLine === 'head' ? 'Head Line (Intellect & Focus)' : palmLine === 'life' ? 'Life Line (Vitality Arch)' : 'Fate Line (Saturn Karma Track)'}
                    </span>
                    <span className="font-mono text-9px text-[#059669]">21 Landmark Nodes</span>
                  </div>

                  <p className="text-11px leading-relaxed text-[#3D3834]">
                    {palmLine === 'heart' && 'Deep curved contour terminating near Jupiter mount — indicates high emotional discernment, loyalty in long-term relationships, and heart chakra alignment.'}
                    {palmLine === 'head' && 'Long unbroken path inclining toward upper Moon mount — confirms exceptional analytical clarity, strategic architecture capabilities, and creative problem-solving.'}
                    {palmLine === 'life' && 'Broad continuous arc encircling robust Venus mount — reflects sturdy constitutional stamina, rapid physiological recuperation, and steady immune resistance.'}
                    {palmLine === 'fate' && 'Sharp vertical ascent originating at Age 28 (wrist to Saturn mount) — confirms career autonomy milestone in late 20s, accelerating into prime leadership during Saturn Antardasha.'}
                  </p>

                  <div className="mt-2 pt-2 border-t flex flex-wrap items-center justify-between text-9px uppercase tracking-wider font-semibold" style={{ borderColor: 'rgba(184, 134, 11, 0.15)' }}>
                    <span style={{ color: '#8C6508' }}>
                      {palmLine === 'heart' && 'Fused with 4th House Chandra & Venusian balance'}
                      {palmLine === 'head' && 'Fused with 10th House Budhaditya Yoga'}
                      {palmLine === 'life' && 'Fused with Lagna Lord strength & 8th House'}
                      {palmLine === 'fate' && 'Fused with 10th Lord Saturn Dasha timing'}
                    </span>
                    <span className="text-[#059669] font-mono">🔒 Zero Biometric Retention</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. TRANSIT RIPPLE ENGINE (Full-width card) */}
            <div className="lg:col-span-2 flex flex-col justify-between rounded-2xl p-7 md:p-8 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.3)', boxShadow: '0 4px 20px -4px rgba(184, 134, 11, 0.12)' }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🌊</span>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-9px uppercase tracking-wider font-semibold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    Multi-House Shockwave Engine
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                  Planetary Transit Ripple Engine
                </h3>
                <p className="mt-2 text-sm leading-relaxed max-w-4xl" style={{ color: '#3D3834' }}>
                  Major planetary transits never act in isolation. When slow-moving cosmic giants (Saturn, Jupiter, Rahu, Ketu) enter a new rashi,
                  their drishti (aspects) and resonance trigger 4 interconnected houses simultaneously. Click below to simulate how each cosmic transit propagates its shockwave.
                </p>
              </div>

              {/* Interactive Transit Selector & Ripple Propagation Canvas */}
              <div className="mt-6 rounded-xl p-4 border" style={{ borderColor: 'rgba(184, 134, 11, 0.25)', background: '#FAF7F2' }}>
                {/* Transit Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-9px uppercase tracking-wider font-bold" style={{ color: '#8C6508' }}>
                      Select Transit Shockwave:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveTransit('saturn')}
                      className={`cursor-pointer rounded px-3 py-1 text-10px font-medium transition-colors ${
                        activeTransit === 'saturn'
                          ? 'bg-[#B8860B]/20 text-[#785404] border border-[#B8860B] font-bold shadow-xs'
                          : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                      }`}
                    >
                      🪐 Saturn in Pisces
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTransit('jupiter')}
                      className={`cursor-pointer rounded px-3 py-1 text-10px font-medium transition-colors ${
                        activeTransit === 'jupiter'
                          ? 'bg-[#059669]/15 text-[#065f46] border border-[#059669] font-bold shadow-xs'
                          : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                      }`}
                    >
                      🌟 Jupiter in Taurus
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTransit('rahu')}
                      className={`cursor-pointer rounded px-3 py-1 text-10px font-medium transition-colors ${
                        activeTransit === 'rahu'
                          ? 'bg-[#7c3aed]/15 text-[#6d28d9] border border-[#7c3aed] font-bold shadow-xs'
                          : 'bg-[#FAF5EB] text-[#5C5248] border border-[rgba(184,134,11,0.2)] hover:text-[#1A1A1A]'
                      }`}
                    >
                      ⚡ Rahu-Ketu Axis
                    </button>
                  </div>
                </div>

                {/* Active Transit Header Tag */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-xs" style={{ color: '#1A1A1A' }}>
                    ✦ Active Simulation: {TRANSIT_DATA[activeTransit].name}
                  </div>
                  <span className="font-mono text-9px uppercase px-2 py-0.5 rounded font-bold"
                    style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.25)' }}>
                    {TRANSIT_DATA[activeTransit].cycle}
                  </span>
                </div>
                <div className="text-10px text-[#5C5248] mt-0.5 mb-3">
                  {TRANSIT_DATA[activeTransit].tagline}
                </div>

                {/* 4 Multi-House Shockwave Cards */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  {TRANSIT_DATA[activeTransit].houses.map((h, i) => (
                    <div
                      key={h.tag}
                      className={`rounded-lg p-3.5 shadow-xs transition-all ${
                        i === 0 ? 'bg-[#FFFDF5] border-2 border-[#B8860B]' : 'bg-[#FFFFFF] border border-[rgba(184,134,11,0.25)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-9px uppercase tracking-wider font-bold"
                          style={{ color: i === 0 ? '#B8860B' : '#8C6508' }}>
                          {h.tag}
                        </span>
                        <span className="text-8px font-mono px-1.5 py-0.5 rounded font-semibold bg-[#FAF5EB] text-[#5C5248]">
                          {h.impact}
                        </span>
                      </div>
                      <div className="font-bold text-sm mt-1" style={{ color: '#1A1A1A' }}>
                        {h.title}
                      </div>
                      <div className="text-10px mt-1.5 leading-relaxed" style={{ color: '#3D3834' }}>
                        {h.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* TIER 2: DECISION & LIFE INTELLIGENCE SUITE (6 Interactive Cards) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.4)' }}>
              Tier 2 · Practical Life Solutions
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#6B635B' }}>
              6 Interactive Decision Engines
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 'marriage',
                icon: '💍',
                title: 'K.N. Rao Marriage Window Scanner',
                badge: 'Double-Transit Sutra',
                desc: 'Identifies the precise 12-month marriage timing window through Jupiter and Saturn mutual aspects on the 7th house and lagna, combined with 36-point Ashtakoota & Nadi Dosha cancellation.',
                tabs: ['Double-Transit Sutra', '36-Point Ashtakoota'],
                previews: [
                  'Both Saturn & Jupiter must aspect 7th house or 7th lord simultaneously for marriage manifestation.',
                  'Ashtakoota 36 Guna Milan with automatic cancellation rules for Nadi Dosha & Bhakoot.',
                ],
              },
              {
                id: 'yogas',
                icon: '⚡',
                title: '300+ Vedic Yogas & 6-Fold Shadbala',
                badge: 'Algorithmic Shastra',
                desc: 'Automatic detection of Raja, Dhana, Gajakesari, and Viparita yogas with Sthana, Dik, Kaala, and Chesta mathematical Shadbala scores to compute genuine planetary strength.',
                tabs: ['Yoga Detector', '6-Fold Shadbala'],
                previews: [
                  'Scans 300+ classical yogas: Gajakesari, Pancha Mahapurusha, Neechbhanga Raja Yoga & Viparita.',
                  'Computes Sthana (positional), Dik (directional), Kaala (temporal), & Chesta (motional) bala.',
                ],
              },
              {
                id: 'numerology',
                icon: '🔢',
                title: 'Vedic & Pythagorean Numerology Matrix',
                badge: 'Name Vibration',
                desc: 'Life Path, Soul Urge, and Destiny Number calculations with Lo-Shu Grid analysis. Optimizes personal and business name spellings for harmonic frequency alignment with your planetary chart.',
                tabs: ['Lo-Shu 3x3 Grid', 'Name Harmonic Tuning'],
                previews: [
                  'Identifies missing numbers and energetic arrows of will, intellect, and prosperity in the 3x3 Lo-Shu grid.',
                  'Compound name vibration tuning to eliminate anti-planetary friction with Lagna & Dasha lords.',
                ],
              },
              {
                id: 'muhurat',
                icon: '⏱️',
                title: '30-Day Precision Shubh Muhurat Scanner',
                badge: 'Auspicious Timing',
                desc: 'Automated 30-day shastra scanner for Vivah, Griha Pravesh, Startup Registration, and Major Investments — pre-calculating Chaughadia, Abhijit, Hora, and eliminating Rahu Kaal pitfalls.',
                tabs: ['Shubh Chaughadia', 'Rahu Kaal Filter'],
                previews: [
                  'Ranks Amrit, Shubh, and Labh Chaughadia windows with Abhijit Muhurat overlap down to the minute.',
                  'Strict negative filtering: eliminates Rahu Kaal, Gulika, Yamaganda, and Bhadra Vishti Karana.',
                ],
              },
              {
                id: 'vastu',
                icon: '🏛️',
                title: '16-Zone Astro-Vastu Directional Engine',
                badge: 'Spatial Alignment',
                desc: 'Maps the 16 Vastu directions of your home or workplace to your planetary strengths. Detects directional blockages without costly architectural demolition, providing subtle element remedies.',
                tabs: ['16-Zone Compass', 'Zero-Demolition Upaya'],
                previews: [
                  'Maps North-East (Ishanya/Jupiter) to South-West (Nairutya/Rahu) to balance personal energy flow.',
                  'Zero-demolition elemental remedies using metals, elemental colors, yantras, and lighting.',
                ],
              },
              {
                id: 'jung',
                icon: '🧠',
                title: 'Jungian Astro-Psychology & Shadow Work',
                badge: 'Subconscious Archetypes',
                desc: 'Bridges Swiss psychoanalyst Carl Jung with ancient Jyotish. Analyzes elemental temperament, shadow archetypes, and subconscious karmic blind spots for authentic psychological growth.',
                tabs: ['Shadow Archetypes', 'Karmic Blind Spots'],
                previews: [
                  'Unveils Rahu-Ketu axis subconscious fixation: unconscious obsessions and repressed potential.',
                  'Actionable shadow integration prompts to turn astrological conflict into psychological maturity.',
                ],
              },
            ].map((card) => {
              const activeIdx = tier2Tabs[card.id] || 0;
              return (
                <div key={card.id} className="flex flex-col justify-between rounded-xl p-6 transition-all duration-300 hover:border-[#B8860B]"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(184, 134, 11, 0.25)', boxShadow: '0 4px 16px -2px rgba(184, 134, 11, 0.1)' }}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{card.icon}</span>
                      <span className="font-mono text-9px uppercase tracking-wider px-2.5 py-0.5 rounded font-semibold"
                        style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.2)' }}>
                        {card.badge}
                      </span>
                    </div>
                    <h4 className="mt-4 font-serif text-lg font-bold" style={{ color: '#1A1A1A' }}>
                      {card.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: '#3D3834' }}>
                      {card.desc}
                    </p>
                  </div>

                  {/* Interactive Tab Chips & Live Preview Box */}
                  <div className="mt-4 pt-3 border-t" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {card.tabs.map((tab, idx) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setCardTab(card.id, idx)}
                          className={`cursor-pointer rounded px-2.5 py-1 text-9px font-mono transition-colors ${
                            activeIdx === idx
                              ? 'bg-[#B8860B]/16 text-[#785404] border border-[#B8860B] font-bold'
                              : 'text-[#6B635B] bg-[#FAF5EB] hover:text-[#1A1A1A] border border-[rgba(184,134,11,0.2)]'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="rounded p-2.5 text-10px leading-relaxed border" style={{ background: '#FAF7F2', borderColor: 'rgba(184, 134, 11, 0.2)', color: '#2A2623' }}>
                      <span className="text-[#8C6508] font-mono text-9px font-bold block mb-0.5">✦ Live Engine Logic:</span>
                      {card.previews[activeIdx]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TIER 3: THE CLASSICAL VEDIC SUPERCOMPUTER (6 Core Systems) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.4)' }}>
              Tier 3 · Classical Shastra Supercomputer
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#6B635B' }}>
              Deep Mathematical & Epistemological Architecture
            </span>
          </div>

          <div className="grid gap-px overflow-hidden rounded-xl sm:grid-cols-2 lg:grid-cols-3"
            style={{ border: '1px solid rgba(184, 134, 11, 0.3)', background: 'rgba(184, 134, 11, 0.2)' }}>
            {[
              {
                num: '01',
                title: '5-Tier Vimshottari Dasha Hierarchy',
                desc: 'Mahadasha, Antardasha, Pratyantardasha, Sookshma, and Pranadasha computed down to exact hours and minutes for micro-timing life events.'
              },
              {
                num: '02',
                title: 'Daily Panchang & Microsecond Boundaries',
                desc: 'High-precision Vedic Ganita Siddhanta calculations for Tithi, Vara, Nakshatra, Yoga, and Karana, with exact sunrise, sunset, and twilight transitions.'
              },
              {
                num: '03',
                title: 'Krishnamurti Paddhati (KP System)',
                desc: 'Placidus cusp calculations, 249 sub-lord divisions, 4-step ruling planets, and significators for precise event confirmation.'
              },
              {
                num: '04',
                title: 'Lal Kitab Farman & Practical Upaya',
                desc: 'Identifies sleeping houses, blind planets, ancestral debts (Pitra Rin), and zero-cost, non-commercial household remedies.'
              },
              {
                num: '05',
                title: 'Jaimini Sutras & Chara Karakas',
                desc: 'Atmakaraka soul purpose, Arudha Lagna public illusion, Upapada relationship karma, and Karakamsha spiritual path.'
              },
              {
                num: '06',
                title: '81-Square Sarvatobhadra Chakra & AstroBank',
                desc: 'Classical Sarvatobhadra Nakshatra Vedha matrix alongside our research archive of 4,000+ verified historical charts.'
              },
            ].map((sys) => (
              <div key={sys.title} className="p-6" style={{ background: '#FFFFFF' }}>
                <span className="font-mono text-xs font-bold" style={{ color: '#8C6508' }}>{sys.num}</span>
                <div className="mt-1 font-serif text-base font-bold" style={{ color: '#1A1A1A' }}>{sys.title}</div>
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: '#3D3834' }}>{sys.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ====================== III · A SPECIMEN READING ==================== */
export function DirectionAInsights() {
  const [viewMode, setViewMode] = useState<'conversational' | 'shastra'>('conversational');

  const msgs = [
    { who: 'you', t: 'Should I take the offer in Berlin?' },
    {
      who: 'ai',
      t: 'You are in Jupiter mahādaśā, Saturn antardaśā — a season that rewards patience over speed. The move is sound, but its fruit ripens in 18–24 months. If you can hold steady, go. If you need fast returns, wait for Mercury in April.',
    },
    { who: 'you', t: 'When does Venus reach my seventh house?' },
    {
      who: 'ai',
      t: 'October 19, 14:22 IST. Watch the following three days — someone returns to your life unbidden.',
    },
  ];

  return (
    <section className="relative px-6 py-24 md:px-10" style={{ background: 'var(--al-bg)' }}>
      <div className="mx-auto max-w-3xl">
        <FolioMarker numeral="III" label="A Specimen Reading" />
        <h2 className="dira-display-sm mb-4" style={{ color: '#1A1A1A' }}>
          It answers from <span className="italic" style={{ color: '#8C6508' }}>your</span> chart.
        </h2>
        <p className="mb-8 text-sm md:text-base leading-relaxed" style={{ color: '#3D3834' }}>
          No canned horoscopes or generic AI filler. Toggle to Classical Shastra Proof to see the exact Sanskrit sutras,
          ephemeris coordinates, and KP sub-lord mathematics calculating each answer.
        </p>

        <div className="overflow-hidden rounded-2xl shadow-md border"
          style={{ borderColor: 'rgba(184, 134, 11, 0.35)', background: '#FFFFFF' }}>
          {/* Reading Header with View Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5"
            style={{ borderColor: 'rgba(184, 134, 11, 0.2)', background: '#FAF7F2' }}>
            <div className="flex items-center gap-3">
              <span className="h-7 w-7 rounded-full flex items-center justify-center text-xs shadow-xs"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', color: '#FFFFFF' }}>
                ✦
              </span>
              <div>
                <div className="text-sm font-bold" style={{ color: '#1A1A1A' }}>AstroLife AI Engine</div>
                <div className="text-9px font-mono uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#059669' }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
                  Live Natal Chart Active · Lahiri Ayanamsha
                </div>
              </div>
            </div>

            {/* Shastra vs Conversational Toggle */}
            <div className="flex rounded-lg p-0.5 border" style={{ borderColor: 'rgba(184, 134, 11, 0.3)', background: '#FAF5EB' }}>
              <button
                type="button"
                onClick={() => setViewMode('conversational')}
                className={`cursor-pointer rounded px-3 py-1 text-10px font-medium transition-all ${
                  viewMode === 'conversational'
                    ? 'bg-[#FFFFFF] text-[#1A1A1A] font-bold shadow-xs'
                    : 'text-[#6B635B] hover:text-[#1A1A1A]'
                }`}
              >
                💬 Conversational
              </button>
              <button
                type="button"
                onClick={() => setViewMode('shastra')}
                className={`cursor-pointer rounded px-3 py-1 text-10px font-medium transition-all ${
                  viewMode === 'shastra'
                    ? 'bg-[#B8860B] text-[#FFFFFF] font-bold shadow-xs'
                    : 'text-[#6B635B] hover:text-[#1A1A1A]'
                }`}
              >
                📜 Classical Shastra Proof
              </button>
            </div>
          </div>

          {/* Reading Content */}
          <div className="space-y-4 p-5 md:p-6" style={{ background: '#FFFFFF' }}>
            {viewMode === 'conversational' ? (
              // Conversational View
              msgs.map((m, i) => (
                <div key={i} className="flex" style={{ justifyContent: m.who === 'you' ? 'flex-end' : 'flex-start' }}>
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                    style={{
                      background: m.who === 'you' ? '#FAF5EB' : '#FAF7F2',
                      border: `1px solid ${m.who === 'you' ? 'rgba(184, 134, 11, 0.4)' : 'rgba(184, 134, 11, 0.2)'}`,
                      color: m.who === 'you' ? '#785404' : '#2A2623',
                    }}>
                    {m.who === 'you' ? (
                      <span className="font-medium text-xs sm:text-sm">{m.t}</span>
                    ) : (
                      <div>
                        <span className="font-mono text-9px uppercase tracking-wider block mb-1 text-[#8C6508] font-bold">
                          AstroLife Synthesizer:
                        </span>
                        <span className="text-xs sm:text-sm">{m.t}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Classical Shastra Proof View
              <div className="space-y-5">
                {/* Proof Item 1 */}
                <div className="rounded-xl p-4 border" style={{ borderColor: 'rgba(184, 134, 11, 0.3)', background: '#FAF7F2' }}>
                  <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                    <span className="font-bold text-xs" style={{ color: '#1A1A1A' }}>
                      Query 1: “Should I take the offer in Berlin?”
                    </span>
                    <span className="font-mono text-9px uppercase px-2 py-0.5 rounded font-bold"
                      style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.3)' }}>
                      Dasha & KP Proof
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: '#3D3834' }}>
                    <div className="rounded p-2.5 bg-[#FFFFFF] border" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                      <div className="font-mono text-9px uppercase font-bold text-[#8C6508] mb-0.5">
                        1. Brihat Parashara Hora Shastra (BPHS) · Ch. 42 (Guru-Shani Phala)
                      </div>
                      <p className="italic text-[#1A1A1A] font-serif text-11px">
                        “Guru-Sani sambandhe vilambena phalam drishyate; navame sthite videsha gamanat...”
                      </p>
                      <p className="mt-1 text-10px text-[#5C5248]">
                        Classical Translation: Saturn Antardasha under Jupiter Mahadasha operates with gestational delay. Relocation across the 9th/10th axis stabilizes durably only after 18–24 months of groundwork.
                      </p>
                    </div>

                    <div className="rounded p-2.5 bg-[#FFFFFF] border" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                      <div className="font-mono text-9px uppercase font-bold text-[#8C6508] mb-0.5">
                        2. Krishnamurti Paddhati (KP 249 Sub-Lord Rule)
                      </div>
                      <p className="text-10px text-[#1A1A1A]">
                        10th Cusp Sub-Lord is <span className="font-bold">Saturn</span>, situated in Star of <span className="font-bold">Sun</span> (Uttarashadha). Sun rules 9th house (foreign relocation). Signifies houses <span className="font-mono font-bold text-[#059669]">2, 6, 9, 10, 11</span> — affirmative for international professional elevation, but requires steadfast endurance before Mercury Antardasha unlocks liquidity.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Proof Item 2 */}
                <div className="rounded-xl p-4 border" style={{ borderColor: 'rgba(184, 134, 11, 0.3)', background: '#FAF7F2' }}>
                  <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                    <span className="font-bold text-xs" style={{ color: '#1A1A1A' }}>
                      Query 2: “When does Venus reach my seventh house?”
                    </span>
                    <span className="font-mono text-9px uppercase px-2 py-0.5 rounded font-bold"
                      style={{ background: '#FAF5EB', color: '#8C6508', border: '1px solid rgba(184, 134, 11, 0.3)' }}>
                      Swiss Ephemeris & Gochara
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: '#3D3834' }}>
                    <div className="rounded p-2.5 bg-[#FFFFFF] border" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                      <div className="font-mono text-9px uppercase font-bold text-[#8C6508] mb-0.5">
                        1. Sub-Arcsecond Planetary Coordinate
                      </div>
                      <p className="font-mono text-10px text-[#1A1A1A]">
                        Venus ingress into 7th Rashi (Libra / Tula): <span className="font-bold text-[#8C6508]">Oct 19, 14:22:18 IST</span> at exactly 14°22'04&quot;. (Lahiri Ayanamsha: 24°13'42&quot;).
                      </p>
                    </div>

                    <div className="rounded p-2.5 bg-[#FFFFFF] border" style={{ borderColor: 'rgba(184, 134, 11, 0.2)' }}>
                      <div className="font-mono text-9px uppercase font-bold text-[#8C6508] mb-0.5">
                        2. Phaladeepika · Ch. 14 (Gocharaphala) & Kakshya Timing
                      </div>
                      <p className="italic text-[#1A1A1A] font-serif text-11px">
                        “Shukre saptame sthite purva sambandha punaragamanam...”
                      </p>
                      <p className="mt-1 text-10px text-[#5C5248]">
                        Transiting Venus crosses natal 7th cusp Kakshya with 6 benefic Ashtakavarga Bindus. Activates unexpected reconnection from past relationships, legal reconciliations, and contract signings within a 72-hour window.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-9px uppercase tracking-wider font-mono text-[#059669] pt-1">
                  <span>✓ 100% Deterministic Shastra Grounding</span>
                  <span>Zero LLM Hallucination</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================== IV · HOW IT WORKS ======================= */
export function DirectionAHowItWorks() {
  const steps = [
    { t: 'Give your birth', d: 'Date, time and place. Thirty seconds, no account.' },
    { t: 'Receive your kundli', d: 'D-1, D-9 and current daśā — yours to keep, forever, no card.' },
    { t: 'Ask anything', d: 'Career, marriage, money, timing. The AI reasons aloud from your chart.' },
    { t: 'Go deeper when ready', d: 'Premium opens KP, Lāl Kitāb, family karma and the printed Blueprint.' },
  ];
  return (
    <section id="how" className="relative px-6 py-24 md:px-10" style={{ background: TINT(35) }}>
      <div className="mx-auto max-w-4xl">
        <FolioMarker numeral="IV" label="The Passage" />
        <h2 className="dira-display-sm mb-12" style={{ color: 'var(--al-ivory)' }}>
          Four steps from birth to <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>clarity.</span>
        </h2>
        <ol className="relative ml-3 border-l" style={{ borderColor: 'var(--al-line-strong)' }}>
          {steps.map((s, i) => (
            <li key={s.t} className="relative pl-10 pb-10 last:pb-0">
              <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full font-mono text-10px"
                style={{ background: 'var(--al-bg)', border: '1px solid var(--al-gold)', color: 'var(--al-gold)' }}>
                {i + 1}
              </span>
              <div className="font-serif text-xl" style={{ color: 'var(--al-ivory)' }}>{s.t}</div>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ============================== V · PRICING ========================= */
export function DirectionAPricing() {
  const plans = [
    { tier: 'Free', price: '₹0', note: 'Begin here', primary: false,
      bullets: ['Full Vedic chart (D-1, D-9)', '10 AI questions / month', 'Today’s daśā teaser', 'Daily one-line forecast'],
      cta: 'Cast my free kundli' },
    { tier: 'Premium', price: '₹499', note: 'Most chosen', primary: true,
      bullets: ['Everything in Free', 'Unlimited AI conversations', 'Full daśā · antardaśā · pratyantar', 'KP · Lāl Kitāb · Nāḍī · Vāstu', 'Compatibility & matching', 'Printed Cosmic Blueprint (PDF)'],
      cta: 'Begin Premium' },
    { tier: 'Elite', price: '₹1,999', note: 'For the seekers', primary: false,
      bullets: ['Everything in Premium', 'A named, personalized AI astrologer', 'Family-karma chart linking', 'Annual Varṣaphala forecast', 'Priority WhatsApp line', 'Quarterly human review'],
      cta: 'Go Elite' },
  ];
  return (
    <section id="pricing" className="relative px-6 py-24 md:px-10" style={{ background: 'var(--al-bg)' }}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <FolioMarker numeral="V" label="The Subscription" />
        </div>
        <h2 className="dira-display-sm mb-14 text-center" style={{ color: 'var(--al-ivory)' }}>
          Pay only for the <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>depth</span> you want.
        </h2>
        <div className="grid gap-6 md:grid-cols-3 md:items-start">
          {plans.map((p) => (
            <div key={p.tier}
              className={`relative flex flex-col rounded-2xl p-6 sm:p-7 transition-transform duration-300 hover:-translate-y-1 ${p.primary ? 'md:scale-[1.03]' : ''}`}
              style={{
                background: p.primary ? TINT(85) : TINT(45),
                border: `1px solid ${p.primary ? 'var(--al-line-strong)' : 'var(--al-line)'}`,
                boxShadow: p.primary ? 'var(--al-shadow-lg)' : 'none',
              }}>
              {p.primary && (
                <span className="absolute right-6 top-6 rounded-full px-3 py-1 text-8px font-semibold uppercase tracking-widest"
                  style={{ background: GOLD_TINT(16), color: 'var(--al-gold-bright)', border: '1px solid var(--al-line-strong)' }}>
                  {p.note}
                </span>
              )}
              {!p.primary && (
                <div className="mb-2 text-9px font-semibold uppercase tracking-widest" style={{ color: 'var(--al-ivory-mute)' }}>{p.note}</div>
              )}
              <div className="font-serif text-2xl" style={{ color: 'var(--al-ivory)' }}>{p.tier}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-serif text-4xl" style={{ color: p.primary ? 'var(--al-gold-bright)' : 'var(--al-ivory)' }}>{p.price}</span>
                {p.price !== '₹0' && <span className="text-sm" style={{ color: 'var(--al-ivory-mute)' }}>/mo</span>}
              </div>
              <a href={p.price === '₹0' ? '/onboarding' : '/auth/signup'}
                className="mt-6 cursor-pointer inline-block w-full text-center rounded-full py-3 text-sm font-semibold tracking-wide transition-transform duration-300 hover:scale-[1.02]"
                style={{
                  background: p.primary ? 'linear-gradient(180deg, var(--al-gold-bright), var(--al-gold))' : 'transparent',
                  color: p.primary ? 'var(--al-bg)' : 'var(--al-gold)',
                  border: p.primary ? 'none' : '1px solid var(--al-line-strong)',
                }}>
                {p.cta}
              </a>
              <div className="mt-7 space-y-3">
                {p.bullets.map((b) => (
                  <div key={b} className="flex items-start gap-3 text-sm" style={{ color: 'var(--al-ivory-dim)' }}>
                    <span style={{ color: 'var(--al-gold)' }}>✦</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================= VI · VOICES ========================== */
export function DirectionATestimonials() {
  const quotes = [
    { q: 'It named my Saturn return to the week. I have since deleted three other apps.', n: 'Priya S.', r: 'Product Manager · Bengaluru' },
    { q: 'The remedies felt gentle, never gimmicky. I trust it precisely because it does not try too hard.', n: 'Arjun M.', r: 'Founder · Mumbai' },
    { q: 'I am a scientist and a sceptic. The reasoning it shows beside each prediction is what won me.', n: 'Kavya R.', r: 'Doctor · Delhi' },
  ];
  return (
    <section id="testimonials" className="relative px-6 py-24 md:px-10" style={{ background: TINT(35) }}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <FolioMarker numeral="VI" label="Testimonials" />
        </div>
        <h2 className="dira-display-sm mb-14 text-center" style={{ color: 'var(--al-ivory)' }}>
          Trusted by <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>thousands.</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((t) => (
            <figure key={t.n} className="flex flex-col rounded-2xl p-7"
              style={{ background: 'var(--al-bg)', border: '1px solid var(--al-line)' }}>
              <div className="mb-4 font-serif text-3xl leading-none" style={{ color: 'var(--al-gold)' }}>&ldquo;</div>
              <blockquote className="flex-1 font-serif text-lg italic leading-relaxed" style={{ color: 'var(--al-ivory)' }}>
                {t.q}
              </blockquote>
              <figcaption className="mt-6">
                <div className="text-sm font-semibold" style={{ color: 'var(--al-ivory)' }}>{t.n}</div>
                <div className="text-9px uppercase tracking-widest" style={{ color: 'var(--al-ivory-mute)' }}>{t.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ CLOSING CTA =========================== */
export function DirectionAClosing({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <section className="relative overflow-hidden px-6 py-28 text-center md:px-10"
      style={{ background: 'var(--al-bg)' }}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.4 }}>
        <CelestialInstrument size={520} style={{ maxWidth: '90vw', maxHeight: '90vw' }} />
      </div>
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, transparent, var(--al-bg) 78%)' }} />
      <div className="relative z-10 mx-auto max-w-2xl">
        <OrnamentDivider />
        <h2 className="dira-display mt-6" style={{ color: 'var(--al-ivory)' }}>
          The sky has been
          <br />
          <span className="italic" style={{ color: 'var(--al-gold-bright)' }}>waiting for you.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-md text-base" style={{ color: 'var(--al-ivory-dim)' }}>
          Cast your chart in thirty seconds. Free, forever, no card.
        </p>
        <button onClick={onGetStarted}
          className="group mt-9 cursor-pointer rounded-full px-10 py-4 text-sm font-semibold tracking-wide transition-transform duration-300 hover:scale-[1.03]"
          style={{
            background: 'linear-gradient(180deg, var(--al-gold-bright), var(--al-gold))',
            color: 'var(--al-bg)',
            boxShadow: '0 18px 44px -14px color-mix(in srgb, var(--al-gold) 70%, transparent)',
          }}>
          Generate my free kundli
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </section>
  );
}

/* ============================== FOOTER ============================== */
export function DirectionAFooter() {
  const columns: { head: string; links: Array<{label: string; href: string}> }[] = [
    { head: 'Product', links: [
      { label: 'Free Kundli', href: '/onboarding' },
      { label: 'AI Chat', href: '/dashboard/chat' },
      { label: 'Reports', href: '/dashboard/report' },
      { label: 'Pricing', href: '#pricing' },
    ]},
    { head: 'Engines', links: [
      { label: 'KP System', href: '/dashboard/kp' },
      { label: 'Lal Kitab', href: '/dashboard/lalkitab' },
      { label: 'Dasha', href: '/dashboard/dasha' },
      { label: 'All Engines', href: '/dashboard' },
    ]},
    { head: 'Company', links: [
      { label: 'Contact', href: 'mailto:hello@astrolife.ai' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Blog', href: '/blog' },
    ]},
    { head: 'Legal', links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Refunds', href: '/refund' },
    ]},
  ];
  return (
    <footer className="border-t px-6 py-16 md:px-10" style={{ borderColor: 'var(--al-line)', background: TINT(35) }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.4fr_repeat(4,1fr)] md:gap-12">
          {/* brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <svg width="24" height="24" viewBox="-12 -12 24 24" style={{ color: 'var(--al-gold)' }}>
                <circle r="10.5" stroke="currentColor" strokeWidth="0.7" fill="none" />
                <polygon points="0,-6 5,3 -5,3" fill="none" stroke="currentColor" strokeWidth="0.7" />
                <polygon points="0,6 5,-3 -5,-3" fill="none" stroke="currentColor" strokeWidth="0.7" />
              </svg>
              <span className="font-serif text-lg uppercase" style={{ color: 'var(--al-ivory)', letterSpacing: '0.18em' }}>
                AstroLife AI
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed" style={{ color: 'var(--al-ivory-dim)' }}>
              AI-powered Vedic Astrology Intelligence OS. Guidance-oriented. Precise. Yours forever.
            </p>
          </div>

          {/* link columns */}
          {columns.map((col) => (
            <div key={col.head}>
              <div className="mb-4 text-9px font-semibold uppercase tracking-widest" style={{ color: 'var(--al-gold)' }}>
                {col.head}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--al-ivory-dim)' }}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t pt-7 text-center sm:flex-row sm:text-left"
          style={{ borderColor: 'var(--al-line)' }}>
          <div className="text-9px" style={{ color: 'var(--al-ivory-mute)' }}>
            © 2026 AstroLife AI. All rights reserved.
          </div>
          <div className="text-9px italic" style={{ color: 'var(--al-ivory-mute)' }}>
            Guidance-oriented astrology, not fear-based predictions.
          </div>
        </div>
      </div>
    </footer>
  );
}
