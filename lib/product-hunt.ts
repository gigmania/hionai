import { createSupabaseServiceClient } from "@/lib/supabase";

type ProductHuntPost = {
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  url?: string | null;
  votesCount?: number | null;
  createdAt?: string | null;
  topics?: {
    edges?: Array<{
      node?: {
        name?: string | null;
      };
    }>;
  };
};

type ProductHuntResponse = {
  data?: {
    posts?: {
      edges?: Array<{
        node?: ProductHuntPost;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
};

export type ProductHuntIngestResult = {
  ok: boolean;
  postsFetched: number;
  postsUpserted: number;
  errors: string[];
};

const AI_KEYWORDS = [
  " ai ",
  "artificial intelligence",
  "agent",
  "agents",
  "llm",
  "gpt",
  "chatgpt",
  "openai",
  "claude",
  "gemini",
  "copilot",
  "automation",
  "model",
  "prompt"
];

function isAiLaunch(post: ProductHuntPost) {
  const topics = post.topics?.edges?.map((edge) => edge.node?.name ?? "").join(" ") ?? "";
  const text = ` ${post.name} ${post.tagline ?? ""} ${post.description ?? ""} ${topics} `.toLowerCase();
  return AI_KEYWORDS.some((keyword) => text.includes(keyword));
}

function launchStatus(votes: number) {
  if (votes >= 250) return "hot";
  if (votes >= 75) return "rising";
  return "watch";
}

export async function ingestProductHunt(): Promise<ProductHuntIngestResult> {
  const token = process.env.PRODUCT_HUNT_TOKEN;
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return {
      ok: true,
      postsFetched: 0,
      postsUpserted: 0,
      errors: ["Supabase service credentials are not configured."]
    };
  }

  if (!token) {
    return {
      ok: true,
      postsFetched: 0,
      postsUpserted: 0,
      errors: ["PRODUCT_HUNT_TOKEN is not configured."]
    };
  }

  const query = `
    query HionaiProductHuntPosts {
      posts(first: 50, order: VOTES) {
        edges {
          node {
            id
            name
            tagline
            description
            url
            votesCount
            createdAt
            topics {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const errors: string[] = [];
  let posts: ProductHuntPost[] = [];

  try {
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "HIonAI/0.1 (+https://hionai.net)"
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Product Hunt API returned ${response.status}`);
    }

    const payload = (await response.json()) as ProductHuntResponse;
    if (payload.errors?.length) {
      throw new Error(payload.errors.map((error) => error.message).join("; "));
    }

    posts = (payload.data?.posts?.edges ?? []).map((edge) => edge.node).filter((post): post is ProductHuntPost => Boolean(post));
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown Product Hunt error");
  }

  const aiPosts = posts.filter(isAiLaunch).slice(0, 30);
  let postsUpserted = 0;

  for (const post of aiPosts) {
    const votes = post.votesCount ?? 0;
    const { error } = await supabase.from("launches").upsert(
      {
        name: post.name,
        category: "Product Hunt",
        summary: post.tagline || post.description || "AI launch imported from Product Hunt.",
        momentum: Math.max(0, Math.min(100, Math.round(votes / 4))),
        status: launchStatus(votes),
        source_url: post.url,
        source: "Product Hunt",
        external_id: post.id,
        votes_count: votes,
        launched_at: post.createdAt,
        published: true,
        published_at: new Date().toISOString()
      },
      {
        onConflict: "name"
      }
    );

    if (error) {
      errors.push(error.message);
    } else {
      postsUpserted += 1;
    }
  }

  return {
    ok: errors.length === 0 || postsUpserted > 0,
    postsFetched: posts.length,
    postsUpserted,
    errors
  };
}
