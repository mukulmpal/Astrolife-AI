type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function cleanContext(context: LogContext = {}) {
  return Object.fromEntries(
    Object.entries(context).filter(([, value]) => value !== undefined),
  );
}

function emit(level: LogLevel, event: string, context: LogContext = {}) {
  const payload = {
    level,
    event,
    service: "astrolife-ai",
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    deploymentUrl: process.env.VERCEL_URL,
    timestamp: new Date().toISOString(),
    ...cleanContext(context),
  };

  const line = JSON.stringify(payload);

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

