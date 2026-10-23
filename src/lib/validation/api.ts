import { NextRequest, NextResponse } from "next/server";

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; issues?: string[] };

export type Validator<T> = (value: unknown) => ValidationResult<T>;

export function ok<T>(data: T): ValidationResult<T> {
  return { ok: true, data };
}

export function fail<T = never>(error: string, issues?: string[]): ValidationResult<T> {
  return { ok: false, error, issues };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function isString(value: unknown, maxLength = 10_000): value is string {
  return typeof value === "string" && value.length <= maxLength;
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function readJsonWithLimit<T>(
  request: NextRequest,
  validator: Validator<T>,
  options: { maxBytes?: number; routeName?: string } = {},
): Promise<ValidationResult<T>> {
  const maxBytes = options.maxBytes ?? 128_000;
  const text = await request.text().catch(() => "");

  if (!text) return fail("Request body is required.");
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    return fail(`Request body too large. Max ${Math.round(maxBytes / 1024)}KB allowed.`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return fail("Malformed JSON body.");
  }

  return validator(parsed);
}

export function validationErrorResponse(result: { error: string; issues?: string[] }, status = 400) {
  return NextResponse.json(
    { error: result.error, issues: result.issues ?? [] },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export function sanitizeText(value: unknown, maxLength = 8_000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

export function optionalText(value: unknown, maxLength = 20_000): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return sanitizeText(value, maxLength) ?? undefined;
}

export function validateEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback?: T,
): ValidationResult<T> {
  if (typeof value === "string" && (allowed as readonly string[]).includes(value)) return ok(value as T);
  if (fallback) return ok(fallback);
  return fail(`Expected one of: ${allowed.join(", ")}.`);
}

