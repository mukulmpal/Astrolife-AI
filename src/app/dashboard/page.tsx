"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type User = { email?: string; phone?: string; user_metadata?: { full_name?: string; avatar_url?: string } };

const PLANETS = [
  { name: "Sun",     sign: "Aries",    house: "1st",  icon: "☀️", energy: "High" },
  { name: "Moon",    sign: "Cancer",   house: "4th",  icon: "🌙", energy: "Calm" },
  { name: "Mars",    sign: "Gemini",   house: "3rd",  icon: "♂",  energy: "Active" },
  { name: "Mercury", sign: "Taurus",   house: "2nd",  icon: "☿",  energy: "Sharp" },
  { name: "Jupiter", sign: "Leo",      house: "5th",  icon: "♃",  energy: "Expand" },
  { name: "Venus",   sign: "Pisces",   house: "12th", icon: "♀",  energy: "Divine" },
  { name: "Saturn",  sign: "Aquarius", house: "11th", icon: "♄",  energy: "Karmic" },
  { name: "Rahu",    sign: "Scorpio",  house: "8th",  icon: "☊",  energy: "Intense" },
];

const QUICK_ACTIONS = [
  { icon: "🔯", label: "Generate Kundli",   desc: "Create birth chart",       color: "#3c2880", href: "/dashboard/kundli" },
  { icon: "🤖", label: "AI Chat",           desc: "Talk to AI astrologer",    color: "#1a4a2e", href: "/dashboard/chat" },
  { icon: "📈", label: "Destiny Timeline",  desc: "See your life arc",        color: "#4a2010", href: "/dashboard/timeline" },
  { icon: "🧠", label: "Psychology",        desc: "Mind & soul analysis",     color: "#2a1a4a", href: "/dashboard/psychology" },
  { icon: "🎼", label: "Sound Therapy",     desc: "Planetary frequencies",    color: "#1a3a4a", href: "/dashboard/sound" },
  { icon: "👨‍👩‍👧", label: "Family Karma", desc: "Ancestral patterns",       color: "#3a1a2a", href: "/dashboard/family" },
];

