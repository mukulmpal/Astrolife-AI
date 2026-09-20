import React, { useState } from "react";
import type { PulseTrigger, TaraBalaModifier, ChandraBalaModifier, MicroTimingWindow } from "@/lib/astro-engine/cosmic-pulse/types";
import { formatLongitudeToDms, formatOrb } from "./formatters";

interface PulseEvidenceDrawerProps {
  trigger: PulseTrigger | null;
  taraBala: TaraBalaModifier;
  chandraBala: ChandraBalaModifier;
  timing: MicroTimingWindow;
  isOpen: boolean;
  onClose: () => void;
}

const CLASSICAL_CONCEPTS = [
  {
    id: "samasaptaka",
    title: "1. Samasaptaka (180° Mutual Aspect)",
    sanskrit: "समसप्तक दृष्टि",
    howItWorks:
      "When two planets sit in opposite signs (7 houses apart, ~180° angular separation), they cast 100% full mutual sight (Purna Drishti) directly onto each other. There is no blind spot.",
    whyItMatters:
      "Unlike harmonious trines (120°), opposite planets demand total awareness between two conflicting human drives — such as Self vs Other (1st/7th), Family vs Career (4th/10th), or Ego vs Duty (Sun vs Saturn).",
    classicalRule:
      "Classical Parashari Principle: Every graha casts full mutual aspect on the 7th house from its placement ('Sarve Graha Saptamam Pasyanti').",
  },
  {
    id: "special-drishti",
    title: "2. Special Graha Drishti (Vishesha Drishti)",
    sanskrit: "विशेष दृष्टि (Mars, Saturn, Jupiter)",
    howItWorks:
      "While all planets look at the 7th house, three outer planets possess special asymmetric vision: Mars casts full aspect on the 4th and 8th; Saturn on the 3rd and 10th; Jupiter on the 5th and 9th.",
    whyItMatters:
      "Mars represents proactive drive and protection (4th house defense, 8th house sudden change). Saturn represents enduring responsibility and long-term labor (3rd house effort, 10th house governance). Their special aspects alert you to pressure before events culminate.",
    classicalRule:
      "Classical Parashari Principle: Saturn uniquely influences 3rd & 10th houses; Mars uniquely influences 4th & 8th houses ('Vishesha Drishti').",
  },
  {
    id: "tara-bala",
    title: "3. Tara Bala (9-Star Nativity Resonance)",
    sanskrit: "नव तारा चक्र",
    howItWorks:
      "Tara Bala is calculated by counting the current transit Nakshatra from your natal birth Moon Nakshatra, modulo 9. This groups all 27 nakshatras into 9 functional cosmic archetypes.",
    whyItMatters:
      "1-Janma (Self), 2-Sampat (Wealth/Gains), 3-Vipat (Obstacles), 4-Kshema (Comfort), 5-Pratyak (Opposition), 6-Sadhana (Accomplishment), 7-Naidhana (Danger/Caution), 8-Mitra (Friendly), 9-Parama Mitra (Supreme Ally). It acts as your personalized daily energetic filter.",
    classicalRule:
      "Classical Muhurta Principle: Stars 2 (Sampat), 4 (Kshema), 6 (Sadhana), 8 (Mitra) and 9 (Parama Mitra) provide supportive flow; 3, 5, and 7 require mindfulness.",
  },
  {
    id: "chandra-bala",
    title: "4. Chandra Bala & Ashtama Chandra",
    sanskrit: "चन्द्र बल एवं अष्टम चन्द्र",
    howItWorks:
      "Chandra Bala tracks the Moon's transit through the 12 signs relative to your natal Moon sign. Auspicious houses are 1st, 3rd, 6th, 7th, 10th, and 11th.",
    whyItMatters:
      "The Moon governs Manas (emotional bandwidth, mental peace, circadian rhythm). When the Moon transits the 8th house from your birth Moon (Ashtama Chandra), emotional resilience drops and minor frictions feel magnified. It is a time for rest and self-care, not high-stakes combat.",
    classicalRule:
      "Classical Lunar Transit Principle: 8th house transit from natal Moon (Ashtama Chandra) marks a time for conservation of emotional energy.",
  },
  {
    id: "muhurta-timing",
    title: "5. Abhijit Muhurta vs Rahu Kaal",
    sanskrit: "अभिजित मुहूर्त एवं राहु काल",
    howItWorks:
      "Daytime (Sunrise to Sunset) is divided into 15 equal Muhurtas and 8 equal planetary segments. The 8th Muhurta (~midday) is Abhijit, presided over by Lord Vishnu. One specific 1/8th daytime segment belongs to Rahu.",
    whyItMatters:
      "Abhijit coincides with the Sun's highest altitude (zenith), burning subtle energetic doshas and empowering decisive actions. Rahu Kaal represents maximum smoke and distraction, making signatures and emotional confrontation prone to unforeseen complications.",
    classicalRule:
      "Classical Muhurta Principle: The midday solar zenith window (Abhijit) neutralizes daily transit blemishes; the 1/8th diurnal Rahu segment counsels postponement of major launches.",
  },
];

