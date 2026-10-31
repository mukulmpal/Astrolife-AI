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
export function pageTransitShivlingUpacharas(chart: ChartData, pageNum = "SU"): string {
  const transitRemedy = evaluateTransitNakshatraRemedy(chart);
  if (!transitRemedy) {
    return `<section class="page dense">${pageRail("Transit Shivling Upacharas", pageNum)}
      <div style="padding:48px;color:var(--ivory-dim);">Transit calculations pending for this chart.</div>
      ${pageFoot("astrolife · sacred remedies", "Shivling Upachara")}
    </section>`;
  }

  const shiv = transitRemedy.shivlingRemedy;
  const adShiv = transitRemedy.antardashaShivlingRemedy;
  const takYog = transitRemedy.distanceAnalysis;
  const belief = transitRemedy.beliefGuidanceHinglish;

  return `<section class="page dense">
    ${pageRail("Transit Nakshatra Shivling Engine · 27 Upacharas", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>Transit Nakshatra Shivling Upacharas</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        Based on classical Shastric texts and oral traditions: The active Dasha Lord's transit nakshatra determines the exact 
        vibrational medicine for the soul. Aligning daily Shivling offerings with the transit star transmutes friction into Grace.
      </div>

      <!-- Mahadasha Lord Hero Card -->
      <div class="card" style="padding:14px;border-left:3px solid var(--gold);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div class="kicker" style="color:var(--gold-bright);">Mahadasha Lord Transit: ${esc(transitRemedy.activeDashaLord)}</div>
          <span style="font-size:10px;padding:2px 8px;border-radius:3px;background:var(--surface);color:var(--gold);border:1px solid var(--gold-dim);">
            Tara #${transitRemedy.taraNumber} · ${esc(transitRemedy.taraName)} (${esc(transitRemedy.taraRelationType)})
          </span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:12px;margin-bottom:8px;">
          <div>
            <div style="font-size:10px;color:var(--ivory-mute);text-transform:uppercase;">Transit Placement</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--ivory);">${esc(transitRemedy.transitSign)} · Star #${transitRemedy.transitNakshatraNumber}</div>
            <div style="font-size:12px;color:var(--gold);">${esc(transitRemedy.transitNakshatra)}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--ivory-mute);text-transform:uppercase;">Prescribed Upachara (#${shiv.upacharaNumber})</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--gold-bright);">${esc(shiv.upacharaName)} — ${esc(shiv.hindiTitle)}</div>
            <div style="font-size:11px;color:var(--ivory);margin-top:2px;"><strong>Offering Material:</strong> ${esc(shiv.itemOrOffering)}</div>
          </div>
        </div>
        <div class="body-s" style="font-size:11px;color:var(--ivory-dim);border-top:1px solid var(--surface);padding-top:6px;margin-top:4px;">
          <strong>Significance:</strong> ${esc(shiv.significanceHinglish)}
        </div>
        <div class="body-s" style="font-size:11px;color:var(--ivory-dim);margin-top:4px;">
          <strong>Vidhi (Procedure):</strong> ${esc(shiv.procedureNarrativeHinglish)}
        </div>
      </div>

      <!-- Antardasha & Tak Yog Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        ${adShiv ? `<div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">Antardasha Lord: ${esc(transitRemedy.activeAntardashaLord)}</div>
          <div style="font-size:12px;color:var(--ivory);font-weight:600;">Transit in ${esc(transitRemedy.antardashaTransitNakshatra)} (${esc(transitRemedy.antardashaTransitSign)})</div>
          <div style="font-size:11px;color:var(--gold-bright);margin-top:4px;">Upachara #${adShiv.upacharaNumber}: ${esc(adShiv.upacharaName)} (${esc(adShiv.hindiTitle)})</div>
          <div style="font-size:10px;color:var(--ivory-dim);margin-top:4px;">Offering: ${esc(adShiv.itemOrOffering)}</div>
        </div>` : ""}

        <div class="card" style="padding:12px;border-left:3px solid ${takYog?.isTakYog ? "var(--crimson)" : "var(--jade)"};">
          <div class="kicker" style="color:${takYog?.isTakYog ? "var(--crimson)" : "var(--jade)"};margin-bottom:4px;">MD-AD Harmonics &amp; Tak Yog (${esc(takYog?.mutualAxis ?? "1/7")})</div>
          <div style="font-size:12px;color:var(--ivory);font-weight:600;">${esc(takYog?.impactDescriptionHinglish ?? "Harmonic Flow")}</div>
          <div style="font-size:10px;color:var(--ivory-dim);margin-top:4px;">
            ${takYog?.isTakYog ? esc(takYog.takYogRemedyHinglish ?? "6/8 friction active.") : "Dasha and Antardasha lords operate in cooperative synergy. No 6/8 Tak Yog obstruction active."}
          </div>
        </div>
      </div>

      <!-- House 6, 8, 12 Practical Regimen -->
      <div class="card" style="padding:12px;background:var(--surface);">
        <div class="kicker" style="color:var(--saffron);margin-bottom:6px;">6th, 8th &amp; 12th House Remedial Matrix</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:10px;font-weight:700;color:var(--jade);">6th House: Shraddha (Plants)</div>
            <div style="font-size:9px;color:var(--ivory-dim);margin-top:3px;">${esc(belief.house6MessageHinglish)}</div>
          </div>
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:10px;font-weight:700;color:var(--gold);">8th House: Fruits (Transformation)</div>
            <div style="font-size:9px;color:var(--ivory-dim);margin-top:3px;">Offer seasonal fruits on Amavasya/Tuesdays to dissolve sudden crisis.</div>
          </div>
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:10px;font-weight:700;color:var(--crimson);">12th House: Strict Parikshan</div>
            <div style="font-size:9px;color:var(--ivory-dim);margin-top:3px;">${esc(belief.house12MessageHinglish)}</div>
          </div>
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · sacred remedies", "Transit Shivling Upacharas")}
  </section>`;
}

