import { computePlanets } from "@/lib/astro-engine/calculations";
import { resolveNakshatraCoordinate } from "@/lib/astro-engine/ayanamsa-config";
import {
  calculateTaraNumber,
  CLASSICAL_TARAS,
} from "@/lib/astro-engine/navtara-engine";
import { getNakshatraByName } from "@/lib/astro-engine/nakshatra-data";

const TELEGRAM_API = "https://api.telegram.org/bot";

type TelegramMessage = {
  chat?: {
    id?: number;
  };
  text?: string;
};

type TelegramUpdate = {
  message?: TelegramMessage;
};

async function sendTelegramMessage(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN");
  }

  const response = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram sendMessage failed: ${errorText}`);
  }

  return response.json();
}

function getTodayMoonCoordinate() {
  const jd = 2440587.5 + Date.now() / 86400000;
  const planets = computePlanets(jd);
  return resolveNakshatraCoordinate(planets.Moon, jd);
}

export async function GET() {
  return Response.json({
    ok: true,
    service: "Chitragupt AI Telegram webhook",
    status: "alive",
    version: "1.2.0 (Navtara Enabled)",
  });
}

export async function POST(req: Request) {
  try {
    const update = (await req.json()) as TelegramUpdate;

    const chatId = update.message?.chat?.id;
    const rawText = update.message?.text?.trim() || "";

    if (!chatId) {
      return Response.json({ ok: true, ignored: true });
    }

    const lower = rawText.toLowerCase();

    if (lower === "/start") {
      await sendTelegramMessage(
        chatId,
        "Namaste 🙏 Main Chitragupt AI hoon. AstroLife Telegram bot connected hai ✅\n\nDaily Navtara ke liye type karein:\n/tara <Aapka_Nakshatra> (e.g. /tara Rohini)"
      );
    } else if (lower === "/help") {
      await sendTelegramMessage(
        chatId,
        "Commands:\n/start - Start bot\n/tara <Nakshatra> - Aaj Ka Tara (Personal Daily Guidance)\n/panchang - Today's Panchang & Moon Nakshatra\n/help - Help"
      );
    } else if (lower.startsWith("/tara") || lower.startsWith("/aajkatara")) {
      const parts = rawText.split(/\s+/);
      const todayMoon = getTodayMoonCoordinate();

      if (parts.length < 2) {
        await sendTelegramMessage(
          chatId,
          `🌙 Aaj Moon Nakshatra: ${todayMoon.nakshatra.name} (Pada ${todayMoon.pada}) · Lord: ${todayMoon.nakshatra.lord}\n\nApna personal "Aaj Ka Tara" check karne ke liye apna Janma Nakshatra likhein:\n/tara <Nakshatra>\nExample: /tara Rohini ya /tara Ashwini`
        );
      } else {
        const queryNak = parts.slice(1).join(" ");
        const birthNak = getNakshatraByName(queryNak);

        if (!birthNak) {
          await sendTelegramMessage(
            chatId,
            `⚠️ Nakshatra '${queryNak}' recognize nahi hua. Kripya sahi spelling likhein (e.g. Rohini, Ashwini, Magha, Swati, Uttara Phalguni, etc.)`
          );
        } else {
          const taraNum = calculateTaraNumber(birthNak.id, todayMoon.nakshatra.id);
          const tara = CLASSICAL_TARAS[taraNum];
          const isAfflicted = [3, 5, 7].includes(taraNum);
          const isJanma = taraNum === 1;

          const indicator = isAfflicted ? "🔴 [CAUTION]" : isJanma ? "🟠 [JANMA / SELF]" : "🟢 [AUSPICIOUS]";

          const reply = [
            `✨ AstroLife Aaj Ka Tara ✨`,
            ``,
            `🌙 Today's Moon: ${todayMoon.nakshatra.name} (Pada ${todayMoon.pada})`,
            `⭐ Your Janma Star: ${birthNak.name} (#${birthNak.id})`,
            ``,
            `${indicator} Tara #${taraNum} — ${tara.name} (${tara.sanskritName})`,
            `✦ Signification: ${tara.signification}`,
            ``,
            `📖 Practical Strategy:`,
            `${tara.practicalAdvice}`,
            ``,
            `👉 Interactive 27-Chakra Wheel: https://astrolife-ai.vercel.app/dashboard/dasha`,
          ].join("\n");

          await sendTelegramMessage(chatId, reply);
        }
      }
    } else if (lower === "/panchang") {
      const todayMoon = getTodayMoonCoordinate();
      await sendTelegramMessage(
        chatId,
        `📅 Aaj Ka Panchang Overview:\n\n🌙 Moon Nakshatra: ${todayMoon.nakshatra.name} (Pada ${todayMoon.pada})\n👑 Star Lord: ${todayMoon.nakshatra.lord}\n🕉️ Deity: ${todayMoon.nakshatra.devta}\n\nPersonal Tara dekhne ke liye: /tara <Nakshatra>`
      );
    } else {
      await sendTelegramMessage(
        chatId,
        `Namaste 🙏 maine aapka message receive kiya: "${rawText}".\n\nAaj Ka Tara janne ke liye type karein: /tara <Aapka_Nakshatra> (e.g. /tara Rohini)`
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);

    return Response.json(
      {
        ok: false,
        error: "Telegram webhook failed",
      },
      { status: 500 }
    );
  }
}
