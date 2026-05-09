import { createSupabaseServiceClient } from "@/lib/supabase";

const AWESOME_LLM_README_URL = "https://raw.githubusercontent.com/Hannibal046/Awesome-LLM/main/README.md";

const MODEL_NAME_PATTERNS = [
  /deepseek/i,
  /qwen/i,
  /openai/i,
  /\bo\d/i,
  /kimi/i,
  /llama/i,
  /mistral/i,
  /mixtral/i,
  /gemini/i,
  /claude/i,
  /grok/i
];

const PROJECT_SKIP_PATTERNS = [/tinyzero/i, /open-r1/i, /reproduction/i];

type AwesomeCandidate = {
  name: string;
  url: string;
  summary: string;
};

export type AwesomeLlmIngestResult = {
  ok: boolean;
  candidatesFetched: number;
  candidatesUpserted: number;
  errors: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferMaker(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("openai") || /\bo\d/.test(normalized)) return "OpenAI";
  if (normalized.includes("deepseek")) return "DeepSeek";
  if (normalized.includes("qwen")) return "Alibaba Cloud";
  if (normalized.includes("kimi")) return "Moonshot AI";
  if (normalized.includes("llama")) return "Meta";
  if (normalized.includes("mistral") || normalized.includes("mixtral")) return "Mistral AI";
  if (normalized.includes("gemini")) return "Google DeepMind";
  if (normalized.includes("claude")) return "Anthropic";
  if (normalized.includes("grok")) return "xAI";
  return "Unknown";
}

function isModelCandidate(candidate: AwesomeCandidate) {
  const text = `${candidate.name} ${candidate.summary}`;
  return MODEL_NAME_PATTERNS.some((pattern) => pattern.test(text)) && !PROJECT_SKIP_PATTERNS.some((pattern) => pattern.test(text));
}

function parseTrendingCandidates(markdown: string) {
  const trendingStart = markdown.indexOf("## Trending LLM Projects");
  const tocStart = markdown.indexOf("## Table of Content");

  if (trendingStart === -1 || tocStart === -1 || tocStart <= trendingStart) return [];

  const section = markdown.slice(trendingStart, tocStart);
  const candidates: AwesomeCandidate[] = [];
  const linkPattern = /- \[([^\]]+)\]\(([^)]+)\) - ([^-#\n]+?)(?= - \[[^\]]+\]\(|\n##|$)/g;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(section)) !== null) {
    candidates.push({
      name: match[1].trim(),
      url: match[2].trim(),
      summary: match[3].trim()
    });
  }

  return candidates.filter(isModelCandidate);
}

export async function ingestAwesomeLlmCandidates(): Promise<AwesomeLlmIngestResult> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      ok: true,
      candidatesFetched: 0,
      candidatesUpserted: 0,
      errors: ["Supabase service credentials are not configured."]
    };
  }

  const errors: string[] = [];
  let candidates: AwesomeCandidate[] = [];

  try {
    const response = await fetch(AWESOME_LLM_README_URL, {
      headers: {
        "User-Agent": "HIonAI/0.1 (+https://hionai.net)"
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Awesome-LLM returned ${response.status}`);
    }

    candidates = parseTrendingCandidates(await response.text());
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown Awesome-LLM error");
  }

  let candidatesUpserted = 0;

  for (const candidate of candidates) {
    const { error } = await supabase.from("ai_models").upsert(
      {
        rank: 900,
        slug: slugify(candidate.name),
        name: candidate.name,
        maker: inferMaker(candidate.name),
        summary: candidate.summary,
        strengths: ["Community signal", "Recent attention"],
        context: "Needs review",
        modality: "Text",
        access: "Needs review",
        detail_url: candidate.url,
        source: "Awesome-LLM",
        source_url: "https://github.com/Hannibal046/Awesome-LLM",
        published: false,
        published_at: null,
        last_verified_at: new Date().toISOString()
      },
      {
        onConflict: "slug"
      }
    );

    if (error) {
      errors.push(`${candidate.name}: ${error.message}`);
    } else {
      candidatesUpserted += 1;
    }
  }

  return {
    ok: errors.length === 0 || candidatesUpserted > 0,
    candidatesFetched: candidates.length,
    candidatesUpserted,
    errors
  };
}