// ── 2. Page: 27 Nakshatra Social Archetypes & Service Registry ───────────────
export function pageNakshatraSocialRegistry(chart: ChartData, pageNum = "NS"): string {
  const dossier = evaluateNakshatraRemedyDossier(chart);
  if (!dossier) {
    return `<section class="page dense">${pageRail("Nakshatra Social Archetypes", pageNum)}
      <div style="padding:48px;color:var(--ivory-dim);">Nakshatra dossier pending.</div>
      ${pageFoot("astrolife · karmic alignment", "Nakshatra Social Registry")}
    </section>`;
  }

  return `<section class="page dense">
    ${pageRail("Nakshatra Social Remedies & Living Archetypes", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>Nakshatra Archetype &amp; Social Service</h2>
      </div>

      <div class="body-s" style="margin-bottom:12px;max-width:680px;color:var(--ivory-dim);">
        Each Nakshatra carries an evolutionary psychological archetype and a specific social service (Karmic Debt release). 
        Active Dasha Lord Star: <strong style="color:var(--gold-bright);">${esc(dossier.activeNakshatraName)}</strong> (${esc(dossier.activeDashaPlanet)}).
      </div>

      <!-- Archetype Story & Personality -->
      <div class="card" style="padding:14px;border-left:3px solid var(--gold);margin-bottom:10px;">
        <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">Living Archetype &amp; Psychological Temperament</div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;margin-bottom:6px;">
          ${esc(dossier.section1_InnerStateAndPersonality)}
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);line-height:1.5;">
          ${esc(dossier.section2_LivingArchetypeStory)}
        </div>
      </div>

      <!-- Karmic Trap Warning & Daily Conduct -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--crimson);">
          <div class="kicker" style="color:var(--crimson);margin-bottom:4px;">Karmic Trap &amp; Anger Warning</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(dossier.section3_KarmicTrapAndAngerWarning)}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid var(--jade);">
          <div class="kicker" style="color:var(--jade);margin-bottom:4px;">Daily Conduct Protocol</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(dossier.section4_BehavioralConductInDailyLife)}
          </div>
        </div>
      </div>

      <!-- Actionable Seva Plan & Checklist -->
      <div class="card" style="padding:12px;background:var(--surface);margin-bottom:10px;">
        <div class="kicker" style="color:var(--saffron);margin-bottom:6px;">Targeted Social Seva &amp; Action Protocol</div>
        <div style="font-size:11px;color:var(--ivory);margin-bottom:8px;">${esc(dossier.section5_ActionableRemedyAndSevaPlan)}</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:9px;color:var(--gold-dim);text-transform:uppercase;">Primary Seva</div>
            <div style="font-size:10px;color:var(--ivory);font-weight:600;">${esc(dossier.primaryActionItem)}</div>
          </div>
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:9px;color:var(--gold-dim);text-transform:uppercase;">Pashu/Bird Seva</div>
            <div style="font-size:10px;color:var(--ivory);font-weight:600;">${esc(dossier.naturePashuSeva)}</div>
          </div>
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:9px;color:var(--gold-dim);text-transform:uppercase;">Auspicious Timing</div>
            <div style="font-size:10px;color:var(--ivory);font-weight:600;">${esc(dossier.timingAndMuhurat)}</div>
          </div>
          <div style="padding:6px;background:var(--surface-subtle);border-radius:3px;">
            <div style="font-size:9px;color:var(--gold-dim);text-transform:uppercase;">Key Substances</div>
            <div style="font-size:10px;color:var(--ivory);font-weight:600;">${esc(dossier.materialsNeeded.join(", ") || "Standard offerings")}</div>
          </div>
        </div>
      </div>

      <!-- Elemental Vehicle -->
      <div class="card" style="padding:10px;border-left:3px solid var(--cyan);">
        <div class="kicker" style="color:var(--cyan);margin-bottom:2px;">${esc(dossier.elementalVehicleTitle)}</div>
        <div style="font-size:10px;color:var(--ivory-dim);">${esc(dossier.elementalVehicleExplanation)} — <em>${esc(dossier.elementalVehicleProcedure)}</em></div>
      </div>
    </div>
    ${pageFoot("astrolife · karmic alignment", "Nakshatra Social Registry")}
  </section>`;
}

