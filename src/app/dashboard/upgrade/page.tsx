"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    period: "forever",
    highlight: false,
    color: "#605890",
    features: [
      "Basic Kundli Chart",
      "5 AI Questions / month",
      "Daily Horoscope Card",
      "Top 5 Yogas Only",
      "Watermarked PDF",
      "Ad-supported",
    ],
    cta: "Current Plan",
    disabled: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹499",
    period: "/ month",
    highlight: true,
    color: "#c8a030",
    features: [
      "Unlimited AI Chat — All 10 Agents",
      "All 15+ Astrology Engines",
      "Full Dasha + KP + Lal Kitab + Nadi",
      "Astro Sound Engine",
      "Transit Alerts (Email + Push)",
      "PDF Exports — No Watermark",
      "Family Charts (5 members)",
      "AI Voice Reports",
    ],
    cta: "Upgrade to Premium",
    disabled: false,
  },
  {
    id: "elite",
    name: "Elite",
    price: "₹1,999",
    period: "/ month",
    highlight: false,
    color: "#a855f7",
    features: [
      "Everything in Premium",
      "WhatsApp AI Astrologer",
      "Business Muhurat AI",
      "Yearly Forecast Reports",
      "Family Karma Mapping",
      "Custom Rituals & Remedies",
      "White-label Astrologer Mode",
      "Priority Support",
    ],
    cta: "Upgrade to Elite",
    disabled: false,
  },
];

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return;
    setLoading(planId);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // Load Razorpay script
      const loaded = await loadRazorpay();
      if (!loaded) { alert("Razorpay load nahi hua. Please try again."); return; }

      // Create order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const order = await res.json();
      if (order.error) throw new Error(order.error);

      // Open Razorpay checkout
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "AstroLife AI",
        description: order.description,
        order_id: order.orderId,
        image: "/logo.png",
        prefill: {
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: { color: "#c8a030" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Verify payment
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planId,
            }),
          });
          const result = await verifyRes.json();
          if (result.success) {
            setSuccess(true);
            setTimeout(() => window.location.href = "/dashboard", 2500);
          }
        },
        modal: {
          ondismiss: () => setLoading(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Kuch error aa gaya. Please try again.");
    }
    setLoading(null);
  };

  if (success) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@400;500;600&display=swap');
          *{margin:0;padding:0;box-sizing:border-box}
          body{background:#060410;font-family:'Outfit',sans-serif;color:#f0e8d0}
          @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes pulse{0%,100%{box-shadow:0 0 20px rgba(200,160,48,0.3)}50%{box-shadow:0 0 50px rgba(200,160,48,0.7)}}
        `}</style>
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center", padding:24 }}>
          <div style={{ animation:"fadeUp 0.8s ease" }}>
            <div style={{ width:100, height:100, borderRadius:"50%", background:"linear-gradient(135deg,#3c2880,#c8a030)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, margin:"0 auto 32px", animation:"pulse 2s infinite" }}>
              ✦
            </div>
            <div style={{ fontFamily:"Cormorant Garamond, serif", fontSize:36, fontWeight:600, color:"#f0e8d0", marginBottom:12 }}>
              Welcome to <em style={{color:"#c8a030"}}>Premium!</em>
            </div>
            <div style={{ fontSize:15, color:"#605890", marginBottom:8 }}>
              Payment successful. Your cosmic universe is unlocked.
            </div>
            <div style={{ fontSize:13, color:"#3a3060" }}>Redirecting to dashboard...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{background:#060410;color:#f0e8d0;font-family:'Outfit',sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
        .serif{font-family:'Cormorant Garamond',Georgia,serif}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#060410}::-webkit-scrollbar-thumb{background:#c8a030;border-radius:2px}

        .page{max-width:1100px;margin:0 auto;padding:48px 32px}

        /* HEADER */
        .page-tag{font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#c8a030;margin-bottom:12px;text-align:center}
        .page-title{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,56px);font-weight:600;color:#f0e8d0;text-align:center;line-height:1.1;margin-bottom:14px}
        .page-title em{font-style:italic;color:#c8a030}
        .page-sub{font-size:16px;color:#605890;text-align:center;margin-bottom:60px;line-height:1.7}

        /* PLANS GRID */
        .plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:60px}

        /* PLAN CARD */
        .plan{background:#0d0a22;border:1px solid #1c1840;border-radius:20px;padding:36px 32px;position:relative;transition:transform 0.3s,border-color 0.3s}
        .plan:hover{transform:translateY(-4px)}
        .plan.highlight{border-color:rgba(200,160,48,0.4);background:linear-gradient(160deg,rgba(200,160,48,0.05),#0d0a22)}
        .popular-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#c8a030,#a07820);color:#060410;font-size:10px;font-weight:700;padding:5px 16px;border-radius:100px;letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap}
        .plan-tier{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#605890;margin-bottom:14px}
        .plan-price{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:600;color:#f0e8d0;line-height:1;margin-bottom:4px}
        .plan-period{font-size:14px;color:#605890;margin-bottom:28px}
        .plan-divider{height:1px;background:#1c1840;margin-bottom:24px}
        .plan-features{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:32px}
        .plan-feature{display:flex;align-items:flex-start;gap:10px;font-size:13.5px;color:#c8c0a8;line-height:1.5}
        .feat-dot{color:#c8a030;font-size:10px;margin-top:3px;flex-shrink:0}
        .plan-btn{width:100%;padding:15px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.25s;font-family:'Outfit',sans-serif;border:none;letter-spacing:0.3px;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-gold{background:linear-gradient(135deg,#c8a030,#a07820);color:#060410}
        .btn-gold:hover:not(:disabled){box-shadow:0 10px 28px rgba(200,160,48,0.4);transform:translateY(-2px);filter:brightness(1.08)}
        .btn-outline{background:transparent;border:1px solid #1c1840 !important;color:#605890;cursor:default}
        .btn-purple{background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff}
        .btn-purple:hover:not(:disabled){box-shadow:0 10px 28px rgba(168,85,247,0.3);transform:translateY(-2px)}
        .plan-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none !important}

        /* FEATURES COMPARISON */
        .compare{background:#0d0a22;border:1px solid #1c1840;border-radius:20px;padding:36px;margin-bottom:40px}
        .compare-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:#f0e8d0;margin-bottom:24px}
        .compare-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:16px;padding:12px 0;border-bottom:1px solid #1c1840;align-items:center;font-size:13px}
        .compare-row:last-child{border-bottom:none}
        .compare-header{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#3a3060;padding-bottom:16px;border-bottom:1px solid #1c1840}
        .compare-feature{color:#605890}
        .check-yes{color:#c8a030;font-size:16px;text-align:center}
        .check-no{color:#3a3060;font-size:16px;text-align:center}

        /* FAQ */
        .faq{margin-bottom:40px}
        .faq-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:#f0e8d0;margin-bottom:24px;text-align:center}
        .faq-item{background:#0d0a22;border:1px solid #1c1840;border-radius:12px;padding:20px 24px;margin-bottom:10px}
        .faq-q{font-size:14px;font-weight:500;color:#c8c0a8;margin-bottom:8px}
        .faq-a{font-size:13px;color:#605890;line-height:1.7}

        /* GUARANTEE */
        .guarantee{text-align:center;padding:32px;background:rgba(200,160,48,0.04);border:1px solid rgba(200,160,48,0.15);border-radius:16px;margin-bottom:40px}
        .guarantee-icon{font-size:40px;margin-bottom:12px}
        .guarantee-title{font-family:'Cormorant Garamond',serif;font-size:22px;color:#f0e8d0;margin-bottom:8px}
        .guarantee-text{font-size:13px;color:#605890;line-height:1.7}

        @media(max-width:900px){
          .plans-grid{grid-template-columns:1fr}
          .compare{display:none}
          .page{padding:32px 20px}
        }
      `}</style>

      <div className="page">
        {/* HEADER */}
        <div className="page-tag">✦ Upgrade Your Journey</div>
        <h1 className="page-title serif">
          Unlock Your Full<br /><em>Cosmic Universe</em>
        </h1>
        <p className="page-sub">
          Start free. Upgrade when the stars align.<br />
          Testing mode stays open for now. Billing enforcement can be turned on at launch.
        </p>

        {/* PLANS */}
        <div className="plans-grid">
          {PLANS.map((p) => (
            <div key={p.id} className={`plan ${p.highlight ? "highlight" : ""}`}>
              {p.highlight && <div className="popular-badge">Most Popular</div>}
              <div className="plan-tier">{p.name}</div>
              <div className="plan-price serif">{p.price}</div>
              <div className="plan-period">{p.period}</div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {p.features.map((f, i) => (
                  <li key={i} className="plan-feature">
                    <span className="feat-dot">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`plan-btn ${p.highlight ? "btn-gold" : p.id === "elite" ? "btn-purple" : "btn-outline"}`}
                onClick={() => handleUpgrade(p.id)}
                disabled={p.disabled || loading === p.id}
              >
                {loading === p.id ? "⟳ Processing..." : p.cta}
              </button>
            </div>
          ))}
        </div>

        {/* GUARANTEE */}
        <div className="guarantee">
          <div className="guarantee-icon">🛡️</div>
          <div className="guarantee-title serif">7-Day Money Back Guarantee</div>
          <div className="guarantee-text">
            Not satisfied? Get a full refund within 7 days — no questions asked.<br />
            We are confident you will love AstroLife Premium.
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="compare">
          <div className="compare-title serif">Feature Comparison</div>
          {[
            { feature:"Basic Kundli Chart",           free:true,  premium:true,  elite:true },
            { feature:"AI Chat Questions",            free:"5/mo", premium:"∞",  elite:"∞" },
            { feature:"All Astrology Engines",        free:false, premium:true,  elite:true },
            { feature:"PDF Export (No Watermark)",    free:false, premium:true,  elite:true },
            { feature:"Transit Alerts",               free:false, premium:true,  elite:true },
            { feature:"Family Charts",                free:false, premium:"5",   elite:"∞" },
            { feature:"AI Voice Reports",             free:false, premium:true,  elite:true },
            { feature:"WhatsApp AI Astrologer",       free:false, premium:false, elite:true },
            { feature:"Business Muhurat AI",          free:false, premium:false, elite:true },
            { feature:"White-label Dashboard",        free:false, premium:false, elite:true },
          ].map((row, i) => (
            <div key={i} className={`compare-row ${i === 0 ? "compare-header" : ""}`}>
              <span className="compare-feature">{row.feature}</span>
              <span className="check-yes" style={{textAlign:"center"}}>
                {row.free === true ? "✦" : row.free === false ? <span className="check-no">—</span> : row.free}
              </span>
              <span className="check-yes" style={{textAlign:"center"}}>
                {row.premium === true ? "✦" : row.premium === false ? <span className="check-no">—</span> : row.premium}
              </span>
              <span className="check-yes" style={{textAlign:"center"}}>
                {row.elite === true ? "✦" : row.elite === false ? <span className="check-no">—</span> : row.elite}
              </span>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="faq">
          <div className="faq-title serif">Frequently Asked Questions</div>
          {[
            { q:"Can I cancel anytime?", a:"Yes! Cancel anytime from your account settings. No lock-in, no hidden fees. Your access continues until the end of the billing period." },
            { q:"Is my payment secure?", a:"Absolutely. We use Razorpay — India's most trusted payment gateway. All transactions are encrypted and PCI-DSS compliant." },
            { q:"What happens after I upgrade?", a:"Instant access! All premium features unlock immediately after payment. No waiting, no approval needed." },
            { q:"Do you offer student discounts?", a:"Yes! Students get 30% off on Premium plan. Contact us at support@astrolife.ai with your student ID." },
          ].map((f, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q">✦ {f.q}</div>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
