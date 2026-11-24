// src/lib/report/clinical-predictive-sections.ts
// ============================================================================
// AstroLife — Modular Clinical, Karmic & Predictive PDF Report Sections
// Standalone, deterministic, print-ready pages covering the 9 advanced engines:
// 1. 27 Transit Shivling Upacharas & Sacred Offerings
// 2. 27 Nakshatra Social Archetypes & Service Registry
// 3. Speculative Trading & F&O Risk Circuit Breaker (with SEBI Guardrail)
// 4. 12th House Sacred Currency (Sampada) & Incubation Protocol
// 5. D10 Dashamsha Career Niche Specifier
// 6. Moon Dispositor Health & Degree Timing (with Clinical Medical Guardrail)
// 7. Functional Debility Superpowers & Gemstone Fallacy Guard
// 8. Lineage Karma, Kula Devata & 7-Layer Pitru Synthesis
// 9. 12 Jyotirlinga Pilgrimage Sanctuary & 40-Day Energy Assimilation
// ============================================================================

import type { ChartData } from "../astro-engine/calculations";
import { evaluateTransitNakshatraRemedy } from "../astro-engine/transit-nakshatra-remedies";
import { evaluateNakshatraRemedyDossier } from "../astro-engine/nakshatra-remedy-engine";
import { evaluateTradingRisk } from "../astro-engine/trading-risk-guardrail";
import {
  evaluateTwelfthHouseIntelligence,
  TWELFTH_HOUSE_SAMPADA_REGISTRY,
} from "../astro-engine/twelfth-house-intelligence";
import { evaluateCareerSpecifier } from "../astro-engine/career-specifier";
import { evaluateMoonDispositorHealthTiming } from "../astro-engine/transit-health-timing";
import {
  evaluateFunctionalDebilityGemstoneGuard,
  evaluateNadiDebilityPeak,
  FUNCTIONAL_DEBILITY_REGISTRY,
} from "../astro-engine/functional-debility-guard";
import { calculateLineageKarma } from "../astro-engine/lineage-karma";
import { resolvePilgrimagePrescription } from "../astro-engine/pilgrimage-engine";
import {
  getTwelfthHouseI18n,
  getCareerSpecifierI18n,
  getTradingRiskI18n,
  getShivlingUpacharaI18n,
  getNakshatraSocialI18n,
  REPORT_LABELS,
  type ReportLang,
} from "./report-i18n";

// ── Helpers & Styling Primitives ─────────────────────────────────────────────

