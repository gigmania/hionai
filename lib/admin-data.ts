import type { Launch } from "@/lib/data";
import { createSupabaseServiceClient } from "@/lib/supabase";

export type AdminLaunch = Launch & {
  id: string;
  source_url: string | null;
  published: boolean;
  created_at: string;
  published_at: string | null;
};

export type AdminMediaItem = {
  id: string;
  source: string;
  type: "News" | "Podcast" | "Video" | "Newsletter";
  title: string;
  why: string;
  url: string | null;
  published: boolean;
  created_at: string;
  published_at: string | null;
};

export type AdminSource = {
  id: string;
  name: string;
  url: string | null;
  feed_url: string | null;
  category: string;
  credibility_score: number;
  is_active: boolean;
  last_fetched_at: string | null;
  last_error: string | null;
};

export type AdminIngestionRun = {
  id: string;
  status: string;
  started_at: string;
  finished_at: string | null;
  active_sources: number;
  raw_inserted: number;
  media_inserted: number;
  product_hunt_upserted: number;
  polymarket_upserted: number;
  kalshi_upserted: number;
  arxiv_upserted: number;
  models_upserted: number;
  errors: Array<unknown>;
  summary: string | null;
};

export type AdminAiModel = {
  id: string;
  rank: number;
  slug: string;
  name: string;
  maker: string;
  summary: string;
  strengths: string[];
  context: string;
  modality: string;
  access: string;
  detail_url: string | null;
  source: string | null;
  source_url: string | null;
  published: boolean;
  created_at: string;
  published_at: string | null;
  last_verified_at: string | null;
};

function missingSupabaseError() {
  return "SUPABASE_SERVICE_ROLE_KEY is not configured.";
}

export async function getAdminLaunches() {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      launches: [] as AdminLaunch[],
      error: missingSupabaseError()
    };
  }

  const { data, error } = await supabase
    .from("launches")
    .select("id,rank,name,category,summary,momentum,status,source_url,published,created_at,published_at")
    .order("published", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return { launches: [] as AdminLaunch[], error: error.message };
  }

  return { launches: (data ?? []) as AdminLaunch[], error: null };
}

export async function getAdminMediaItems() {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      mediaItems: [] as AdminMediaItem[],
      error: missingSupabaseError()
    };
  }

  const { data, error } = await supabase
    .from("media_items")
    .select("id,source,type,title,why,url,published,created_at,published_at")
    .order("published", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return { mediaItems: [] as AdminMediaItem[], error: error.message };
  }

  return { mediaItems: (data ?? []) as AdminMediaItem[], error: null };
}

export async function getAdminSources() {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      sources: [] as AdminSource[],
      error: missingSupabaseError()
    };
  }

  const { data, error } = await supabase
    .from("sources")
    .select("id,name,url,feed_url,category,credibility_score,is_active,last_fetched_at,last_error")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return { sources: [] as AdminSource[], error: error.message };
  }

  return { sources: (data ?? []) as AdminSource[], error: null };
}

export async function getAdminIngestionRuns() {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      runs: [] as AdminIngestionRun[],
      error: missingSupabaseError()
    };
  }

  const { data, error } = await supabase
    .from("ingestion_runs")
    .select("id,status,started_at,finished_at,active_sources,raw_inserted,media_inserted,product_hunt_upserted,polymarket_upserted,kalshi_upserted,arxiv_upserted,models_upserted,errors,summary")
    .order("started_at", { ascending: false })
    .limit(10);

  if (error) {
    return { runs: [] as AdminIngestionRun[], error: error.message };
  }

  return { runs: (data ?? []) as AdminIngestionRun[], error: null };
}

export async function getAdminModels() {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      models: [] as AdminAiModel[],
      error: missingSupabaseError()
    };
  }

  const { data, error } = await supabase
    .from("ai_models")
    .select("id,rank,slug,name,maker,summary,strengths,context,modality,access,detail_url,source,source_url,published,created_at,published_at,last_verified_at")
    .order("published", { ascending: true })
    .order("rank", { ascending: true })
    .order("name", { ascending: true })
    .limit(150);

  if (error) {
    return { models: [] as AdminAiModel[], error: error.message };
  }

  return { models: (data ?? []) as AdminAiModel[], error: null };
}
