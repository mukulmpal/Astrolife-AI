"use client";
import { useEffect, useRef, useState } from "react";

type Theme = "indigo" | "saffron";

const THEMES = {
  indigo: {
    bg:"#060410", bg2:"#0a0720", card:"#0d0a22", card2:"#120f2a",
    border:"#1c1840", border2:"#261f50",
    gold:"#c8a030", gold2:"#e8c060", gold3:"#f0d898",
    cream:"#f0e8d0", cream2:"#c8c0a8", muted:"#605890",
    accent:"#3c2880",
    orb1:"rgba(60,40,128,0.18)", orb2:"rgba(200,160,48,0.10)",
    ring1:"rgba(200,160,48,0.05)", ring2:"rgba(60,40,128,0.05)",
    star:"200,160,48",
    nextLabel:"☀️ Sacred Saffron",
  },
  saffron: {
    bg:"#0c0804", bg2:"#160e06", card:"#130a04", card2:"#1c1008",
    border:"#2a1808", border2:"#3a2210",
    gold:"#c87820", gold2:"#f0a030", gold3:"#ffd080",
    cream:"#fdf0d8", cream2:"#c8a878", muted:"#806040",
    accent:"#8b3a10",
    orb1:"rgba(200,100,20,0.22)", orb2:"rgba(230,160,30,0.14)",
    ring1:"rgba(200,120,32,0.07)", ring2:"rgba(180,80,20,0.05)",
    star:"240,160,48",
    nextLabel:"🌌 Midnight Indigo",
  },
};

