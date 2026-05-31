"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculateChart } from "@/lib/astro-engine/calculations";
import { saveChartToAccount } from "@/lib/user-chart";
import CityAutocomplete, { type CitySearchResult } from "@/components/location/CityAutocomplete";

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  name: string;
  gender: string;
  dob: string;
  tob: string;
  city: string;
  lat: number | null;
  lon: number | null;
  tz: number | null;
}

const ZODIAC = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

function ianaToUtcOffset(timezone: string, dob: string, tob: string): number {
  try {
    const dt = new Date(`${dob}T${tob || "12:00"}`);
    const parts = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    }).formatToParts(dt);
    const tzStr = parts.find(p => p.type === "timeZoneName")?.value ?? "GMT+5:30";
    const m = tzStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!m) return 5.5;
    const sign = m[1] === "+" ? 1 : -1;
    return sign * (parseInt(m[2], 10) + (parseInt(m[3] ?? "0", 10) / 60));
  } catch { return 5.5; }
}

export default function Onboarding() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({ name:"", gender:"", dob:"", tob:"", city:"", lat:null, lon:null, tz:null });
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);
  const [calcStep, setCalcStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animClass, setAnimClass] = useState("slide-in");
  const supabase = createClient();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 1) nameRef.current?.focus();
  }, [step]);

  function handleCitySelect(city: CitySearchResult | null) {
    setSelectedCity(city);
    if (city) {
      const tz = city.timezone ? ianaToUtcOffset(city.timezone, form.dob, form.tob) : 5.5;
      setForm(f => ({ ...f, city: city.displayName, lat: city.latitude, lon: city.longitude, tz }));
    } else {
      setForm(f => ({ ...f, city: "", lat: null, lon: null, tz: null }));
    }
  }

  // Calculation animation
  useEffect(() => {
    if (step !== 4) return;
    const steps = [
      "Reading your birth coordinates...",
      "Calculating planetary positions...",
      "Mapping 25+ astrology engines...",
      "Detecting yogas & dashas...",
      "Building your AI personality profile...",
      "Your cosmic blueprint is ready ✦",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setCalcStep(i);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => window.location.href = "/dashboard", 1200);
      }
    }, 900);
    return () => clearInterval(interval);
  }, [step]);

  const goNext = (nextStep: Step) => {
    setAnimClass("slide-out");
    setTimeout(() => {
      setStep(nextStep);
      setAnimClass("slide-in");
    }, 300);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          name: form.name,
          gender: form.gender,
          dob: form.dob,
          tob: form.tob,
          city: form.city,
          lat: form.lat,
          lon: form.lon,
          onboarding_completed: true,
        });
      }
      await saveChartToAccount(
        calculateChart(form.name, form.dob, form.tob, form.city, form.lat ?? undefined, form.lon ?? undefined, form.tz ?? undefined),
        { replacePrimary: true },
      );
      // Track chart generation for admin (await so it doesn't get cancelled on navigate)
      await fetch("/api/charts/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, dob: form.dob, tob: form.tob, city: form.city, lat: form.lat, lon: form.lon }),
      }).catch(() => {});
    } catch (e) { console.log(e); }
    setLoading(false);
    goNext(4);
  };

  const calcSteps = [
    "Reading your birth coordinates...",
    "Calculating planetary positions...",
    "Mapping 25+ astrology engines...",
    "Detecting yogas & dashas...",
    "Building your AI personality profile...",
    "Your cosmic blueprint is ready ✦",
  ];

  const progress = step <= 3 ? Math.round(((step - 1) / 3) * 100) : 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{background:var(--app-bg);color:var(--app-fg);font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}

        .page{--onboard-bg:var(--app-bg,#060410);--onboard-fg:var(--app-fg,#f0e8d0);--onboard-card:var(--app-card,#0d0a22);--onboard-card-alt:var(--app-card-alt,#0f0c28);--onboard-border:var(--app-border,#1c1840);--onboard-border-strong:var(--app-border-strong,#261f50);--onboard-muted:var(--app-muted,#605890);--onboard-muted-deep:var(--app-muted-deep,#3a3060);--onboard-accent:var(--app-accent,#3c2880);--onboard-gold:var(--app-gold,#c8a030);--onboard-gold-strong:var(--app-gold-strong,#f0d898);--onboard-soft:var(--app-soft,#c8c0a8);min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;position:relative;overflow:hidden;background:var(--onboard-bg);color:var(--onboard-fg);color-scheme:dark}
        html[data-theme-mode="light"] .page{color-scheme:light}

        /* BG */
        .orb1{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--onboard-accent) 18%,transparent) 0%,transparent 65%);top:-150px;left:-150px;pointer-events:none}
        .orb2{position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--onboard-gold) 10%,transparent) 0%,transparent 65%);bottom:-100px;right:-100px;pointer-events:none}
        .ring{position:absolute;border-radius:50%;border:1px solid color-mix(in srgb,var(--onboard-gold) 12%,transparent);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
        .r1{width:500px;height:500px;animation:spin 80s linear infinite}
        .r2{width:800px;height:800px;border-color:color-mix(in srgb,var(--onboard-accent) 10%,transparent);animation:spin 130s linear infinite reverse}
        @keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}

        /* ANIMATIONS */
        .slide-in{animation:slideIn 0.35s ease both}
        .slide-out{animation:slideOut 0.3s ease both}
        @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-30px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 20px color-mix(in srgb,var(--onboard-gold) 22%,transparent)}50%{box-shadow:0 0 40px color-mix(in srgb,var(--onboard-gold) 48%,transparent)}}
        @keyframes spin2{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

        /* TOP BAR */
        .topbar{position:fixed;top:0;left:0;right:0;padding:20px 40px;display:flex;align-items:center;justify-content:space-between;z-index:100}
        .logo{display:flex;align-items:center;gap:10px}
        .logo-gem{width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,var(--app-accent),var(--app-gold));display:flex;align-items:center;justify-content:center;font-size:16px;animation:pulse 4s ease-in-out infinite}
        .logo-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;background:linear-gradient(135deg,var(--app-gold),var(--app-gold-strong));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .step-indicator{font-size:12px;color:var(--app-muted)}
        .step-indicator span{color:var(--app-gold);font-weight:500}

        /* PROGRESS */
        .progress-wrap{position:fixed;top:70px;left:0;right:0;padding:0 40px;z-index:100}
        .progress-track{height:2px;background:var(--app-border);border-radius:2px;overflow:hidden}
        .progress-fill{height:100%;background:linear-gradient(90deg,var(--app-accent),var(--app-gold));border-radius:2px;transition:width 0.6s cubic-bezier(.4,0,.2,1)}

        /* CARD */
        .card{position:relative;z-index:1;width:100%;max-width:520px;background:color-mix(in srgb,var(--onboard-card) 95%,transparent);border:1px solid var(--onboard-border);border-radius:24px;padding:48px 44px;backdrop-filter:blur(20px)}

        /* STEP BADGE */
        .step-badge{display:inline-flex;align-items:center;gap:6px;background:color-mix(in srgb,var(--onboard-gold) 8%,transparent);border:1px solid color-mix(in srgb,var(--onboard-gold) 22%,transparent);border-radius:100px;padding:5px 14px;font-size:10px;color:var(--onboard-gold);letter-spacing:2px;text-transform:uppercase;margin-bottom:24px}
        .step-dot{width:5px;height:5px;border-radius:50%;background:var(--onboard-gold);animation:blink 2s infinite}

        /* HEADING */
        .heading{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;color:var(--onboard-fg);line-height:1.15;margin-bottom:8px}
        .heading em{font-style:italic;color:var(--onboard-gold)}
        .subheading{font-size:14px;color:var(--onboard-muted);line-height:1.7;margin-bottom:32px}

        /* INPUTS */
        .label{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--onboard-muted);margin-bottom:8px;display:block}
        .input{width:100%;height:52px;padding:0 18px;background:color-mix(in srgb,var(--onboard-fg) 4%,transparent);border:1px solid var(--onboard-border);border-radius:12px;outline:none;font-size:15px;color:var(--onboard-fg);font-family:'Outfit',sans-serif;transition:border-color 0.2s;margin-bottom:20px}
        .input:focus{border-color:var(--onboard-gold)}
        .input::placeholder{color:var(--onboard-muted-deep)}

        /* GENDER */
        .gender-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px}
        .gender-btn{padding:14px 10px;border-radius:12px;border:1px solid var(--onboard-border);background:color-mix(in srgb,var(--onboard-fg) 3%,transparent);cursor:pointer;transition:all 0.2s;text-align:center;font-size:13px;color:var(--onboard-muted);font-family:'Outfit',sans-serif}
        .gender-btn:hover{border-color:color-mix(in srgb,var(--onboard-gold) 32%,transparent);color:var(--onboard-soft)}
        .gender-btn.selected{border-color:color-mix(in srgb,var(--onboard-gold) 52%,transparent);background:color-mix(in srgb,var(--onboard-gold) 9%,transparent);color:var(--onboard-gold)}
        .gender-icon{font-size:24px;margin-bottom:6px}

        /* DATE TIME ROW */
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px}

        /* CITY */
        .city-wrap{position:relative;margin-bottom:20px}
        .city-dropdown{position:absolute;top:calc(100% + 4px);left:0;right:0;background:var(--onboard-card-alt);border:1px solid var(--onboard-border-strong);border-radius:12px;overflow:hidden;z-index:10;max-height:200px;overflow-y:auto}
        .city-opt{padding:12px 16px;font-size:14px;color:var(--onboard-soft);cursor:pointer;transition:background 0.15s}
        .city-opt:hover{background:color-mix(in srgb,var(--onboard-gold) 8%,transparent);color:var(--onboard-fg)}

        /* ZODIAC SCROLL */
        .zodiac-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-bottom:24px;scrollbar-width:none}
        .zodiac-row::-webkit-scrollbar{display:none}
        .zodiac-sign{width:40px;height:40px;flex-shrink:0;border-radius:10px;border:1px solid var(--onboard-border);display:flex;align-items:center;justify-content:center;font-size:18px;cursor:default;transition:all 0.2s}
        .zodiac-sign:hover{border-color:color-mix(in srgb,var(--onboard-gold) 32%,transparent);background:color-mix(in srgb,var(--onboard-gold) 6%,transparent)}

        /* BUTTON */
        .btn{width:100%;padding:16px;background:linear-gradient(135deg,var(--onboard-gold),color-mix(in srgb,var(--onboard-accent) 80%,transparent));border:none;border-radius:12px;font-size:15px;font-weight:600;color:var(--onboard-bg);cursor:pointer;transition:all 0.25s;font-family:'Outfit',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px color-mix(in srgb,var(--onboard-gold) 30%,transparent);filter:brightness(1.08)}
        .btn:disabled{opacity:0.4;cursor:not-allowed}
        .btn-back{width:100%;padding:12px;background:transparent;border:1px solid var(--onboard-border);border-radius:12px;font-size:14px;color:var(--onboard-muted);cursor:pointer;font-family:'Outfit',sans-serif;margin-top:10px;transition:all 0.2s}
        .btn-back:hover{border-color:var(--onboard-border-strong);color:var(--onboard-soft)}

        /* CALCULATION SCREEN */
        .calc-screen{text-align:center}
        .calc-orb{width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,var(--onboard-accent),var(--onboard-gold));margin:0 auto 32px;display:flex;align-items:center;justify-content:center;font-size:48px;animation:pulse 2s ease-in-out infinite}
        .calc-ring{width:160px;height:160px;border-radius:50%;border:1px solid color-mix(in srgb,var(--onboard-gold) 22%,transparent);margin:0 auto;display:flex;align-items:center;justify-content:center;animation:spin2 4s linear infinite;margin-bottom:40px}
        .calc-ring-inner{animation:spin2 4s linear infinite reverse}
        .calc-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--onboard-fg);margin-bottom:8px}
        .calc-title em{font-style:italic;color:var(--onboard-gold)}
        .calc-steps{margin-top:28px;display:flex;flex-direction:column;gap:10px}
        .calc-step-item{display:flex;align-items:center;gap:10px;font-size:13px;padding:10px 16px;border-radius:10px;transition:all 0.4s}
        .calc-step-item.done{color:var(--onboard-gold);background:color-mix(in srgb,var(--onboard-gold) 6%,transparent)}
        .calc-step-item.active{color:var(--onboard-fg);background:color-mix(in srgb,var(--onboard-fg) 4%,transparent)}
        .calc-step-item.pending{color:var(--onboard-muted-deep)}
        .calc-check{width:18px;height:18px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px}
        .calc-check.done{background:color-mix(in srgb,var(--onboard-gold) 20%,transparent);color:var(--onboard-gold)}
        .calc-check.active{background:color-mix(in srgb,var(--onboard-fg) 10%,transparent);animation:blink 1s infinite}
        .calc-check.pending{background:var(--onboard-border)}

        @media(max-width:540px){
          .card{padding:36px 24px}
          .heading{font-size:28px}
          .topbar{padding:16px 20px}
          .progress-wrap{padding:0 20px}
        }
      `}</style>

      {/* TOP */}
      {step !== 4 && (
        <>
          <div className="topbar">
            <div className="logo">
              <div className="logo-gem">✦</div>
              <span className="logo-name">AstroLife</span>
            </div>
            {step <= 3 && (
              <div className="step-indicator">
                Step <span>{step}</span> of 3
              </div>
            )}
          </div>
          <div className="progress-wrap">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </>
      )}

      <div className="page">
        <div className="orb1" /><div className="orb2" />
        <div className="ring r1" /><div className="ring r2" />

        {/* ── STEP 1: NAME + GENDER ── */}
        {step === 1 && (
          <div className={`card ${animClass}`}>
            <div className="step-badge"><div className="step-dot" />Step 1 of 3</div>
            <h1 className="heading">Tell us<br /><em>who you are</em></h1>
            <p className="subheading">Your name carries vibration. Your gender shapes your cosmic expression.</p>

            <label className="label">Your Full Name</label>
            <input
              ref={nameRef}
              className="input"
              placeholder="e.g. Arjun Sharma"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && form.name.trim() && setStep(1)}
            />

            <label className="label">Gender</label>
            <div className="gender-row">
              {[
                { val:"male",   icon:"♂",  label:"Male" },
                { val:"female", icon:"♀",  label:"Female" },
                { val:"other",  icon:"✦",  label:"Other" },
              ].map(g => (
                <button
                  key={g.val}
                  className={`gender-btn ${form.gender === g.val ? "selected" : ""}`}
                  onClick={() => setForm(f => ({ ...f, gender: g.val }))}
                >
                  <div className="gender-icon">{g.icon}</div>
                  {g.label}
                </button>
              ))}
            </div>

            <button
              className="btn"
              disabled={!form.name.trim() || !form.gender}
              onClick={() => goNext(2)}
            >
              Continue ✦
            </button>
          </div>
        )}

        {/* ── STEP 2: DATE + TIME ── */}
        {step === 2 && (
          <div className={`card ${animClass}`}>
            <div className="step-badge"><div className="step-dot" />Step 2 of 3</div>
            <h1 className="heading">Your moment<br /><em>of arrival</em></h1>
            <p className="subheading">The exact time and date you entered this universe defines your entire cosmic blueprint.</p>

            <label className="label">Date of Birth</label>
            <input
              className="input"
              type="date"
              value={form.dob}
              max={new Date().toISOString().split("T")[0]}
              onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
            />

            <label className="label">Time of Birth</label>
            <div className="two-col">
              <input
                className="input"
                type="time"
                value={form.tob}
                onChange={e => setForm(f => ({ ...f, tob: e.target.value }))}
                style={{ marginBottom: 0 }}
              />
              <div style={{ display:"flex", alignItems:"center", fontSize:12, color:"var(--onboard-muted)", padding:"0 8px", lineHeight:1.6 }}>
                Unknown time? Use 12:00 PM (noon) as default
              </div>
            </div>

            <div style={{ margin:"20px 0 24px", padding:"14px 16px", background:"color-mix(in srgb,var(--onboard-gold) 5%,transparent)", border:"1px solid color-mix(in srgb,var(--onboard-gold) 16%,transparent)", borderRadius:10 }}>
              <div style={{ fontSize:11, color:"var(--onboard-gold)", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:6 }}>✦ Why time matters</div>
              <div style={{ fontSize:13, color:"var(--onboard-muted)", lineHeight:1.7 }}>Birth time determines your Ascendant (Lagna), house positions, and dasha periods — the foundation of Vedic astrology accuracy.</div>
            </div>

            <button className="btn" disabled={!form.dob || !form.tob} onClick={() => goNext(3)}>Continue ✦</button>
            <button className="btn-back" onClick={() => goNext(1)}>← Back</button>
          </div>
        )}

        {/* ── STEP 3: CITY ── */}
        {step === 3 && (
          <div className={`card ${animClass}`}>
            <div className="step-badge"><div className="step-dot" />Step 3 of 3</div>
            <h1 className="heading">Where were<br /><em>you born?</em></h1>
            <p className="subheading">Your birthplace anchors your chart to the Earth&apos;s grid — longitude and latitude shape your destiny.</p>

            <div style={{ marginBottom: 20 }}>
              <CityAutocomplete
                label="Birth City"
                value={selectedCity}
                onChange={handleCitySelect}
                placeholder="Search city, e.g. Mumbai, London, New York"
              />
            </div>

            <label className="label" style={{ marginTop:4 }}>Your Zodiac (optional preview)</label>
            <div className="zodiac-row">
              {ZODIAC.map((z,i) => (
                <div key={i} className="zodiac-sign">{z}</div>
              ))}
            </div>

            <button
              className="btn"
              disabled={!selectedCity || loading}
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : "Build My Cosmic Blueprint ✦"}
            </button>
            <button className="btn-back" onClick={() => goNext(2)}>← Back</button>
          </div>
        )}

        {/* ── STEP 4: CALCULATION ANIMATION ── */}
        {step === 4 && (
          <div className="card" style={{ textAlign:"center", maxWidth:480 }}>
            <div style={{ position:"relative", width:160, height:160, margin:"0 auto 32px" }}>
              <div style={{
                position:"absolute", inset:0, borderRadius:"50%",
                border:"1px solid color-mix(in srgb,var(--onboard-gold) 22%,transparent)",
                animation:"spin2 6s linear infinite",
              }} />
              <div style={{
                position:"absolute", inset:10, borderRadius:"50%",
                border:"1px solid color-mix(in srgb,var(--onboard-accent) 30%,transparent)",
                animation:"spin2 4s linear infinite reverse",
              }} />
              <div style={{
                position:"absolute", inset:0, display:"flex",
                alignItems:"center", justifyContent:"center",
                fontSize:52,
                animation:"pulse 2s ease-in-out infinite",
              }}>✦</div>
            </div>

            <h2 className="calc-title serif">
              Building Your<br /><em>Cosmic Blueprint</em>
            </h2>
            <p style={{ fontSize:13, color:"var(--onboard-muted)", marginTop:8 }}>
              Namaste, {form.name}. Please wait while our engines align...
            </p>

            <div className="calc-steps">
              {calcSteps.map((s, i) => (
                <div
                  key={i}
                  className={`calc-step-item ${i < calcStep ? "done" : i === calcStep ? "active" : "pending"}`}
                >
                  <div className={`calc-check ${i < calcStep ? "done" : i === calcStep ? "active" : "pending"}`}>
                    {i < calcStep ? "✓" : i === calcStep ? "◉" : "○"}
                  </div>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
