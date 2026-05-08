import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json({
      ok: true,
      mode: "dry-run",
      message: "Supabase service credentials are not configured yet. Ingestion is ready to wire once env vars are set.",
      ingestedAt: new Date().toISOString()
    });
  }

  const { count, error } = await supabase.from("sources").select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: "ready",
    activeSources: count ?? 0,
    message: "Ingestion cron placeholder. Wire RSS, market APIs, arXiv, launch feeds, and Supabase writes here.",
    ingestedAt: new Date().toISOString()
  });
}
