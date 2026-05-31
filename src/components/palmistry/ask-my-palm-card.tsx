import type { PalmRuleTier } from "@/lib/palmistry/types";
import { canUsePalmistryFeature } from "@/lib/palmistry/product-gating";
import { PalmistryPremiumLock } from "./palmistry-premium-lock";

type AskMyPalmCardProps = {
  userTier: PalmRuleTier;
  sessionId?: string;
};

export function AskMyPalmCard({ userTier, sessionId }: AskMyPalmCardProps) {
  const allowed = canUsePalmistryFeature(userTier, "ask_my_palm");

  if (!allowed) {
    return <PalmistryPremiumLock feature="ask_my_palm" title="Ask My Palm is an Elite Feature" />;
  }

  const href = sessionId
    ? `/dashboard/chat?palmSessionId=${encodeURIComponent(sessionId)}&source=palmistry`
    : "/dashboard/chat";

  return (
    <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-zinc-950 via-black to-stone-950 p-5 shadow-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70">Existing AstroLife AI Chat</p>
      <h3 className="mt-3 text-xl font-bold text-amber-100">Ask My Palm</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Ask questions about this palm report inside your existing AstroLife AI Chat. It will use palmistry context together with Kundli, Dasha, Transit and Numerology context.
      </p>
      <a
        href={href}
        className="mt-5 inline-flex rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-200"
      >
        Ask My Palm
      </a>
    </div>
  );
}
