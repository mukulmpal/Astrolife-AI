"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculateChart } from "@/lib/astro-engine/calculations";
import { saveChartToAccount } from "@/lib/user-chart";

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  name: string;
  gender: string;
  dob: string;
  tob: string;
  city: string;
  lat: number | null;
  lon: number | null;
}

const ZODIAC = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

const CITIES = [
  "Mumbai","Delhi","Bangalore","Chennai","Kolkata","Hyderabad",
  "Pune","Ahmedabad","Jaipur","Lucknow","Chandigarh","Bhopal",
  "Indore","Nagpur","Surat","Vadodara","Patna","Ranchi",
  "Bhubaneswar","Kochi","Thiruvananthapuram","Coimbatore",
  "Mysuru","Visakhapatnam","Agra","Varanasi","Amritsar","Dehradun",
];

export default function Onboarding() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({ name:"", gender:"", dob:"", tob:"", city:"", lat:null, lon:null });
  const [citySearch, setCitySearch] = useState("");
  const [calcStep, setCalcStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animClass, setAnimClass] = useState("slide-in");
  const supabase = createClient();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 1) nameRef.current?.focus();
  }, [step]);

  const filteredCities = citySearch.length > 1
    ? CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
    : [];

  // Calculation animation
  useEffect(() => {
    if (step !== 4) return;
    const steps = [
      "Reading your birth coordinates...",
      "Calculating planetary positions...",
      "Mapping 15+ astrology systems...",
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
      await saveChartToAccount(calculateChart(form.name, form.dob, form.tob, form.city), { replacePrimary: true });
    } catch (e) { console.log(e); }
    setLoading(false);
    goNext(4);
  };

  const calcSteps = [
    "Reading your birth coordinates...",
    "Calculating planetary positions...",
    "Mapping 15+ astrology systems...",
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
        body{background:#060410;color:#f0e8d0;font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}

        .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;position:relative;overflow:hidden}

        /* BG */
        .orb1{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(60,40,128,0.18) 0%,transparent 65%);top:-150px;left:-150px;pointer-events:none}
        .orb2{position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(200,160,48,0.1) 0%,transparent 65%);bottom:-100px;right:-100px;pointer-events:none}
        .ring{position:absolute;border-radius:50%;border:1px solid rgba(200,160,48,0.04);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
        .r1{width:500px;height:500px;animation:spin 80s linear infinite}
        .r2{width:800px;height:800px;border-color:rgba(60,40,128,0.03);animation:spin 130s linear infinite reverse}
        @keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}

        /* ANIMATIONS */
        .slide-in{animation:slideIn 0.35s ease both}
        .slide-out{animation:slideOut 0.3s ease both}
        @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-30px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 20px rgba(200,160,48,0.2)}50%{box-shadow:0 0 40px rgba(200,160,48,0.5)}}
        @keyframes spin2{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

        /* TOP BAR */
        .topbar{position:fixed;top:0;left:0;right:0;padding:20px 40px;display:flex;align-items:center;justify-content:space-between;z-index:100}
        .logo{display:flex;align-items:center;gap:10px}
        .logo-gem{width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#3c2880,#c8a030);display:flex;align-items:center;justify-content:center;font-size:16px;animation:pulse 4s ease-in-out infinite}
        .logo-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;background:linear-gradient(135deg,#c8a030,#f0d898);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .step-indicator{font-size:12px;color:#605890}
        .step-indicator span{color:#c8a030;font-weight:500}

        /* PROGRESS */
        .progress-wrap{position:fixed;top:70px;left:0;right:0;padding:0 40px;z-index:100}
        .progress-track{height:2px;background:#1c1840;border-radius:2px;overflow:hidden}
        .progress-fill{height:100%;background:linear-gradient(90deg,#3c2880,#c8a030);border-radius:2px;transition:width 0.6s cubic-bezier(.4,0,.2,1)}

        /* CARD */
        .card{position:relative;z-index:1;width:100%;max-width:520px;background:rgba(13,10,34,0.95);border:1px solid #1c1840;border-radius:24px;padding:48px 44px;backdrop-filter:blur(20px)}

        /* STEP BADGE */
        .step-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(200,160,48,0.08);border:1px solid rgba(200,160,48,0.2);border-radius:100px;padding:5px 14px;font-size:10px;color:#c8a030;letter-spacing:2px;text-transform:uppercase;margin-bottom:24px}
        .step-dot{width:5px;height:5px;border-radius:50%;background:#c8a030;animation:blink 2s infinite}

        /* HEADING */
        .heading{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;color:#f0e8d0;line-height:1.15;margin-bottom:8px}
        .heading em{font-style:italic;color:#c8a030}
        .subheading{font-size:14px;color:#605890;line-height:1.7;margin-bottom:32px}

        /* INPUTS */
        .label{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#605890;margin-bottom:8px;display:block}
        .input{width:100%;height:52px;padding:0 18px;background:rgba(255,255,255,0.03);border:1px solid #1c1840;border-radius:12px;outline:none;font-size:15px;color:#f0e8d0;font-family:'Outfit',sans-serif;transition:border-color 0.2s;margin-bottom:20px}
        .input:focus{border-color:#c8a030}
        .input::placeholder{color:#3a3060}

        /* GENDER */
        .gender-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px}
        .gender-btn{padding:14px 10px;border-radius:12px;border:1px solid #1c1840;background:rgba(255,255,255,0.02);cursor:pointer;transition:all 0.2s;text-align:center;font-size:13px;color:#605890;font-family:'Outfit',sans-serif}
        .gender-btn:hover{border-color:rgba(200,160,48,0.3);color:#c8c0a8}
        .gender-btn.selected{border-color:rgba(200,160,48,0.5);background:rgba(200,160,48,0.08);color:#c8a030}
        .gender-icon{font-size:24px;margin-bottom:6px}

        /* DATE TIME ROW */
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px}

        /* CITY */
        .city-wrap{position:relative;margin-bottom:20px}
        .city-dropdown{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#0f0c28;border:1px solid #261f50;border-radius:12px;overflow:hidden;z-index:10;max-height:200px;overflow-y:auto}
        .city-opt{padding:12px 16px;font-size:14px;color:#c8c0a8;cursor:pointer;transition:background 0.15s}
        .city-opt:hover{background:rgba(200,160,48,0.08);color:#f0e8d0}

        /* ZODIAC SCROLL */
        .zodiac-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-bottom:24px;scrollbar-width:none}
        .zodiac-row::-webkit-scrollbar{display:none}
        .zodiac-sign{width:40px;height:40px;flex-shrink:0;border-radius:10px;border:1px solid #1c1840;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:default;transition:all 0.2s}
        .zodiac-sign:hover{border-color:rgba(200,160,48,0.3);background:rgba(200,160,48,0.06)}

        /* BUTTON */
        .btn{width:100%;padding:16px;background:linear-gradient(135deg,#c8a030,#3c2880cc);border:none;border-radius:12px;font-size:15px;font-weight:600;color:#060410;cursor:pointer;transition:all 0.25s;font-family:'Outfit',sans-serif;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(200,160,48,0.3);filter:brightness(1.08)}
        .btn:disabled{opacity:0.4;cursor:not-allowed}
        .btn-back{width:100%;padding:12px;background:transparent;border:1px solid #1c1840;border-radius:12px;font-size:14px;color:#605890;cursor:pointer;font-family:'Outfit',sans-serif;margin-top:10px;transition:all 0.2s}
        .btn-back:hover{border-color:#261f50;color:#c8c0a8}

        /* CALCULATION SCREEN */
        .calc-screen{text-align:center}
        .calc-orb{width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#3c2880,#c8a030);margin:0 auto 32px;display:flex;align-items:center;justify-content:center;font-size:48px;animation:pulse 2s ease-in-out infinite}
        .calc-ring{width:160px;height:160px;border-radius:50%;border:1px solid rgba(200,160,48,0.2);margin:0 auto;display:flex;align-items:center;justify-content:center;animation:spin2 4s linear infinite;margin-bottom:40px}
        .calc-ring-inner{animation:spin2 4s linear infinite reverse}
        .calc-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:#f0e8d0;margin-bottom:8px}
        .calc-title em{font-style:italic;color:#c8a030}
        .calc-steps{margin-top:28px;display:flex;flex-direction:column;gap:10px}
        .calc-step-item{display:flex;align-items:center;gap:10px;font-size:13px;padding:10px 16px;border-radius:10px;transition:all 0.4s}
        .calc-step-item.done{color:#c8a030;background:rgba(200,160,48,0.06)}
        .calc-step-item.active{color:#f0e8d0;background:rgba(255,255,255,0.04)}
        .calc-step-item.pending{color:#3a3060}
        .calc-check{width:18px;height:18px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:10px}
        .calc-check.done{background:rgba(200,160,48,0.2);color:#c8a030}
        .calc-check.active{background:rgba(255,255,255,0.1);animation:blink 1s infinite}
        .calc-check.pending{background:#1c1840}

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
              style={{ colorScheme: "dark" }}
            />

            <label className="label">Time of Birth</label>
            <div className="two-col">
              <input
                className="input"
                type="time"
                value={form.tob}
                onChange={e => setForm(f => ({ ...f, tob: e.target.value }))}
                style={{ colorScheme: "dark", marginBottom: 0 }}
              />
              <div style={{ display:"flex", alignItems:"center", fontSize:12, color:"#605890", padding:"0 8px", lineHeight:1.6 }}>
                Unknown time? Use 12:00 PM (noon) as default
              </div>
            </div>

            <div style={{ margin:"20px 0 24px", padding:"14px 16px", background:"rgba(200,160,48,0.05)", border:"1px solid rgba(200,160,48,0.15)", borderRadius:10 }}>
              <div style={{ fontSize:11, color:"#c8a030", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:6 }}>✦ Why time matters</div>
              <div style={{ fontSize:13, color:"#605890", lineHeight:1.7 }}>Birth time determines your Ascendant (Lagna), house positions, and dasha periods — the foundation of Vedic astrology accuracy.</div>
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

            <label className="label">Birth City</label>
            <div className="city-wrap">
              <input
                className="input"
                style={{ marginBottom: 0 }}
                placeholder="Search city... e.g. Mumbai"
                value={citySearch}
                onChange={e => { setCitySearch(e.target.value); setForm(f => ({ ...f, city: "" })); }}
              />
              {filteredCities.length > 0 && (
                <div className="city-dropdown">
                  {filteredCities.map(c => (
                    <div key={c} className="city-opt" onClick={() => { setForm(f => ({ ...f, city: c })); setCitySearch(c); }}>
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {form.city && (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"rgba(200,160,48,0.06)", border:"1px solid rgba(200,160,48,0.2)", borderRadius:10, marginBottom:20, fontSize:13, color:"#c8a030" }}>
                ✦ {form.city} selected
              </div>
            )}

            <label className="label" style={{ marginTop:4 }}>Your Zodiac (optional preview)</label>
            <div className="zodiac-row">
              {ZODIAC.map((z,i) => (
                <div key={i} className="zodiac-sign">{z}</div>
              ))}
            </div>

            <button
              className="btn"
              disabled={!form.city || loading}
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
                border:"1px solid rgba(200,160,48,0.2)",
                animation:"spin2 6s linear infinite",
              }} />
              <div style={{
                position:"absolute", inset:10, borderRadius:"50%",
                border:"1px solid rgba(60,40,128,0.3)",
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
            <p style={{ fontSize:13, color:"#605890", marginTop:8 }}>
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
