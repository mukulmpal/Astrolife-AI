import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", name: "AstroLife MCP Endpoint" });
}

export async function POST() {
  return NextResponse.json({ status: "ok", message: "MCP protocol endpoint ready" });
}
