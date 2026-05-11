import type { ChartData } from "./astro-engine/calculations";
import { calculateRemedies } from "./astro-engine/remedy";

export interface VoiceReportOptions {
  type: "full" | "kundli" | "remedy" | "medical" | "destiny" | "summary";
  rate?: number;
  pitch?: number;
}

export function generateVoiceScript(chart: ChartData, options: VoiceReportOptions = { type: "summary" }): string {
  let script = "";

  if (options.type === "summary" || options.type === "full" || options.type === "kundli") {
    script += `
    Welcome to your AstroLife voice report.
    
    Birth Information:
    Name: ${chart.name}
    Born on ${chart.dob} at ${chart.tob} in ${chart.city}
    
    Your Ascendant is ${chart.lagnaRashi}. 
    This is your core identity and how you appear to the world.
    
    Your Moon sign is ${chart.planets.Moon?.sign || "Unknown"}.
    This represents your emotional nature.
    
    Your Sun sign is ${chart.planets.Sun?.sign || "Unknown"}.
    This is your true self and willpower.
    `;
  }

  if (options.type === "remedy" || options.type === "full") {
    const remedies = calculateRemedies(chart);
    script += `
    Recommended Remedies:
    ${remedies.cards.map(c => `${c.planet}: Gem ${c.gem}, Mantra ${c.mantra.substring(0, 30)}, Donate ${c.donate}`).join(". ")}
    `;
  }

  if (options.type === "medical" || options.type === "full") {
    script += `
    Medical Astrology Insights:
    Based on your birth chart, certain areas require attention.
    Please consult with healthcare professionals for medical advice.
    Astrology is a complementary tool, not a substitute for medical care.
    `;
  }

  if (options.type === "destiny" || options.type === "full") {
    script += `
    Destiny and Life Path:
    Your chart indicates specific karmic patterns and life lessons.
    These are areas for personal growth and development throughout your life.
    `;
  }

  return script;
}

export async function speakVoiceReport(
  script: string,
  options: VoiceReportOptions = { type: "summary" }
) {
  if (!("speechSynthesis" in window)) {
    throw new Error("Speech synthesis not supported in this browser");
  }

  const utterance = new SpeechSynthesisUtterance(script);
  utterance.rate = options.rate || 1;
  utterance.pitch = options.pitch || 1;
  utterance.volume = 1;

  return new Promise((resolve, reject) => {
    utterance.onend = () => resolve(true);
    utterance.onerror = () => reject(new Error("Speech synthesis error"));
    window.speechSynthesis.speak(utterance);
  });
}

export function stopVoiceReport() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export async function downloadVoiceReport(
  chart: ChartData,
  options: VoiceReportOptions = { type: "summary" }
) {
  const script = generateVoiceScript(chart, options);

  // Using Web Speech API with browser's native voice
  // For production, integrate with a service like Google Cloud Text-to-Speech or ElevenLabs
  const utterance = new SpeechSynthesisUtterance(script);
  utterance.rate = options.rate || 1;
  utterance.pitch = options.pitch || 1;

  // In production, this would generate an actual MP3 file
  // For now, we'll trigger playback
  return speakVoiceReport(script, options);
}

// For production: integrate with ElevenLabs or Google Cloud TTS
export async function generateVoiceReportMP3(
  chart: ChartData,
  options: VoiceReportOptions = { type: "summary" }
): Promise<Blob> {
  const script = generateVoiceScript(chart, options);

  // This requires backend integration with TTS service
  // Example with ElevenLabs API (requires API key):
  /*
  const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  return await response.blob();
  */

  throw new Error("MP3 generation requires backend integration with TTS service");
}
