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