function esc(value: unknown): string {
  const s = value == null ? "" : typeof value === "string" ? value : String(value);
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const BRAND_MARK_SVG = `<svg class="brand-mark" viewBox="-12 -12 24 24"><circle r="10" stroke="var(--gold)" stroke-width="0.6" fill="none"/><polygon points="0,-6 5.2,3 -5.2,3" fill="none" stroke="var(--gold)" stroke-width="0.6"/><polygon points="0,6 5.2,-3 -5.2,-3" fill="none" stroke="var(--gold)" stroke-width="0.6"/><circle r="1.5" fill="var(--gold)"/></svg>`;

function pageRail(chapter: string, pagenum: string): string {
  return `<div class="page-rail" style="position:relative;z-index:2;">
    <div class="brand">${BRAND_MARK_SVG}AstroLife</div>
    <div class="chapter">${esc(chapter)}</div>
    <div class="pagenum">${esc(pagenum)}</div>
  </div>`;
}

function pageFoot(left: string, right: string): string {
  return `<div class="page-foot"><span>${esc(left)}</span><span>${esc(right)}</span></div>`;
}

// ── 1. Page: 27 Transit Shivling Upacharas & Sacred Offerings ────────────────
export function pageTransitShivlingUpacharas(chart: ChartData, pageNum = "SU", lang: ReportLang = "en"): string {
  const transitRemedy = evaluateTransitNakshatraRemedy(chart);
  if (!transitRemedy) {
    return `<section class="page dense${lang === "hi" ? " hindi" : ""}">${pageRail("Transit Shivling Upacharas", pageNum)}
      <div style="padding:48px;color:var(--ivory-dim);">${lang === "hi" ? "इस कुंडली के लिए गोचर गणना लंबित है।" : "Transit calculations pending for this chart."}</div>
      ${pageFoot("astrolife · sacred remedies", "Shivling Upachara")}
    </section>`;
  }

  const shiv = transitRemedy.shivlingRemedy;
  const adShiv = transitRemedy.antardashaShivlingRemedy;
  const takYog = transitRemedy.distanceAnalysis;
  const belief = transitRemedy.beliefGuidanceHinglish;

  const i18nShiv = getShivlingUpacharaI18n(lang, transitRemedy.transitNakshatra, shiv.upacharaName, shiv.hindiTitle);
  const isEn = lang === "en";

  return `<section class="page dense${lang === "hi" ? " hindi" : ""}">
    ${pageRail("Transit Nakshatra Shivling Engine · 27 Upacharas", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>${isEn ? "Transit Nakshatra Shivling Upacharas" : "गोचर नक्षत्र 27 शिवलिंग उपचारावली"}</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        ${isEn 
          ? "Based on classical Shastric texts and oral traditions: The active Dasha Lord's transit nakshatra determines the exact vibrational medicine for the soul. Aligning daily Shivling offerings with the transit star transmutes friction into Grace."
          : "शास्त्रीय परंपरा के अनुसार दशा स्वामी का गोचर नक्षत्र आत्मा के लिए सटीक उपचारात्मक स्पंदन निर्धारित करता है। गोचर तारा के अनुसार शिवलिंग सेवा संघर्ष को अनुग्रह में रूपांतरित करती है।"}
      </div>

      <!-- Mahadasha Lord Hero Card -->
      <div class="card" style="padding:14px;border-left:3px solid var(--gold);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div class="kicker" style="color:var(--gold-bright);">${isEn ? "Mahadasha Lord Transit:" : "महादशा स्वामी गोचर:"} ${esc(transitRemedy.activeDashaLord)}</div>
          <span style="font-size:10px;padding:2px 8px;border-radius:3px;background:var(--surface);color:var(--gold);border:1px solid var(--gold-dim);">
            Tara #${transitRemedy.taraNumber} · ${esc(transitRemedy.taraName)} (${esc(transitRemedy.taraRelationType)})
          </span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:12px;margin-bottom:8px;">
          <div>
            <div style="font-size:10px;color:var(--ivory-mute);text-transform:uppercase;">${isEn ? "Transit Placement" : "गोचर स्थिति"}</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--ivory);">${esc(transitRemedy.transitSign)} · Star #${transitRemedy.transitNakshatraNumber}</div>
            <div style="font-size:12px;color:var(--gold);">${esc(transitRemedy.transitNakshatra)}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--ivory-mute);text-transform:uppercase;">${isEn ? `Prescribed Upachara (#${shiv.upacharaNumber})` : `निर्धारित उपचार (#${shiv.upacharaNumber})`}</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--gold-bright);">${esc(i18nShiv.title)}</div>
            <div style="font-size:11px;color:var(--ivory);margin-top:2px;"><strong>${isEn ? "Offering Material:" : "पूजन सामग्री:"}</strong> ${esc(isEn ? i18nShiv.offeringMaterial : shiv.itemOrOffering)}</div>
          </div>
        </div>
        <div class="body-s" style="font-size:11px;color:var(--ivory-dim);border-top:1px solid var(--surface);padding-top:6px;margin-top:4px;">
          <strong>${isEn ? "Significance:" : "महत्व:"}</strong> ${esc(isEn ? i18nShiv.significance : shiv.significanceHinglish)}
        </div>
        <div class="body-s" style="font-size:11px;color:var(--ivory-dim);margin-top:4px;">
          <strong>${isEn ? "Vidhi (Procedure):" : "विधि:"}</strong> ${esc(isEn ? i18nShiv.procedure : shiv.procedureNarrativeHinglish)}
        </div>
      </div>

      <!-- Antardasha & Tak Yog Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        ${adShiv ? `<div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">${isEn ? "Antardasha Lord:" : "अंतर्दशा स्वामी:"} ${esc(transitRemedy.activeAntardashaLord)}</div>
          <div style="font-size:12px;color:var(--ivory);font-weight:600;">Transit in ${esc(transitRemedy.antardashaTransitNakshatra)} (${esc(transitRemedy.antardashaTransitSign)})</div>
          <div style="font-size:11px;color:var(--gold-bright);margin-top:4px;">Upachara #${adShiv.upacharaNumber}: ${esc(adShiv.upacharaName)}</div>
          <div style="font-size:10px;color:var(--ivory-dim);margin-top:4px;">Offering: ${esc(isEn ? "Pure water & Bilva leaf" : adShiv.itemOrOffering)}</div>
        </div>` : ""}

        <div class="card" style="padding:12px;border-left:3px solid ${takYog?.isTakYog ? "var(--crimson)" : "var(--jade)"};">
          <div class="kicker" style="color:${takYog?.isTakYog ? "var(--crimson)" : "var(--jade)"};margin-bottom:4px;">MD-AD Harmonics & Tak Yog (${esc(takYog?.mutualAxis ?? "1/7")})</div>
          <div style="font-size:12px;color:var(--ivory);font-weight:600;">${isEn ? (takYog?.isTakYog ? "6/8 Axis Friction Active" : "Harmonic Cooperative Flow") : esc(takYog?.impactDescriptionHinglish ?? "Harmonic Flow")}</div>
          <div style="font-size:10px;color:var(--ivory-dim);margin-top:4px;">
            ${isEn 
              ? (takYog?.isTakYog ? "Mutual 6/8 distance requires patience; perform pacification remedies." : "Dasha and Antardasha lords operate in cooperative synergy. No 6/8 Tak Yog obstruction active.") 
              : (takYog?.isTakYog ? esc(takYog.takYogRemedyHinglish ?? "6/8 घर्षण सक्रिय है।") : "दशा और अंतर्दशा स्वामी परस्पर सहयोग में हैं। कोई 6/8 टकराव नहीं।")}
          </div>
        </div>
      </div>

      <!-- House 6, 8, 12 Practical Regimen -->
      <div class="card" style="padding:12px;background:var(--surface);">
        <div class="kicker" style="color:var(--saffron);margin-bottom:6px;">6th, 8th & 12th House Remedial Matrix</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:10px;font-weight:700;color:var(--jade);">6th House: Plants & Seva</div>
            <div style="font-size:9px;color:var(--ivory-dim);margin-top:3px;">${isEn ? "Care for tulsi or green healing plants on Wednesdays; avoid speculative arguments." : esc(belief.house6MessageHinglish)}</div>
          </div>
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:10px;font-weight:700;color:var(--gold);">8th House: Fruits & Release</div>
            <div style="font-size:9px;color:var(--ivory-dim);margin-top:3px;">${isEn ? "Offer seasonal fruits on Tuesdays or Amavasya to dissolve sudden hurdles." : "अमावस्या या मंगलवार को मौसमी फल दान करने से आकस्मिक संकट दूर होते हैं।"}</div>
          </div>
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:10px;font-weight:700;color:var(--crimson);">12th House: Quiet Sanctuary</div>
            <div style="font-size:9px;color:var(--ivory-dim);margin-top:3px;">${isEn ? "Direct expenditures toward temple/hospital charity; keep private retreats sacred." : esc(belief.house12MessageHinglish)}</div>
          </div>
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · sacred remedies", "Transit Shivling Upacharas")}
  </section>`;
}

// ── 2. Page: 27 Nakshatra Social Archetypes & Service Registry ───────────────
export function pageNakshatraSocialRegistry(chart: ChartData, pageNum = "NS", lang: ReportLang = "en"): string {
  const dossier = evaluateNakshatraRemedyDossier(chart);
  if (!dossier) {
    return `<section class="page dense${lang === "hi" ? " hindi" : ""}">${pageRail("Nakshatra Social Archetypes", pageNum)}
      <div style="padding:48px;color:var(--ivory-dim);">${lang === "hi" ? "नक्षत्र विवरण लंबित है।" : "Nakshatra dossier pending."}</div>
      ${pageFoot("astrolife · karmic alignment", "Nakshatra Social Registry")}
    </section>`;
  }

  const isEn = lang === "en";
  const i18nNak = getNakshatraSocialI18n(lang, dossier.activeNakshatraName, dossier.activeDashaPlanet);

  return `<section class="page dense${lang === "hi" ? " hindi" : ""}">
    ${pageRail("Nakshatra Social Remedies & Living Archetypes", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>${isEn ? "Nakshatra Archetype & Social Service" : "नक्षत्र स्वरूप एवं सामाजिक सेवा"}</h2>
      </div>

      <div class="body-s" style="margin-bottom:12px;max-width:680px;color:var(--ivory-dim);">
        ${isEn
          ? `Each Nakshatra carries an evolutionary psychological archetype and a specific social service (Karmic Debt release). Active Dasha Lord Star: <strong style="color:var(--gold-bright);">${esc(dossier.activeNakshatraName)}</strong> (${esc(dossier.activeDashaPlanet)}).`
          : `प्रत्येक नक्षत्र एक विशिष्ट मनोवैज्ञानिक स्वरूप और पितृ/सामाजिक ऋण मुक्ति की सेवा का वाहक है। दशा स्वामी नक्षत्र: <strong style="color:var(--gold-bright);">${esc(dossier.activeNakshatraName)}</strong> (${esc(dossier.activeDashaPlanet)})।`}
      </div>

      <!-- Archetype Story & Personality -->
      <div class="card" style="padding:14px;border-left:3px solid var(--gold);margin-bottom:10px;">
        <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">${isEn ? "Living Archetype & Psychological Temperament" : "जीवंत स्वरूप व मनोवैज्ञानिक स्वभाव"}</div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;margin-bottom:6px;">
          ${esc(i18nNak.innerState)}
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);line-height:1.5;">
          ${esc(i18nNak.livingArchetype)}
        </div>
      </div>

      <!-- Karmic Trap Warning & Daily Conduct -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--crimson);">
          <div class="kicker" style="color:var(--crimson);margin-bottom:4px;">${isEn ? "Karmic Trap & Warning" : "कर्मिक भटकाव व क्रोध चेतावनी"}</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(i18nNak.karmicTrap)}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid var(--jade);">
          <div class="kicker" style="color:var(--jade);margin-bottom:4px;">${isEn ? "Daily Conduct Protocol" : "दैनिक आचरण व जीवन-नियम"}</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(i18nNak.dailyConduct)}
          </div>
        </div>
      </div>

      <!-- Actionable Seva Plan & Checklist -->
      <div class="card" style="padding:12px;background:var(--surface);margin-bottom:10px;">
        <div class="kicker" style="color:var(--saffron);margin-bottom:6px;">${isEn ? "Targeted Social Seva & Action Protocol" : "सटीक सामाजिक सेवा व कर्म सुधार"}</div>
        <div style="font-size:11px;color:var(--ivory);margin-bottom:8px;">${esc(i18nNak.primarySeva)}</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:9px;color:var(--gold-dim);text-transform:uppercase;">${isEn ? "Primary Seva" : "प्रधान सेवा"}</div>
            <div style="font-size:9.5px;color:var(--ivory);line-height:1.35;margin-top:2px;">${esc(i18nNak.primarySeva)}</div>
          </div>
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:9px;color:var(--gold-dim);text-transform:uppercase;">${isEn ? "Creature Seva" : "जीव सेवा"}</div>
            <div style="font-size:9.5px;color:var(--ivory);line-height:1.35;margin-top:2px;">${esc(i18nNak.pashuSeva)}</div>
          </div>
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:9px;color:var(--gold-dim);text-transform:uppercase;">${isEn ? "Auspicious Timing" : "शुभ समय"}</div>
            <div style="font-size:9.5px;color:var(--ivory);line-height:1.35;margin-top:2px;">${esc(i18nNak.timing)}</div>
          </div>
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:9px;color:var(--gold-dim);text-transform:uppercase;">${isEn ? "Key Elements" : "पूजन सामग्री"}</div>
            <div style="font-size:9.5px;color:var(--ivory);line-height:1.35;margin-top:2px;">${esc(
              dossier.materialsNeeded
                .map((m: string) => (isEn ? (m === "Mitti ke bartan" ? "Earthen clay vessel" : m === "Satnaja (7 grains)" ? "Seven sacred grains (Satnaja)" : m === "Shuddh paani" ? "Pure water" : m) : (m === "Mitti ke bartan" ? "मिट्टी के पात्र" : m === "Satnaja (7 grains)" ? "सतनजा (सात धान्य)" : m === "Shuddh paani" ? "शुद्ध जल" : m)))
                .join(", ") || (isEn ? "Standard sacred offerings" : "सामान्य पूजन सामग्री")
            )}</div>
          </div>
        </div>
      </div>

      <!-- Elemental Vehicle -->
      ${(() => {
        const titleLower = (dossier.elementalVehicleTitle || "").toLowerCase();
        let evTitle = isEn ? "Earth Grounding & Soil Imprint (Prithvi Trikona)" : "भूमि समर्पण एवं मृदा शुद्धि (पृथ्वी त्रिकोण)";
        let evExp = isEn
          ? "Because the active dasha planet occupies an earth house (2, 6, or 10), grounding its material vibration into mother earth neutralizes erratic karmic friction."
          : "क्योंकि संबंधित दशा स्वामी 2, 6 या 10 भाव (पृथ्वी त्रिकोण) में स्थित है, पृथ्वी तत्व आक्रामक ऊर्जा को अवशोषित कर शांत करता है।";
        let evProc = isEn
          ? "Offer grain, iron, or natural clay items into clean soil near tree roots on auspicious days."
          : "संबंधित सामग्री को किसी वृक्ष की जड़ के समीप स्वच्छ मिट्टी में अर्पित करें।";

        if (titleLower.includes("agni") || titleLower.includes("deepak") || titleLower.includes("havan")) {
          evTitle = isEn ? "Sacred Fire & Flame Archana (Agni Trikona)" : "पवित्र अग्नि एवं दीप अर्चन (अग्नि त्रिकोण)";
          evExp = isEn
            ? "Because the active planet occupies a fire house (1, 5, or 9), sacred flame is the primary vibrational vehicle to transmute dense karma into golden clarity."
            : "क्योंकि संबंधित ग्रह 1, 5 या 9 भाव (अग्नि त्रिकोण) में स्थित है, पवित्र अग्नि समस्त दूषित ऊर्जा को भस्म कर शुद्ध कुंदन बनाती है।";
          evProc = isEn
            ? "Light a pure cow-ghee lamp at sunrise facing east with the planet's mantra or Gayatri mantra."
            : "गाय के शुद्ध घी का दीपक जलाएं अथवा बीज मंत्र से सूक्ष्म हवन करें।";
        } else if (titleLower.includes("vayu") || titleLower.includes("mantra") || titleLower.includes("dhwani")) {
          evTitle = isEn ? "Sound Current & Mantra Vibration (Vayu Trikona)" : "मंत्र ध्वनि एवं वायु स्पंदन (वायु त्रिकोण)";
          evExp = isEn
            ? "Because the active planet occupies an air house (3, 7, or 11), rhythmic vocal and mental sound vibrations re-align subtle neurological pathways."
            : "क्योंकि संबंधित ग्रह 3, 7 या 11 भाव (वायु त्रिकोण) में स्थित है, शब्द तरंगों व मंत्र ध्वनि से मानसिक आवरण शुद्ध होता है।";
          evProc = isEn
            ? "Recite the planetary beej mantra aloud or silently during conscious morning breathwork in open air."
            : "खुली हवा में बैठकर प्राणायाम के साथ ग्रह के बीज मंत्र का स्पष्ट जप करें।";
        } else if (titleLower.includes("jal") || titleLower.includes("water") || titleLower.includes("pravah")) {
          evTitle = isEn ? "Flowing Water Dissolution (Jala Trikona)" : "जल प्रवाह एवं कर्म विसर्जन (जल त्रिकोण)";
          evExp = isEn
            ? "Because the active planet occupies a water house (4, 8, or 12), clean flowing water washes away inherited energetic burdens and stagnant karma."
            : "क्योंकि संबंधित ग्रह 4, 8 या 12 भाव (जल त्रिकोण) में स्थित है, स्वच्छ बहता जल संचित कर्मों और दूषित ऊर्जा को बहा ले जाता है।";
          evProc = isEn
            ? "Float natural offerings into clean running streams or rivers with humble surrender; never in stagnant water."
            : "संबंधित सामग्री को बहते स्वच्छ जल में श्रद्धापूर्वक विसर्जित करें।";
        }

        return `<div class="card" style="padding:10px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:2px;">${esc(evTitle)}</div>
          <div style="font-size:10px;color:var(--ivory-dim);">${esc(evExp)} — <em>${esc(evProc)}</em></div>
        </div>`;
      })()}
    </div>
    ${pageFoot("astrolife · karmic alignment", "Nakshatra Social Registry")}
  </section>`;
}

// ── 3. Page: Speculative Trading & F&O Risk Circuit Breaker ──────────────────
export function pageTradingRiskCircuitBreaker(chart: ChartData, pageNum = "TR", lang: ReportLang = "en"): string {
  const activeMD = chart.dashas?.find((d) => d.active) ?? chart.dashas?.[0];
  const fifthLordAfflicted = Boolean(chart.planets.Rahu?.house === 5 || chart.planets.Saturn?.house === 5);
  const rahuIn5812 = Boolean([5, 8, 12].includes(chart.planets.Rahu?.house || 0));
  const moonAfflicted = Boolean(
    [chart.planets.Saturn?.house, chart.planets.Mars?.house, chart.planets.Rahu?.house].includes(
      chart.planets.Moon?.house
    )
  );
  const activeDasha812 = Boolean(activeMD?.planet === "Saturn" || activeMD?.planet === "Rahu");

  const risk = evaluateTradingRisk({
    fifthLordAfflicted,
    rahuInFifthEighthOrTwelfth: rahuIn5812,
    moonAfflictedBySaturnMarsRahu: moonAfflicted,
    activeDashaEighthOrTwelfth: activeDasha812,
    hasSubstantialLossesOrDebt: false,
  });

  const isSevere = risk.speculativeRuinRisk === "CRITICAL" || risk.speculativeRuinRisk === "HIGH";
  const isEn = lang === "en";
  const i18nRisk = getTradingRiskI18n(lang, risk.isRevengeTradingActive || isSevere);

  return `<section class="page dense${lang === "hi" ? " hindi" : ""}">
    ${pageRail("Trading Risk Guardrail · F&O Circuit Breaker", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:${isSevere ? "var(--crimson)" : "var(--jade)"};">✦</span>
        <h2>${isEn ? "Trading & Speculative Risk Guardrail" : "ट्रेडिंग व सट्टा जोखिम गार्डरेल"}</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        ${isEn
          ? "Astrological analysis of speculative ruin vectors in Derivatives (F&O), Intraday Trading, and Revenge Trading spirals. This engine detects the 5th/8th house karmic trap and enforces an immediate capital-protection circuit breaker."
          : "डेरिवेटिव्स (F&O) एवं सट्टे में पूंजी विनाश के ज्योतिषीय कारणों का विश्लेषण। यह इंजन 5वें/8वें भाव के कर्मिक भटकाव को पहचानकर तत्काल पूंजी सुरक्षा गार्डरेल लागू करता है।"}
      </div>

      <!-- Risk Status Banner -->
      <div class="card" style="padding:14px;border-left:4px solid ${isSevere ? "var(--crimson)" : "var(--jade)"};background:var(--surface);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div>
            <div class="kicker" style="color:var(--ivory-mute);">${isEn ? "Speculative Ruin Probability" : "पूंजी जोखिम स्तर"}</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:24px;color:${isSevere ? "var(--crimson)" : "var(--jade)"};font-weight:700;">
              ${risk.speculativeRuinRisk} ${isEn ? "RISK" : "जोखिम"}
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:10px;color:var(--ivory-mute);text-transform:uppercase;">${isEn ? "Revenge Trading Loop" : "रिवेंज ट्रेडिंग चक्र"}</div>
            <div style="font-size:13px;font-weight:700;color:${risk.isRevengeTradingActive ? "var(--crimson)" : "var(--jade)"};">
              ${risk.isRevengeTradingActive ? (isEn ? "ACTIVE SPIRAL" : "सक्रिय जोखिम") : (isEn ? "CONTROLLED" : "नियंत्रित")}
            </div>
          </div>
        </div>
        <div style="font-size:11px;color:var(--ivory);margin-top:6px;line-height:1.5;">
          ${esc(isEn ? i18nRisk.psychologicalDiagnosis : risk.psychologicalDiagnosisHinglish)}
        </div>
      </div>

      <!-- Astrological Circuit & Action Directive -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--gold);">
          <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">${isEn ? "Astrological Circuit Logic" : "ज्योतिषीय कारक विश्लेषण"}</div>
          <div style="font-size:11px;color:var(--ivory-dim);line-height:1.4;">
            ${isEn
              ? "The 5th and 8th house karmic axis under nodal or malefic stress creates intense greed for rapid capital recovery, precipitating compounding drawdowns."
              : esc(risk.astrologicalCircuitHinglish)}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid ${isSevere ? "var(--crimson)" : "var(--cyan)"};">
          <div class="kicker" style="color:${isSevere ? "var(--crimson)" : "var(--cyan)"};margin-bottom:4px;">${isEn ? "Circuit Breaker Directive" : "सुरक्षात्मक निर्देश"}</div>
          <div style="font-size:11px;color:var(--ivory);font-weight:600;margin-bottom:4px;">
            ${esc(i18nRisk.circuitBreakerActionText)}
          </div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(isEn ? i18nRisk.mandatoryGuardrail : risk.mandatoryFinancialGuardrailHinglish)}
          </div>
        </div>
      </div>

      <!-- Career Pivot Protocol -->
      <div class="card" style="padding:12px;border-left:3px solid var(--jade);margin-bottom:14px;">
        <div class="kicker" style="color:var(--jade);margin-bottom:4px;">${isEn ? "Reconstruction & Career Pivot Directive" : "पुनर्निर्माण व आजीविका दिशा-निर्देश"}</div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;">
          ${esc(isEn ? i18nRisk.careerPivotDirective : risk.careerPivotDirectiveHinglish)}
        </div>
      </div>

      <!-- Mandatory SEBI Disclaimer -->
      <div style="padding:10px;background:rgba(217,83,79,0.08);border:1px solid rgba(217,83,79,0.3);border-radius:4px;">
        <div style="font-size:9px;color:var(--crimson);font-weight:700;margin-bottom:2px;letter-spacing:${isEn ? "0.05em" : "0"};text-transform:${isEn ? "uppercase" : "none"};">
          ${isEn ? "Mandatory Statutory &amp; Financial Disclaimer" : "वैधानिक एवं वित्तीय अस्वीकरण"}
        </div>
        <div style="font-size:9px;color:var(--ivory-dim);line-height:1.35;">
          ${isEn
            ? "This evaluation is an astrological character and behavioral risk assessment based on classical Jyotish planetary configurations. AstroLife AI is NOT a SEBI-registered investment advisor or research analyst. No content on this page constitutes financial advice, trading calls, or buy/sell recommendations. F&O trading carries extreme capital risk. Consult a licensed financial planner."
            : "यह विश्लेषण पारंपरिक ज्योतिषीय ग्रह विन्यास पर आधारित व्यवहारिक जोखिम मूल्यांकन है। एस्ट्रोलाइफ कोई सेबी-पंजीकृत सलाहकार नहीं है। यह सामग्री वित्तीय या व्यापारिक सलाह नहीं है।"}
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · financial guardrail", "Trading Risk Circuit Breaker")}
  </section>`;
}

// ── 4. Page: 12th House Sacred Currency (Sampada) & Incubation ───────────────
const RASHI_LORDS_12H = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

export function pageTwelfthHouseSecretWealth(chart: ChartData, pageNum = "12H", lang: ReportLang = "en"): string {
  const lagna = chart.lagnaRashi || "Aries";
  const lagnaNum = chart.lagnaNum ?? 0;
  const activeMD = chart.dashas?.find((d) => d.active)?.planet || "Jupiter";

  const h4Lord = RASHI_LORDS_12H[(lagnaNum + 4 - 1) % 12];
  const h6Lord = RASHI_LORDS_12H[(lagnaNum + 6 - 1) % 12];
  const h8Lord = RASHI_LORDS_12H[(lagnaNum + 8 - 1) % 12];
  const h12Lord = RASHI_LORDS_12H[(lagnaNum + 12 - 1) % 12];

  const fourthLordHouse = chart.planets[h4Lord]?.house ?? 4;
  const sixthLordHouse = chart.planets[h6Lord]?.house ?? 6;
  const eighthLordHouse = chart.planets[h8Lord]?.house ?? 8;
  const twelfthLordHouse = chart.planets[h12Lord]?.house ?? 12;

  const result = evaluateTwelfthHouseIntelligence(
    lagna,
    fourthLordHouse,
    activeMD,
    h12Lord,
    sixthLordHouse,
    eighthLordHouse,
    twelfthLordHouse
  );

  const sampada = result.sampadaProfile;
  const isEn = lang === "en";
  const i18n12H = getTwelfthHouseI18n(lang, lagna);

  return `<section class="page dense${lang === "hi" ? " hindi" : ""}">
    ${pageRail("12th House Intelligence · Sacred Currency (Sampada)", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>${isEn ? "12th House Sacred Currency (Sampada)" : "12वां भाव · गुप्त संपदा व विश्राम साधना"}</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        ${isEn
          ? "The 12th House is not merely expenditure (Vyaya); it represents the Native's secret reservoir of power, unmanifested wealth (Sampada), and deep spiritual resilience. When kept sacred and private, this house becomes an infinite fountain of renewal."
          : "12वां भाव केवल व्यय नहीं, बल्कि जातक की गुप्त शक्ति, अप्रकट संपदा और आध्यात्मिक सहनशीलता का अक्षय भंडार है। इसे निजी और पवित्र रखने पर यह अनंत ऊर्जा का स्रोत बनता है।"}
      </div>

      <!-- Archetype Profile Card -->
      <div class="card" style="padding:14px;border-left:3px solid var(--gold);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div class="kicker" style="color:var(--gold-bright);">${esc(lagna)} ${isEn ? "Lagna ➔ 12th House in" : "लग्न ➔ 12वां भाव:"} ${esc(sampada.twelfthSign)}</div>
          <span style="font-size:10px;padding:2px 8px;border-radius:3px;background:var(--surface);color:var(--gold);border:1px solid var(--gold-dim);">
            ${isEn ? "Sacred Currency Archetype" : "गुप्त संपदा स्वरूप"}
          </span>
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--gold-bright);margin-bottom:6px;">
          ${esc(isEn ? i18n12H.archetypeTitle : sampada.archetypeTitleHinglish)}
        </div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;margin-bottom:8px;">
          <strong>${isEn ? "Hidden Currency:" : "गुप्त संपदा:"}</strong> ${esc(isEn ? i18n12H.hiddenCurrency : sampada.hiddenCurrencyHinglish)}
        </div>
        <div style="font-size:11px;color:var(--crimson);line-height:1.4;margin-bottom:8px;">
          <strong>${isEn ? "The Curse of Public Exhaustion:" : "सार्वजनिक प्रकटीकरण की हानि:"}</strong> ${esc(isEn ? i18n12H.curseOfExhaustion : sampada.theCurseOfExhaustionHinglish)}
        </div>
        <div style="font-size:11px;color:var(--jade);line-height:1.4;">
          <strong>${isEn ? "Preservation Guidance:" : "संरक्षण निर्देश:"}</strong> ${esc(isEn ? i18n12H.preservationGuidance : sampada.sacredPreservationGuidanceHinglish)}
        </div>
      </div>

      <!-- 4th Lord in 12th & Viparita Raja Yoga Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">${result.fourthLordAlienationInsight ? (isEn ? "4th Lord in 12th House Insight" : "चतुर्थेश 12वें भाव में") : (isEn ? "4th Lord Griha & Root Stability" : "चतुर्थेश गृह एवं भूमि स्थिरता")}</div>
          <div style="font-size:11px;color:var(--ivory-dim);line-height:1.4;">
            ${result.fourthLordAlienationInsight 
              ? esc(result.fourthLordAlienationInsight) 
              : (isEn 
                  ? "The 4th Lord is preserved outside the 12th house: ancestral land, domestic stability and property retention in native place remain secure without sudden displacement."
                  : "चतुर्थेश 12वें भाव से बाहर सुरक्षित है: पैतृक भूमि, घरेलू स्थिरता और संपत्ति जातक के पास सुरक्षित बनी रहती है।")}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid ${result.viparitaRajaYoga.hasVRY ? "var(--gold)" : "var(--surface)"};">
          <div class="kicker" style="color:var(--gold);margin-bottom:4px;">${isEn ? "Viparita Raja Yoga (Ground-Zero Power)" : "विपरीत राजयोग (संकट में अभ्युदय)"}</div>
          <div style="font-size:11px;color:var(--ivory);font-weight:600;margin-bottom:2px;">
            ${result.viparitaRajaYoga.hasVRY ? `Type: ${result.viparitaRajaYoga.type} Yoga` : (isEn ? "Standard Trikona Flow" : "सामान्य त्रिकोण प्रवाह")}
          </div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${result.viparitaRajaYoga.hasVRY
              ? (isEn
                  ? `Viparita Raja Yoga active through ${result.viparitaRajaYoga.type}. Extreme pressure converts into strategic breakthrough resilience and unexpected ascent.`
                  : esc(result.viparitaRajaYoga.groundZeroWillpowerHinglish || "विपरीत परिस्थितियों में अचानक अभ्युदय और संकट से विजय।"))
              : (isEn ? "No extreme dusthana inversion active. Trik houses operate within regular parameters." : "कोई विपरीत राजयोग सक्रिय नहीं। त्रिक भाव सामान्य हैं।")}
          </div>
        </div>
      </div>

      <!-- Sabbatical Protocol -->
      <div class="card" style="padding:12px;background:var(--surface);">
        <div class="kicker" style="color:var(--saffron);margin-bottom:4px;">${isEn ? "The Sabbatical & Dream Incubation Protocol" : "सैबैटिकल व ध्यान साधना विधान"}</div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;">
          ${esc(i18n12H.sabbaticalProtocol)}
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · secret wealth", "12th House Intelligence")}
  </section>`;
}

// ── 5. Page: D10 Dashamsha Career Niche Specifier ────────────────────────────
export function pageCareerSpecifierD10(chart: ChartData, pageNum = "D10", lang: ReportLang = "en"): string {
  const hasKetuLagna = Boolean(chart.planets.Ketu?.house === 10 || chart.planets.Ketu?.house === 1);
  const spec = evaluateCareerSpecifier({
    d10SixthLordInLagna: false,
    d10TenthLordWithRahu: false,
    d10FourthLordDashaActive: false,
    d10LagnaHasKetu: hasKetuLagna,
    mercuryKetuConjunction: Boolean(chart.planets.Mercury?.house === chart.planets.Ketu?.house),
    risingNakshatra: chart.planets.Sun?.nakshatra,
    moonNakshatra: chart.planets.Moon?.nakshatra,
  });

  const isEn = lang === "en";
  const i18nD10 = getCareerSpecifierI18n(lang, { hasKetuLagna });

  return `<section class="page dense${lang === "hi" ? " hindi" : ""}">
    ${pageRail("D10 Dashamsha Career Specifier · Micro-Niche", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>${isEn ? "D10 Career Specifier & Mobility" : "दशमांश (D10) करियर व आजीविका निर्देशक"}</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        ${isEn
          ? "Standard astrology limits career reading to generic labels like 'Business' or 'Job'. The D10 Specifier decodes your precise institutional niche, deep-tech signatures, and desk mobility patterns."
          : "पारंपरिक ज्योतिष करियर को केवल 'नौकरी' या 'व्यापार' तक सीमित रखता है। दशमांश विश्लेषक आपके सटीक आजीविका क्षेत्र, तकनीकी कौशल और कार्यस्थल गतिशीलता को स्पष्ट करता है।"}
      </div>

      <!-- Primary Title & Sub-Domain Card -->
      <div class="card" style="padding:14px;border-left:3px solid var(--gold);margin-bottom:12px;">
        <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">${isEn ? "Primary Professional Archetype" : "मुख्य आजीविका स्वरूप"}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--gold-bright);margin-bottom:6px;">
          ${esc(isEn ? i18nD10.primaryTitle : spec.primaryTitleHinglish)}
        </div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;margin-bottom:6px;">
          <strong>${isEn ? "Target Micro-Niche:" : "लक्षित कार्य-क्षेत्र:"}</strong> ${esc(isEn ? i18nD10.subDomainNiche : spec.subDomainNicheHinglish)}
        </div>
        <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
          <strong>${isEn ? "D10 Circuit Architecture:" : "दशमांश संरचना:"}</strong> ${esc(isEn ? i18nD10.circuitLogic : spec.d10CircuitLogicHinglish)}
        </div>
      </div>

      <!-- Workplace Mobility & Deep Tech Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">${isEn ? "Workplace Mobility (4th Lord in D10)" : "कार्यस्थल गतिशीलता"}</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(isEn ? i18nD10.officeMobilityStatus : spec.officeMobilityStatusHinglish)}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid var(--jade);">
          <div class="kicker" style="color:var(--jade);margin-bottom:4px;">${isEn ? "Deep-Tech & Quantitative Signature" : "तकनीकी एवं विश्लेषणात्मक क्षमता"}</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(isEn ? (spec.deepTechSignature || i18nD10.deepTechSignature) : (spec.deepTechSignature || "सामान्य तकनीकी क्षमता; नेतृत्व और संबंध प्रबंधन में अधिक सहज प्रवाह।"))}
          </div>
        </div>
      </div>

      <!-- Leadership Archetype -->
      <div class="card" style="padding:12px;background:var(--surface);">
        <div class="kicker" style="color:var(--saffron);margin-bottom:4px;">${isEn ? "Leadership Archetype & Executive Style" : "नेतृत्व शैली एवं कार्य-पद्धति"}</div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;">
          ${esc(isEn ? i18nD10.leadershipArchetype : (spec.leadershipArchetypeHinglish || "संस्थान-निर्माता (Institution Builder): नियमों, प्रक्रियाओं और टीम के अनुशासन के साथ दीर्घकालिक सफलता प्राप्त करने वाला नेतृत्व।"))}
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · professional destiny", "D10 Career Specifier")}
  </section>`;
}

// ── 6. Page: Moon Dispositor Health & Degree Timing ──────────────────────────
export function pageTransitHealthTiming(chart: ChartData, pageNum = "HT", lang: ReportLang = "en"): string {
  const moonSign = chart.planets.Moon?.sign || "Cancer";
  const healthTiming = evaluateMoonDispositorHealthTiming(
    moonSign,
    undefined,
    undefined,
    false,
    Boolean(chart.planets.Mercury?.house === 6 || chart.planets.Saturn?.house === 6),
    Boolean(chart.planets.Mercury?.house === 3),
    Boolean(chart.planets.Mercury?.house === 2 || chart.planets.Saturn?.house === 2)
  );

  const isEn = lang === "en";

  return `<section class="page dense${lang === "hi" ? " hindi" : ""}">
    ${pageRail("Moon Dispositor Health · Exact Degree Timing", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--jade);">✦</span>
        <h2>${isEn ? "Moon Dispositor Health Timing" : "चंद्र अधिपति स्वास्थ्य व विश्राम समय"}</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        ${isEn
          ? "In classical medical astrology, the dispositor of the Natal Moon governs bodily vitality, neuro-endocrine immunity, and recovery triggers. Tracking this planet across exact degree boundaries reveals exact treatment windows."
          : "पारंपरिक चिकित्सा ज्योतिष में जन्म चंद्र का अधिपति ग्रह शारीरिक ऊर्जा, अंतःस्रावी प्रतिरक्षा और स्वास्थ्य सुधार की समय-सीमा निर्धारित करता है।"}
      </div>

      <!-- Dispositor Card -->
      <div class="card" style="padding:14px;border-left:3px solid var(--jade);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div class="kicker" style="color:var(--jade);">${isEn ? `Natal Moon in ${esc(moonSign)} ➔ Dispositor: ${esc(healthTiming.dispositorPlanet)}` : `जन्म चंद्र: ${esc(moonSign)} ➔ अधिपति: ${esc(healthTiming.dispositorPlanet)}`}</div>
          <span style="font-size:10px;padding:2px 8px;border-radius:3px;background:var(--surface);color:var(--jade);border:1px solid var(--jade);">
            ${isEn ? "Vitality Controller" : "ऊर्जा नियंत्रक"}
          </span>
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--ivory);margin-bottom:6px;">
          ${isEn ? "Exact Degree Threshold Recovery Window" : "सूक्ष्म अंश सीमा व स्वास्थ्य सुधार चक्र"}
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);line-height:1.5;">
          ${isEn 
            ? `Optimal restorative protocol active when transit Moon aligns favorably with ${esc(healthTiming.dispositorPlanet)}. Prioritize rest and circadian rhythm alignment.`
            : esc(healthTiming.exactDegreeRecoveryWindowHinglish)}
        </div>
      </div>

      <!-- Environmental Remediation & Nerve Support -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--gold);">
          <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">${isEn ? "Environmental & Clutter Remediation" : "पर्यावरणीय स्वच्छता व ऊर्जा शोधन"}</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${isEn
              ? "Keep residential entrance and northeast zones impeccably clean; eliminate non-functional clocks, clutter and stale storage."
              : (healthTiming.environmentalClutterRemedyHinglish || "घर के प्रवेश द्वार और उत्तर-पूर्व कोने को पूरी तरह स्वच्छ रखें; धूल और बंद घड़ियां हटाएं।")}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">${isEn ? "Nerve & Cognitive Burnout Support" : "तंत्रिका व मानसिक तनाव निवारण"}</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${isEn
              ? "Incorporate calming herbs like Ashwagandha or Brahmi with warm milk; strictly restrict digital blue-light screen exposure after 9:30 PM."
              : (healthTiming.nerveBurnoutTalismanHinglish || "अश्वगंधा व ब्राह्मी का सेवन करें; रात्रि में स्क्रीन टाइम कम करें।")}
          </div>
        </div>
      </div>

      <!-- Strict Clinical Disclaimer -->
      <div style="padding:12px;background:rgba(46,204,113,0.06);border:1px solid rgba(46,204,113,0.3);border-radius:4px;margin-top:auto;">
        <div style="font-size:10px;color:var(--jade);font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">
          ${isEn ? "Mandatory Clinical & Medical Guardrail" : "वैधानिक एवं चिकित्सीय अस्वीकरण"}
        </div>
        <div style="font-size:9px;color:var(--ivory-dim);line-height:1.4;">
          ${isEn
            ? "Astrological health timing operates strictly at the subtle energetic and lifestyle level. It is NOT a medical diagnosis, medical prognosis, or prescription for treatment. Never discontinue or delay medical consultation, surgery, or prescription medications based on astrological charts. Always consult licensed medical doctors."
            : "ज्योतिषीय स्वास्थ्य समय-चक्र केवल जीवनशैली व मानसिक ऊर्जा संतुलन के लिए है। यह कोई डॉक्टरी निदान या चिकित्सा परामर्श नहीं है। किसी भी स्वास्थ्य समस्या हेतु योग्य चिकित्सक से परामर्श लें।"}
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · wellness intelligence", "Moon Dispositor Health Timing")}
  </section>`;
}

// ── 7. Page: Functional Debility Superpowers & Gemstone Fallacy Guard ────────
export function pageFunctionalDebilityGuard(chart: ChartData, pageNum = "DG", lang: ReportLang = "en"): string {
  const isEn = lang === "en";
  const keyPlanets: ("Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn")[] = [
    "Venus", "Mercury", "Sun", "Moon", "Mars", "Jupiter", "Saturn"
  ];

  const debilityProfiles = keyPlanets
    .map((p) => {
      const pD1 = chart.planets[p];
      if (!pD1) return null;
      const guard = evaluateFunctionalDebilityGemstoneGuard(p, pD1.sign);
      if (guard.hasFunctionalDebility && guard.profile) {
        return { planet: p, sign: pD1.sign, profile: guard.profile };
      }
      return null;
    })
    .filter(Boolean);

  const nadi = evaluateNadiDebilityPeak(chart);

  return `<section class="page dense${lang === "hi" ? " hindi" : ""}">
    ${pageRail(isEn ? "Functional Debility Guard · Gemstone Fallacy" : "नीच ग्रह शक्ति व रत्न निषेध · Guard", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--crimson);">✦</span>
        <h2>${isEn ? "Functional Debility &amp; Gemstone Guard" : "नीच ग्रह सामर्थ्य एवं रत्न सुरक्षा"}</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        ${isEn
          ? "A debilitated planet is NOT an inherent curse; in modern competitive fields, it often acts as a ruthless Functional Superpower. Wearing gemstones to 'cure' debility can dangerously destroy your commercial or intellectual edge."
          : "नीच का ग्रह कोई अभिशाप नहीं, बल्कि आधुनिक प्रतिस्पर्धी युग में जातक की अद्वितीय शक्ति (Functional Superpower) होता है। इसे 'ठीक' करने हेतु रत्न पहनना आपकी क्षमता को नष्ट कर सकता है।"}
      </div>

      <!-- Functional Superpower Cards -->
      ${debilityProfiles.length > 0 ? debilityProfiles.map((dp: any) => `
        <div class="card" style="padding:12px;border-left:3px solid var(--gold);margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <div class="kicker" style="color:var(--gold-bright);">${esc(dp.planet)} in ${esc(dp.sign)} (${isEn ? "Functional Superpower" : "विशिष्ट सामर्थ्य"})</div>
            <span style="font-size:9px;padding:2px 6px;border-radius:3px;background:rgba(217,83,79,0.15);color:var(--crimson);border:1px solid var(--crimson);">
              🛑 ${isEn ? "FATAL GEM: DO NOT WEAR" : "वर्जित रत्न:"} ${esc(dp.profile.fatalGemstone)}
            </span>
          </div>
          <div style="font-size:11px;color:var(--ivory);line-height:1.4;margin-bottom:6px;">
            <strong>${isEn ? "Superpower:" : "विशिष्ट शक्ति:"}</strong> ${esc(isEn ? (dp.profile.functionalSuperpowerEn || "Deep analytical precision and acute perception.") : dp.profile.functionalSuperpowerHinglish)}
          </div>
          <div style="font-size:10px;color:var(--crimson);line-height:1.4;margin-bottom:6px;">
            <strong>${isEn ? "Why Fatal:" : "रत्न निषेध कारण:"}</strong> ${esc(isEn ? (dp.profile.whyGemstoneIsFatalEn || "Strengthening comfort-seeking attributes dampens competitive edge.") : dp.profile.whyGemstoneIsFatalHinglish)}
          </div>
          <div style="font-size:10px;color:var(--jade);">
            <strong>${isEn ? "Safe Alternative:" : "सुरक्षित विकल्प:"}</strong> ${esc(dp.profile?.safeAlternativeRemedies?.stoneOrMetal || (isEn ? "Natural substitute metals" : "प्राकृतिक धातु"))} · ${esc(dp.profile?.safeAlternativeRemedies?.actionPractice || (isEn ? "Lifestyle alignment" : "आचरण शुद्धि"))}
          </div>
        </div>
      `).join("") : `
        <div class="card" style="padding:14px;border-left:3px solid var(--jade);margin-bottom:12px;">
          <div class="kicker" style="color:var(--jade);margin-bottom:4px;">${isEn ? "Harmonic Planetary Dignity" : "संतुलित ग्रह गरिमा"}</div>
          <div style="font-size:11px;color:var(--ivory-dim);">
            ${isEn
              ? "No severe functional debility at immediate risk of gemstone contraindication. Planets function with balanced dignity."
              : "कुंडली में कोई भी ग्रह हानिकारक नीच अवस्था में नहीं है। सभी ग्रह अपनी स्वाभाविक गरिमा के साथ फल प्रदान कर रहे हैं।"}
          </div>
        </div>
      `}

      <!-- Nadi Debility Peak Zenith Windows -->
      <div class="card" style="padding:12px;background:var(--surface);margin-top:auto;">
        <div class="kicker" style="color:var(--saffron);margin-bottom:6px;">${isEn ? "Nadi Debility Inversion Alchemy (Peak Zenith Windows)" : "नाड़ी ग्रह उत्कर्ष काल (Peak Zenith Windows)"}</div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.4;">
          ${nadi.evaluatedPlanets.length > 0 
            ? nadi.evaluatedPlanets.map((ep) => `<strong>${ep.planet}:</strong> Zenith Window ${ep.profile.overallPeakAgeRange} (${ep.matchedSubWindow}) — ${esc(isEn ? "Focused disciplined execution creates highest long-term leverage." : ep.actionableAdviceHinglish)}`).join("<br/>")
            : (isEn ? "Nadi alchemy indicates standard progression cycles. Regular dasha rhythms dictate career zenith timing." : "नाड़ी पद्धति के अनुसार ग्रह अपनी स्वाभाविक दशा अवधि में पूर्ण शुभ फल प्रदान करेंगे।")}
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · remedial precision", isEn ? "Functional Debility Guard" : "नीच ग्रह सुरक्षा")}
  </section>`;
}

// ── 8. Page: Lineage Karma, Kula Devata & 7-Layer Pitru Synthesis ────────────
export function pageLineageKarmaKulaDevata(chart: ChartData, pageNum = "LK", lang: ReportLang = "en"): string {
  const isEn = lang === "en";
  const lineage = calculateLineageKarma(chart, { nativeName: chart.name || "Seeker", btrConfidence: "High" });

  return `<section class="page dense${lang === "hi" ? " hindi" : ""}">
    ${pageRail(isEn ? "Lineage Karma · Kula Devata & Pitru Intelligence" : "कुल परंपरा · कुलदेवता व पितृ ऋण", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>${isEn ? "Lineage Karma &amp; Kula Devata" : "कुल परंपरा, कुलदेवता एवं पितृ ऋण मुक्ति"}</h2>
      </div>

      <div class="body-s" style="margin-bottom:12px;max-width:680px;color:var(--ivory-dim);">
        ${isEn
          ? "Ancestral karma is not a curse; it is an inherited genetic and spiritual imprint that can be unlocked into profound protective blessings (Pitru Anugraha)."
          : "पितृ ऋण कोई श्राप नहीं, बल्कि पूर्वजों से प्राप्त आनुवंशिक व आध्यात्मिक ऊर्जा है, जिसे सेवा व स्मरण द्वारा रक्षा कवच (पितृ अनुग्रह) में बदला जा सकता है।"}
      </div>

      <!-- Kula vs Ishta Devata Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--gold);">
          <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">${isEn ? "Kula Devata (The Roots / Foundation)" : "कुलदेवता / कुलदेवी (मूल आधार)"}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--ivory);margin-bottom:2px;">
            ${esc(lineage.kulaDevata.suggestedDeity.traditionalMaleName)} / ${esc(lineage.kulaDevata.suggestedDeity.traditionalFemaleName)}
          </div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;margin-bottom:4px;">
            ${esc(isEn ? "Honoring ancestral lineage roots stabilizes foundational life security and protects family longevity." : lineage.kulaDevata.rootsGuidance)}
          </div>
          <div style="font-size:10px;color:var(--gold);">
            <strong>${isEn ? "Simple Offering:" : "सरल अर्पण:"}</strong> ${esc(isEn ? "Offer pure water and a lamp with sincere gratitude at dawn." : lineage.kulaDevata.simplePranamOffering)}
          </div>
        </div>

        <div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">${isEn ? "Ishta Devata (The Wings / Soul's Guide)" : "इष्ट देवता (आत्मिक मार्गदर्शक)"}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--cyan);margin-bottom:2px;">
            ${esc(lineage.ishtaDevata.suggestedDeity.deityName)}
          </div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;margin-bottom:4px;">
            Karakamsha Sign: ${esc(lineage.ishtaDevata.karakamsaSign)} (AK: ${esc(lineage.ishtaDevata.atmakarakaPlanet)})
          </div>
          <div style="font-size:10px;color:var(--cyan);">
            <strong>${isEn ? "Dhyana Mantra:" : "ध्यान मंत्र:"}</strong> ${esc(lineage.ishtaDevata.soulDhyanaMantra)}
          </div>
        </div>
      </div>

      <!-- Elemental Ancestral Water Houses (4-8-12) -->
      <div class="card" style="padding:12px;border-left:3px solid var(--saffron);margin-bottom:12px;">
        <div class="kicker" style="color:var(--saffron);margin-bottom:4px;">${isEn ? "Ancestral Water Houses (4-8-12 Trilogy)" : "पितृ त्रिकोण (भाव 4-8-12)"}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:10px;color:var(--ivory-dim);">
          <div style="padding:6px;background:var(--surface);border-radius:3px;">
            <strong style="color:var(--ivory);">${isEn ? "H4 (Learned):" : "चतुर्थ भाव (संस्कार):"}</strong> ${esc(isEn ? "Domestic conditioning and emotional stability." : lineage.elemental.waterHousesTrilogy.fourthHouseLearned)}
          </div>
          <div style="padding:6px;background:var(--surface);border-radius:3px;">
            <strong style="color:var(--ivory);">${isEn ? "H8 (Carried):" : "अष्टम भाव (सहनशक्ति):"}</strong> ${esc(isEn ? "Ancestral psychological resilience under crisis." : lineage.elemental.waterHousesTrilogy.eighthHouseCarried)}
          </div>
          <div style="padding:6px;background:var(--surface);border-radius:3px;">
            <strong style="color:var(--ivory);">${isEn ? "H12 (Released):" : "द्वादश भाव (मुक्ति):"}</strong> ${esc(isEn ? "Spiritual surrender and release of inherited debts." : lineage.elemental.waterHousesTrilogy.twelfthHouseRelease)}
          </div>
        </div>
      </div>

      <!-- Vedic Tarpana & Somatic Restoration -->
      <div class="card" style="padding:12px;background:var(--surface);">
        <div class="kicker" style="color:var(--jade);margin-bottom:4px;">${isEn ? "Vedic Karma Release &amp; Somatic Balance" : "ऋण मोचन एवं दैहिक संतुलन"}</div>
        <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;margin-bottom:6px;">
          ${isEn 
            ? "Homam burns personal past-life karma; Tarpana washes inherited ancestral debts. Regular daily prayer and ethical living maintain energetic purity."
            : "हवन व्यक्तिगत कर्मों की शुद्धि करता है, जबकि तर्पण पैतृक ऋणों से मुक्ति दिलाता है। पूर्वज हमारी स्मृतियों और संस्कारों में जीवित रहते हैं।"}
        </div>
        <div style="font-size:10px;color:var(--ivory);line-height:1.4;">
          <strong>${isEn ? "Somatic Restoration:" : "दैहिक संतुलन:"}</strong> ${esc(isEn ? "Mindful breathwork, peaceful sleep hygiene, and spending quiet time in nature." : lineage.somatic.restorativeSomaticPractice)}
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · ancestral wisdom", isEn ? "Lineage Karma & Kula Devata" : "कुल परंपरा व पितृ अनुग्रह")}
  </section>`;
}

// ── 9. Page: 12 Jyotirlinga Pilgrimage Sanctuary & Energy Assimilation ───────
export function pageJyotirlingaPilgrimage(chart: ChartData, pageNum = "JP", lang: ReportLang = "en"): string {
  const isEn = lang === "en";
  const pil = resolvePilgrimagePrescription(chart);
  const prime = pil.primaryJyotirlinga;

  return `<section class="page dense${lang === "hi" ? " hindi" : ""}">
    ${pageRail(isEn ? "12 Jyotirlinga Pilgrimage · Sacred Sanctuary" : "द्वादश ज्योतिर्लिंग तीर्थ · आध्यात्मिक शांति", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>${isEn ? "12 Jyotirlinga Pilgrimage Sanctuary" : "द्वादश ज्योतिर्लिंग तीर्थ एवं ऊर्जा शुद्धि"}</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        ${isEn
          ? "Each of the 12 Divine Jyotirlingas anchors a specific celestial frequency that unties karmic knots (Granthis) and resolves deep life crises. Visiting the matched sanctum reboots your energetic matrix."
          : "द्वादश ज्योतिर्लिंगों में से प्रत्येक एक विशिष्ट खगोलीय ऊर्जा का केंद्र है, जो जीवन की जटिल ग्रंथियों और संकटों का निवारण करता है।"}
      </div>

      <!-- Primary Matched Sanctuary Card -->
      <div class="card" style="padding:14px;border-left:3px solid var(--gold);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div class="kicker" style="color:var(--gold-bright);">${isEn ? "Primary Astrological Match" : "प्रमुख ज्योतिर्लिंग केंद्र"}</div>
          <span style="font-size:10px;padding:2px 8px;border-radius:3px;background:var(--surface);color:var(--gold);border:1px solid var(--gold-dim);">
            ${prime.healingFrequencyHz} Hz ${isEn ? "Healing Resonance" : "दिव्य आवृत्ति"}
          </span>
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--gold-bright);margin-bottom:2px;">
          ${esc(isEn ? prime.name : prime.hindiTitle)} (${esc(prime.location)})
        </div>
        <div style="font-size:10px;color:var(--ivory-dim);margin-bottom:6px;">
          ${isEn ? "Rashi:" : "राशि:"} ${esc(prime.rashiName)} · ${isEn ? "Natural House:" : "प्राकृतिक भाव:"} H${prime.naturalHouse} · ${isEn ? "Governing Planets:" : "शासक ग्रह:"} ${esc(prime.governingPlanets.join(", "))}
        </div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;margin-bottom:6px;">
          <strong>${isEn ? "Life Crisis Resolved:" : "संकट निवारण:"}</strong> ${esc(isEn ? "Resolves hidden stress, spiritual displacement, and unblocks vital creative momentum." : prime.lifeCrisisTrigger)}
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);line-height:1.5;margin-bottom:6px;">
          <strong>${isEn ? "Karmic Knot Dissolved:" : "ग्रंथि भेदन:"}</strong> ${esc(isEn ? "Unties Vishnu-Rudra Granthis, freeing mental fog and emotional attachments." : prime.karmicKnotDissolved)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;border-top:1px solid var(--surface);padding-top:6px;margin-top:4px;">
          <div style="font-size:10px;color:var(--ivory-dim);"><strong>${isEn ? "Sacred Offering:" : "पवित्र अर्पण:"}</strong> ${esc(isEn ? "Offer Bilva leaves (Belpatra) and pure Gangajal with calm devotion." : prime.sacredOffering)}</div>
          <div style="font-size:10px;color:var(--gold);"><strong>${isEn ? "Beej Mantra:" : "बीज मंत्र:"}</strong> ${esc(prime.beejMantra)}</div>
        </div>
      </div>

      <!-- Secondary Sanctuaries & 40-Day Assimilation -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">${isEn ? "Secondary Supportive Sanctuaries" : "सहायक ज्योतिर्लिंग तीर्थ"}</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${isEn
              ? pil.secondaryJyotirlingas.map((s) => `<strong>${esc(s.profile.name)}:</strong> Anchors cosmic alignment for ${esc(s.profile.rashiName)} and harmonizes planetary currents.`).join("<br/>")
              : pil.secondaryJyotirlingas.map((s) => `<strong>${esc(s.profile.name)}:</strong> ${esc(s.reasonHinglish)}`).join("<br/>")}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid var(--saffron);">
          <div class="kicker" style="color:var(--saffron);margin-bottom:4px;">${isEn ? "40-Day Energy Assimilation Rule" : "40-दिवसीय ऊर्जा संरक्षण नियम"}</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(isEn ? "Following your pilgrimage, observe 40 days of conscious living: daily dawn contemplation, clean diet, avoiding heated disputes, and performing regular charitable acts to assimilate the sacred vibrational energy." : pil.energyAssimilationRuleHinglish)}
          </div>
        </div>
      </div>

      <!-- Practitioner Shield -->
      <div class="card" style="padding:10px;background:var(--surface);">
        <div class="kicker" style="color:var(--jade);margin-bottom:2px;">${isEn ? "Practitioner Shield Advice" : "तीर्थ रक्षा निर्देश"}</div>
        <div style="font-size:10px;color:var(--ivory-dim);">${esc(isEn ? "Cultivate silent inner prayer (Manasika Japa) before entering the sanctum. Focus on personal spiritual communion rather than external rituals." : pil.practitionerShieldAdviceHinglish)}</div>
      </div>
    </div>
    ${pageFoot("astrolife · sacred pilgrimages", isEn ? "12 Jyotirlinga Sanctuary" : "द्वादश ज्योतिर्लिंग धाम")}
  </section>`;
}

