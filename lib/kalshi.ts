import { createSupabaseServiceClient } from "@/lib/supabase";

type KalshiMarket = {
  ticker?: string;
  event_ticker?: string;
  series_ticker?: string;
  title?: string;
  subtitle?: string;
  yes_sub_title?: string;
  no_sub_title?: string;
  status?: string;
  yes_bid_dollars?: string;
  yes_ask_dollars?: string;
  last_price_dollars?: string;
  previous_price_dollars?: string;
  volume_fp?: string;
  volume_24h_fp?: string;
  liquidity_dollars?: string;
  rules_primary?: string;
  rules_secondary?: string;
};

type KalshiMarketsResponse = {
  markets?: KalshiMarket[];
  cursor?: string;
};

export type KalshiIngestResult = {
  ok: boolean;
  marketsFetched: number;
  marketsUpserted: number;
  errors: string[];
};

const AI_KEYWORDS = [
  " ai ",
  "artificial intelligence",
  "machine learning",
  "llm",
  "openai",
  "chatgpt",
  "gpt",
  "anthropic",
  "claude",
  "gemini",
  "google",
  "alphabet",
  "microsoft",
  "meta",
  "amazon",
  "apple",
  "tesla",
  "xai",
  "nvidia",
  "amd",
  "broadcom",
  "tsmc",
  "arm ",
  "semiconductor",
  "semiconductors",
  "chip",
  "chips",
  "gpu",
  "data center",
  "datacenter",
  "cloud computing",
  "compute",
  "accelerator",
  "power demand",
  "robot",
  "robotics",
  "humanoid",
  "autonomous vehicle",
  "self-driving"
];

const MAX_PAGES = 8;
const TARGET_SERIES_TICKERS = ["KXLLM1"];

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isAiMarket(market: KalshiMarket) {
  const text = ` ${market.title ?? ""} ${market.subtitle ?? ""} ${market.yes_sub_title ?? ""} ${market.no_sub_title ?? ""} ${
    market.event_ticker ?? ""
  } ${market.rules_primary ?? ""} ${market.rules_secondary ?? ""} `.toLowerCase();
  return AI_KEYWORDS.some((keyword) => text.includes(keyword));
}

function probabilityFromMarket(market: KalshiMarket) {
  const last = numberValue(market.last_price_dollars);
  if (last !== null) return Math.round(last * 100);

  const bid = numberValue(market.yes_bid_dollars);
  const ask = numberValue(market.yes_ask_dollars);
  if (bid !== null && ask !== null) return Math.round(((bid + ask) / 2) * 100);

  return 0;
}

function normalizeMarket(market: KalshiMarket) {
  if (!market.ticker || !market.title) return null;

  const previous = numberValue(market.previous_price_dollars);
  const current = probabilityFromMarket(market);
  const previousPct = previous === null ? current : Math.round(previous * 100);
  const outcome = market.yes_sub_title ?? market.subtitle;
  const question = outcome && !market.title.toLowerCase().includes(outcome.toLowerCase()) ? `${market.title} ${outcome}` : market.title;

  return {
    question,
    probability: Math.max(0, Math.min(100, current)),
    move: current - previousPct,
    venue: "Kalshi",
    source: "Kalshi",
    external_id: market.ticker,
    url: `https://kalshi.com/markets/${market.ticker}`,
    volume: numberValue(market.volume_24h_fp) ?? numberValue(market.volume_fp),
    liquidity: numberValue(market.liquidity_dollars),
    source_url: `https://kalshi.com/markets/${market.ticker}`,
    published: true,
    published_at: new Date().toISOString()
  };
}

export async function ingestKalshi(): Promise<KalshiIngestResult> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      ok: true,
      marketsFetched: 0,
      marketsUpserted: 0,
      errors: ["Supabase service credentials are not configured."]
    };
  }

  const errors: string[] = [];
  const seen = new Set<string>();
  let markets: KalshiMarket[] = [];

  async function fetchMarkets(params: URLSearchParams) {
    const response = await fetch(`https://external-api.kalshi.com/trade-api/v2/markets?${params.toString()}`, {
      headers: {
        "User-Agent": "HIonAI/0.1 (+https://hionai.net)"
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Kalshi markets returned ${response.status}`);
    }

    return (await response.json()) as KalshiMarketsResponse;
  }

  function addMarket(market: KalshiMarket, force = false) {
    const key = market.ticker ?? market.title;
    if (!key || seen.has(key) || (!force && !isAiMarket(market))) return;
    seen.add(key);
    markets.push(market);
  }

  try {
    for (const seriesTicker of TARGET_SERIES_TICKERS) {
      let cursor: string | undefined;

      for (let page = 0; page < MAX_PAGES; page += 1) {
        const params = new URLSearchParams({
          limit: "1000",
          status: "open",
          series_ticker: seriesTicker
        });

        if (cursor) params.set("cursor", cursor);

        const payload = await fetchMarkets(params);
        for (const market of payload.markets ?? []) addMarket(market, true);

        cursor = payload.cursor || undefined;
        if (!cursor) break;
      }
    }

    let cursor: string | undefined;

    for (let page = 0; page < MAX_PAGES; page += 1) {
      const params = new URLSearchParams({
        limit: "1000",
        status: "open"
      });

      if (cursor) params.set("cursor", cursor);

      const payload = await fetchMarkets(params);
      for (const market of payload.markets ?? []) addMarket(market);

      cursor = payload.cursor || undefined;
      if (!cursor) break;
    }

    markets = markets
      .sort((a, b) => (numberValue(b.volume_24h_fp) ?? numberValue(b.volume_fp) ?? 0) - (numberValue(a.volume_24h_fp) ?? numberValue(a.volume_fp) ?? 0))
      .slice(0, 150);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown Kalshi error");
  }

  let marketsUpserted = 0;

  for (const market of markets) {
    const normalized = normalizeMarket(market);
    if (!normalized) continue;

    const { error } = await supabase.from("market_signals").upsert(normalized, {
      onConflict: "question"
    });

    if (error) {
      errors.push(error.message);
    } else {
      marketsUpserted += 1;
    }
  }

  return {
    ok: errors.length === 0 || marketsUpserted > 0,
    marketsFetched: markets.length,
    marketsUpserted,
    errors
  };
}