// ── 3. Page: Speculative Trading & F&O Risk Circuit Breaker ──────────────────
export function pageTradingRiskCircuitBreaker(chart: ChartData, pageNum = "TR"): string {
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

  return `<section class="page dense">
    ${pageRail("Trading Risk Guardrail · F&amp;O Circuit Breaker", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:${isSevere ? "var(--crimson)" : "var(--jade)"};">✦</span>
        <h2>Trading &amp; Speculative Risk Guardrail</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        Astrological analysis of speculative ruin vectors in Derivatives (F&amp;O), Intraday Trading, and Revenge Trading spirals. 
        This engine detects the 5th/8th house karmic trap and enforces an immediate capital-protection circuit breaker.
      </div>

      <!-- Risk Status Banner -->
      <div class="card" style="padding:14px;border-left:4px solid ${isSevere ? "var(--crimson)" : "var(--jade)"};background:var(--surface);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div>
            <div class="kicker" style="color:var(--ivory-mute);">Speculative Ruin Probability</div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:24px;color:${isSevere ? "var(--crimson)" : "var(--jade)"};font-weight:700;">
              ${risk.speculativeRuinRisk} RISK
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:10px;color:var(--ivory-mute);text-transform:uppercase;">Revenge Trading Loop</div>
            <div style="font-size:13px;font-weight:700;color:${risk.isRevengeTradingActive ? "var(--crimson)" : "var(--jade)"};">
              ${risk.isRevengeTradingActive ? "ACTIVE SPIRAL" : "CONTROLLED"}
            </div>
          </div>
        </div>
        <div style="font-size:11px;color:var(--ivory);margin-top:6px;line-height:1.5;">
          ${esc(risk.psychologicalDiagnosisHinglish)}
        </div>
      </div>

      <!-- Astrological Circuit & Action Directive -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--gold);">
          <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">Astrological Circuit Logic</div>
          <div style="font-size:11px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(risk.astrologicalCircuitHinglish)}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid ${isSevere ? "var(--crimson)" : "var(--cyan)"};">
          <div class="kicker" style="color:${isSevere ? "var(--crimson)" : "var(--cyan)"};margin-bottom:4px;">Circuit Breaker Directive</div>
          <div style="font-size:11px;color:var(--ivory);font-weight:600;margin-bottom:4px;">
            ${risk.circuitBreakerAction === "IMMEDIATE_HALT_EMPLOYMENT_PIVOT" ? "🛑 IMMEDIATE F&amp;O HALT REQUIRED" : "STRICT DISCIPLINARY HEDGING"}
          </div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(risk.mandatoryFinancialGuardrailHinglish)}
          </div>
        </div>
      </div>

      <!-- Career Pivot Protocol -->
      <div class="card" style="padding:12px;border-left:3px solid var(--jade);margin-bottom:14px;">
        <div class="kicker" style="color:var(--jade);margin-bottom:4px;">Reconstruction &amp; Career Pivot Directive</div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;">
          ${esc(risk.careerPivotDirectiveHinglish)}
        </div>
      </div>

      <!-- Mandatory SEBI Disclaimer -->
      <div style="padding:10px;background:rgba(217,83,79,0.08);border:1px solid rgba(217,83,79,0.3);border-radius:4px;">
        <div style="font-size:9px;color:var(--crimson);font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:2px;">
          Mandatory Statutory &amp; Financial Disclaimer
        </div>
        <div style="font-size:9px;color:var(--ivory-dim);line-height:1.35;">
          This evaluation is an astrological character and behavioral risk assessment based on classical Jyotish planetary configurations. 
          AstroLife AI is NOT a SEBI-registered investment advisor or research analyst. No content on this page constitutes financial advice, 
          trading calls, or buy/sell recommendations. F&amp;O trading carries extreme capital risk. Consult a licensed financial planner.
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · financial guardrail", "Trading Risk Circuit Breaker")}
  </section>`;
}

