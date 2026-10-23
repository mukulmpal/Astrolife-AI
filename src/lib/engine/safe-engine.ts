import { monitor } from "@/lib/server-monitoring";

export type SafeEngineResult<T> =
  | { ok: true; value: T }
  | { ok: false; value: T; error: string };

export function runSafeEngine<T>(engineName: string, fn: () => T, fallback: T): SafeEngineResult<T> {
  try {
    const value = fn();
    return { ok: true, value };
  } catch (error) {
    monitor.error("engine.failed", {
      engineName,
      errorName: error instanceof Error ? error.name : undefined,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return {
      ok: false,
      value: fallback,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function runSafeEngineAsync<T>(
  engineName: string,
  fn: () => Promise<T>,
  fallback: T,
): Promise<SafeEngineResult<T>> {
  try {
    const value = await fn();
    return { ok: true, value };
  } catch (error) {
    monitor.error("engine.failed", {
      engineName,
      errorName: error instanceof Error ? error.name : undefined,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return {
      ok: false,
      value: fallback,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

