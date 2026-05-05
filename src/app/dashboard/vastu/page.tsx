"use client";
import { useEffect, useRef, useState } from "react";
import "@/app/dashboard/shared.css";
import { calculateVastu, VASTU_ZONES_DEF, type VastuZone, type VastuResult } from "@/lib/astro-engine/vastu";
import { PremiumFeature } from "@/components/premium-feature";
import { useUserChart } from "@/lib/user-chart";

// ── Compass Canvas ────────────────────────────────────────────
function VastuCompass({ zones }: { zones: VastuZone[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const W = 300, cx = 150, cy = 150, r = 120;
    ctx.clearRect(0, 0, W, W);
    ctx.fillStyle = "#08051a"; ctx.fillRect(0, 0, W, W);

    VASTU_ZONES_DEF.forEach(z => {
      const zone = zones.find(zz => zz.dir === z.dir);
      const score = zone?.score ?? 50;
      const col   = zone?.statusColor ?? "#c8a030";
      const start = (z.deg - 11.25 - 90) * Math.PI / 180;
      const end   = (z.deg + 11.25 - 90) * Math.PI / 180;

      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath();
      ctx.fillStyle   = col + (score >= 70 ? "44" : score >= 50 ? "28" : "18");
      ctx.strokeStyle = col + "99"; ctx.lineWidth = 1;
      ctx.fill(); ctx.stroke();

      const mid = (z.deg - 90) * Math.PI / 180;
      const tx  = cx + Math.cos(mid) * (r * 0.72);
      const ty  = cy + Math.sin(mid) * (r * 0.72);
      ctx.fillStyle = col; ctx.font = "bold 8.5px Outfit,sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(z.dir, tx, ty);

      // Score micro text
      const sx = cx + Math.cos(mid) * (r * 0.88);
      const sy = cy + Math.sin(mid) * (r * 0.88);
      ctx.fillStyle = col + "cc"; ctx.font = "6px Outfit,sans-serif";
      ctx.fillText(String(score), sx, sy);
    });

    // Center orb
    ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = "#0d0b24"; ctx.fill();
    ctx.strokeStyle = "#c8a030"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "#c8a030"; ctx.font = "18px serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("🏠", cx, cy);

    // Cardinal labels
    [["N",cx,12],["S",cx,W-8],["E",W-8,cy],["W",8,cy]].forEach(([l,x,y]) => {
      ctx.fillStyle = "#3a3060"; ctx.font = "bold 9px Outfit,sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(l), Number(x), Number(y));
    });
  }, [zones]);

  return (
    <canvas ref={ref} width={300} height={300}
      style={{ width: "100%", maxWidth: 300, height: "auto", borderRadius: 12, display: "block", margin: "0 auto" }} />
  );
}