// ── 4. Page: 12th House Sacred Currency (Sampada) & Incubation ───────────────
export function pageTwelfthHouseSecretWealth(chart: ChartData, pageNum = "12H"): string {
  const lagna = chart.lagnaRashi || "Aries";
  const activeMD = chart.dashas?.find((d) => d.active)?.planet || "Jupiter";
  const fourthLordHouse = chart.planets.Moon?.house || 4;

  const result = evaluateTwelfthHouseIntelligence(
    lagna,
    fourthLordHouse,
    activeMD,
    "Jupiter",
    chart.planets.Mars?.house || 6,
    chart.planets.Saturn?.house || 8,
    chart.planets.Jupiter?.house || 12
  );

  const sampada = result.sampadaProfile;

  return `<section class="page dense">
    ${pageRail("12th House Intelligence · Sacred Currency (Sampada)", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>12th House Sacred Currency (Sampada)</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        The 12th House is not merely expenditure (Vyaya); it represents the Native's secret reservoir of power, unmanifested 
        wealth (Sampada), and deep spiritual resilience. When kept sacred and private, this house becomes an infinite fountain of renewal.
      </div>

      <!-- Archetype Profile Card -->
      <div class="card" style="padding:14px;border-left:3px solid var(--gold);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div class="kicker" style="color:var(--gold-bright);">${esc(lagna)} Lagna ➔ 12th House in ${esc(sampada.twelfthSign)}</div>
          <span style="font-size:10px;padding:2px 8px;border-radius:3px;background:var(--surface);color:var(--gold);border:1px solid var(--gold-dim);">
            Sacred Currency Archetype
          </span>
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--gold-bright);margin-bottom:6px;">
          ${esc(sampada.archetypeTitleHinglish)}
        </div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;margin-bottom:8px;">
          <strong>Hidden Currency:</strong> ${esc(sampada.hiddenCurrencyHinglish)}
        </div>
        <div style="font-size:11px;color:var(--crimson);line-height:1.4;margin-bottom:8px;">
          <strong>The Curse of Public Exhaustion:</strong> ${esc(sampada.theCurseOfExhaustionHinglish)}
        </div>
        <div style="font-size:11px;color:var(--jade);line-height:1.4;">
          <strong>Preservation Guidance:</strong> ${esc(sampada.sacredPreservationGuidanceHinglish)}
        </div>
      </div>

      <!-- 4th Lord in 12th & Viparita Raja Yoga Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">4th Lord in 12th House Insight</div>
          <div style="font-size:11px;color:var(--ivory-dim);line-height:1.4;">
            ${result.fourthLordAlienationInsight 
              ? esc(result.fourthLordAlienationInsight) 
              : "चतुर्थेश 12वें में नहीं है: जातक को पैतृक स्थान अथवा स्वदेश में संपत्ति सुख सामान्य रूप से प्राप्त होता है।"}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid ${result.viparitaRajaYoga.hasVRY ? "var(--gold)" : "var(--surface)"};">
          <div class="kicker" style="color:var(--gold);margin-bottom:4px;">Viparita Raja Yoga (Ground-Zero Power)</div>
          <div style="font-size:11px;color:var(--ivory);font-weight:600;margin-bottom:2px;">
            ${result.viparitaRajaYoga.hasVRY ? `Type: ${result.viparitaRajaYoga.type} Yoga` : "Standard Trikona Flow"}
          </div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${result.viparitaRajaYoga.groundZeroWillpowerHinglish 
              ? esc(result.viparitaRajaYoga.groundZeroWillpowerHinglish) 
              : "No extreme dusthana inversion active. Trik houses operate within regular parameters."}
          </div>
        </div>
      </div>

      <!-- Sabbatical Protocol -->
      <div class="card" style="padding:12px;background:var(--surface);">
        <div class="kicker" style="color:var(--saffron);margin-bottom:4px;">The Sabbatical &amp; Dream Incubation Protocol</div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;">
          ${result.sabbaticalProtocol 
            ? `${esc(result.sabbaticalProtocol.recommendationTitleHinglish)} — ${esc(result.sabbaticalProtocol.actionProtocolHinglish)}`
            : "जब भी 12वें भाव या उसके स्वामी की दशा सक्रिय हो, दौड़भाग छोड़कर 1-3 माह का एकांत सैबैटिकल लें। नींद, ध्यान और अवचेतन मन की प्रेरणा से जीवन का सबसे बड़ा साम्राज्य खड़ा होता है।"}
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · secret wealth", "12th House Intelligence")}
  </section>`;
}

