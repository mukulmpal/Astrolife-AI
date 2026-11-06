type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function postJson(url: string | undefined, body: unknown, headers: Record<string, string> = {}) {
  if (!url || typeof fetch === "undefined") return;
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined);
}

function cleanContext(context: LogContext = {}) {
  return Object.fromEntries(
    Object.entries(context).filter(([, value]) => value !== undefined),
  );
}

export interface DiagnosticEntry {
  readonly id: string;
  readonly level: LogLevel;
  readonly event: string;
  readonly service: string;
  readonly environment: string;
  readonly timestamp: string;
  readonly deploymentUrl?: string;
  readonly errorName?: string;
  readonly errorMessage?: string;
  readonly errorStack?: string;
  readonly route?: string;
  readonly userId?: string;
  readonly [key: string]: unknown;
}

const RING_BUFFER_SIZE = 250;
const memoryDiagnosticSheet: DiagnosticEntry[] = [];

async function recordToDiagnosticSheet(payload: DiagnosticEntry) {
  memoryDiagnosticSheet.unshift(Object.freeze({ ...payload }));
  if (memoryDiagnosticSheet.length > RING_BUFFER_SIZE) {
    memoryDiagnosticSheet.pop();
  }

  if (typeof window === "undefined") {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const logDir = path.join(process.cwd(), ".logs");
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      fs.appendFileSync(
        path.join(logDir, "diagnostic-sheet.jsonl"),
        JSON.stringify(payload) + "\n",
        "utf8"
      );
    } catch {
      // Serverless or read-only filesystem graceful bypass
    }
  }
}

export function getDiagnosticSheetEntries(limit = 100): readonly DiagnosticEntry[] {
  return Object.freeze(memoryDiagnosticSheet.slice(0, limit).map((e) => Object.freeze({ ...e })));
}

function emit(level: LogLevel, event: string, context: LogContext = {}) {
  const payload: DiagnosticEntry = {
    id: `diag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    level,
    event,
    service: "astrolife-ai",
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    deploymentUrl: process.env.VERCEL_URL,
    timestamp: new Date().toISOString(),
    ...cleanContext(context),
  };

  recordToDiagnosticSheet(payload);

  const line = JSON.stringify(payload);
  const webhookUrl = process.env.MONITORING_WEBHOOK_URL;
  postJson(webhookUrl, payload);

  const posthogKey = process.env.POSTHOG_PROJECT_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.POSTHOG_HOST || "https://app.posthog.com";
  if (posthogKey) {
    postJson(`${posthogHost.replace(/\/$/, "")}/capture/`, {
      api_key: posthogKey,
      event,
      distinct_id: String(context.userId || context.sessionId || "server"),
      properties: payload,
    });
  }

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.info(line);
}

export const monitor = {
  info(event: string, context?: LogContext) {
    emit("info", event, context);
  },
  warn(event: string, context?: LogContext) {
    emit("warn", event, context);
  },
  error(event: string, error: unknown, context: LogContext = {}) {
    emit("error", event, {
      ...context,
      errorName: error instanceof Error ? error.name : undefined,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack:
        process.env.NODE_ENV === "production"
          ? undefined
          : error instanceof Error
            ? error.stack
            : undefined,
    });
  },
};

export function createRequestId(prefix = "req") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
