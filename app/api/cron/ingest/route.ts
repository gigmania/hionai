import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Ingestion cron placeholder. Wire RSS, market APIs, arXiv, launch feeds, and Supabase writes here.",
    ingestedAt: new Date().toISOString()
  });
}