// ── 5. Page: D10 Dashamsha Career Niche Specifier ────────────────────────────
export function pageCareerSpecifierD10(chart: ChartData, pageNum = "D10"): string {
  const spec = evaluateCareerSpecifier({
    d10SixthLordInLagna: false,
    d10TenthLordWithRahu: false,
    d10FourthLordDashaActive: false,
    d10LagnaHasKetu: Boolean(chart.planets.Ketu?.house === 10 || chart.planets.Ketu?.house === 1),
    mercuryKetuConjunction: Boolean(chart.planets.Mercury?.house === chart.planets.Ketu?.house),
    risingNakshatra: chart.planets.Sun?.nakshatra,
    moonNakshatra: chart.planets.Moon?.nakshatra,
  });

  return `<section class="page dense">
    ${pageRail("D10 Dashamsha Career Specifier · Micro-Niche", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>D10 Career Specifier &amp; Mobility</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        Standard astrology limits career reading to generic labels like 'Business' or 'Job'. 
        The D10 Specifier decodes your precise institutional niche, deep-tech signatures, and desk mobility patterns.
      </div>

      <!-- Primary Title & Sub-Domain Card -->
      <div class="card" style="padding:14px;border-left:3px solid var(--gold);margin-bottom:12px;">
        <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">Primary Professional Archetype</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--gold-bright);margin-bottom:6px;">
          ${esc(spec.primaryTitleHinglish)}
        </div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;margin-bottom:6px;">
          <strong>Target Micro-Niche:</strong> ${esc(spec.subDomainNicheHinglish)}
        </div>
        <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
          <strong>D10 Circuit Architecture:</strong> ${esc(spec.d10CircuitLogicHinglish)}
        </div>
      </div>

      <!-- Workplace Mobility & Deep Tech Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">Workplace Mobility (4th Lord in D10)</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(spec.officeMobilityStatusHinglish)}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid var(--jade);">
          <div class="kicker" style="color:var(--jade);margin-bottom:4px;">Deep-Tech &amp; Algorithmic Signature</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${spec.deepTechSignature ? esc(spec.deepTechSignature) : "सामान्य तकनीकी क्षमता; नेतृत्व और संबंध प्रबंधन में अधिक सहज प्रवाह।"}
          </div>
        </div>
      </div>

      <!-- Leadership Archetype -->
      <div class="card" style="padding:12px;background:var(--surface);">
        <div class="kicker" style="color:var(--saffron);margin-bottom:4px;">Leadership Archetype &amp; Executive Style</div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;">
          ${spec.leadershipArchetypeHinglish ? esc(spec.leadershipArchetypeHinglish) : "संस्थान-निर्माता (Institution Builder): नियमों, प्रक्रियाओं और टीम के अनुशासन के साथ दीर्घकालिक सफलता प्राप्त करने वाला नेतृत्व।"}
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · professional destiny", "D10 Career Specifier")}
  </section>`;
}

