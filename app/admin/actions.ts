"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase";

function revalidateAdminAndPublic() {
  revalidatePath("/");
  revalidatePath("/launches");
  revalidatePath("/media");
  revalidatePath("/admin");
}

export async function publishLaunch(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const rank = Number(formData.get("rank") ?? 999);
  const momentum = Number(formData.get("momentum") ?? 50);
  const status = String(formData.get("status") ?? "watch");
  const supabase = createSupabaseServiceClient();

  if (!supabase || !id) return;

  await supabase
    .from("launches")
    .update({
      rank,
      momentum,
      status,
      published: true,
      published_at: new Date().toISOString()
    })
    .eq("id", id);

  revalidateAdminAndPublic();
}

export async function unpublishLaunch(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = createSupabaseServiceClient();

  if (!supabase || !id) return;

  await supabase
    .from("launches")
    .update({
      published: false,
      published_at: null
    })
    .eq("id", id);

  revalidateAdminAndPublic();
}

export async function publishMediaItem(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = createSupabaseServiceClient();

  if (!supabase || !id) return;

  await supabase
    .from("media_items")
    .update({
      published: true,
      published_at: new Date().toISOString()
    })
    .eq("id", id);

  revalidateAdminAndPublic();
}

export async function unpublishMediaItem(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = createSupabaseServiceClient();

  if (!supabase || !id) return;

  await supabase
    .from("media_items")
    .update({
      published: false,
      published_at: null
    })
    .eq("id", id);

  revalidateAdminAndPublic();
}

export async function createSource(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "news").trim();
  const url = String(formData.get("url") ?? "").trim();
  const feedUrl = String(formData.get("feedUrl") ?? "").trim();
  const credibilityScore = Number(formData.get("credibilityScore") ?? 70);
  const supabase = createSupabaseServiceClient();

  if (!supabase || !name || !feedUrl) return;

  await supabase.from("sources").upsert(
    {
      name,
      category,
      url: url || null,
      feed_url: feedUrl,
      credibility_score: credibilityScore,
      is_active: true
    },
    { onConflict: "name" }
  );

  revalidatePath("/admin");
}
