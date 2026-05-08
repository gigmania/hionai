"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase";

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

  revalidatePath("/");
  revalidatePath("/launches");
  revalidatePath("/admin");
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

  revalidatePath("/");
  revalidatePath("/launches");
  revalidatePath("/admin");
}
