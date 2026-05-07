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

export async function GET() {
  return Response.json({
    ok: true,
    service: "Chitragupt AI Telegram webhook",
    status: "alive",
  });
}

export async function POST(req: Request) {
  try {
    const update = (await req.json()) as TelegramUpdate;

    const chatId = update.message?.chat?.id;
    const text = update.message?.text?.trim() || "";

    if (!chatId) {
      return Response.json({ ok: true, ignored: true });
    }

    if (text === "/start") {
      await sendTelegramMessage(
        chatId,
        "Namaste Mukul JI 🙏 Main Chitragupt AI hoon. AstroLife Telegram bot connected hai ✅"
      );
    } else if (text === "/help") {
      await sendTelegramMessage(
        chatId,
        "Commands:\n/start - Start bot\n/help - Help\n/panchang - Panchang\n/kundli - Kundli\n/ask - Ask Chitragupt AI"
      );
    } else {
      await sendTelegramMessage(
        chatId,
        `Mukul JI, maine aapka message receive kiya: ${text}`
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
