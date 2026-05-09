import type { ChartData } from "./astro-engine/calculations";

export interface ShareMessage {
  title: string;
  text: string;
  url: string;
  hashtags: string[];
}

export function generateShareMessage(chart: ChartData, engine: string): ShareMessage {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://astrolife.app";
  const chartUrl = `${baseUrl}/dashboard?chart=${chart.name.replace(/\s+/g, "-")}`;

  const messages: Record<string, ShareMessage> = {
    kundli: {
      title: `My Birth Chart Analysis on AstroLife`,
      text: `Just analyzed my birth chart! 🔯 I'm a ${chart.lagnaRashi} Ascendant with ${chart.planets.Moon?.sign} Moon. My chart shows ${Object.values(chart.planets).filter(p => p.dignity?.includes("Sva")).length}/9 planets in good dignity.`,
      url: chartUrl,
      hashtags: ["astrology", "vedic", "birthchart", "astrolife", "kundli"],
    },
    remedy: {
      title: `My Personalized Remedies from AstroLife`,
      text: `Got my personalized remedy plan! 💎 Specific gems, mantras, and daily practices tailored to my chart. Already feeling the shift! #VedicAstrology`,
      url: chartUrl,
      hashtags: ["remedies", "vedic", "astrology", "gems", "mantras", "healing"],
    },
    prashna: {
      title: `My Prashna (Question Chart) Reading`,
      text: `Asked the universe a question and got my answer via Prashna Kundali! 🎯 The cosmic timing is real. #VedicAstrology #Prashna`,
      url: chartUrl,
      hashtags: ["prashna", "horary", "astrology", "answers", "destiny"],
    },
    career: {
      title: `My Career Forecast from AstroLife`,
      text: `Just got my career forecast! 💼 Knowing the auspicious windows for career changes changes everything. #CareerAstrology #Destiny`,
      url: chartUrl,
      hashtags: ["career", "astrology", "success", "destiny", "timing"],
    },
    marriage: {
      title: `My Marriage Compatibility Check`,
      text: `Ran a compatibility check with my partner! 💑 The stars are aligned! #VedicAstrology #LoveAstrology #Compatibility`,
      url: chartUrl,
      hashtags: ["marriage", "compatibility", "love", "astrology", "soulmate"],
    },
  };

  return messages[engine] || messages.kundli;
}

export function shareToWhatsApp(message: ShareMessage) {
  const text = encodeURIComponent(`${message.title}\n\n${message.text}\n\n${message.url}\n\n${message.hashtags.map(h => `#${h}`).join(" ")}`);
  const whatsappUrl = `https://wa.me/?text=${text}`;
  window.open(whatsappUrl, "_blank");
}

export function shareToTwitter(message: ShareMessage) {
  const text = encodeURIComponent(`${message.text} ${message.url} ${message.hashtags.map(h => `#${h}`).join(" ")}`);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(twitterUrl, "_blank");
}

export function shareToFacebook(message: ShareMessage) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message.url)}&quote=${encodeURIComponent(message.text)}`;
  window.open(facebookUrl, "_blank");
}

export function shareToLinkedIn(message: ShareMessage) {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(message.url)}`;
  window.open(linkedInUrl, "_blank");
}

export function shareToEmail(message: ShareMessage) {
  const subject = encodeURIComponent(message.title);
  const body = encodeURIComponent(`${message.text}\n\n${message.url}`);
  const emailUrl = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = emailUrl;
}

export function copyToClipboard(message: ShareMessage) {
  const fullMessage = `${message.title}\n\n${message.text}\n\n${message.url}\n\n${message.hashtags.map(h => `#${h}`).join(" ")}`;
  navigator.clipboard.writeText(fullMessage);
  return true;
}
