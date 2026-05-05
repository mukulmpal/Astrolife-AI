"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { calculateDestiny } from "@/lib/astro-engine/destiny";
import { calculatePsychology } from "@/lib/astro-engine/psychology";
import { checkSupabaseHealth, isSupabaseReady, type DbHealthItem } from "@/lib/db-health";
import { useUserChart } from "@/lib/user-chart";
import { getAccountAiUsageStatus, getFreeMonthlyAiLimit } from "@/lib/usage";

type User = { email?: string; phone?: string; user_metadata?: { full_name?: string; avatar_url?: string } };
type Profile = { subscription_tier?: string | null; subscription_expires_at?: string | null };

const NAV_MAIN = [
  { icon:"🏠", label:"Dashboard",  href:"/dashboard" },
  { icon:"🔯", label:"My Charts",  href:"/dashboard/kundli" },
  { icon:"🤖", label:"AI Chat",    href:"/dashboard/chat" },
  { icon:"📈", label:"Timeline",   href:"/dashboard/destiny" },
];

const NAV_ENGINES = [
  { icon:"🔢", label:"Numerology",    href:"/dashboard/numerology" },
  { icon:"🧠", label:"Psychology",    href:"/dashboard/psychology" },
  { icon:"💑", label:"Kundali Milan", href:"/dashboard/kundali-milan" },
  { icon:"🎼", label:"Sound Therapy", href:"/dashboard/chat" },
  { icon:"👨‍👩‍👧", label:"Family Karma",  href:"/dashboard/chat" },
  { icon:"💊", label:"Remedies",      href:"/dashboard/chat" },
  { icon:"🏠", label:"Vastu",         href:"/dashboard/vastu" },
];

const NAV_ACCOUNT = [
  { icon:"👤", label:"Profile",  href:"/dashboard/profile" },
  { icon:"💎", label:"Upgrade",  href:"/dashboard/upgrade" },
  { icon:"⚙️", label:"Settings", href:"/dashboard/settings" },
];

