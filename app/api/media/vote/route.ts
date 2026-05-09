import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase";

const voteSchema = z.object({
  id: z.string().uuid(),
  direction: z.enum(["up", "down"])
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = voteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid vote." }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Voting is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("media_items")
    .select("upvotes,downvotes,popularity_score")
    .eq("id", parsed.data.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, message: error?.message || "Story not found." }, { status: 404 });
  }

  const upvotes = Number(data.upvotes ?? 0) + (parsed.data.direction === "up" ? 1 : 0);
  const downvotes = Number(data.downvotes ?? 0) + (parsed.data.direction === "down" ? 1 : 0);
  const popularityScore = Math.max(0, Number(data.popularity_score ?? 0) + (parsed.data.direction === "up" ? 3 : -2));

  const { error: updateError } = await supabase
    .from("media_items")
    .update({
      upvotes,
      downvotes,
      popularity_score: popularityScore
    })
    .eq("id", parsed.data.id);

  if (updateError) {
    return NextResponse.json({ ok: false, message: updateError.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/media");

  return NextResponse.json({
    ok: true,
    upvotes,
    downvotes,
    popularity_score: popularityScore
  });
}
