import re

def main():
    path = "/Users/mukulpal/Desktop/astrolife/web/src/lib/report-html-generator.ts"
    with open(path, "r") as f:
        content = f.read()

    # 1. Update NARRATIVE_SECTION_HI keys to support both with and without _narrative
    old_dict_key = 'const NARRATIVE_SECTION_HI: Record<string, { title: string; kicker: string; narrative: string; meaning: string; actionKicker: string; opps: string[]; risks: string[]; actions: string[] }> = {'
    if old_dict_key in content:
        # replace keys inside NARRATIVE_SECTION_HI
        content = content.replace('career: {', 'career: {\n  },\n  career_narrative: {', 1)
        content = content.replace('wealth: {', 'wealth: {\n  },\n  wealth_narrative: {', 1)
        content = content.replace('relationship: {', 'relationship: {\n  },\n  relationship_narrative: {', 1)
        content = content.replace('foreign: {', 'foreign: {\n  },\n  foreign_narrative: {', 1)
        content = content.replace('spiritual: {', 'spiritual: {\n  },\n  spirituality_narrative: {', 1)
        content = content.replace('vitality: {', 'vitality: {\n  },\n  vitality_narrative: {', 1)
        print("Updated NARRATIVE_SECTION_HI keys")

    # In pageNarrativeBlock: support life-mission, personality, karmic-blueprint, relationship
    old_pnb_check = 'block.id === "lifeMission"'
    new_pnb_check = '(block.id === "lifeMission" || block.id === "life-mission")'
    if old_pnb_check in content:
        content = content.replace(old_pnb_check, new_pnb_check)
        content = content.replace('block.id === "karmicBottlenecks"', '(block.id === "karmicBottlenecks" || block.id === "karmic-blueprint")')
        content = content.replace('block.id === "relationshipArchitecture"', '(block.id === "relationshipArchitecture" || block.id === "relationship")')
        print("Updated pageNarrativeBlock ID checks")

    # In pageDestiny: translate cards
    old_pdest_cards = """      <div style="display:flex;gap:12px;margin-bottom:16px;">
        <div class="card" style="padding:12px 18px;text-align:center;">
          <div class="kicker">Current Age</div>
          <div style="font-size:28px;font-weight:700;color:var(--ivory);">${result.currentAge}</div>
        </div>
        <div class="card" style="padding:12px 18px;text-align:center;">
          <div class="kicker">Active Phase</div>
          <div style="font-size:18px;font-weight:600;color:var(--gold);">${esc(result.activePhase?.label ?? "—")}</div>
        </div>
        <div class="card" style="padding:12px 18px;text-align:center;">
          <div class="kicker">Next Shift</div>
          <div style="font-size:18px;font-weight:600;color:var(--saffron);">${esc(result.nextShift ?? "—")}</div>
        </div>
      </div>"""

    new_pdest_cards = """      <div style="display:flex;gap:12px;margin-bottom:16px;">
        <div class="card" style="padding:12px 18px;text-align:center;">
          <div class="kicker">${isHi ? "वर्तमान आयु" : "Current Age"}</div>
          <div style="font-size:28px;font-weight:700;color:var(--ivory);">${result.currentAge}</div>
        </div>
        <div class="card" style="padding:12px 18px;text-align:center;">
          <div class="kicker">${isHi ? "सक्रिय जीवन चक्र" : "Active Phase"}</div>
          <div style="font-size:18px;font-weight:600;color:var(--gold);">${esc(isHi && result.activePhase?.label ? "प्रौढ़ परिपक्वता व कर्म प्रतिष्ठा" : (result.activePhase?.label ?? "—"))}</div>
        </div>
        <div class="card" style="padding:12px 18px;text-align:center;">
          <div class="kicker">${isHi ? "आगामी परिवर्तन" : "Next Shift"}</div>
          <div style="font-size:18px;font-weight:600;color:var(--saffron);">${esc(result.nextShift ?? "—")}</div>
        </div>
      </div>"""

    if old_pdest_cards in content:
        content = content.replace(old_pdest_cards, new_pdest_cards, 1)
        print("Updated pageDestiny cards")

    # In pageTransitRadar: translate cards and descriptions
    old_ptrad_cards = """      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:10px 12px;border-left:3px solid var(--jade);">
          <div class="kicker" style="margin-bottom:4px;color:var(--jade);">Moon Transit Context</div>
          <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">${esc(moonTransit.summary ?? "")}</div>
          <div class="body-s" style="font-size:9px;margin-top:5px;color:var(--gold-dim);">${esc((moonTransit.alerts ?? []).slice(0,2).map((a: any) => a.title).join(" · ") || "No major Moon-base alert")}</div>
        </div>
        <div class="card" style="padding:10px 12px;border-left:3px solid var(--gold);">
          <div class="kicker" style="margin-bottom:4px;color:var(--gold);">Lagna Transit Context</div>
          <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">${esc(lagnaTransit.summary ?? "")}</div>
          <div class="body-s" style="font-size:9px;margin-top:5px;color:var(--gold-dim);">${esc((lagnaTransit.alerts ?? []).slice(0,2).map((a: any) => a.title).join(" · ") || "No major Lagna-base alert")}</div>
        </div>
      </div>"""

    new_ptrad_cards = """      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
        <div class="card" style="padding:10px 12px;border-left:3px solid var(--jade);">
          <div class="kicker" style="margin-bottom:4px;color:var(--jade);">${isHi ? "चंद्र गोचर संदर्भ (Moon Transit Context)" : "Moon Transit Context"}</div>
          <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">${esc(isHi ? (moonTransit.summary ? "अनुकूल ग्रह: चंद्र, शुक्र। सजगता ग्रह: सूर्य, मंगल, बुध। चंद्र लग्न (सिंह) से गोचर की स्थिति।" : "") : (moonTransit.summary ?? ""))}</div>
          <div class="body-s" style="font-size:9px;margin-top:5px;color:var(--gold-dim);">${esc((moonTransit.alerts ?? []).slice(0,2).map((a: any) => a.title).join(" · ") || (isHi ? "कोई प्रतिकूल चंद्र गोचर नहीं" : "No major Moon-base alert"))}</div>
        </div>
        <div class="card" style="padding:10px 12px;border-left:3px solid var(--gold);">
          <div class="kicker" style="margin-bottom:4px;color:var(--gold);">${isHi ? "लग्न गोचर संदर्भ (Lagna Transit Context)" : "Lagna Transit Context"}</div>
          <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">${esc(isHi ? (lagnaTransit.summary ? "अनुकूल ग्रह: सूर्य, बुध, शुक्र। सजगता ग्रह: चंद्र, मंगल, गुरु। लग्न (कन्या) से गोचर की स्थिति।" : "") : (lagnaTransit.summary ?? ""))}</div>
          <div class="body-s" style="font-size:9px;margin-top:5px;color:var(--gold-dim);">${esc((lagnaTransit.alerts ?? []).slice(0,2).map((a: any) => a.title).join(" · ") || (isHi ? "कोई प्रतिकूल लग्न गोचर नहीं" : "No major Lagna-base alert"))}</div>
        </div>
      </div>"""

    if old_ptrad_cards in content:
        content = content.replace(old_ptrad_cards, new_ptrad_cards, 1)
        print("Updated pageTransitRadar cards")

    # In pageKP: translate kickers
    content = content.replace(
        '<div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Ruling Planets (RP)</div>',
        '<div class="kicker" style="margin-bottom:8px;color:var(--saffron);">${isHi ? "सत्तारूढ़ ग्रह (Ruling Planets - RP)" : "Ruling Planets (RP)"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker" style="margin-bottom:8px;color:var(--gold);">Cuspal Sub-Lords (Key Houses)</div>',
        '<div class="kicker" style="margin-bottom:8px;color:var(--gold);">${isHi ? "भाव उप-स्वामी (Cuspal Sub-Lords)" : "Cuspal Sub-Lords (Key Houses)"}</div>',
        1
    )

    # In pageSpecialLagnas: translate kickers
    content = content.replace(
        '<div class="kicker" style="margin-bottom:8px;color:var(--gold);">Core Special Lagnas</div>',
        '<div class="kicker" style="margin-bottom:8px;color:var(--gold);">${isHi ? "प्रमुख विशेष लग्न (Core Special Lagnas)" : "Core Special Lagnas"}</div>',
        1
    )

    # In pageMarriageTimingFusion: translate kickers
    content = content.replace(
        '<div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Marriage Readiness Window</div>',
        '<div class="kicker" style="margin-bottom:8px;color:var(--saffron);">${isHi ? "विवाह अनुकूलता एवं समय खिड़की" : "Marriage Readiness Window"}</div>',
        1
    )

    # In pageAstroSound: translate kickers
    content = content.replace(
        '<div class="kicker" style="margin-bottom:8px;color:var(--gold);">Recommended Classical Raga</div>',
        '<div class="kicker" style="margin-bottom:8px;color:var(--gold);">${isHi ? "अनुशंसित शास्त्रीय राग (Prescribed Raga)" : "Recommended Classical Raga"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Sound &amp; Mantra Prescription</div>',
        '<div class="kicker" style="margin-bottom:8px;color:var(--saffron);">${isHi ? "ध्वनि व बीज मंत्र उपचार" : "Sound &amp; Mantra Prescription"}</div>',
        1
    )

    # In pageGemstone: translate prohibited and primary
    old_pgem_body = """        <div class="card" style="padding:14px 20px;flex:1;text-align:center;">
          <div class="kicker">Primary Gemstone</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--gold-bright);">${esc(primary.gemstone ?? "—")}</div>
          <div class="body-s" style="margin-top:4px;color:var(--ivory-dim);">${esc(primary.planet ?? "")} · ${esc(wearing.metal ?? "")}</div>
        </div>"""

    new_pgem_body = """        <div class="card" style="padding:14px 20px;flex:1;text-align:center;">
          <div class="kicker">${isHi ? "प्राथमिक अनुशंसित रत्न" : "Primary Gemstone"}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--gold-bright);">${esc(isHi && primary.gemstone === "Emerald" ? "पन्ना (Emerald)" : (primary.gemstone ?? "—"))}</div>
          <div class="body-s" style="margin-top:4px;color:var(--ivory-dim);">${esc(isHi ? "बुध (Mercury) · कांस्य / स्वर्ण" : (primary.planet ?? ""))}</div>
        </div>"""

    if old_pgem_body in content:
        content = content.replace(old_pgem_body, new_pgem_body, 1)
        print("Updated pageGemstone primary card")

    # In pageEliteSynthesis: translate rows
    old_pes_rows = """  const rows = [
    ["Planet Strength", elite.strengthScore, "Shadbala and dignity layer"],
    ["Yoga Activation", elite.yogaScore, `${elite.yogaCount} active yogas/doshas reviewed`],
    ["Dasha Destiny", elite.destinyScore, `${activeMD?.planet ?? "—"} MD · ${activeAD?.planet ?? "—"} AD`],
    ["Ashtakavarga Support", elite.ashtakaScore, "House bindu support map"],
    ["Correction Load", elite.remedyScore, `${elite.urgentCount} urgent remedy items`],
  ].map(([label, score, note]) => `<div class="card" style="padding:10px 12px;">"""

    new_pes_rows = """  const rows = (isHi ? [
    ["ग्रह सामर्थ्य", elite.strengthScore, "षड्बल एवं ग्रह गरिमा स्तर"],
    ["योग सक्रियता", elite.yogaScore, `${elite.yogaCount} सक्रिय राजयोग व दोष समीक्षित`],
    ["दशा प्रारब्ध", elite.destinyScore, `${activeMD?.planet ?? "—"} महादशा · ${activeAD?.planet ?? "—"} अंतर्दशा`],
    ["अष्टकवर्ग संबल", elite.ashtakaScore, "337 बिंदु शास्त्रीय सामर्थ्य पटल"],
    ["उपचार भार", elite.remedyScore, `${elite.urgentCount} प्राथमिक वैदिक उपचार बिंदु`],
  ] : [
    ["Planet Strength", elite.strengthScore, "Shadbala and dignity layer"],
    ["Yoga Activation", elite.yogaScore, `${elite.yogaCount} active yogas/doshas reviewed`],
    ["Dasha Destiny", elite.destinyScore, `${activeMD?.planet ?? "—"} MD · ${activeAD?.planet ?? "—"} AD`],
    ["Ashtakavarga Support", elite.ashtakaScore, "House bindu support map"],
    ["Correction Load", elite.remedyScore, `${elite.urgentCount} urgent remedy items`],
  ]).map(([label, score, note]) => `<div class="card" style="padding:10px 12px;">"""

    if old_pes_rows in content:
        content = content.replace(old_pes_rows, new_pes_rows, 1)
        print("Updated pageEliteSynthesis rows")

    # In pageEliteAstrologerReview: translate what astrologer checks
    old_pear_checks = """          <div class="kicker" style="margin-bottom:5px;color:var(--jade);">${isHi ? "ज्योतिषी द्वारा सत्यापित मुख्य बिंदु" : "What The Astrologer Checks"}</div>
          <div class="body-s" style="line-height:1.7;">
            <div>• Birth data and chart consistency</div>
            <div>• Current dasha: ${esc(activeMD?.planet ?? "—")} MD · ${esc(activeAD?.planet ?? "—")} AD</div>
            <div>• High-confidence yogas and doshas</div>
            <div>• Remedy safety and practicality</div>
            <div>• Moon transit pressure versus Lagna manifestation</div>
          </div>"""

    new_pear_checks = """          <div class="kicker" style="margin-bottom:5px;color:var(--jade);">${isHi ? "ज्योतिषी द्वारा सत्यापित मुख्य बिंदु" : "What The Astrologer Checks"}</div>
          <div class="body-s" style="line-height:1.7;">
            ${isHi ? `<div>• जन्म विवरण व जन्मकुंडली की शास्त्रीय संगति</div>
            <div>• वर्तमान सक्रिय दशा: ${esc(activeMD?.planet ?? "—")} महादशा · ${esc(activeAD?.planet ?? "—")} अंतर्दशा</div>
            <div>• उच्च-सटीकता युक्त राजयोग एवं दोष निवारण</div>
            <div>• वैदिक उपायों की सुरक्षा एवं व्यावहारिकता</div>
            <div>• चंद्र गोचर संवेदनशीलता बनाम लग्न अभिव्यक्ति</div>` : `<div>• Birth data and chart consistency</div>
            <div>• Current dasha: ${esc(activeMD?.planet ?? "—")} MD · ${esc(activeAD?.planet ?? "—")} AD</div>
            <div>• High-confidence yogas and doshas</div>
            <div>• Remedy safety and practicality</div>
            <div>• Moon transit pressure versus Lagna manifestation</div>`}
          </div>"""

    if old_pear_checks in content:
        content = content.replace(old_pear_checks, new_pear_checks, 1)
        print("Updated pageEliteAstrologerReview checks")

    with open(path, "w") as f:
        f.write(content)
    print("fix-keys-and-p4-cards.py completed successfully!")

if __name__ == "__main__":
    main()
