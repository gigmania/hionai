import { createSupabaseServiceClient } from "@/lib/supabase";

type KalshiMarket = {
  ticker?: string;
  title?: string;
  subtitle?: string;
  status?: string;
  yes_bid_dollars?: string;
  yes_ask_dollars?: string;
  last_price_dollars?: string;
  previous_price_dollars?: string;
  volume_fp?: string;
  volume_24h_fp?: string;
  liquidity_dollars?: string;
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
  "openai",
  "chatgpt",
  "gpt",
  "anthropic",
  "claude",
  "gemini",
  "nvidia",
  "semiconductor",
  "chip",
  "gpu"
];

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isAiMarket(market: KalshiMarket) {
  const text = ` ${market.title ?? ""} ${market.subtitle ?? ""} `.toLowerCase();
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

  return {
    question: market.title,
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
  let markets: KalshiMarket[] = [];

  try {
    const params = new URLSearchParams({
      limit: "1000",
      status: "open",
      mve_filter: "exclude"
    });
    const response = await fetch(`https://external-api.kalshi.com/trade-api/v2/markets?${params.toString()}`, {
      headers: {
        "User-Agent": "HIonAI/0.1 (+https://hionai.net)"
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Kalshi markets returned ${response.status}`);
    }

    const payload = (await response.json()) as KalshiMarketsResponse;
    markets = (payload.markets ?? []).filter(isAiMarket).slice(0, 40);
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