// ── Zone Card ─────────────────────────────────────────────────
function ZoneCard({ zone }: { zone: VastuZone }) {
  const [open, setOpen] = useState(false);
  const pct = zone.score;

  return (
    <div onClick={() => setOpen(o => !o)} style={{
      background: "#0d0b24", border: `1px solid ${open ? zone.statusColor + "55" : "#1c1840"}`,
      borderRadius: 12, padding: "12px 14px", cursor: "pointer", transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
          background: zone.statusColor,
          boxShadow: `0 0 6px ${zone.statusColor}88`,
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 14, fontWeight: 600, color: "#f0e8d0" }}>
              {zone.dir} — {zone.name}
            </span>
            {zone.hasDosha && (
              <span style={{ fontSize: 9, background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 4, padding: "1px 5px" }}>WEAK</span>
            )}
          </div>
          <div style={{ fontSize: 10, color: "#605890" }}>{zone.planet} · {zone.deity} · {zone.domain}</div>
          <div style={{ marginTop: 6, height: 3, background: "#1c1840", borderRadius: 2 }}>
            <div style={{ height: 3, width: `${pct}%`, background: zone.statusColor, borderRadius: 2, transition: "width 0.6s ease" }} />
          </div>
        </div>
        <div style={{ textAlign: "right", minWidth: 38 }}>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 20, fontWeight: 700, color: zone.statusColor, lineHeight: 1 }}>{zone.score}</div>
          <div style={{ fontSize: 8, color: "#3a3060" }}>/100</div>
        </div>
        <span style={{ fontSize: 10, color: "#3a3060" }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1c1840", display: "flex", flexDirection: "column", gap: 8 }}>
          {zone.planets.length > 0 && (
            <div style={{ fontSize: 11, color: "#c8c0a8" }}>
              <span style={{ color: "#605890" }}>Planets here: </span>
              {zone.planets.join(", ")}
            </div>
          )}
          <div style={{ fontSize: 11, color: "#605890" }}>
            <span style={{ color: "#c8a030" }}>Ideal room: </span>{zone.roomIdeal}
          </div>
          <div style={{
            background: zone.hasDosha ? "rgba(239,68,68,0.06)" : "rgba(200,160,48,0.05)",
            border: `1px solid ${zone.hasDosha ? "rgba(239,68,68,0.2)" : "rgba(200,160,48,0.15)"}`,
            borderRadius: 8, padding: "8px 10px", fontSize: 11,
            color: zone.hasDosha ? "#fca5a5" : "#d4b896", lineHeight: 1.8,
          }}>
            {zone.remedy}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function VastuPage() {
  const { birth, chart } = useUserChart();
  const result: VastuResult = calculateVastu(chart.planets as never);
  const [tab, setTab] = useState<"compass"|"zones"|"rooms"|"psych"|"alerts">("compass");

  const scoreColor = result.overallScore >= 70 ? "#22c55e" : result.overallScore >= 50 ? "#c8a030" : "#ef4444";

  return (
    <div className="page">
      <div className="page-tag">🏠 Vastu Engine</div>
      <h1 className="page-title serif">Astro-Vastu <em>16 Zone Analysis</em></h1>
      <p className="page-sub">MahaVastu · Planet-Direction Mapping · Zone Scores · Remedies · Psych Bridge</p>
      <PremiumFeature feature="Astro-Vastu Engine">

      {/* HEADER */}
      <div className="header-card" style={{ marginBottom: 16 }}>
        <div className="header-orb" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "#c8a030", marginBottom: 6 }}>🏠 Astro-Vastu Analysis</div>
          <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 26, fontWeight: 600, color: "#f0e8d0" }}>{birth.name}</div>
          <div style={{ fontSize: 13, color: "#605890", marginTop: 4 }}>
            {result.strongZones.length} Strong Zones · {result.weakZones.length} Weak Zones · {result.zones.filter(z => z.status === "Average").length} Average
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          <div className="hstat">
            <div className="hstat-n" style={{ color: scoreColor }}>{result.overallScore}</div>
            <div className="hstat-l">OVERALL</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{ color: "#22c55e" }}>{result.strongZones.length}</div>
            <div className="hstat-l">STRONG</div>
          </div>
          <div className="hstat">
            <div className="hstat-n" style={{ color: "#ef4444" }}>{result.weakZones.length}</div>
            <div className="hstat-l">WEAK</div>
          </div>
        </div>
      </div>

      {/* SUMMARY STRIP */}
      <div className="summary-strip" style={{ marginBottom: 16 }}>
        🧭 Strong: {result.strongZones.map(z => z.dir).join(", ") || "None"} ·
        Weak: {result.weakZones.map(z => z.dir).join(", ") || "None"}
      </div>

      {/* TABS */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        {([
          ["compass","Compass"],
          ["zones","16 Zones"],
          ["rooms","Room Guide"],
          ["psych","Psychology"],
          ["alerts","Alerts"],
        ] as const).map(([t, l]) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {/* ── COMPASS TAB ── */}
      {tab === "compass" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <div className="card-tag">✦ Vastu Compass — 16 Zone View</div>
            <div className="card-title serif">Your Home&apos;s Energy Map</div>
            <p style={{ fontSize: 12, color: "#605890", marginBottom: 16, lineHeight: 1.7 }}>
              360° ÷ 16 = 22.5° per zone. Each zone is ruled by a planet, deity & element.
              Zone strength = natal planets (40%) + ruling planet position (60%).
            </p>
            <VastuCompass zones={result.zones} />
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 14, fontSize: 11, flexWrap: "wrap" }}>
              <span style={{ color: "#22c55e" }}>● Strong (70+)</span>
              <span style={{ color: "#c8a030" }}>● Average (50–69)</span>
              <span style={{ color: "#ef4444" }}>● Weak (&lt;50)</span>
            </div>
          </div>

          {/* Quick score grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {result.zones.map(z => (
              <div key={z.dir} style={{
                background: "#0d0b24", border: `1px solid ${z.statusColor}33`,
                borderRadius: 10, padding: "10px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 9, color: "#605890", marginBottom: 4 }}>{z.dir}</div>
                <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 22, fontWeight: 700, color: z.statusColor, lineHeight: 1 }}>{z.score}</div>
                <div style={{ fontSize: 8, color: z.statusColor, marginTop: 3 }}>{z.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ZONES TAB ── */}
      {tab === "zones" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="card" style={{ marginBottom: 4 }}>
            <div className="card-tag">✦ 16 Zone Analysis</div>
            <div className="card-title serif">Tap any zone for detail & remedy</div>
            <div style={{ fontSize: 11, color: "#605890", lineHeight: 1.7 }}>
              System: 360° ÷ 16 = 22.5° per zone. Zone strength computed from natal planets in that house + ruling planet position.
            </div>
          </div>
          {/* Weak zones first */}
          {result.weakZones.length > 0 && (
            <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4, paddingLeft: 4 }}>
              ⚠️ Weak Zones — Need Attention
            </div>
          )}
          {result.weakZones.map(z => <ZoneCard key={z.dir} zone={z} />)}

          {result.zones.filter(z => z.status === "Average").length > 0 && (
            <div style={{ fontSize: 10, color: "#c8a030", letterSpacing: "1.5px", textTransform: "uppercase", margin: "8px 0 4px", paddingLeft: 4 }}>
              ⚡ Average Zones
            </div>
          )}
          {result.zones.filter(z => z.status === "Average").map(z => <ZoneCard key={z.dir} zone={z} />)}

          {result.strongZones.length > 0 && (
            <div style={{ fontSize: 10, color: "#22c55e", letterSpacing: "1.5px", textTransform: "uppercase", margin: "8px 0 4px", paddingLeft: 4 }}>
              ✅ Strong Zones
            </div>
          )}
          {result.strongZones.map(z => <ZoneCard key={z.dir} zone={z} />)}
        </div>
      )}

      {/* ── ROOMS TAB ── */}
      {tab === "rooms" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-tag">✦ Ideal Room Placement</div>
            <div className="card-title serif">Where Should Each Room Be?</div>
            <div style={{ fontSize: 12, color: "#605890", lineHeight: 1.7, marginBottom: 16 }}>
              MahaVastu room placement based on planetary zone rulership. Place rooms in their ideal directions to amplify zone energy.
            </div>
            {result.roomGuide.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #1c1840", alignItems: "flex-start" }}>
                <div style={{ fontSize: 22, minWidth: 32, textAlign: "center" }}>
                  {r.room.includes("Bedroom") ? "🛏️" : r.room.includes("Prayer") ? "🙏" : r.room.includes("Kitchen") ? "🍳" : r.room.includes("Study") ? "📚" : r.room.includes("Children") ? "🧒" : r.room.includes("Guest") ? "🛋️" : r.room.includes("Dining") ? "🍽️" : r.room.includes("Cash") ? "💰" : "🚗"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 15, fontWeight: 600, color: "#f0e8d0", marginBottom: 3 }}>{r.room}</div>
                  <div style={{ fontSize: 12, color: "#c8a030", marginBottom: 4 }}>Ideal: {r.idealDir}</div>
                  <div style={{ fontSize: 11, color: "#605890", lineHeight: 1.7 }}>{r.reason}</div>
                </div>
              </div>
            ))}
          </div>

          {/* House-Direction map */}
          <div className="card">
            <div className="card-tag">✦ House → Direction Mapping</div>
            <div className="card-title serif">Your Planets in Each Direction</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
              {result.houseMap.map(h => (
                <div key={h.house} style={{ background: "#08051a", borderRadius: 8, padding: "10px 12px", border: "1px solid #1c1840" }}>
                  <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: 13, fontWeight: 600, color: "#c8a030", marginBottom: 3 }}>
                    H{h.house} → {h.dir}
                  </div>
                  <div style={{ fontSize: 11, color: h.planets.length ? "#c8c0a8" : "#3a3060" }}>
                    {h.planets.length ? h.planets.join(", ") : "Empty"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PSYCH TAB ── */}
      {tab === "psych" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-tag">✦ Psychological-Vastu Bridge</div>
            <div className="card-title serif">How Your Chart Shapes Your Space</div>
            <div style={{ fontSize: 12, color: "#605890", lineHeight: 1.8, marginBottom: 16 }}>
              Each planetary zone corresponds to a psychological pattern. Weak zones don&apos;t just affect your home — they reflect behavioral and mental tendencies that need healing.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.psychBridge.map((insight, i) => (
                <div key={i} style={{
                  background: "rgba(200,160,48,0.04)", border: "1px solid rgba(200,160,48,0.12)",
                  borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#c8c0a8", lineHeight: 1.8,
                }}>
                  • {insight}
                </div>
              ))}
            </div>
          </div>

          {/* Scientific note */}
          <div className="card" style={{ borderColor: "rgba(6,182,212,0.2)" }}>
            <div className="card-tag" style={{ color: "#06b6d4" }}>🔬 Scientific Approach</div>
            <div className="card-title serif">Why Vastu Works Psychologically</div>
            <div style={{ fontSize: 12, color: "#605890", lineHeight: 1.9 }}>
              Zone weaknesses correlate with electromagnetic field imbalances in corresponding building areas. Heavy objects, electronics, or structural cuts in specific zones amplify astrological planetary pressures — creating measurable behavioral and emotional patterns in inhabitants.
            </div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { planet:"NE Zone", insight:"Brain waves, morning light, serotonin regulation — affects clarity & spiritual receptivity." },
                { planet:"SW Zone", insight:"Earth's gravitational center in a building — affects stability, relationships & sense of security." },
                { planet:"North Zone", insight:"Magnetic north — affects iron in blood, mental alertness & financial decision-making." },
                { planet:"SE Zone", insight:"Fire/heat zone — affects digestion, metabolism & action drive when used as kitchen." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#06b6d4", fontSize: 13, minWidth: 80, fontFamily: "Cormorant Garamond,serif", fontWeight: 600 }}>{item.planet}</span>
                  <span style={{ fontSize: 11, color: "#605890", lineHeight: 1.7 }}>{item.insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ALERTS TAB ── */}
      {tab === "alerts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-tag">✦ Transit Zone Alerts</div>
            <div className="card-title serif">Current Planetary Pressure on Zones</div>
            <div style={{ fontSize: 12, color: "#605890", lineHeight: 1.7, marginBottom: 14 }}>
              Natal planet positions create permanent zone pressure. Benefics energize zones; malefics create stress.
            </div>
            {result.transitAlerts.length === 0 ? (
              <div style={{ textAlign: "center", padding: 24, color: "#605890", fontSize: 13 }}>No critical zone alerts detected.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.transitAlerts.map((a, i) => (
                  <div key={i} style={{
                    background: a.positive ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
                    border: `1px solid ${a.positive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                    borderRadius: 10, padding: "12px 14px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: a.positive ? "#22c55e" : "#ef4444" }}>
                        {a.positive ? "✅" : "⚠️"} {a.planet}
                      </span>
                      <span style={{ fontSize: 11, color: "#605890" }}>→ {a.zone} Zone</span>
                      <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: a.positive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: a.positive ? "#22c55e" : "#ef4444" }}>
                        {a.positive ? "ENERGIZING" : "PRESSURE"}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#c8c0a8", marginBottom: 6 }}>{a.domain} — {a.effect}</div>
                    <div style={{ fontSize: 11, color: a.positive ? "#22c55e" : "#f59e0b", lineHeight: 1.7 }}>
                      💊 {a.remedy}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* General Vastu principles */}
          <div className="card">
            <div className="card-tag">✦ Universal Vastu Rules</div>
            <div className="card-title serif">Always Follow These</div>
            {[
              { rule:"NE must always be kept clean & sacred", why:"Ishan Kona — Shiva's zone. Blocks here create health & wealth issues." },
              { rule:"SW must be heaviest room", why:"SW anchors the house. Light/open SW creates instability in relationships." },
              { rule:"No toilet in NE or North", why:"Destroys Mercury (wealth) & Jupiter (wisdom) zone energy." },
              { rule:"Main door ideally in N, NE, or E", why:"These are benefic zones — Kubera, Shiva, Indra energies welcome prosperity." },
              { rule:"Kitchen in SE — never NE or SW", why:"Fire in water/earth zones creates elemental conflict & health issues." },
              { rule:"Master bedroom in SW — head pointing South", why:"Earth's magnetic field aligns with body when sleeping with head South." },
            ].map((item, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #1c1840" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#c8a030", marginBottom: 3 }}>✦ {item.rule}</div>
                <div style={{ fontSize: 11, color: "#605890", lineHeight: 1.7 }}>{item.why}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      </PremiumFeature>
    </div>
  );
}
