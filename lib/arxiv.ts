import { XMLParser } from "fast-xml-parser";
import { createSupabaseServiceClient } from "@/lib/supabase";

type ArxivEntry = {
  id?: string;
  title?: string;
  summary?: string;
  published?: string;
  updated?: string;
  author?: { name?: string } | Array<{ name?: string }>;
};

type ArxivFeed = {
  feed?: {
    entry?: ArxivEntry | ArxivEntry[];
  };
};

export type ArxivIngestResult = {
  ok: boolean;
  papersFetched: number;
  papersUpserted: number;
  errors: string[];
};

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function cleanText(value: string | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export async function ingestArxiv(): Promise<ArxivIngestResult> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      ok: true,
      papersFetched: 0,
      papersUpserted: 0,
      errors: ["Supabase service credentials are not configured."]
    };
  }

  const errors: string[] = [];
  let entries: ArxivEntry[] = [];

  try {
    const params = new URLSearchParams({
      search_query: "cat:cs.AI OR cat:cs.LG OR cat:cs.CL",
      start: "0",
      max_results: "20",
      sortBy: "submittedDate",
      sortOrder: "descending"
    });

    const response = await fetch(`https://export.arxiv.org/api/query?${params.toString()}`, {
      headers: {
        "User-Agent": "HIonAI/0.1 (+https://hionai.net)"
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`arXiv API returned ${response.status}`);
    }

    const xml = await response.text();
    const parsed = parser.parse(xml) as ArxivFeed;
    entries = asArray(parsed.feed?.entry);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown arXiv error");
  }

  let papersUpserted = 0;

  for (const entry of entries) {
    const title = cleanText(entry.title);
    const summary = cleanText(entry.summary).slice(0, 700);
    if (!title || !summary) continue;

    const { error } = await supabase.from("research_items").upsert(
      {
        label: "arXiv",
        title,
        summary,
        level: "Researcher",
        source_url: entry.id ?? null,
        published: true,
        published_at: new Date().toISOString()
      },
      {
        onConflict: "title"
      }
    );

    if (error) {
      errors.push(error.message);
    } else {
      papersUpserted += 1;
    }
  }

  return {
    ok: errors.length === 0 || papersUpserted > 0,
    papersFetched: entries.length,
    papersUpserted,
    errors
  };
}
