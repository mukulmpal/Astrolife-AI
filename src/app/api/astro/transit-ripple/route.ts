import { NextRequest, NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toCamelCase(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(toCamelCase);
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter: string) =>
        letter.toUpperCase(),
      );
      output[camelKey] = toCamelCase(val);
    }

    return output;
  }

  return value;
}

function runPythonTransitEngine(input: unknown): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "transit_ripple_cli.py",
    );

    const child = spawn("python3", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    let stdoutBytes = 0;
    const maxBufferBytes = 1024 * 1024 * 20;

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", (chunk: string) => {
      stdoutBytes += Buffer.byteLength(chunk, "utf8");

      if (stdoutBytes > maxBufferBytes && !settled) {
        settled = true;
        child.kill();
        reject(new Error("Python transit engine output exceeded 20MB"));
        return;
      }

      stdout += chunk;
    });

    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      if (!settled) {
        settled = true;
        reject(error);
      }
    });

    child.on("close", (code) => {
      if (settled) return;

      settled = true;

      if (code !== 0) {
        reject(
          new Error(
            stderr.trim() ||
              `Python transit engine exited with code ${String(code)}`,
          ),
        );
        return;
      }

      resolve(stdout);
    });

    child.stdin.write(JSON.stringify(input));
    child.stdin.end();
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body.ascendant ||
      !body.transitPlanet ||
      !body.transitSign ||
      !body.transitNakshatra
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: ascendant, transitPlanet, transitSign, transitNakshatra",
        },
        { status: 400 },
      );
    }

    const stdout = await runPythonTransitEngine(body);
    const parsed = JSON.parse(stdout);

    if (parsed.success === false) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error || "Python transit engine failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      report: toCamelCase(parsed),
    });
  } catch (error) {
    console.error("Transit Ripple API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate transit ripple report",
      },
      { status: 500 },
    );
  }
}
