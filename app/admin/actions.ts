"use server";

import { revalidatePath } from "next/cache";
import { ingestSources } from "@/lib/ingest";
import { createSupabaseServiceClient } from "@/lib/supabase";

function revalidateAdminAndPublic() {
  revalidatePath("/");
  revalidatePath("/launches");
  revalidatePath("/media");
  revalidatePath("/models");
  revalidatePath("/admin");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseStrengths(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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

export async function upsertModel(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const maker = String(formData.get("maker") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const rank = Number(formData.get("rank") ?? 999);
  const context = String(formData.get("context") ?? "").trim();
  const modality = String(formData.get("modality") ?? "").trim();
  const access = String(formData.get("access") ?? "").trim();
  const detailUrl = String(formData.get("detailUrl") ?? "").trim();
  const source = String(formData.get("source") ?? "Provider model card").trim();
  const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
  const published = formData.get("published") === "on";
  const supabase = createSupabaseServiceClient();

  if (!supabase || !name || !slug || !maker || !summary) return;

  const payload = {
    rank,
    slug,
    name,
    maker,
    summary,
    strengths: parseStrengths(formData.get("strengths")),
    context,
    modality,
    access,
    detail_url: detailUrl || null,
    source: source || "Provider model card",
    source_url: sourceUrl || detailUrl || null,
    published,
    published_at: published ? new Date().toISOString() : null,
    last_verified_at: new Date().toISOString()
  };

  if (id) {
    await supabase.from("ai_models").update(payload).eq("id", id);
  } else {
    await supabase.from("ai_models").upsert(payload, { onConflict: "slug" });
  }

  revalidatePath("/");
  revalidatePath("/models");
  revalidatePath(`/models/${slug}`);
  revalidatePath("/admin");
}

export async function publishModel(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const supabase = createSupabaseServiceClient();

  if (!supabase || !id) return;

  await supabase
    .from("ai_models")
    .update({
      published: true,
      published_at: new Date().toISOString(),
      last_verified_at: new Date().toISOString()
    })
    .eq("id", id);

  revalidatePath("/models");
  revalidatePath(`/models/${slug}`);
  revalidatePath("/admin");
}

export async function unpublishModel(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const supabase = createSupabaseServiceClient();

  if (!supabase || !id) return;

  await supabase
    .from("ai_models")
    .update({
      published: false,
      published_at: null
    })
    .eq("id", id);

  revalidatePath("/models");
  revalidatePath(`/models/${slug}`);
  revalidatePath("/admin");
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

export async function runIngestion() {
  await ingestSources();
  revalidatePath("/");
  revalidatePath("/media");
  revalidatePath("/models");
  revalidatePath("/admin");
}