const INSIGHTS = [
  { tag: "Saturn Transit", text: "Saturn in your 10th house is testing your career foundations. Stay disciplined — a breakthrough awaits in 3 months.", icon: "♄", urgent: true },
  { tag: "Moon Energy",    text: "Today's Cancer moon amplifies your emotional intelligence. Ideal day for deep conversations and creative work.", icon: "🌙", urgent: false },
  { tag: "Rahu Dasha",     text: "You are currently in Rahu Mahadasha. Foreign connections, unexpected opportunities, and spiritual awakening are themes.", icon: "☊", urgent: false },
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "Seeker";
  const greeting = time.getHours() < 12 ? "Shubh Prabhat" : time.getHours() < 17 ? "Namaste" : "Shubh Sandhya";
  const dayName = time.toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = time.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:#060410;color:#f0e8d0;font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#060410}::-webkit-scrollbar-thumb{background:#c8a030;border-radius:2px}

        /* LAYOUT */
        .layout{display:flex;min-height:100vh}

        /* SIDEBAR */
        .sidebar{
          width:240px;flex-shrink:0;
          background:#0a0720;
          border-right:1px solid #1c1840;
          display:flex;flex-direction:column;
          padding:24px 0;
          position:fixed;top:0;left:0;bottom:0;
          z-index:100;
        }
        .sidebar-logo{display:flex;align-items:center;gap:10px;padding:0 20px 28px;border-bottom:1px solid #1c1840;margin-bottom:20px}
        .logo-gem{width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#3c2880,#c8a030);display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 20px rgba(200,160,48,0.25)}
        .logo-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;background:linear-gradient(135deg,#c8a030,#f0d898);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

        .nav-section{padding:0 12px;margin-bottom:8px}
        .nav-section-title{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#3a3060;padding:0 8px;margin-bottom:8px}
        .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:all 0.2s;margin-bottom:2px;font-size:13px;color:#605890;text-decoration:none}
        .nav-item:hover{background:rgba(200,160,48,0.06);color:#c8c0a8}
        .nav-item.active{background:rgba(200,160,48,0.1);color:#c8a030;border:1px solid rgba(200,160,48,0.15)}
        .nav-icon{font-size:16px;width:20px;text-align:center}

        .sidebar-bottom{margin-top:auto;padding:16px 12px;border-top:1px solid #1c1840}
        .user-chip{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid #1c1840}
        .user-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#3c2880,#c8a030);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:13px;color:#f0e8d0;flex-shrink:0}
        .user-name{font-size:13px;color:#c8c0a8;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .logout-btn{background:none;border:none;color:#3a3060;cursor:pointer;font-size:16px;transition:color 0.2s;padding:4px}
        .logout-btn:hover{color:#c8a030}

        /* MAIN */
        .main{margin-left:240px;flex:1;padding:32px;min-height:100vh}

        /* TOPBAR */
        .topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px}
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
        .tab:hover:not(.active){color:#c8c0a8}

        /* STAT CARDS */
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
        .stat-card{background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:20px;transition:border-color 0.3s}
        .stat-card:hover{border-color:rgba(200,160,48,0.2)}
        .stat-icon{font-size:24px;margin-bottom:12px}
        .stat-val{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:#c8a030;line-height:1;margin-bottom:4px}
        .stat-lbl{font-size:12px;color:#605890}
        .stat-change{font-size:11px;color:#1d9e75;margin-top:6px}

        /* GRID */
        .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
        .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}

        /* CARDS */
        .card{background:#0d0a22;border:1px solid #1c1840;border-radius:16px;padding:24px;transition:border-color 0.3s}
        .card:hover{border-color:rgba(200,160,48,0.15)}
        .card-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#f0e8d0;margin-bottom:16px;display:flex;align-items:center;gap:8px}
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
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        .insight-text{font-size:13px;color:#c8c0a8;line-height:1.7}

        /* PLANETS TABLE */
        .planet-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #1c1840}
        .planet-row:last-child{border-bottom:none}
        .planet-icon{font-size:20px;width:28px;text-align:center}
        .planet-name{font-size:13px;color:#c8c0a8;width:70px}
        .planet-sign{font-size:13px;color:#f0e8d0;flex:1}
        .planet-house{font-size:11px;color:#605890;width:40px;text-align:center}
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

        /* UPGRADE BANNER */
        .upgrade{background:linear-gradient(135deg,rgba(60,40,128,0.4),rgba(200,160,48,0.1));border:1px solid rgba(200,160,48,0.25);border-radius:16px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
        .upgrade-text h3{font-family:'Cormorant Garamond',serif;font-size:18px;color:#f0e8d0;margin-bottom:4px}
        .upgrade-text p{font-size:13px;color:#605890}
        .upgrade-btn{background:linear-gradient(135deg,#c8a030,#a07820);color:#060410;border:none;border-radius:10px;padding:10px 24px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'Outfit',sans-serif;white-space:nowrap}
        .upgrade-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(200,160,48,0.3)}

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
          .actions-grid{grid-template-columns:1fr 1fr}
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

          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            {[
              { icon:"🏠", label:"Dashboard",  active:true },
              { icon:"🔯", label:"My Charts",  active:false },
              { icon:"🤖", label:"AI Chat",    active:false },
              { icon:"📈", label:"Timeline",   active:false },
            ].map(n => (
              <div key={n.label} className={`nav-item ${n.active?"active":""}`}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Engines</div>
            {[
              { icon:"🧠", label:"Psychology" },
              { icon:"🎼", label:"Sound Therapy" },
              { icon:"👨‍👩‍👧", label:"Family Karma" },
              { icon:"💊", label:"Remedies" },
              { icon:"🏠", label:"Vastu" },
            ].map(n => (
              <div key={n.label} className="nav-item">
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Account</div>
            {[
              { icon:"👤", label:"Profile" },
              { icon:"💎", label:"Upgrade" },
              { icon:"⚙️", label:"Settings" },
            ].map(n => (
              <div key={n.label} className="nav-item">
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </div>

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
              <div className="greeting-sub">The stars have been waiting for you.</div>
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

          {/* TODAY'S CARD */}
          <div className="today-card">
            <div className="today-orb" />
            <div className="today-tag">✦ Today&apos;s Cosmic Energy</div>
            <div className="today-title serif">A day of karmic realignment and hidden opportunities</div>
            <div className="today-text">
              Saturn&apos;s aspect on your Moon creates emotional depth today. Mercury&apos;s position favors communication, contracts, and important decisions. Avoid impulsive financial moves — wait until evening for clarity.
            </div>
            <div className="today-score">
              <div className="score-n serif">7.4</div>
              <div className="score-l">COSMIC SCORE</div>
            </div>
          </div>

          {/* UPGRADE BANNER */}
          <div className="upgrade">
            <div className="upgrade-text">
              <h3 serif="">Unlock Your Full Cosmic Blueprint ✦</h3>
              <p>You are on the Free plan. Upgrade to access all 15+ engines, unlimited AI chat, and destiny timeline.</p>
            </div>
            <button className="upgrade-btn">Upgrade to Premium →</button>
          </div>

          {/* STATS */}
          <div className="stats-row">
            {[
              { icon:"🔯", val:"1",    lbl:"Charts Created",   change:"+ Generate New" },
              { icon:"🤖", val:"3",    lbl:"AI Questions Left", change:"5 free / month" },
              { icon:"⚡", val:"7.4",  lbl:"Today's Score",    change:"↑ Better than yesterday" },
              { icon:"🌙", val:"Rahu", lbl:"Active Dasha",     change:"Until 2031" },
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
            {/* Quick Actions */}
            <div className="card">
              <div className="card-tag">✦ Quick Actions</div>
              <div className="card-title serif">What would you like to explore?</div>
              <div className="actions-grid">
                {QUICK_ACTIONS.map((a,i) => (
                  <a key={i} href={a.href} className="action-btn">
                    <div className="action-btn-icon">{a.icon}</div>
                    <div className="action-btn-label">{a.label}</div>
                    <div className="action-btn-desc">{a.desc}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="card">
              <div className="card-tag">✦ AI Insights</div>
              <div className="card-title serif">Your cosmic intelligence briefing</div>
              {INSIGHTS.map((ins,i) => (
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
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 32px" }}>
              {PLANETS.map((p,i) => (
                <div key={i} className="planet-row">
                  <span className="planet-icon">{p.icon}</span>
                  <span className="planet-name">{p.name}</span>
                  <span className="planet-sign">{p.sign}</span>
                  <span className="planet-house">{p.house}</span>
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