const PLANET_KARAKAS: Record<string, { karaka: string; nature: string }> = {
  Sun: {
    karaka: "Soul (Atma), authority, identity, vital energy, father, sovereignty, recognition",
    nature: "Pure Sattvic fire, demands integrity, rejects compromise with negligence",
  },
  Moon: {
    karaka: "Mind (Manas), emotional stability, mother, public perception, nurturing",
    nature: "Sattvic water, receptive, cyclical, sensitive to planetary tension",
  },
  Mars: {
    karaka: "Courage, proactive force, physical vitality, siblings, decisive execution, conflict",
    nature: "Rajasic/Tamasic fire, initiates momentum, intolerant of stagnation",
  },
  Mercury: {
    karaka: "Intellect (Buddhi), speech, commercial transactions, logic, adaptability, analytics",
    nature: "Rajasic neutrality, mirrors surrounding planetary influences",
  },
  Jupiter: {
    karaka: "Wisdom (Guru), expansion, ethical dharma, wealth, fortune, children, spirituality",
    nature: "Pure Sattvic benevolence, seeks higher meaning and divine protection",
  },
  Venus: {
    karaka: "Love, aesthetics, diplomacy, material comforts, vehicles, creative vitality",
    nature: "Rajasic harmony, seeks refined pleasure and contractual equilibrium",
  },
  Saturn: {
    karaka: "Duty (Karma), time (Kala), discipline, structural endurance, delays, reality checks",
    nature: "Tamasic cold earth/air, enforces humility, rewards patient service",
  },
  Rahu: {
    karaka: "Obsession, unconventional disruption, foreign influence, illusion, technological ambition",
    nature: "Shadow smoke, amplifies worldly appetite, tests discernment",
  },
  Ketu: {
    karaka: "Detachment (Moksha), spiritual liberation, intuitive insight, sudden severance",
    nature: "Shadow flame, cuts material attachment, compels internal introspection",
  },
};

