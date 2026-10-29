"use client";

import Link from "next/link";
import { isBillingEnforced, isFullAccessEnabled, canAccessTier, SubscriptionTier } from "@/lib/access";
import { useUserTier } from "@/context/ChartContext";

type PremiumFeatureProps = {
  children: React.ReactNode;
  feature: string;
  requiredTier?: "premium" | "elite";
  enforceLock?: boolean;
};

export function PremiumFeature({
  children,
  feature,
  requiredTier = "premium",
  enforceLock,
}: PremiumFeatureProps) {
  const { userTier, isElite } = useUserTier();
  const fullAccess = isFullAccessEnabled();

  if (fullAccess) {
    return <>{children}</>;
  }

  const enforced = enforceLock ?? isBillingEnforced();
  const hasAccess = isElite || canAccessTier(requiredTier, userTier);
  const isLocked = enforced && !hasAccess;

  const isEliteReq = requiredTier === "elite";
  const targetName = isEliteReq ? "💎 Elite" : "👑 Pro";
  const upgradeCta = isEliteReq ? "Upgrade to Elite 💎" : "Upgrade to Pro 👑";
  const currentPlanLabel = isElite
    ? "💎 Elite"
    : userTier === "premium"
    ? "👑 Pro"
    : "🌱 Basic";

  return (
    <>
      <style>{`
        .premium-gate{margin-bottom:18px;border-radius:14px;padding:12px 18px;border:1px solid;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;transition:all 0.2s ease}
        .premium-gate-copy{display:flex;flex-direction:column;gap:3px}
        .premium-gate-badge{display:inline-flex;align-items:center;width:fit-content;padding:2px 9px;border-radius:999px;font-size:10px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700}
        .premium-gate-title{font-size:13px;font-weight:600;color:#1A1A1A}
        .premium-gate-sub{font-size:11.5px;color:#5A5248;line-height:1.5}
        .premium-gate-cta{display:inline-flex;align-items:center;justify-content:center;padding:8px 16px;border-radius:9px;text-decoration:none;font-size:12px;font-weight:700;white-space:nowrap;transition:all 0.15s ease}
        
        .premium-gate.elite-locked{background:rgba(168,85,247,0.06);border-color:rgba(168,85,247,0.25)}
        .premium-gate.elite-locked .premium-gate-badge{background:rgba(168,85,247,0.15);color:#9333ea;border:1px solid rgba(168,85,247,0.35)}
        .premium-gate.elite-locked .premium-gate-cta{background:linear-gradient(135deg,#a855f7,#7c3aed);color:#FAF7F2;box-shadow:0 3px 12px rgba(168,85,247,0.3)}

        .premium-gate.pro-locked{background:rgba(200,160,48,0.07);border-color:rgba(200,160,48,0.28)}
        .premium-gate.pro-locked .premium-gate-badge{background:rgba(200,160,48,0.16);color:#b8860b;border:1px solid rgba(200,160,48,0.35)}
        .premium-gate.pro-locked .premium-gate-cta{background:linear-gradient(135deg,#c8a030,#a07820);color:#FAF7F2;box-shadow:0 3px 12px rgba(200,160,48,0.3)}

        .premium-feature-shell{position:relative;width:100%}
        .premium-feature-shell.locked .premium-feature-content{filter:blur(10px) grayscale(20%);opacity:0.22;pointer-events:none;user-select:none;max-height:560px;overflow:hidden}
        .premium-feature-overlay{position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;padding-top:60px;z-index:30}
        .premium-feature-card{max-width:440px;width:90%;text-align:center;background:rgba(255,255,255,0.95);border:1.5px solid ${isEliteReq ? "rgba(168,85,247,0.45)" : "rgba(200,160,48,0.45)"};border-radius:20px;padding:32px 24px;box-shadow:0 18px 48px rgba(0,0,0,0.14);backdrop-filter:blur(16px)}
        .premium-feature-card-title{font-family:"Cormorant Garamond",serif;font-size:24px;font-weight:700;color:#1A1A1A;margin-bottom:8px}
        .premium-feature-card-text{font-size:13px;color:#5A5248;line-height:1.6;margin-bottom:20px}
        .premium-feature-card-cta{display:inline-flex;align-items:center;justify-content:center;padding:12px 24px;border-radius:12px;background:${isEliteReq ? "linear-gradient(135deg,#a855f7,#7c3aed)" : "linear-gradient(135deg,#c8a030,#a07820)"};color:#FAF7F2;text-decoration:none;font-size:13.5px;font-weight:700;box-shadow:${isEliteReq ? "0 4px 18px rgba(168,85,247,0.35)" : "0 4px 18px rgba(200,160,48,0.35)"};transition:all 0.15s ease}
        .premium-feature-card-cta:hover{transform:translateY(-1px);box-shadow:${isEliteReq ? "0 6px 24px rgba(168,85,247,0.5)" : "0 6px 24px rgba(200,160,48,0.5)"}}
      `}</style>

      {isLocked && (
        <div className={`premium-gate ${isEliteReq ? "elite-locked" : "pro-locked"}`}>
          <div className="premium-gate-copy">
            <span className="premium-gate-badge">
              🔒 Locked for {currentPlanLabel}
            </span>
            <div className="premium-gate-title">{feature} — {targetName} Exclusive Engine</div>
            <div className="premium-gate-sub">
              {isEliteReq
                ? "यह एडवांस्ड मॉड्यूल केवल 💎 Elite सदस्यों के लिए उपलब्ध है।"
                : "यह एडवांस्ड मॉड्यूल 👑 Pro और 💎 Elite सदस्यों के लिए उपलब्ध है।"}
            </div>
          </div>
          <Link href="/dashboard/upgrade" className="premium-gate-cta">
            {upgradeCta}
          </Link>
        </div>
      )}

      <div className={`premium-feature-shell ${isLocked ? "locked" : ""}`}>
        <div className="premium-feature-content">{children}</div>
        {isLocked && (
          <div className="premium-feature-overlay">
            <div className="premium-feature-card">
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
              <div className="premium-feature-card-title">{feature}</div>
              <div className="premium-feature-card-text">
                {isEliteReq
                  ? `यह उच्च-स्तरीय वैदिक इंजन केवल 💎 Elite सदस्यों के लिए उपलब्ध है। अपने ${currentPlanLabel} प्लान को अपग्रेड करके तुरंत संपूर्ण एक्सेस प्राप्त करें।`
                  : `यह शक्तिशाली मॉड्यूल केवल 👑 Pro और 💎 Elite सदस्यों के लिए उपलब्ध है। अपने ${currentPlanLabel} प्लान को अपग्रेड करके तुरंत अनलॉक करें।`}
              </div>
              <Link href="/dashboard/upgrade" className="premium-feature-card-cta">
                {upgradeCta}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
