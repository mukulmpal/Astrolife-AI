export function buildAstroSoundChatContext(input: string): string {
  const text = String(input || "").toLowerCase();

  const isSoundQuery =
    text.includes("astro sound") ||
    text.includes("raga") ||
    text.includes("raag") ||
    text.includes("music remedy") ||
    text.includes("sound remedy") ||
    text.includes("sound healing") ||
    text.includes("mantra sound") ||
    text.includes("sleep music") ||
    text.includes("focus music") ||
    text.includes("which music") ||
    text.includes("which raga");

  if (!isSoundQuery) {
    return "";
  }

  return `
ASTROLIFE SOUND CONTEXT:
AstroLife includes an Astro Sound engine that gives guidance-oriented raga recommendations based on the user's goal, mood, available chart signals and listening preference.

IMPORTANT SAFETY:
- Do not claim music cures disease, depression, anxiety or medical conditions.
- Use safe language: "may support", "can help create a calmer environment", "guidance-oriented listening protocol".
- For serious mental health or medical concerns, advise consulting a qualified professional.

PHASE 1 ACTIVE CAPABILITIES:
- Goal-based raga recommendation: mind, sleep, study, career, love, money, travel, spiritual.
- Emotion/rasa support: calm, focus, joy, devotion, confidence, release, romance.
- Preferred sound: vocal, flute, sitar, veena, sarod, tanpura.
- Intensity: soft, medium, strong.
- Feedback memory: felt good, too heavy, skip next time.
- No audio player yet. Listen Now links are planned for Phase 2.

DEFAULT RAGA GUIDANCE:
- Mind balance / calm: Yaman, Ahir Bhairav, Bhoopali.
- Sleep support: Hindolam, Revati, Darbari carefully, Bageshri.
- Study / focus: Hamsadhwani, Saraswati, Bhoopali, Abhogi.
- Career confidence: Bhairav, Hamsadhwani, Brindavani Sarang, Shankarabharanam.
- Love / harmony: Bageshri, Kafi, Khamaj, Charukeshi.
- Spiritual alignment: Bhairav, Yaman, Revati, Malkauns carefully.
- Emotional release: Bhimpalasi, Ahir Bhairav, Charukeshi, Bageshri.

WHEN USER ASKS FOR SOUND REMEDY:
Give:
1. Primary raga
2. Best time
3. Session length
4. Preferred instrument
5. Safe caution
6. 3-step listening protocol
7. Invite user to open Astro Sound page at /dashboard/astro-sound for personalized scoring.
`;
}
