import type { Launch } from "@/lib/data";
import { createSupabaseServiceClient } from "@/lib/supabase";

export type AdminLaunch = Launch & {
  id: string;
  source_url: string | null;
  published: boolean;
  created_at: string;
  published_at: string | null;
};

export async function getAdminLaunches() {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      launches: [] as AdminLaunch[],
      error: "SUPABASE_SERVICE_ROLE_KEY is not configured."
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
