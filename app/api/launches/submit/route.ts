import { NextResponse } from "next/server";
import { launchSubmissionSchema } from "@/lib/validation";
import { createSupabaseServiceClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = launchSubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid launch submission.",
        issues: parsed.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        message: "Launch submissions are not configured yet."
      },
      { status: 503 }
    );
  }

  const { name, category, summary, sourceUrl } = parsed.data;
  const { error } = await supabase.from("launches").insert({
    name,
    category,
    summary,
    source_url: sourceUrl || null,
    rank: 999,
    momentum: 0,
    status: "watch",
    published: false
  });

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Launch submitted for review."
  });
}
