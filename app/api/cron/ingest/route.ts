import { NextResponse } from "next/server";
import { parseFeed } from "@/lib/rss";
import { createSupabaseServiceClient } from "@/lib/supabase";

type SourceRow = {
  id: string;
  name: string;
  category: string;
  feed_url: string | null;
};

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

  const { data: sources, error: sourcesError } = await supabase
    .from("sources")
    .select("id,name,category,feed_url")
    .eq("is_active", true)
    .not("feed_url", "is", null)
    .limit(20);

  if (sourcesError) {
    return NextResponse.json({ ok: false, message: sourcesError.message }, { status: 500 });
  }

  let rawInserted = 0;
  let mediaInserted = 0;
  const errors: Array<{ source: string; error: string }> = [];

  for (const source of (sources ?? []) as SourceRow[]) {
    if (!source.feed_url) continue;

    try {
      const response = await fetch(source.feed_url, {
        headers: {
          "User-Agent": "HIonAI/0.1 (+https://hionai.net)"
        },
        next: { revalidate: 0 }
      });

      if (!response.ok) {
        throw new Error(`Feed returned ${response.status}`);
      }

      const xml = await response.text();
      const items = parseFeed(xml).slice(0, 20);

      for (const item of items) {
        const { error: rawError } = await supabase.from("raw_ingest_items").upsert(
          {
            source_id: source.id,
            external_id: item.externalId,
            title: item.title,
            url: item.url,
            summary: item.summary,
            published_at: item.publishedAt,
            raw_payload: item.raw
          },
          {
            onConflict: "source_id,external_id",
            ignoreDuplicates: true
          }
        );

        if (!rawError) rawInserted += 1;

        const { error: mediaError } = await supabase.from("media_items").upsert(
          {
            source: source.name,
            type: source.category === "podcast" ? "Podcast" : source.category === "video" ? "Video" : "News",
            title: item.title,
            why: item.summary || "Imported from source feed. Add editorial context before publishing.",
            url: item.url,
            published: false
          },
          {
            onConflict: "title",
            ignoreDuplicates: true
          }
        );

        if (!mediaError) mediaInserted += 1;
      }

      await supabase
        .from("sources")
        .update({
          last_fetched_at: new Date().toISOString(),
          last_error: null
        })
        .eq("id", source.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown ingestion error";
      errors.push({ source: source.name, error: message });
      await supabase
        .from("sources")
        .update({
          last_fetched_at: new Date().toISOString(),
          last_error: message
        })
        .eq("id", source.id);
    }
  }

  return NextResponse.json({
    ok: true,
    mode: "ready",
    activeSources: sources?.length ?? 0,
    rawInserted,
    mediaInserted,
    errors,
    message: "Ingestion completed. Imported items are unpublished until reviewed in admin.",
    ingestedAt: new Date().toISOString()
  });
}
