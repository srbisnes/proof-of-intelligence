import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "proof-of-intelligence",
    timestamp: new Date().toISOString(),
    version: "0.1.0",
  });
}
