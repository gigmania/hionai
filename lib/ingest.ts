import { parseFeed } from "@/lib/rss";
import { createSupabaseServiceClient } from "@/lib/supabase";

type SourceRow = {
  id: string;
  name: string;
  category: string;
  feed_url: string | null;
};

export type IngestResult = {
  ok: boolean;
  mode: "dry-run" | "ready";
  activeSources?: number;
  rawInserted?: number;
  mediaInserted?: number;
  errors?: Array<{ source: string; error: string }>;
  message: string;
  ingestedAt: string;
};

export async function ingestSources(): Promise<IngestResult> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      ok: true,
      mode: "dry-run",
      message: "Supabase service credentials are not configured yet. Ingestion is ready to wire once env vars are set.",
      ingestedAt: new Date().toISOString()
    };
  }

  const { data: sources, error: sourcesError } = await supabase
    .from("sources")
    .select("id,name,category,feed_url")
    .eq("is_active", true)
    .not("feed_url", "is", null)
    .limit(20);

  if (sourcesError) {
    return {
      ok: false,
      mode: "ready",
      message: sourcesError.message,
      ingestedAt: new Date().toISOString()
    };
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
            why: item.summary || "Imported from source feed.",
            url: item.url,
            published: true,
            published_at: new Date().toISOString()
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

  return {
    ok: true,
    mode: "ready",
    activeSources: sources?.length ?? 0,
    rawInserted,
    mediaInserted,
    errors,
    message: "Ingestion completed. Imported media items were published automatically.",
    ingestedAt: new Date().toISOString()
  };
}
