import { NextResponse } from "next/server";
import { ingestSources } from "@/lib/ingest";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const result = await ingestSources();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