// ── 6. Page: Moon Dispositor Health & Degree Timing ──────────────────────────
export function pageTransitHealthTiming(chart: ChartData, pageNum = "HT"): string {
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

  return `<section class="page dense">
    ${pageRail("Moon Dispositor Health · Exact Degree Timing", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--jade);">✦</span>
        <h2>Moon Dispositor Health Timing</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        In classical medical astrology, the dispositor of the Natal Moon governs bodily vitality, neuro-endocrine immunity, 
        and recovery triggers. Tracking this planet across exact degree boundaries reveals exact treatment windows.
      </div>

      <!-- Dispositor Card -->
      <div class="card" style="padding:14px;border-left:3px solid var(--jade);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div class="kicker" style="color:var(--jade);">Natal Moon in ${esc(moonSign)} ➔ Dispositor: ${esc(healthTiming.dispositorPlanet)}</div>
          <span style="font-size:10px;padding:2px 8px;border-radius:3px;background:var(--surface);color:var(--jade);border:1px solid var(--jade);">
            Vitality Controller
          </span>
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--ivory);margin-bottom:6px;">
          Exact Degree Threshold Recovery Window
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);line-height:1.5;">
          ${esc(healthTiming.exactDegreeRecoveryWindowHinglish)}
        </div>
      </div>

      <!-- Environmental Remediation & Nerve Support -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--gold);">
          <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">Environmental &amp; Clutter Remediation</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${healthTiming.environmentalClutterRemedyHinglish 
              ? esc(healthTiming.environmentalClutterRemedyHinglish) 
              : "घर के प्रवेश द्वार और उत्तर-पूर्व कोने को पूरी तरह स्वच्छ रखें; धूल और बंद घड़ियां हटाएं।"}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">Nerve &amp; 3rd House Burnout Support</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${healthTiming.nerveBurnoutTalismanHinglish 
              ? esc(healthTiming.nerveBurnoutTalismanHinglish) 
              : "अश्वगंधा व ब्राह्मी का सेवन करें; रात्रि में स्क्रीन टाइम कम करें।"}
          </div>
        </div>
      </div>

      <!-- Strict Clinical Disclaimer -->
      <div style="padding:12px;background:rgba(46,204,113,0.06);border:1px solid rgba(46,204,113,0.3);border-radius:4px;margin-top:auto;">
        <div style="font-size:10px;color:var(--jade);font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">
          Mandatory Clinical &amp; Medical Guardrail
        </div>
        <div style="font-size:9px;color:var(--ivory-dim);line-height:1.4;">
          Astrological health timing operates strictly at the subtle energetic and lifestyle level. 
          It is NOT a medical diagnosis, medical prognosis, or prescription for treatment. Never discontinue or delay medical 
          consultation, surgery, or prescription medications based on astrological charts. Always consult licensed medical doctors.
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · wellness intelligence", "Moon Dispositor Health Timing")}
  </section>`;
}

// ── 7. Page: Functional Debility Superpowers & Gemstone Fallacy Guard ────────
export function pageFunctionalDebilityGuard(chart: ChartData, pageNum = "DG"): string {
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

  return `<section class="page dense">
    ${pageRail("Functional Debility Guard · Gemstone Fallacy", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--crimson);">✦</span>
        <h2>Functional Debility &amp; Gemstone Guard</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        A debilitated planet is NOT an inherent curse; in modern competitive fields, it often acts as a ruthless 
        Functional Superpower. Wearing gemstones to 'cure' debility can dangerously destroy your commercial or intellectual edge.
      </div>

      <!-- Functional Superpower Cards -->
      ${debilityProfiles.length > 0 ? debilityProfiles.map((dp: any) => `
        <div class="card" style="padding:12px;border-left:3px solid var(--gold);margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <div class="kicker" style="color:var(--gold-bright);">${esc(dp.planet)} in ${esc(dp.sign)} (Functional Superpower)</div>
            <span style="font-size:9px;padding:2px 6px;border-radius:3px;background:rgba(217,83,79,0.15);color:var(--crimson);border:1px solid var(--crimson);">
              🛑 FATAL GEM: DO NOT WEAR ${esc(dp.profile.fatalGemstone)}
            </span>
          </div>
          <div style="font-size:11px;color:var(--ivory);line-height:1.4;margin-bottom:6px;">
            <strong>Superpower:</strong> ${esc(dp.profile.functionalSuperpowerHinglish)}
          </div>
          <div style="font-size:10px;color:var(--crimson);line-height:1.4;margin-bottom:6px;">
            <strong>Why Fatal:</strong> ${esc(dp.profile.whyGemstoneIsFatalHinglish)}
          </div>
          <div style="font-size:10px;color:var(--jade);">
            <strong>Safe Alternative:</strong> ${esc(dp.profile?.safeAlternativeRemedies?.stoneOrMetal || "Natural substitute metals")} · ${esc(dp.profile?.safeAlternativeRemedies?.actionPractice || "Lifestyle alignment")}
          </div>
        </div>
      `).join("") : `
        <div class="card" style="padding:14px;border-left:3px solid var(--jade);margin-bottom:12px;">
          <div class="kicker" style="color:var(--jade);margin-bottom:4px;">Harmonic Planetary Dignity</div>
          <div style="font-size:11px;color:var(--ivory-dim);">
            No severe functional debility at immediate risk of gemstone contraindication. Planets function with balanced dignity.
          </div>
        </div>
      `}

      <!-- Nadi Debility Peak Zenith Windows -->
      <div class="card" style="padding:12px;background:var(--surface);margin-top:auto;">
        <div class="kicker" style="color:var(--saffron);margin-bottom:6px;">Nadi Debility Inversion Alchemy (Peak Zenith Windows)</div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.4;">
          ${nadi.evaluatedPlanets.length > 0 
            ? nadi.evaluatedPlanets.map((ep) => `<strong>${ep.planet}:</strong> Zenith Window ${ep.profile.overallPeakAgeRange} (${ep.matchedSubWindow}) — ${esc(ep.actionableAdviceHinglish)}`).join("<br/>")
            : "Nadi alchemy indicates standard progression cycles. Regular dasha rhythms dictate career zenith timing."}
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · remedial precision", "Functional Debility Guard")}
  </section>`;
}

