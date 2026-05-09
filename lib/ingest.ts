import { ingestPolymarket, type PolymarketIngestResult } from "@/lib/polymarket";
import { ingestArxiv, type ArxivIngestResult } from "@/lib/arxiv";
import { ingestKalshi, type KalshiIngestResult } from "@/lib/kalshi";
import { ingestProviderModelCards, type ModelCardIngestResult } from "@/lib/model-cards";
import { ingestProductHunt, type ProductHuntIngestResult } from "@/lib/product-hunt";
import { parseFeed } from "@/lib/rss";
import { createSupabaseServiceClient } from "@/lib/supabase";

type SourceRow = {
  id: string;
  name: string;
  category: string;
  feed_url: string | null;
  credibility_score?: number | null;
};

export type IngestResult = {
  ok: boolean;
  mode: "dry-run" | "ready";
  activeSources?: number;
  rawInserted?: number;
  mediaInserted?: number;
  productHunt?: ProductHuntIngestResult;
  modelCards?: ModelCardIngestResult;
  polymarket?: PolymarketIngestResult;
  kalshi?: KalshiIngestResult;
  arxiv?: ArxivIngestResult;
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
    .select("id,name,category,feed_url,credibility_score")
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
  const startedAt = new Date().toISOString();

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
            popularity_score: Math.max(1, Math.min(100, source.credibility_score ?? 50)),
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

  const [productHunt, modelCards, polymarket, kalshi, arxiv] = await Promise.all([
    ingestProductHunt(),
    ingestProviderModelCards(),
    ingestPolymarket(),
    ingestKalshi(),
    ingestArxiv()
  ]);
  const allErrors = [
    ...errors,
    ...productHunt.errors.map((error) => ({ source: "Product Hunt", error })),
    ...modelCards.errors.map((error) => ({ source: "Provider model cards", error })),
    ...polymarket.errors.map((error) => ({ source: "Polymarket", error })),
    ...kalshi.errors.map((error) => ({ source: "Kalshi", error })),
    ...arxiv.errors.map((error) => ({ source: "arXiv", error }))
  ];
  const status = allErrors.length > 0 ? "partial" : "success";
  const message = "Ingestion completed. Imported media, market signals, and research items were published automatically.";

  await supabase.from("ingestion_runs").insert({
    status,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    active_sources: sources?.length ?? 0,
    raw_inserted: rawInserted,
    media_inserted: mediaInserted,
    product_hunt_upserted: productHunt.postsUpserted,
    models_upserted: modelCards.modelsUpserted,
    polymarket_upserted: polymarket.marketsUpserted,
    kalshi_upserted: kalshi.marketsUpserted,
    arxiv_upserted: arxiv.papersUpserted,
    errors: allErrors,
    summary: message
  });

  return {
    ok: true,
    mode: "ready",
    activeSources: sources?.length ?? 0,
    rawInserted,
    mediaInserted,
    productHunt,
    modelCards,
    polymarket,
    kalshi,
    arxiv,
    errors: allErrors,
    message,
    ingestedAt: new Date().toISOString()
  };
}