export default function Dashboard() {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [aiQuestionsLeft, setAiQuestionsLeft] = useState("0");
  const [dbHealth, setDbHealth] = useState<DbHealthItem[]>([]);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const { birth, chart } = useUserChart();

  useEffect(() => {
    const loadDashboardState = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        const { data: nextProfile } = await supabase
          .from("profiles")
          .select("subscription_tier,subscription_expires_at")
          .eq("id", data.user.id)
          .maybeSingle();

        setProfile(nextProfile);
        const usage = await getAccountAiUsageStatus(nextProfile?.subscription_tier);
        setAiQuestionsLeft(usage.isUnlimited ? "Unlimited" : String(usage.left));
        return;
      }

      const usage = await getAccountAiUsageStatus(null);
      setAiQuestionsLeft(String(usage.left));
    };

    loadDashboardState();
    checkSupabaseHealth().then(setDbHealth);
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || birth.name.split(" ")[0] || "Seeker";
  const greeting = time.getHours() < 12 ? "Shubh Prabhat" : time.getHours() < 17 ? "Namaste" : "Shubh Sandhya";
  const dayName  = time.toLocaleDateString("en-IN", { weekday:"long" });
  const dateStr  = time.toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" });
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/dashboard";
  const destiny = calculateDestiny(chart.planets as never, chart.dashas, birth.dob);
  const psychology = calculatePsychology(chart.planets as never);
  const activeDasha = chart.dashas.find((entry) => entry.active) || chart.dashas[0];
  const strongestArea = [...destiny.areas].sort((a, b) => b.score - a.score)[0];
  const weakestArea = [...destiny.areas].sort((a, b) => a.score - b.score)[0];
  const cosmicScore = (destiny.currentScore / 10).toFixed(1);
  const plan = profile?.subscription_tier && profile.subscription_tier !== "free"
    ? profile.subscription_tier.toUpperCase()
    : "FREE";
  const chartCount = chart.name ? "1" : "0";
  const aiQuestionsChange = plan === "FREE"
    ? `${getFreeMonthlyAiLimit()} free / month`
    : `${plan} plan active`;
  const dbReady = isSupabaseReady(dbHealth);
  const pendingDbTables = dbHealth.filter((item) => item.status !== "ready");
  const planetCards = [
    { name:"Sun", icon:"☉", col:"#f97316" },
    { name:"Moon", icon:"☽", col:"#c084fc" },
    { name:"Mars", icon:"♂", col:"#ef4444" },
    { name:"Mercury", icon:"☿", col:"#22c55e" },
    { name:"Jupiter", icon:"♃", col:"#f59e0b" },
    { name:"Venus", icon:"♀", col:"#ec4899" },
    { name:"Saturn", icon:"♄", col:"#60a5fa" },
    { name:"Rahu", icon:"☊", col:"#a78bfa" },
  ].map((planet) => {
    const details = chart.planets[planet.name];
    const energy = details.dignity.includes("Exalted") || details.dignity.includes("Own")
      ? "Strong"
      : [6, 8, 12].includes(details.house)
      ? "Intense"
      : "Active";

    return {
      ...planet,
      sign: details.sign,
      house: `${details.house}th`,
      energy,
    };
  });
  const insights = [
    {
      tag: `${activeDasha.planet} Mahadasha`,
      text: `${activeDasha.planet} is your active karmic teacher right now. Current life score is ${destiny.currentScore}%, so this is a phase for focused work in ${weakestArea.name.toLowerCase()} and steady gains in ${strongestArea.name.toLowerCase()}.`,
      icon: "✦",
      urgent: destiny.currentScore < 55,
    },
    {
      tag: `${psychology.pattern.name}`,
      text: `${psychology.summary} Anxiety index is ${psychology.pattern.anxietyIdx}, so today works best when you keep decisions simple and stay close to routines that calm the mind.`,
      icon: "🧠",
      urgent: psychology.pattern.anxietyIdx >= 70,
    },
    {
      tag: `${strongestArea.name} Window`,
      text: `${strongestArea.name} is currently your strongest life area at ${strongestArea.score}%. ${weakestArea.name} sits at ${weakestArea.score}%, so the dashboard should be used as a guide for balance, not just momentum.`,
      icon: strongestArea.icon,
      urgent: false,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:#060410;color:#f0e8d0;font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#060410}::-webkit-scrollbar-thumb{background:#c8a030;border-radius:2px}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

        /* LAYOUT */
        .layout{display:flex;min-height:100vh}

        /* SIDEBAR */
        .sidebar{width:240px;flex-shrink:0;background:#0a0720;border-right:1px solid #1c1840;display:flex;flex-direction:column;padding:24px 0;position:fixed;top:0;left:0;bottom:0;z-index:100;overflow-y:auto}
        .sidebar-logo{display:flex;align-items:center;gap:10px;padding:0 20px 28px;border-bottom:1px solid #1c1840;margin-bottom:20px}
        .logo-gem{width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#3c2880,#c8a030);display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 20px rgba(200,160,48,0.25)}
        .logo-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;background:linear-gradient(135deg,#c8a030,#f0d898);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

        .nav-section{padding:0 12px;margin-bottom:8px}
        .nav-section-title{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#3a3060;padding:0 8px;margin-bottom:8px}

        /* NAV ITEMS — both div and a */
        .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:all 0.2s;margin-bottom:2px;font-size:13px;color:#605890;text-decoration:none;border:none;background:none;width:100%;text-align:left;font-family:'Outfit',sans-serif}
        .nav-item:hover{background:rgba(200,160,48,0.06);color:#c8c0a8}
        .nav-item.active{background:rgba(200,160,48,0.1);color:#c8a030;border:1px solid rgba(200,160,48,0.15)}
        .nav-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0}

        .sidebar-bottom{margin-top:auto;padding:16px 12px;border-top:1px solid #1c1840}
        .user-chip{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid #1c1840}
        .user-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#3c2880,#c8a030);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:13px;color:#f0e8d0;flex-shrink:0;font-weight:600}
        .user-name{font-size:13px;color:#c8c0a8;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .logout-btn{background:none;border:none;color:#3a3060;cursor:pointer;font-size:16px;transition:color 0.2s;padding:4px}
        .logout-btn:hover{color:#c8a030}

        /* MAIN */
        .main{margin-left:240px;flex:1;padding:32px;min-height:100vh}

        /* TOPBAR */
        .topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;flex-wrap:wrap;gap:16px}
        .greeting-tag{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c8a030;margin-bottom:6px}
        .greeting-h{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:600;color:#f0e8d0;line-height:1.1}
        .greeting-h em{font-style:italic;color:#c8a030}
        .greeting-sub{font-size:13px;color:#605890;margin-top:4px}
        .topbar-right{display:flex;align-items:center;gap:12px;flex-shrink:0}
        .date-chip{background:#0d0a22;border:1px solid #1c1840;border-radius:10px;padding:10px 16px;text-align:right}
        .date-day{font-size:11px;color:#605890;letter-spacing:1px}
        .date-full{font-size:13px;color:#c8c0a8;margin-top:2px}
        .notif-btn{width:40px;height:40px;border-radius:10px;background:#0d0a22;border:1px solid #1c1840;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;font-size:18px}
        .notif-btn:hover{border-color:rgba(200,160,48,0.3)}

        /* TABS */
        .tabs{display:flex;gap:4px;margin-bottom:28px;background:#0a0720;border:1px solid #1c1840;border-radius:12px;padding:4px;width:fit-content}
        .tab{padding:8px 20px;border-radius:9px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;color:#605890;border:none;background:none;font-family:'Outfit',sans-serif}
        .tab.active{background:#1c1840;color:#c8c0a8}

        /* STATS */
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .stat-card{background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:20px;transition:border-color 0.3s}
        .stat-card:hover{border-color:rgba(200,160,48,0.2)}
        .stat-icon{font-size:24px;margin-bottom:12px}
        .stat-val{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:#c8a030;line-height:1;margin-bottom:4px}
        .stat-lbl{font-size:12px;color:#605890}
        .stat-change{font-size:11px;color:#1d9e75;margin-top:6px}

        /* GRID */
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}

        /* CARDS */
        .card{background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:24px;transition:border-color 0.3s}
        .card:hover{border-color:rgba(200,160,48,0.15)}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#f0e8d0;margin-bottom:16px}
        .card-tag{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#605890;margin-bottom:8px}

        /* QUICK ACTIONS */
        .actions-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .action-btn{padding:16px;border-radius:12px;border:1px solid #1c1840;background:#0a0720;cursor:pointer;transition:all 0.25s;text-align:left;text-decoration:none;display:block}
        .action-btn:hover{transform:translateY(-3px);border-color:rgba(200,160,48,0.25);background:#0f0c28}
        .action-btn-icon{font-size:24px;margin-bottom:10px}
        .action-btn-label{font-size:13px;font-weight:500;color:#c8c0a8;margin-bottom:3px}
        .action-btn-desc{font-size:11px;color:#605890}

        /* INSIGHTS */
        .insight{padding:16px;border-radius:12px;border:1px solid #1c1840;background:#0a0720;margin-bottom:10px;transition:border-color 0.2s}
        .insight:last-child{margin-bottom:0}
        .insight:hover{border-color:rgba(200,160,48,0.2)}
        .insight.urgent{border-color:rgba(200,160,48,0.25);background:rgba(200,160,48,0.03)}
        .insight-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
        .insight-icon{font-size:18px}
        .insight-tag{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#c8a030;font-weight:500}
        .insight-urgent-dot{width:6px;height:6px;border-radius:50%;background:#c8a030;margin-left:auto;animation:blink 2s infinite}
        .insight-text{font-size:13px;color:#c8c0a8;line-height:1.7}

        /* PLANETS */
        .planet-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #1c1840}
        .planet-row:last-child{border-bottom:none}
        .energy-pill{font-size:10px;padding:3px 10px;border-radius:20px;background:rgba(200,160,48,0.1);border:1px solid rgba(200,160,48,0.15);color:#c8a030}

        /* TODAY CARD */
        .today-card{background:linear-gradient(135deg,#0f0c28,#1a1040);border:1px solid rgba(200,160,48,0.2);border-radius:16px;padding:24px;margin-bottom:24px;position:relative;overflow:hidden}
        .today-orb{position:absolute;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(200,160,48,0.08) 0%,transparent 70%);right:-40px;top:-40px;pointer-events:none}
        .today-tag{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a030;margin-bottom:10px}
        .today-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#f0e8d0;margin-bottom:8px}
        .today-text{font-size:14px;color:#c8c0a8;line-height:1.8;max-width:600px}
        .today-score{position:absolute;right:24px;bottom:24px;text-align:center}
        .score-n{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:700;color:#c8a030;line-height:1}
        .score-l{font-size:11px;color:#605890;letter-spacing:1px}

        /* UPGRADE */
        .upgrade{background:linear-gradient(135deg,rgba(60,40,128,0.4),rgba(200,160,48,0.1));border:1px solid rgba(200,160,48,0.25);border-radius:16px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px}
        .upgrade-btn{background:linear-gradient(135deg,#c8a030,#a07820);color:#060410;border:none;border-radius:10px;padding:10px 24px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif;white-space:nowrap;text-decoration:none}
        .upgrade-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(200,160,48,0.3)}
        .db-health{background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.18);border-radius:14px;padding:14px 18px;margin-bottom:24px;display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
        .db-health-title{font-size:13px;color:#fdba74;font-weight:600;margin-bottom:4px}
        .db-health-text{font-size:12px;color:#c8c0a8;line-height:1.7}
        .db-health-tags{display:flex;gap:6px;flex-wrap:wrap}
        .db-health-tag{font-size:10px;color:#fdba74;border:1px solid rgba(249,115,22,0.25);background:rgba(249,115,22,0.08);border-radius:999px;padding:3px 8px}

        @media(max-width:1024px){
          .sidebar{display:none}
          .main{margin-left:0}
          .stats-row{grid-template-columns:repeat(2,1fr)}
          .grid-2{grid-template-columns:1fr}
          .actions-grid{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:640px){
          .main{padding:20px}
          .stats-row{grid-template-columns:1fr 1fr}
          .today-score{display:none}
        }
      `}</style>

      <div className="layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-gem">✦</div>
            <span className="logo-name">AstroLife</span>
          </div>

          {/* Main Nav */}
          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            {NAV_MAIN.map(n => (
              <Link key={n.label} href={n.href}
                className={`nav-item ${pathname === n.href ? "active" : ""}`}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </Link>
            ))}
          </div>

          {/* Engines Nav */}
          <div className="nav-section">
            <div className="nav-section-title">Engines</div>
            {NAV_ENGINES.map(n => (
              <Link key={n.label} href={n.href} className="nav-item">
                <span className="nav-icon">{n.icon}</span>{n.label}
              </Link>
            ))}
          </div>

          {/* Account Nav */}
          <div className="nav-section">
            <div className="nav-section-title">Account</div>
            {NAV_ACCOUNT.map(n => (
              <Link key={n.label} href={n.href} className="nav-item">
                <span className="nav-icon">{n.icon}</span>{n.label}
              </Link>
            ))}
          </div>

          {/* User chip */}
          <div className="sidebar-bottom">
            <div className="user-chip">
              <div className="user-av">{userName[0]}</div>
              <span className="user-name">{userName}</span>
              <button className="logout-btn" onClick={handleLogout} title="Logout">↩</button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div>
              <div className="greeting-tag">✦ Your Cosmic Dashboard</div>
              <h1 className="greeting-h serif">
                {greeting},<br /><em>{userName}</em>
              </h1>
              <div className="greeting-sub">{birth.city} · Lagna {chart.lagnaRashi} · {activeDasha.planet} Mahadasha active</div>
            </div>
            <div className="topbar-right">
              <div className="date-chip">
                <div className="date-day">{dayName.toUpperCase()}</div>
                <div className="date-full">{dateStr}</div>
              </div>
              <div className="notif-btn">🔔</div>
            </div>
          </div>

          {/* TABS */}
          <div className="tabs">
            {["overview","charts","insights","remedies"].map(t => (
              <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          {/* TODAY CARD */}
          <div className="today-card">
            <div className="today-orb" />
            <div className="today-tag">✦ Today&apos;s Cosmic Energy</div>
            <div className="today-title serif">{psychology.pattern.name} meets {activeDasha.planet} timing</div>
            <div className="today-text">
              {destiny.summary} Your strongest area is {strongestArea.name.toLowerCase()}, while {weakestArea.name.toLowerCase()} needs gentler handling. Use discipline over speed, especially when emotions feel louder than facts.
            </div>
            <div className="today-score">
              <div className="score-n serif">{cosmicScore}</div>
              <div className="score-l">COSMIC SCORE</div>
            </div>
          </div>

          {/* UPGRADE BANNER */}
          <div className="upgrade">
            <div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,color:"#f0e8d0",marginBottom:4}}>
                Unlock Your Full Cosmic Blueprint ✦
              </div>
              <div style={{fontSize:13,color:"#605890"}}>
                Upgrade to access all 15+ engines, unlimited AI chat, and destiny timeline.
              </div>
            </div>
            <Link href="/dashboard/upgrade" className="upgrade-btn">Upgrade to Premium →</Link>
          </div>

          {dbHealth.length > 0 && !dbReady && (
            <div className="db-health">
              <div>
                <div className="db-health-title">Database setup pending</div>
                <div className="db-health-text">
                  Account persistence is in fallback mode. Apply `supabase/schema.sql` and follow `docs/SUPABASE_SETUP.md`.
                </div>
              </div>
              <div className="db-health-tags">
                {pendingDbTables.slice(0, 4).map((item) => (
                  <span key={item.table} className="db-health-tag">{item.label}</span>
                ))}
              </div>
            </div>
          )}

          {/* STATS */}
          <div className="stats-row">
            {[
              { icon:"🔯", val:chartCount, lbl:"Charts Created", change:birth.city ? birth.city : "Create your first chart" },
              { icon:"🤖", val:aiQuestionsLeft, lbl:"AI Questions Left", change:aiQuestionsChange },
              { icon:"⚡", val:cosmicScore,  lbl:"Today&apos;s Score", change:`${strongestArea.name} is strongest` },
              { icon:"🌙", val:activeDasha.planet, lbl:"Active Dasha", change:`Until ${activeDasha.end.getFullYear()}` },
            ].map((s,i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-val serif">{s.val}</div>
                <div className="stat-lbl">{s.lbl}</div>
                <div className="stat-change">{s.change}</div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS + INSIGHTS */}
          <div className="grid-2">
            <div className="card">
              <div className="card-tag">✦ Quick Actions</div>
              <div className="card-title serif">What would you like to explore?</div>
              <div className="actions-grid">
                {[
                  { icon:"🔯", label:"Generate Kundli",  desc:"Create birth chart",    href:"/dashboard/kundli" },
                  { icon:"🤖", label:"AI Chat",          desc:"Talk to AI astrologer", href:"/dashboard/chat" },
                  { icon:"📈", label:"Destiny Timeline", desc:"See your life arc",      href:"/dashboard/destiny" },
                  { icon:"🧠", label:"Psychology",       desc:"Mind & soul analysis",  href:"/dashboard/psychology" },
                  { icon:"💑", label:"Kundali Milan",    desc:"36-point compatibility", href:"/dashboard/kundali-milan" },
                  { icon:"💎", label:"Upgrade",          desc:"Unlock all features",   href:"/dashboard/upgrade" },
                ].map((a,i) => (
                  <Link key={i} href={a.href} className="action-btn">
                    <div className="action-btn-icon">{a.icon}</div>
                    <div className="action-btn-label">{a.label}</div>
                    <div className="action-btn-desc">{a.desc}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-tag">✦ AI Insights</div>
              <div className="card-title serif">Your cosmic intelligence briefing</div>
              {insights.map((ins,i) => (
                <div key={i} className={`insight ${ins.urgent?"urgent":""}`}>
                  <div className="insight-top">
                    <span className="insight-icon">{ins.icon}</span>
                    <span className="insight-tag">{ins.tag}</span>
                    {ins.urgent && <div className="insight-urgent-dot" />}
                  </div>
                  <div className="insight-text">{ins.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PLANETS */}
          <div className="card">
            <div className="card-tag">✦ Planetary Positions</div>
            <div className="card-title serif">Your current cosmic blueprint</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
              {planetCards.map((p,i) => (
                <div key={i} className="planet-row">
                  <span style={{fontSize:18,width:28,color:p.col}}>{p.icon}</span>
                  <span style={{flex:1,fontSize:13,color:"#c8c0a8"}}>{p.name}</span>
                  <span style={{fontSize:13,color:"#f0e8d0"}}>{p.sign}</span>
                  <span style={{fontSize:11,color:"#605890",width:32,textAlign:"right"}}>{p.house}</span>
                  <span className="energy-pill">{p.energy}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
