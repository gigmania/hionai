import { createSupabaseServiceClient } from "@/lib/supabase";

type PolymarketMarket = {
  id?: string | number;
  conditionId?: string;
  slug?: string;
  eventSlug?: string;
  event?: { slug?: string };
  events?: Array<{ slug?: string }>;
  question?: string;
  title?: string;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  volume?: string | number;
  volumeNum?: string | number;
  liquidity?: string | number;
  liquidityNum?: string | number;
  lastTradePrice?: string | number;
  bestBid?: string | number;
  bestAsk?: string | number;
  oneDayPriceChange?: string | number;
  outcomePrices?: string | string[] | number[];
};

type PublicSearchResponse = {
  events?: Array<{
    slug?: string;
    markets?: PolymarketMarket[];
  }>;
  markets?: PolymarketMarket[];
};

export type PolymarketIngestResult = {
  ok: boolean;
  marketsFetched: number;
  marketsUpserted: number;
  errors: string[];
};

const SEARCH_QUERIES = ["artificial intelligence", "AI", "OpenAI", "ChatGPT", "Anthropic", "Nvidia"];
const AI_KEYWORDS = [
  " ai ",
  "artificial intelligence",
  "openai",
  "chatgpt",
  "gpt",
  "anthropic",
  "claude",
  "gemini",
  "deepmind",
  "llm",
  "nvidia",
  "gpu",
  "machine learning"
];

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseOutcomePrices(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value.map(numberValue).filter((item): item is number => item !== null);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parseOutcomePrices(parsed);
    } catch {
      return [];
    }
  }

  return [];
}

function probabilityFromMarket(market: PolymarketMarket) {
  const lastTrade = numberValue(market.lastTradePrice);
  if (lastTrade !== null) return Math.round(lastTrade * 100);

  const bestBid = numberValue(market.bestBid);
  const bestAsk = numberValue(market.bestAsk);
  if (bestBid !== null && bestAsk !== null) return Math.round(((bestBid + bestAsk) / 2) * 100);

  const [yesPrice] = parseOutcomePrices(market.outcomePrices);
  if (yesPrice !== undefined) return Math.round(yesPrice * 100);

  return 0;
}

function isAiMarket(market: PolymarketMarket) {
  const text = ` ${market.question ?? ""} ${market.title ?? ""} `.toLowerCase();
  return AI_KEYWORDS.some((keyword) => text.includes(keyword));
}

function marketUrl(market: PolymarketMarket) {
  const slug = market.eventSlug ?? market.event?.slug ?? market.events?.[0]?.slug ?? market.slug;
  return slug ? `https://polymarket.com/event/${slug}` : "https://polymarket.com/markets";
}

function normalizeMarket(market: PolymarketMarket) {
  const question = market.question ?? market.title;
  if (!question) return null;

  const volume = numberValue(market.volumeNum) ?? numberValue(market.volume);
  const liquidity = numberValue(market.liquidityNum) ?? numberValue(market.liquidity);

  return {
    question,
    probability: Math.max(0, Math.min(100, probabilityFromMarket(market))),
    move: Math.round((numberValue(market.oneDayPriceChange) ?? 0) * 100),
    venue: "Polymarket",
    source: "Polymarket",
    external_id: String(market.conditionId ?? market.id ?? market.slug ?? question),
    url: marketUrl(market),
    volume,
    liquidity,
    source_url: marketUrl(market),
    published: true,
    published_at: new Date().toISOString()
  };
}

export async function ingestPolymarket(): Promise<PolymarketIngestResult> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      ok: true,
      marketsFetched: 0,
      marketsUpserted: 0,
      errors: ["Supabase service credentials are not configured."]
    };
  }

  const seen = new Set<string>();
  const markets: PolymarketMarket[] = [];
  const errors: string[] = [];

  for (const query of SEARCH_QUERIES) {
    try {
      const params = new URLSearchParams({
        q: query,
        limit_per_type: "12",
        events_status: "active",
        keep_closed_markets: "0"
      });
      const response = await fetch(`https://gamma-api.polymarket.com/public-search?${params.toString()}`, {
        headers: {
          "User-Agent": "HIonAI/0.1 (+https://hionai.net)"
        },
        next: { revalidate: 0 }
      });

      if (!response.ok) {
        throw new Error(`Polymarket search returned ${response.status}`);
      }

      const payload = (await response.json()) as PublicSearchResponse;
      const found = [
        ...(payload.markets ?? []),
        ...(payload.events ?? []).flatMap((event) => (event.markets ?? []).map((market) => ({ ...market, eventSlug: event.slug })))
      ];

      for (const market of found) {
        const key = String(market.conditionId ?? market.id ?? market.slug ?? market.question);
        if (!key || seen.has(key) || market.closed || market.archived || !isAiMarket(market)) continue;
        seen.add(key);
        markets.push(market);
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Unknown Polymarket error");
    }
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