// ── 8. Page: Lineage Karma, Kula Devata & 7-Layer Pitru Synthesis ────────────
export function pageLineageKarmaKulaDevata(chart: ChartData, pageNum = "LK"): string {
  const lineage = calculateLineageKarma(chart, { nativeName: chart.name || "Seeker", btrConfidence: "High" });

  return `<section class="page dense">
    ${pageRail("Lineage Karma · Kula Devata &amp; Pitru Intelligence", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>Lineage Karma &amp; Kula Devata</h2>
      </div>

      <div class="body-s" style="margin-bottom:12px;max-width:680px;color:var(--ivory-dim);">
        ${esc(lineage.executiveSummary.oneSentenceSummary)} Ancestral karma is not a curse; it is an inherited genetic 
        and spiritual imprint that can be unlocked into profound protective blessings (Pitru Anugraha).
      </div>

      <!-- Kula vs Ishta Devata Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--gold);">
          <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">Kula Devata (The Roots / Foundation)</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--ivory);margin-bottom:2px;">
            ${esc(lineage.kulaDevata.suggestedDeity.traditionalMaleName)} / ${esc(lineage.kulaDevata.suggestedDeity.traditionalFemaleName)}
          </div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;margin-bottom:4px;">
            ${esc(lineage.kulaDevata.rootsGuidance)}
          </div>
          <div style="font-size:10px;color:var(--gold);">
            <strong>Simple Offering:</strong> ${esc(lineage.kulaDevata.simplePranamOffering)}
          </div>
        </div>

        <div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">Ishta Devata (The Wings / Soul's Guide)</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--cyan);margin-bottom:2px;">
            ${esc(lineage.ishtaDevata.suggestedDeity.deityName)}
          </div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;margin-bottom:4px;">
            Karakamsha Sign: ${esc(lineage.ishtaDevata.karakamsaSign)} (AK: ${esc(lineage.ishtaDevata.atmakarakaPlanet)})
          </div>
          <div style="font-size:10px;color:var(--cyan);">
            <strong>Dhyana Mantra:</strong> ${esc(lineage.ishtaDevata.soulDhyanaMantra)}
          </div>
        </div>
      </div>

      <!-- Elemental Ancestral Water Houses (4-8-12) -->
      <div class="card" style="padding:12px;border-left:3px solid var(--saffron);margin-bottom:12px;">
        <div class="kicker" style="color:var(--saffron);margin-bottom:4px;">Ancestral Water Houses (4-8-12 Trilogy)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:10px;color:var(--ivory-dim);">
          <div style="padding:6px;background:var(--surface);border-radius:3px;">
            <strong style="color:var(--ivory);">H4 (Learned):</strong> ${esc(lineage.elemental.waterHousesTrilogy.fourthHouseLearned)}
          </div>
          <div style="padding:6px;background:var(--surface);border-radius:3px;">
            <strong style="color:var(--ivory);">H8 (Carried):</strong> ${esc(lineage.elemental.waterHousesTrilogy.eighthHouseCarried)}
          </div>
          <div style="padding:6px;background:var(--surface);border-radius:3px;">
            <strong style="color:var(--ivory);">H12 (Released):</strong> ${esc(lineage.elemental.waterHousesTrilogy.twelfthHouseRelease)}
          </div>
        </div>
      </div>

      <!-- Vedic Tarpana & Somatic Restoration -->
      <div class="card" style="padding:12px;background:var(--surface);">
        <div class="kicker" style="color:var(--jade);margin-bottom:4px;">Vedic Karma Release &amp; Somatic Balance</div>
        <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;margin-bottom:6px;">
          <strong>Homam vs Tarpana:</strong> Homam burns personal past-life karma; Tarpana washes inherited ancestral debts. 
          Ancestors live within us as genetic and emotional conditioning.
        </div>
        <div style="font-size:10px;color:var(--ivory);line-height:1.4;">
          <strong>Somatic Restoration:</strong> ${esc(lineage.somatic.restorativeSomaticPractice)} (Vulnerable Organ: ${esc(lineage.somatic.vulnerableOrganSystem)})
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · ancestral wisdom", "Lineage Karma & Kula Devata")}
  </section>`;
}

