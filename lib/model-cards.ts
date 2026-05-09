import { aiModels } from "@/lib/data";
import { createSupabaseServiceClient } from "@/lib/supabase";

export type ModelCardIngestResult = {
  ok: boolean;
  modelsUpserted: number;
  errors: string[];
};

export async function ingestProviderModelCards(): Promise<ModelCardIngestResult> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      ok: true,
      modelsUpserted: 0,
      errors: ["Supabase service credentials are not configured."]
    };
  }

  const errors: string[] = [];
  let modelsUpserted = 0;
  const verifiedAt = new Date().toISOString();

  for (const [index, model] of aiModels.entries()) {
    const { error } = await supabase.from("ai_models").upsert(
      {
        rank: index + 1,
        slug: model.slug,
        name: model.name,
        maker: model.maker,
        summary: model.summary,
        strengths: model.strengths,
        context: model.context,
        modality: model.modality,
        access: model.access,
        detail_url: model.detailUrl,
        source: "Provider model card",
        source_url: model.detailUrl,
        published: true,
        published_at: verifiedAt,
        last_verified_at: verifiedAt
      },
      {
        onConflict: "slug"
      }
    );

    if (error) {
      errors.push(`${model.name}: ${error.message}`);
    } else {
      modelsUpserted += 1;
    }
  }

  return {
    ok: errors.length === 0 || modelsUpserted > 0,
    modelsUpserted,
    errors
  };
}