export default function Home() {
  const [theme, setTheme] = useState<Theme>("indigo");
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const T = THEMES[theme];

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const stars = Array.from({ length: 260 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2, alpha: Math.random() * 0.8 + 0.1,
      speed: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += s.speed; if (s.alpha > 0.9 || s.alpha < 0.05) s.speed *= -1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${T.star},${s.alpha})`; ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, [theme, T.star]);

  const toggle = () => setTheme(p => p === "indigo" ? "saffron" : "indigo");

  const features = [
    { icon:"🔯", title:"15+ Astrology Systems",    desc:"Vedic, Lal Kitab, KP, Nadi, Jaimini, Ashtakavarga — every major system with Swiss ephemeris precision." },
    { icon:"🤖", title:"10 Specialized AI Agents", desc:"Career, Marriage, Karma, Wealth, Health — each agent has memory, personality, and deep chart context." },
    { icon:"📈", title:"Destiny Timeline",          desc:"See your entire life arc — peak periods, karmic turning points, and wealth windows mapped across decades." },
    { icon:"🧠", title:"Psychological Profiling",   desc:"Your chart reveals cognitive patterns, emotional wounds, shadow self, and your soul's deepest purpose." },
    { icon:"🎼", title:"Astro Sound Therapy",       desc:"Every planet vibrates at a frequency. Receive your personal healing soundscape based on your chart." },
    { icon:"👨‍👩‍👧", title:"Family Karma Engine", desc:"Detect Pitra Dosh, ancestral patterns, and repeating generational karma across your family tree." },
  ];

  const plans = [
    { name:"Free",    price:"₹0",     period:"forever", hi:false, cta:"Start Free", feats:["Basic Kundli Chart","5 AI Questions / month","Daily Horoscope Card","Top 5 Yogas Only","Watermarked PDF","Ad-supported"] },
    { name:"Premium", price:"₹499",   period:"/ month", hi:true,  cta:"Go Premium", feats:["Unlimited AI Chat — All Agents","All 15+ Astrology Engines","Full Dasha + KP + Lal Kitab + Nadi","Astro Sound Engine","Transit Alerts","PDF Exports — No Watermark","Family Charts (5 members)","AI Voice Reports"] },
    { name:"Elite",   price:"₹1,999", period:"/ month", hi:false, cta:"Go Elite",   feats:["Everything in Premium","WhatsApp AI Astrologer","Business Muhurat AI","Yearly Forecast Reports","Family Karma Mapping","Custom Rituals & Remedies","White-label Astrologer Mode","Priority Support"] },
  ];

  const testimonials = [
    { name:"Priya Sharma", city:"Mumbai",    ini:"PS", text:"AstroLife ne meri puri zindagi ka blueprint dikha diya. Saturn dasha prediction itni sahi thi ki main stunned reh gayi. Koi app isse better nahi." },
    { name:"Arjun Mehta",  city:"New Delhi", ini:"AM", text:"10 astrology apps try kiye. Koi bhi AstroLife ke level ka nahi. AI agents feel karte hain jaise real astrologer se baat kar rahe ho." },
    { name:"Kavya Nair",   city:"Bangalore", ini:"KN", text:"Family karma analysis ne 3 generations ka pattern ek hi jagah dikha diya. Pitra Dosh detection bilkul accurate tha. Must-have for seekers." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:${T.bg};color:${T.cream};font-family:'Outfit',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;transition:background 0.6s,color 0.6s}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:${T.bg}}::-webkit-scrollbar-thumb{background:${T.gold};border-radius:2px}

        /* TOGGLE */
        .toggle-wrap{display:flex;align-items:center;gap:10px;background:${T.card};border:1px solid ${T.border2};border-radius:100px;padding:6px 14px 6px 8px;cursor:pointer;transition:all 0.3s;font-size:12px;color:${T.cream2};font-family:'Outfit',sans-serif}
        .toggle-wrap:hover{border-color:${T.gold};color:${T.cream};box-shadow:0 0 16px ${T.gold}22}
        .track{width:40px;height:22px;border-radius:11px;background:linear-gradient(135deg,${T.accent},${T.gold});position:relative;transition:all 0.4s;flex-shrink:0}
        .thumb{position:absolute;width:16px;height:16px;border-radius:50%;background:${T.cream};top:3px;left:${theme==="saffron"?"21px":"3px"};transition:left 0.35s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 4px rgba(0,0,0,0.3)}

        /* NAV */
        .nav{position:fixed;top:0;left:0;right:0;z-index:200;height:70px;padding:0 40px;display:flex;align-items:center;justify-content:space-between;transition:background 0.4s}
        .nav.solid{background:${T.bg}ee;backdrop-filter:blur(24px);border-bottom:1px solid ${T.border}}
        .logo{display:flex;align-items:center;gap:12px;cursor:pointer}
        .logo-gem{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,${T.accent},${T.gold});display:flex;align-items:center;justify-content:center;font-size:18px;animation:pulse 4s ease-in-out infinite;transition:background 0.5s}
        @keyframes pulse{0%,100%{box-shadow:0 0 20px ${T.gold}33}50%{box-shadow:0 0 38px ${T.gold}77}}
        .logo-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;background:linear-gradient(135deg,${T.gold},${T.gold3});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;transition:all 0.5s}
        .nav-links{display:flex;align-items:center;gap:20px}
        .nav-link{color:${T.cream2};font-size:14px;cursor:pointer;transition:color 0.2s}.nav-link:hover{color:${T.cream}}
        .nav-btn{background:transparent;border:1px solid ${T.gold}66;color:${T.gold2};border-radius:8px;padding:9px 22px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.25s;font-family:'Outfit',sans-serif}
        .nav-btn:hover{background:${T.gold}14;border-color:${T.gold};box-shadow:0 0 20px ${T.gold}22}
        .mobile-toggle{display:none;position:fixed;top:78px;right:14px;z-index:220}

        /* HERO */
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:140px 24px 100px;position:relative;overflow:hidden}
        .hero-canvas{position:absolute;inset:0;z-index:0;pointer-events:none}
        .orb1{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,${T.orb1} 0%,transparent 65%);top:-200px;left:-150px;pointer-events:none;transition:background 0.6s}
        .orb2{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,${T.orb2} 0%,transparent 65%);bottom:-100px;right:-100px;pointer-events:none;transition:background 0.6s}
        .ring{position:absolute;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
        .r1{width:520px;height:520px;border:1px solid ${T.ring1};animation:spin 80s linear infinite}
        .r2{width:740px;height:740px;border:1px solid ${T.ring2};animation:spin 120s linear infinite reverse}
        .r3{width:960px;height:960px;border:1px solid ${T.ring1};animation:spin 160s linear infinite}
        .ring::before{content:'✦';position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:10px;color:${T.gold}55}
        @keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}
        .hero-content{position:relative;z-index:1}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;border:1px solid ${T.gold}33;background:${T.gold}0d;border-radius:100px;padding:7px 18px;font-size:11px;color:${T.gold2};letter-spacing:1.5px;text-transform:uppercase;margin-bottom:32px;animation:fadeUp 1s ease both;transition:all 0.5s}
        .edot{width:5px;height:5px;border-radius:50%;background:${T.gold};animation:blink 2.5s ease infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .hero-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(44px,7vw,88px);font-weight:600;line-height:1.08;color:${T.cream};margin-bottom:24px;animation:fadeUp 1s 0.15s ease both;transition:color 0.5s}
        .hero-h1 em{font-style:italic;background:linear-gradient(135deg,${T.gold},${T.gold2},${T.gold3});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hero-sub{font-size:clamp(15px,1.8vw,18px);color:${T.cream2};line-height:1.85;max-width:540px;margin:0 auto 44px;animation:fadeUp 1s 0.3s ease both;transition:color 0.5s}
        .hero-sub strong{color:${T.cream};font-weight:500}
        .hero-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;animation:fadeUp 1s 0.45s ease both}
        .btn-gold{background:linear-gradient(135deg,${T.gold},${T.accent}cc);color:${T.bg};border:none;border-radius:10px;padding:15px 34px;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.3s;font-family:'Outfit',sans-serif}
        .btn-gold:hover{transform:translateY(-3px);box-shadow:0 14px 36px ${T.gold}55;filter:brightness(1.1)}
        .btn-ghost{background:transparent;border:1px solid ${T.border2};color:${T.cream2};border-radius:10px;padding:15px 34px;font-size:15px;cursor:pointer;transition:all 0.3s;font-family:'Outfit',sans-serif}
        .btn-ghost:hover{border-color:${T.gold}55;color:${T.cream};transform:translateY(-3px)}

        /* STATS */
        .stats{border-top:1px solid ${T.border};border-bottom:1px solid ${T.border};background:${T.card}99;padding:28px 40px;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;transition:all 0.5s}
        .stat{flex:1;min-width:140px;text-align:center;padding:8px 32px;border-right:1px solid ${T.border}}.stat:last-child{border-right:none}
        .stat-n{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:${T.gold2};line-height:1;margin-bottom:4px;transition:color 0.5s}
        .stat-l{font-size:12px;color:${T.muted};letter-spacing:0.5px}

        /* SECTION */
        .section{padding:110px 40px;max-width:1240px;margin:0 auto}
        .stag{display:inline-block;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:${T.gold};margin-bottom:20px;transition:color 0.5s}
        .sh{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,5vw,54px);font-weight:600;color:${T.cream};line-height:1.15;margin-bottom:18px;transition:color 0.5s}
        .sh em{font-style:italic;color:${T.gold2}}
        .sp{font-size:16px;color:${T.cream2};line-height:1.85;max-width:540px;margin-bottom:64px;transition:color 0.5s}

        /* FEATURES */
        .feat-bg{background:linear-gradient(180deg,${T.bg},${T.bg2},${T.bg});transition:background 0.6s}
        .feat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:1px;background:${T.border};border:1px solid ${T.border};border-radius:18px;overflow:hidden}
        .feat-cell{background:${T.card};padding:36px 32px;transition:background 0.3s;cursor:default}.feat-cell:hover{background:${T.card2}}
        .feat-icon{font-size:28px;margin-bottom:20px}
        .feat-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:${T.cream};margin-bottom:10px}
        .feat-desc{font-size:13.5px;color:${T.cream2};line-height:1.8}

        /* STEPS */
        .steps{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:24px}
        .step{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:36px 32px;position:relative;overflow:hidden;transition:border-color 0.3s,background 0.5s}.step:hover{border-color:${T.gold}44}
        .step-bg-n{position:absolute;bottom:-10px;right:16px;font-family:'Cormorant Garamond',serif;font-size:100px;font-weight:700;color:${T.gold}0a;line-height:1;pointer-events:none;user-select:none}
        .step-icon{width:54px;height:54px;border-radius:14px;border:1px solid ${T.gold}33;background:${T.gold}10;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:24px;transition:all 0.5s}
        .step-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:${T.cream};margin-bottom:12px}
        .step-desc{font-size:14px;color:${T.cream2};line-height:1.8}

        /* PRICING */
        .price-bg{background:linear-gradient(180deg,${T.bg},${T.bg2},${T.bg});transition:background 0.6s}
        .price-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:20px}
        .plan{background:${T.card};border:1px solid ${T.border};border-radius:20px;padding:40px 36px;transition:transform 0.3s,border-color 0.3s,background 0.5s;position:relative}.plan:hover{transform:translateY(-5px)}
        .plan.hi{border-color:${T.gold}55;background:linear-gradient(160deg,${T.gold}0a,${T.card})}
        .plan-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,${T.gold},${T.accent});color:${T.bg};font-size:10px;font-weight:700;padding:5px 16px;border-radius:100px;letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap}
        .plan-tier{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${T.muted};margin-bottom:14px}
        .plan-price{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:600;color:${T.cream};line-height:1;margin-bottom:4px;transition:color 0.5s}
        .plan-period{font-size:14px;color:${T.muted};margin-bottom:28px}
        .plan-line{height:1px;background:${T.border};margin-bottom:28px}
        .plan-feats{list-style:none;display:flex;flex-direction:column;gap:14px;margin-bottom:36px}
        .plan-feat{display:flex;align-items:flex-start;gap:12px;font-size:14px;color:${T.cream2};line-height:1.5}
        .fc{color:${T.gold};font-size:11px;margin-top:2px;flex-shrink:0}
        .plan-cta{width:100%;padding:15px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.3s;font-family:'Outfit',sans-serif;border:none;letter-spacing:0.3px}
        .cta-g{background:linear-gradient(135deg,${T.gold},${T.accent});color:${T.bg}}.cta-g:hover{box-shadow:0 10px 28px ${T.gold}55;transform:translateY(-2px);filter:brightness(1.08)}
        .cta-o{background:transparent;border:1px solid ${T.border2} !important;color:${T.cream2}}.cta-o:hover{border-color:${T.gold}55 !important;color:${T.cream};transform:translateY(-2px)}

        /* TESTIMONIALS */
        .testi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
        .testi{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:32px;transition:border-color 0.3s,background 0.5s}.testi:hover{border-color:${T.gold}33}
        .testi-stars{color:${T.gold};font-size:13px;letter-spacing:3px;margin-bottom:18px}
        .testi-text{font-family:'Cormorant Garamond',serif;font-size:17px;font-style:italic;color:${T.cream2};line-height:1.85;margin-bottom:24px}
        .testi-author{display:flex;align-items:center;gap:14px}
        .testi-av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,${T.accent},${T.gold});display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:${T.cream}}
        .testi-name{font-size:14px;font-weight:500;color:${T.cream}}.testi-city{font-size:12px;color:${T.muted};margin-top:2px}

        /* CTA */
        .fcta{text-align:center;padding:140px 40px;position:relative;overflow:hidden}
        .fcta-orb{position:absolute;width:800px;height:600px;border-radius:50%;background:radial-gradient(circle,${T.orb1} 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;transition:background 0.6s}
        .cta-line{width:1px;height:60px;background:linear-gradient(to bottom,transparent,${T.gold},transparent);margin:0 auto 40px}

        /* FOOTER */
        .footer{border-top:1px solid ${T.border};padding:56px 40px 36px;max-width:1240px;margin:0 auto;transition:border-color 0.5s}
        .footer-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:40px;margin-bottom:48px}
        .footer-tagline{font-size:13px;color:${T.muted};margin-top:8px;max-width:240px;line-height:1.7}
        .footer-links{display:flex;gap:48px;flex-wrap:wrap}
        .footer-col{display:flex;flex-direction:column;gap:12px}
        .fcol-title{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${T.gold};margin-bottom:4px;transition:color 0.5s}
        .flink{font-size:13px;color:${T.muted};cursor:pointer;transition:color 0.2s}.flink:hover{color:${T.cream}}
        .footer-bottom{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding-top:28px;border-top:1px solid ${T.border}}
        .fcopy{font-size:12px;color:${T.muted}}
        .divider{height:1px;background:linear-gradient(90deg,transparent,${T.border},transparent)}

        @media(max-width:768px){
          .nav{padding:0 20px}.nav-links{display:none}
          .mobile-toggle{display:block}
          .hero{padding:120px 20px 80px}
          .stats{padding:24px 20px}
          .stat{border-right:none;border-bottom:1px solid ${T.border}}.stat:last-child{border-bottom:none}
          .section{padding:80px 20px}
          .r2,.r3{display:none}
          .footer{padding:40px 20px 28px}.footer-top{flex-direction:column}
          .toggle-label{display:none}
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${scrollY > 60 ? "solid" : ""}`}>
        <div className="logo">
          <div className="logo-gem">✦</div>
          <span className="logo-name">AstroLife</span>
        </div>
        <div className="nav-links">
          <span className="nav-link">Features</span>
          <span className="nav-link">How It Works</span>
          <span className="nav-link">Pricing</span>

          {/* ── THEME TOGGLE ── */}
          <button className="toggle-wrap" onClick={toggle} title="Switch theme">
            <div className="track"><div className="thumb" /></div>
            <span className="toggle-label">{T.nextLabel}</span>
          </button>

          <button className="nav-btn">Get Free Kundli</button>
        </div>
      </nav>
      <div className="mobile-toggle">
        <button className="toggle-wrap" onClick={toggle} title="Switch theme">
          <div className="track"><div className="thumb" /></div>
          <span className="toggle-label">{T.nextLabel}</span>
        </button>
      </div>

      {/* HERO */}
      <section className="hero">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="orb1" /><div className="orb2" />
        <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
        <div className="hero-content">
          <div className="eyebrow"><div className="edot" />AI-Powered Vedic Astrology Platform</div>
          <h1 className="hero-h1">Your Destiny,<br /><em>Decoded by AI</em></h1>
          <p className="hero-sub">
            India&apos;s most intelligent astrology platform.<br />
            <strong>Vedic · Lal Kitab · KP · Nadi · Psychology</strong><br />
            15+ ancient systems. One cosmic intelligence.
          </p>
          <div className="hero-actions">
  <button
    className="btn-gold"
    onClick={() => {
      window.location.href = "/onboarding";
    }}
  >
    ✦ Generate Free Kundli
  </button>

  <button
    className="btn-ghost"
    onClick={() => {
      window.location.href = "/dashboard/kundli";
    }}
  >
    ▶ Watch Demo
  </button>
</div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        {[{n:"50,000+",l:"Kundlis Generated"},{n:"4.9 / 5",l:"Average Rating"},{n:"15+",l:"Astrology Engines"},{n:"10",l:"AI Agents"},{n:"3 min",l:"To Full Analysis"}].map((s,i)=>(
          <div key={i} className="stat">
            <div className="stat-n serif">{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div className="feat-bg">
        <div className="section">
          <div className="stag">✦ Platform Features</div>
          <h2 className="sh serif">15+ Ancient Engines.<br /><em>One AI Intelligence.</em></h2>
          <p className="sp">Every major Vedic astrology system — unified, intelligent, and deeply personalized.</p>
          <div className="feat-grid">
            {features.map((f,i)=>(
              <div key={i} className="feat-cell">
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title serif">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* HOW IT WORKS */}
      <div className="section">
        <div className="stag">✦ How It Works</div>
        <h2 className="sh serif">Your Cosmic Blueprint<br /><em>in Under 60 Seconds</em></h2>
        <p className="sp">No astrology knowledge needed. From birth details to profound life insights in moments.</p>
        <div className="steps">
          {[
            {icon:"✦",n:"01",title:"Enter Birth Details",    desc:"Name, date, time, and city. Our system auto-fetches precise coordinates from anywhere in the world."},
            {icon:"⬡",n:"02",title:"AI Builds Your Blueprint",desc:"15+ engines run simultaneously — yogas, dashas, transits, psychology. Done in seconds."},
            {icon:"🌙",n:"03",title:"Receive Deep Insights",  desc:"Personalized AI predictions, remedies, destiny timelines, and daily guidance — unique to you."},
          ].map((s,i)=>(
            <div key={i} className="step">
              <div className="step-bg-n">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <div className="step-title serif">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* PRICING */}
      <div className="price-bg">
        <div className="section" style={{textAlign:"center"}}>
          <div className="stag">✦ Pricing</div>
          <h2 className="sh serif" style={{marginBottom:14}}>Simple. Honest.<br /><em>Transparent Pricing.</em></h2>
          <p className="sp" style={{margin:"0 auto 64px"}}>Start free. Upgrade when the stars align.</p>
          <div className="price-grid" style={{textAlign:"left"}}>
            {plans.map((p,i)=>(
              <div key={i} className={`plan ${p.hi?"hi":""}`}>
                {p.hi && <div className="plan-badge">Most Popular</div>}
                <div className="plan-tier">{p.name}</div>
                <div className="plan-price serif">{p.price}</div>
                <div className="plan-period">{p.period}</div>
                <div className="plan-line" />
                <ul className="plan-feats">
                  {p.feats.map((f,j)=><li key={j} className="plan-feat"><span className="fc">✦</span>{f}</li>)}
                </ul>
                <button className={`plan-cta ${p.hi?"cta-g":"cta-o"}`}>{p.cta} →</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* TESTIMONIALS */}
      <div className="section">
        <div className="stag">✦ Testimonials</div>
        <h2 className="sh serif">Loved by Seekers<br /><em>Across India</em></h2>
        <p className="sp">Real people. Real predictions. Real transformation.</p>
        <div className="testi-grid">
          {testimonials.map((t,i)=>(
            <div key={i} className="testi">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text serif">&ldquo;{t.text}&rdquo;</p>
              <div className="testi-author">
                <div className="testi-av">{t.ini}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-city">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="fcta">
        <div className="fcta-orb" />
        <div style={{position:"relative",zIndex:1}}>
          <div className="cta-line" />
          <div className="stag">✦ Begin Your Journey</div>
          <h2 className="sh serif" style={{marginBottom:20}}>Your Stars Are Aligned.<br /><em>Are You Ready?</em></h2>
          <p style={{color:T.cream2,fontSize:17,marginBottom:44,lineHeight:1.8}}>
            Join 50,000+ seekers who found clarity, direction,<br />and purpose through AstroLife AI.
          </p>
          <button className="btn-gold" style={{fontSize:16,padding:"18px 48px",margin:"0 auto"}}>
            ✦ Generate Your Free Kundli
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer">
          <div className="footer-top">
            <div>
              <div className="logo"><div className="logo-gem">✦</div><span className="logo-name">AstroLife</span></div>
              <p className="footer-tagline">AI Destiny Operating System.<br />Ancient wisdom. Modern intelligence.</p>
            </div>
            <div className="footer-links">
              {[
                {title:"Platform", links:["Features","Pricing","AI Agents","Engines","Mobile App"]},
                {title:"Astrology",links:["Vedic Kundli","Lal Kitab","KP System","Numerology","Vastu"]},
                {title:"Company",  links:["About","Blog","Careers","Privacy","Terms"]},
              ].map(col=>(
                <div key={col.title} className="footer-col">
                  <div className="fcol-title">{col.title}</div>
                  {col.links.map(l=><span key={l} className="flink">{l}</span>)}
                </div>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <div className="fcopy">© 2025 AstroLife AI. All rights reserved.</div>
            <div className="fcopy">Made with ✦ for cosmic seekers everywhere</div>
          </div>
        </div>
      </footer>
    </>
  );
}
