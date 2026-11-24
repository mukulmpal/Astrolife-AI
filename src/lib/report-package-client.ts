import type { ChartData } from "./astro-engine/calculations";
import { generatePackageDossierHTML } from "./report/package-dossier-html-generator";

export interface PackageDossierMeta {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  pages: string;
  badge: string;
  color: string;
  engines: string[];
}

export const POWER_BUNDLE_DOSSIERS: PackageDossierMeta[] = [
  {
    id: "pkg_union_family",
    title: "💍 Sacred Union & Family Destiny Pack",
    shortTitle: "Sacred Union & Vivah",
    tagline: "4-in-1 Suite: Kundali Milan, Vivah Timing, Family Karma & Mangal Dosha.",
    pages: "24 pages",
    badge: "Top Marital Pack",
    color: "#E11D48",
    engines: ["Ashtakoota 36-Guna", "D-9 Navamsha Partner", "Family Karma Synastry", "Mangal Dosha Mitigation", "Vivah Timing Windows"],
  },
  {
    id: "pkg_wealth_yogas",
    title: "👑 Raja Yoga & Wealth Acceleration Suite",
    shortTitle: "Raja Yoga & Wealth",
    tagline: "4-in-1 Suite: 300+ Classical Yogas, KP Sub-Lord, Numerology & Transit Purchase.",
    pages: "24 pages",
    badge: "High Net-Worth",
    color: "#B8860B",
    engines: ["300+ Classical Yogas", "KP Sub-Lord Career", "Vedic Numerology", "Asset Purchase Timing", "Quarterly Expansion"],
  },
  {
    id: "pkg_bio_remedies",
    title: "🛡️ Bio-Vedic Protection & Sacred Remedy Vault",
    shortTitle: "Bio-Vedic Remedies",
    tagline: "4-in-1 Vault: Advance Gemstone, Astro Dot Therapy, Astro-Tattoo & Lal Kitab.",
    pages: "24 pages",
    badge: "Energy Shield",
    color: "#16A34A",
    engines: ["Gemstone & Rudraksha", "Palm Dot Therapy", "Sacred Mauli Timings", "Astro-Tattoo Geometry", "Lal Kitab Rin Upay"],
  },
  {
    id: "pkg_space_destiny",
    title: "🏡 Space Energy, Palmistry & Destiny Calibration",
    shortTitle: "Astro-Vastu & Space",
    tagline: "4-in-1 Suite: Astro-Vastu Radar, Samudrika Palmistry, BTR & 1-Year Transit Forecast.",
    pages: "24 pages",
    badge: "High Diagnostic",
    color: "#0284C7",
    engines: ["16-Zone Astro-Vastu", "Samudrika Palm Lines", "Mathematical BTR", "1-Year Transit & Sade Sati", "Energy Harmonization"],
  },
  {
    id: "pkg_stock_trading",
    title: "📈 Stock Market, Trading & Speculation Pack",
    shortTitle: "Stock & Market Speculation",
    tagline: "4-in-1 Suite: Sarvatobhadra Hit Radar, Ashtakavarga 337-Bindus, 5th/11th House Speculation.",
    pages: "24 pages",
    badge: "Trader Speculation",
    color: "#059669",
    engines: ["Sarvatobhadra Vedha Rays", "5th/11th House Matrix", "Ashtakavarga 337 Heatmap", "Rahu/Mercury Greed Filter", "Intraday Muhurat"],
  },
  {
    id: "pkg_jaimini_soul",
    title: "🧘 Jaimini Soul Blueprint & Karmic Mission",
    shortTitle: "Jaimini Soul Blueprint",
    tagline: "4-in-1 Suite: Atmakaraka Soul Purpose, Karakamsa Lagna, Chara Dasha & Arudha Lagna.",
    pages: "24 pages",
    badge: "Soul Awakening",
    color: "#7C3AED",
    engines: ["Atmakaraka Soul Matrix", "Karakamsa Ishta Devata", "Arudha Lagna (AL/A10)", "Chara Dasha Timelines", "Karmic Blockage Upay"],
  },
  {
    id: "pkg_ayurvedic_medical",
    title: "⚕️ Ayurvedic Medical & Psychological Vitality Shield",
    shortTitle: "Ayurvedic Medical & Vitality",
    tagline: "4-in-1 Suite: Medical Astrology, Tridosha Balance, Cognitive Stress & Astro-Sound Hz.",
    pages: "24 pages",
    badge: "Vitality & Longevity",
    color: "#0891B2",
    engines: ["6th/8th/12th Organ Audit", "Tridosha Vata/Pitta/Kapha", "Moon/Mercury Stress Map", "Herbal Decoctions", "Solfeggio Planetary Hz"],
  },
  {
    id: "pkg_muhurat_panchang",
    title: "⚡ Golden Muhurat & Auspicious Decision Suite",
    shortTitle: "Golden Muhurat Suite",
    tagline: "4-in-1 Suite: Instant Prashna, Choghadiya & Hora Radar, Transit Purchase & Tithi Audit.",
    pages: "24 pages",
    badge: "Perfect Timing",
    color: "#D97706",
    engines: ["Instant Binary Prashna", "24-Hour Hora & Choghadiya", "Contracts & Legal Muhurat", "Rahu/Gulika Kaal Radar", "Tithi Synchronization"],
  },
];

export async function downloadPackageDossierPDF(
  chart: ChartData,
  packageId: string,
  packageTitle: string
): Promise<void> {
  const response = await fetch("/api/reports/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reportId: packageId,
      reportTitle: packageTitle,
      chart,
      customer: {
        name: chart.name || "Sacred Seeker",
      },
      isSample: false,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string; detail?: string }).error || (err as { detail?: string }).detail || "Package dossier generation failed on server");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const safeName = (chart.name ?? "Dossier")
    .replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "-") || "Dossier";
  const filename = `AstroLife-${packageId}-${safeName}.pdf`;

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    const newTab = window.open(url, "_blank");
    if (!newTab) {
      window.location.href = url;
    }
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export function previewPackageDossierHTML(
  chart: ChartData,
  packageId: string,
  packageTitle: string
): void {
  try {
    const html = generatePackageDossierHTML(chart, {
      reportId: packageId,
      reportTitle: packageTitle,
      customerName: chart.name || "Sacred Seeker",
      isSample: false,
    });
    const win = window.open("", "_blank");
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
    } else {
      alert("Popup blocked by browser. Please allow popups to view report preview.");
    }
  } catch (err) {
    console.error("Package preview error:", err);
    alert("Error generating preview. Please try again.");
  }
}
