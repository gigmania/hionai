import {
  dailyBriefing as seedDailyBriefing,
  feedItems as seedFeedItems,
  indexBaskets as seedIndexBaskets,
  launches as seedLaunches,
  marketSignals as seedMarketSignals,
  researchItems as seedResearchItems,
  type FeedItem,
  type IndexBasket,
  type Launch,
  type MarketSignal,
  type ResearchItem
} from "@/lib/data";
import { createSupabaseClient } from "@/lib/supabase";

type BriefingItem = (typeof seedDailyBriefing)[number];

export type HomeData = {
  launches: Launch[];
  marketSignals: MarketSignal[];
  feedItems: FeedItem[];
  researchItems: ResearchItem[];
  indexBaskets: IndexBasket[];
  dailyBriefing: BriefingItem[];
  isFallback: boolean;
};

const fallbackData: HomeData = {
  launches: seedLaunches,
  marketSignals: seedMarketSignals,
  feedItems: seedFeedItems,
  researchItems: seedResearchItems,
  indexBaskets: seedIndexBaskets,
  dailyBriefing: seedDailyBriefing,
  isFallback: true
};

function fallbackIfEmpty<T>(rows: T[] | null | undefined, fallback: T[]) {
  return rows && rows.length > 0 ? rows : fallback;
}

export async function getLaunches(): Promise<Launch[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return seedLaunches;

  const { data, error } = await supabase
    .from("launches")
    .select("rank,name,category,summary,momentum,status,source,source_url,votes_count,launched_at")
    .eq("published", true)
    .order("votes_count", { ascending: false, nullsFirst: false })
    .order("rank", { ascending: true })
    .order("momentum", { ascending: false })
    .limit(50);

  if (error) return seedLaunches;
  return fallbackIfEmpty(data as Launch[] | null, seedLaunches);
}

export async function getMarketSignals(): Promise<MarketSignal[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return seedMarketSignals;

  const { data, error } = await supabase
    .from("market_signals")
    .select("question,probability,move,venue,source,url,volume,liquidity")
    .eq("published", true)
    .order("volume", { ascending: false, nullsFirst: false })
    .order("published_at", { ascending: false })
    .limit(500);

  if (error) return seedMarketSignals;
  return fallbackIfEmpty(data as MarketSignal[] | null, seedMarketSignals);
}

export async function getFeedItems(): Promise<FeedItem[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return seedFeedItems;

  const { data, error } = await supabase
    .from("media_items")
    .select("id,source,type,title,why,url,upvotes,downvotes,popularity_score,published_at")
    .eq("published", true)
    .order("popularity_score", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(30);

  if (error) return seedFeedItems;
  return fallbackIfEmpty(data as FeedItem[] | null, seedFeedItems);
}

export async function getResearchItems(): Promise<ResearchItem[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return seedResearchItems;

  const { data, error } = await supabase
    .from("research_items")
    .select("label,title,summary,level")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) return seedResearchItems;
  return fallbackIfEmpty(data as ResearchItem[] | null, seedResearchItems);
}

export async function getIndexBaskets(): Promise<IndexBasket[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return seedIndexBaskets;

  const { data, error } = await supabase
    .from("index_baskets")
    .select("name,companies,signal")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .limit(20);

  if (error) return seedIndexBaskets;
  return fallbackIfEmpty(data as IndexBasket[] | null, seedIndexBaskets);
}

export async function getDailyBriefing(): Promise<BriefingItem[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return seedDailyBriefing;

  const { data, error } = await supabase
    .from("daily_briefings")
    .select("label,text")
    .eq("published", true)
    .order("briefing_date", { ascending: false })
    .order("display_order", { ascending: true })
    .limit(6);

  if (error) return seedDailyBriefing;
  return fallbackIfEmpty(data as BriefingItem[] | null, seedDailyBriefing);
}

export async function getHomeData(): Promise<HomeData> {
  const supabase = createSupabaseClient();
  if (!supabase) return fallbackData;

  const [launches, marketSignals, feedItems, researchItems, indexBaskets, dailyBriefing] = await Promise.all([
    getLaunches(),
    getMarketSignals(),
    getFeedItems(),
    getResearchItems(),
    getIndexBaskets(),
    getDailyBriefing()
  ]);

  return {
    launches,
    marketSignals,
    feedItems,
    researchItems,
    indexBaskets,
    dailyBriefing,
    isFallback:
      launches === seedLaunches &&
      marketSignals === seedMarketSignals &&
      feedItems === seedFeedItems &&
      researchItems === seedResearchItems &&
      indexBaskets === seedIndexBaskets &&
      dailyBriefing === seedDailyBriefing
  };
}