export const PulseEvidenceDrawer: React.FC<PulseEvidenceDrawerProps> = ({
  trigger,
  taraBala,
  chandraBala,
  timing,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"evidence" | "masterclass">("evidence");

  if (!isOpen) return null;

  const evidence = trigger?.evidence;
  const lonA = evidence ? formatLongitudeToDms(evidence.longitudeA) : null;
  const lonB = evidence ? formatLongitudeToDms(evidence.longitudeB) : null;
  const orbStr = evidence ? formatOrb(evidence.currentOrbDeg) : "";

  const planetA = evidence?.planetA || "Sun";
  const planetB = evidence?.planetB || "Saturn";
  const karakaA = PLANET_KARAKAS[planetA] || { karaka: "Planetary influence", nature: "Vedic archetype" };
  const karakaB = PLANET_KARAKAS[planetB] || { karaka: "Planetary influence", nature: "Vedic archetype" };

  return (
    <div className="mt-4 pt-4 border-t border-[#c8a030]/30 bg-[#080518]/95 rounded-2xl p-4 sm:p-6 text-xs text-[#c8c0a8] shadow-2xl transition-all">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1c1840]">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#c8a030] font-semibold">
            Vedic Shastra Learning & Verification Layer
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#f0e8d0] mt-0.5">
            Kyu aur Kaise? — The AstroLife Vedic Engine Explained
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#0a0720] border border-[#1c1840] rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("evidence")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === "evidence"
                  ? "bg-[#1c1840] text-[#f0e8d0]"
                  : "text-[#8e88b8] hover:text-[#c8c0a8]"
              }`}
            >
              Trigger Evidence
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("masterclass")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === "masterclass"
                  ? "bg-[#1c1840] text-[#f0e8d0]"
                  : "text-[#8e88b8] hover:text-[#c8c0a8]"
              }`}
            >
              Vedic Pathshala (5 Concepts)
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#1c1840]/60 hover:bg-[#1c1840] text-[#a098c0] flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tab 1: Specific Trigger Evidence */}
      {activeTab === "evidence" && (
        <div className="pt-4 space-y-5">
          {trigger && evidence && lonA && lonB ? (
            <>
              {/* 1. Mathematical Basis */}
              <div>
                <div className="text-[11px] font-bold text-[#c8a030] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>📐</span> 1. Astronomical & Mathematical Basis
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div className="bg-[#0a0720] border border-[#1c1840] rounded-xl p-2.5">
                    <div className="text-[10px] text-[#605890] uppercase tracking-wide">Graha A ({planetA})</div>
                    <div className="text-sm font-semibold text-[#f0e8d0] font-mono mt-0.5">
                      {lonA.formatted}
                    </div>
                    <div className="text-[10px] text-[#8e88b8] mt-0.5">Absolute: {evidence.longitudeA.toFixed(2)}°</div>
                  </div>

                  <div className="bg-[#0a0720] border border-[#1c1840] rounded-xl p-2.5">
                    <div className="text-[10px] text-[#605890] uppercase tracking-wide">Graha B ({planetB})</div>
                    <div className="text-sm font-semibold text-[#f0e8d0] font-mono mt-0.5">
                      {lonB.formatted}
                    </div>
                    <div className="text-[10px] text-[#8e88b8] mt-0.5">Absolute: {evidence.longitudeB.toFixed(2)}°</div>
                  </div>

                  <div className="bg-[#0a0720] border border-[#1c1840] rounded-xl p-2.5">
                    <div className="text-[10px] text-[#605890] uppercase tracking-wide">Angular Separation & Orb</div>
                    <div className="text-sm font-semibold text-[#c8a030] font-mono mt-0.5">
                      {evidence.exactAspectDeg}° (Orb {orbStr})
                    </div>
                    <div className="text-[10px] text-[#8e88b8] mt-0.5">
                      {evidence.isApplying ? "Approaching (Applying)" : "Separating Phase"}
                    </div>
                  </div>

                  <div className="bg-[#0a0720] border border-[#1c1840] rounded-xl p-2.5">
                    <div className="text-[10px] text-[#605890] uppercase tracking-wide">Vedic Classification</div>
                    <div className="text-sm font-semibold text-[#a855f7] mt-0.5">
                      {evidence.aspectType}
                    </div>
                    <div className="text-[10px] text-[#8e88b8] mt-0.5">Full Sight (Purna Drishti)</div>
                  </div>
                </div>
              </div>

              {/* 2. Classical Shastra Interpretation */}
              <div>
                <div className="text-[11px] font-bold text-[#c8a030] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>📜</span> 2. Classical Shastra Archetypes & Tension Pattern
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#0a0720] border border-[#1c1840] rounded-xl p-3 leading-relaxed">
                    <div className="text-xs font-semibold text-[#f0e8d0] mb-1">{planetA} Significators (Karakatwa)</div>
                    <div className="text-[11px] text-[#c8c0a8] mb-1.5">{karakaA.karaka}</div>
                    <div className="text-[10px] text-[#8e88b8] italic">Nature: {karakaA.nature}</div>
                  </div>

                  <div className="bg-[#0a0720] border border-[#1c1840] rounded-xl p-3 leading-relaxed">
                    <div className="text-xs font-semibold text-[#f0e8d0] mb-1">{planetB} Significators (Karakatwa)</div>
                    <div className="text-[11px] text-[#c8c0a8] mb-1.5">{karakaB.karaka}</div>
                    <div className="text-[10px] text-[#8e88b8] italic">Nature: {karakaB.nature}</div>
                  </div>
                </div>

                <div className="bg-[#0a0720]/80 border border-[#1c1840] rounded-xl p-3 mt-2.5 leading-relaxed text-xs text-[#d4ccb8]">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#c8a030] mb-1">
                    Why the tension arises:
                  </div>
                  When {planetA} and {planetB} form a strong geometric aspect, the traditional Vedic framework treats their significations as being placed in direct psychological tension. One graha represents personal will and self-assertion, while the other demands patience, duty, and reality-testing. The Shastra advises balance over extreme reactivity.
                </div>
              </div>

              {/* 3. Why this matters in YOUR chart */}
              <div>
                <div className="text-[11px] font-bold text-[#c8a030] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>🎯</span> 3. Application in Your Unique Natal Chart
                </div>
                <div className="bg-gradient-to-r from-[#0d0a26] to-[#120e35] border border-[#c8a030]/20 rounded-xl p-3.5 leading-relaxed">
                  <div className="text-xs text-[#f0e8d0] font-medium mb-1">
                    Activated Axis: {trigger.activatedHouses.map((h) => `House ${h}`).join(" ↔ ")}
                  </div>
                  <div className="text-xs text-[#c8c0a8]">
                    This is why this trigger isn&apos;t just an abstract &ldquo;{planetA} vs {planetB}&rdquo; textbook quote. Because it falls across your {trigger.activatedHouses.map((h) => `House ${h}`).join(" and ")} axis, it directly influences {trigger.lifeAreas.join(" and ")}. Consciously align with this energy by applying your recommended 1-minute reset.
                  </div>
                  <div className="mt-2 text-[10px] text-[#8e88b8] font-mono">
                    Classical Source Tradition: {evidence.shastraReference}
                  </div>
                </div>
              </div>

              {/* 4. Nativity Modifiers & Micro-Timing */}
              <div>
                <div className="text-[11px] font-bold text-[#c8a030] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>🌙</span> 4. Personal Modifiers & Timing Calculations
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  <div className="bg-[#0a0720] border border-[#1c1840] rounded-xl p-2.5">
                    <div className="text-[10px] text-[#605890] uppercase tracking-wide">Tara Bala Calculation</div>
                    <div className="text-xs font-semibold text-[#f0e8d0] mt-0.5">
                      {taraBala.name} Tara (#{taraBala.number})
                    </div>
                    <div className="text-[10px] text-[#8e88b8] mt-0.5">
                      {taraBala.birthNakshatra} → {taraBala.transitNakshatra}
                    </div>
                  </div>

                  <div className="bg-[#0a0720] border border-[#1c1840] rounded-xl p-2.5">
                    <div className="text-[10px] text-[#605890] uppercase tracking-wide">Chandra Bala Calculation</div>
                    <div className="text-xs font-semibold text-[#f0e8d0] mt-0.5">
                      House {chandraBala.houseFromNatalMoon} from Moon
                    </div>
                    <div className="text-[10px] text-[#8e88b8] mt-0.5">
                      {chandraBala.natalMoonSign} → {chandraBala.transitMoonSign}
                    </div>
                  </div>

                  <div className="bg-[#0a0720] border border-[#1c1840] rounded-xl p-2.5">
                    <div className="text-[10px] text-[#605890] uppercase tracking-wide">Diurnal Windows</div>
                    <div className="text-xs font-semibold text-[#4ade80] mt-0.5">
                      Abhijit: {timing.actionWindow.start}–{timing.actionWindow.end}
                    </div>
                    <div className="text-[10px] text-[#f87171] mt-0.5">
                      Rahu Kaal: {timing.avoidWindow.start}–{timing.avoidWindow.end}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-4 text-center text-xs text-[#8e88b8]">
              No active tension trigger is currently exerting peak pressure on your chart. Explore the Vedic Pathshala tab below to learn the foundational principles.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Vedic Pathshala (5 Concepts) */}
      {activeTab === "masterclass" && (
        <div className="pt-4 space-y-4">
          <div className="text-[11px] text-[#8e88b8] leading-relaxed">
            Astrology is not a superstition; it is an ancient observational science (Vedanga Jyotisha) of time, geometry, and human consciousness. Here are the 5 core mechanics that drive every calculation in your Cosmic Pulse:
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {CLASSICAL_CONCEPTS.map((concept) => (
              <div
                key={concept.id}
                className="bg-[#0a0720] border border-[#1c1840] hover:border-[#c8a030]/30 transition-colors rounded-xl p-3.5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                  <span className="text-sm font-serif font-bold text-[#f0e8d0]">
                    {concept.title}
                  </span>
                  <span className="text-[11px] font-serif text-[#c8a030] tracking-wide">
                    {concept.sanskrit}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[#c8a030] font-semibold">Kaise Kaam Karta Hai (Mechanism): </span>
                    <span className="text-[#c8c0a8]">{concept.howItWorks}</span>
                  </div>
                  <div>
                    <span className="text-[#a855f7] font-semibold">Kyu Zaroori Hai (Psychological Impact): </span>
                    <span className="text-[#c8c0a8]">{concept.whyItMatters}</span>
                  </div>
                  <div className="text-[10px] text-[#605890] font-mono pt-1">
                    📖 Shastra Principle: {concept.classicalRule}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