// ── 9. Page: 12 Jyotirlinga Pilgrimage Sanctuary & Energy Assimilation ───────
export function pageJyotirlingaPilgrimage(chart: ChartData, pageNum = "JP"): string {
  const pil = resolvePilgrimagePrescription(chart);
  const prime = pil.primaryJyotirlinga;

  return `<section class="page dense">
    ${pageRail("12 Jyotirlinga Pilgrimage · Sacred Sanctuary", pageNum)}
    <div style="position:relative;z-index:2;padding-top:20px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:12px;">
        <span class="section-num" style="color:var(--gold);">✦</span>
        <h2>12 Jyotirlinga Pilgrimage Sanctuary</h2>
      </div>

      <div class="body-s" style="margin-bottom:14px;max-width:680px;color:var(--ivory-dim);">
        Each of the 12 Divine Jyotirlingas anchors a specific celestial frequency that unties karmic knots (Granthis) 
        and resolves deep life crises. Visiting the matched sanctum reboots your energetic matrix.
      </div>

      <!-- Primary Matched Sanctuary Card -->
      <div class="card" style="padding:14px;border-left:3px solid var(--gold);margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <div class="kicker" style="color:var(--gold-bright);">Primary Astrological Match</div>
          <span style="font-size:10px;padding:2px 8px;border-radius:3px;background:var(--surface);color:var(--gold);border:1px solid var(--gold-dim);">
            ${prime.healingFrequencyHz} Hz Healing Resonance
          </span>
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--gold-bright);margin-bottom:2px;">
          ${esc(prime.hindiTitle)} (${esc(prime.location)})
        </div>
        <div style="font-size:10px;color:var(--ivory-dim);margin-bottom:6px;">
          Rashi: ${esc(prime.rashiName)} · Natural House: H${prime.naturalHouse} · Governing Planets: ${esc(prime.governingPlanets.join(", "))}
        </div>
        <div style="font-size:11px;color:var(--ivory);line-height:1.5;margin-bottom:6px;">
          <strong>Life Crisis Resolved:</strong> ${esc(prime.lifeCrisisTrigger)}
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);line-height:1.5;margin-bottom:6px;">
          <strong>Karmic Knot Dissolved:</strong> ${esc(prime.karmicKnotDissolved)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;border-top:1px solid var(--surface);padding-top:6px;margin-top:4px;">
          <div style="font-size:10px;color:var(--ivory-dim);"><strong>Sacred Offering:</strong> ${esc(prime.sacredOffering)}</div>
          <div style="font-size:10px;color:var(--gold);"><strong>Beej Mantra:</strong> ${esc(prime.beejMantra)}</div>
        </div>
      </div>

      <!-- Secondary Sanctuaries & 40-Day Assimilation -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:12px;border-left:3px solid var(--cyan);">
          <div class="kicker" style="color:var(--cyan);margin-bottom:4px;">Secondary Supportive Sanctuaries</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${pil.secondaryJyotirlingas.map((s) => `<strong>${esc(s.profile.name)}:</strong> ${esc(s.reasonHinglish)}`).join("<br/>")}
          </div>
        </div>
        <div class="card" style="padding:12px;border-left:3px solid var(--saffron);">
          <div class="kicker" style="color:var(--saffron);margin-bottom:4px;">40-Day Energy Assimilation Rule</div>
          <div style="font-size:10px;color:var(--ivory-dim);line-height:1.4;">
            ${esc(pil.energyAssimilationRuleHinglish)}
          </div>
        </div>
      </div>

      <!-- Practitioner Shield -->
      <div class="card" style="padding:10px;background:var(--surface);">
        <div class="kicker" style="color:var(--jade);margin-bottom:2px;">Practitioner Shield Advice</div>
        <div style="font-size:10px;color:var(--ivory-dim);">${esc(pil.practitionerShieldAdviceHinglish)}</div>
      </div>
    </div>
    ${pageFoot("astrolife · sacred pilgrimages", "12 Jyotirlinga Sanctuary")}
  </section>`;
}

