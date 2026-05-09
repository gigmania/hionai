import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  Flame,
  Newspaper,
  Cpu,
  Rocket,
  TrendingUp
} from "lucide-react";

export type Launch = {
  rank: number;
  name: string;
  category: string;
  summary: string;
  momentum: number;
  status: "hot" | "rising" | "watch";
  source?: string | null;
  source_url?: string | null;
  votes_count?: number | null;
  launched_at?: string | null;
};

export type MarketSignal = {
  question: string;
  probability: number;
  move: number;
  venue: string;
  source?: string | null;
  url?: string | null;
  volume?: number | null;
  liquidity?: number | null;
};

export type FeedItem = {
  id?: string;
  source: string;
  type: "News" | "Podcast" | "Video" | "Newsletter";
  title: string;
  why: string;
  url?: string | null;
  upvotes: number;
  downvotes: number;
  popularity_score: number;
  published_at?: string | null;
};

export type ResearchItem = {
  label: string;
  title: string;
  summary: string;
  level: "Beginner" | "Practitioner" | "Researcher";
};

export type IndexBasket = {
  name: string;
  companies: string[];
  signal: string;
};

export type AiModel = {
  slug: string;
  name: string;
  maker: string;
  summary: string;
  strengths: string[];
  context: string;
  modality: string;
  access: string;
  detailUrl: string;
  rank?: number;
  source?: string | null;
  sourceUrl?: string | null;
  published?: boolean;
  lastVerifiedAt?: string | null;
};

export const navItems = [
  { href: "/launches", label: "Launches" },
  { href: "/markets", label: "Markets" },
  { href: "/media", label: "Media" },
  { href: "/research", label: "Research" },
  { href: "/models", label: "Models" },
  { href: "/ai-index", label: "Index" },
  { href: "/submit", label: "Submit" }
];

export const productPillars = [
  {
    title: "Launches",
    description: "Rank new AI products, agents, models, APIs, and open-source projects by real-world usefulness.",
    icon: Rocket
  },
  {
    title: "Markets",
    description: "Track AI-related prediction markets, probability moves, volumes, and event risk.",
    icon: BarChart3
  },
  {
    title: "Media",
    description: "Curate news, podcasts, interviews, newsletters, and video into concise signal briefs.",
    icon: Newspaper
  },
  {
    title: "Research",
    description: "Summarize papers, model cards, benchmarks, evals, and safety reports for practitioners.",
    icon: BookOpenText
  },
  {
    title: "Index",
    description: "Map public and private AI exposure across compute, cloud, apps, infra, energy, and data.",
    icon: TrendingUp
  },
  {
    title: "Capital",
    description: "Follow funding rounds, valuation changes, strategic investments, and ecosystem concentration.",
    icon: BriefcaseBusiness
  },
  {
    title: "Models",
    description: "Compare frontier, open-weight, coding, reasoning, multimodal, and specialist AI models.",
    icon: Cpu
  }
];

export const launches: Launch[] = [
  {
    rank: 1,
    name: "Runloop Agent Desk",
    category: "Coding agents",
    summary: "Queues long-running repo tasks, posts completion alerts, and keeps humans in the approval loop.",
    momentum: 94,
    status: "hot"
  },
  {
    rank: 2,
    name: "EvalForge",
    category: "Model evaluation",
    summary: "Builds repeatable eval suites from internal tickets, transcripts, and regression examples.",
    momentum: 86,
    status: "rising"
  },
  {
    rank: 3,
    name: "Briefly Labs",
    category: "Research",
    summary: "Turns papers, filings, and podcasts into source-linked analyst briefs for operators.",
    momentum: 78,
    status: "rising"
  },
  {
    rank: 4,
    name: "VoiceOps Copilot",
    category: "Voice AI",
    summary: "Captures calls, creates follow-ups, and routes updates into CRM and ticketing tools.",
    momentum: 71,
    status: "watch"
  }
];

export const marketSignals: MarketSignal[] = [
  {
    question: "Frontier model released before quarter end",
    probability: 64,
    move: 8,
    venue: "Prediction markets",
    source: "Seed",
    url: null,
    volume: 125000,
    liquidity: 22000
  },
  {
    question: "Open-weight model tops coding benchmark",
    probability: 51,
    move: 5,
    venue: "Model markets",
    source: "Seed",
    url: null,
    volume: 78000,
    liquidity: 14000
  },
  {
    question: "Major AI regulation passes this year",
    probability: 38,
    move: -4,
    venue: "Policy markets",
    source: "Seed",
    url: null,
    volume: 63000,
    liquidity: 9000
  },
  {
    question: "AI infrastructure capex beats consensus",
    probability: 72,
    move: 0,
    venue: "Equity-linked",
    source: "Seed",
    url: null,
    volume: 101000,
    liquidity: 18000
  }
];

export const feedItems: FeedItem[] = [
  {
    source: "Operator Brief",
    type: "News",
    title: "Enterprise AI budgets move from pilots to renewal scrutiny.",
    why: "Procurement teams are asking for measurable workflow impact instead of demo velocity.",
    url: null,
    upvotes: 42,
    downvotes: 3,
    popularity_score: 91
  },
  {
    source: "Founder Interview",
    type: "Podcast",
    title: "What real agent adoption looks like inside technical teams.",
    why: "The adoption pattern is supervised queues first, autonomous work later.",
    url: null,
    upvotes: 31,
    downvotes: 4,
    popularity_score: 78
  },
  {
    source: "Benchmark Desk",
    type: "Video",
    title: "Why eval design now matters more than headline model scores.",
    why: "Teams need task-specific regressions, not generalized leaderboard confidence.",
    url: null,
    upvotes: 25,
    downvotes: 2,
    popularity_score: 72
  },
  {
    source: "Infra Weekly",
    type: "Newsletter",
    title: "Power constraints are becoming product constraints for AI platforms.",
    why: "Data center availability is now a core competitive variable.",
    url: null,
    upvotes: 19,
    downvotes: 1,
    popularity_score: 66
  }
];

export const researchItems: ResearchItem[] = [
  {
    label: "Paper of the day",
    title: "Reliability evaluation for long-horizon agents",
    summary: "A practical framework for testing recovery, tool use, uncertainty, memory, and human handoff.",
    level: "Practitioner"
  },
  {
    label: "Benchmark",
    title: "Maintenance-oriented coding evals",
    summary: "A benchmark suite focused on debugging, dependency drift, repo context, and refactor safety.",
    level: "Researcher"
  },
  {
    label: "Model card",
    title: "Multimodal risk and refusal update",
    summary: "Tracks behavior changes across image understanding, sensitive requests, and safety boundaries.",
    level: "Practitioner"
  }
];

export const aiModels: AiModel[] = [
  {
    slug: "gpt-5-5",
    name: "GPT-5.5",
    maker: "OpenAI",
    summary: "OpenAI frontier model used for complex coding, research, agentic workflows, and real-world professional work.",
    strengths: ["Deep reasoning", "Coding", "Research", "Agentic workflows"],
    context: "Large",
    modality: "Text, tools, multimodal-capable workflows",
    access: "OpenAI API and ChatGPT",
    detailUrl: "https://platform.openai.com/docs/models"
  },
  {
    slug: "gpt-5-4",
    name: "GPT-5.4",
    maker: "OpenAI",
    summary: "Strong general-purpose OpenAI model for everyday coding, analysis, writing, and application workflows.",
    strengths: ["Coding", "Analysis", "Tool use", "General assistant tasks"],
    context: "Large",
    modality: "Text and tool use",
    access: "OpenAI API and ChatGPT",
    detailUrl: "https://platform.openai.com/docs/models"
  },
  {
    slug: "gpt-5-3-codex",
    name: "GPT-5.3 Codex",
    maker: "OpenAI",
    summary: "Coding-optimized OpenAI model focused on repository work, implementation, refactors, and debugging.",
    strengths: ["Code generation", "Repo navigation", "Debugging", "Refactoring"],
    context: "Large",
    modality: "Text and code",
    access: "OpenAI API and Codex",
    detailUrl: "https://platform.openai.com/docs/models"
  },
  {
    slug: "gpt-4o",
    name: "GPT-4o",
    maker: "OpenAI",
    summary: "A multimodal general-purpose model family designed for fast text, vision, and audio-native assistant experiences.",
    strengths: ["Multimodal UX", "General reasoning", "Tool use", "Low-latency interaction"],
    context: "Large",
    modality: "Text, vision, audio",
    access: "API and ChatGPT",
    detailUrl: "https://openai.com/index/hello-gpt-4o/"
  },
  {
    slug: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    maker: "Anthropic",
    summary: "A strong general assistant and coding model known for writing quality, analysis, and long-context workflows.",
    strengths: ["Writing", "Coding", "Long-context analysis", "Enterprise workflows"],
    context: "Large",
    modality: "Text and vision",
    access: "API and Claude",
    detailUrl: "https://www.anthropic.com/news/claude-3-5-sonnet"
  },
  {
    slug: "claude-3-opus",
    name: "Claude 3 Opus",
    maker: "Anthropic",
    summary: "Anthropic model known for high-quality reasoning, writing, and complex analysis across long documents.",
    strengths: ["Reasoning", "Writing", "Long documents", "Analysis"],
    context: "Large",
    modality: "Text and vision",
    access: "API and Claude",
    detailUrl: "https://www.anthropic.com/claude"
  },
  {
    slug: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    maker: "Google DeepMind",
    summary: "A long-context multimodal model aimed at complex analysis across documents, code, video, and structured inputs.",
    strengths: ["Long context", "Multimodal analysis", "Google ecosystem", "Document reasoning"],
    context: "Very large",
    modality: "Text, vision, audio, video",
    access: "API and Gemini",
    detailUrl: "https://deepmind.google/technologies/gemini/"
  },
  {
    slug: "gemini-1-5-flash",
    name: "Gemini 1.5 Flash",
    maker: "Google DeepMind",
    summary: "Fast multimodal Gemini model optimized for lower-latency and cost-sensitive high-volume workloads.",
    strengths: ["Speed", "Cost efficiency", "Multimodal tasks", "Long context"],
    context: "Large",
    modality: "Text, vision, audio, video",
    access: "API and Gemini",
    detailUrl: "https://deepmind.google/technologies/gemini/"
  },
  {
    slug: "llama-3-1",
    name: "Llama 3.1",
    maker: "Meta",
    summary: "An open-weight model family used widely for self-hosted assistants, fine-tuning, and application-specific deployments.",
    strengths: ["Open weights", "Fine-tuning", "Self-hosting", "Ecosystem support"],
    context: "Varies",
    modality: "Text",
    access: "Open weights",
    detailUrl: "https://ai.meta.com/llama/"
  },
  {
    slug: "llama-3-1-405b",
    name: "Llama 3.1 405B",
    maker: "Meta",
    summary: "Large open-weight Llama model used for high-end self-hosted and fine-tuned applications.",
    strengths: ["Open weights", "Fine-tuning", "Self-hosting", "Large model quality"],
    context: "Large",
    modality: "Text",
    access: "Open weights",
    detailUrl: "https://ai.meta.com/llama/"
  },
  {
    slug: "mistral-large",
    name: "Mistral Large",
    maker: "Mistral AI",
    summary: "A frontier-style commercial model from Mistral focused on multilingual reasoning, coding, and enterprise deployment.",
    strengths: ["Multilingual", "Enterprise deployment", "Coding", "European AI stack"],
    context: "Large",
    modality: "Text",
    access: "API",
    detailUrl: "https://mistral.ai/technology/"
  },
  {
    slug: "mixtral-8x22b",
    name: "Mixtral 8x22B",
    maker: "Mistral AI",
    summary: "Sparse mixture-of-experts open model used for efficient high-capability text generation and reasoning.",
    strengths: ["Open model ecosystem", "Efficiency", "Multilingual", "Reasoning"],
    context: "Large",
    modality: "Text",
    access: "Open weights and API",
    detailUrl: "https://mistral.ai/technology/"
  },
  {
    slug: "deepseek-coder",
    name: "DeepSeek Coder",
    maker: "DeepSeek",
    summary: "A coding-focused model family popular for code generation, repository tasks, and open model experimentation.",
    strengths: ["Code generation", "Open model ecosystem", "Developer workflows", "Cost efficiency"],
    context: "Varies",
    modality: "Text and code",
    access: "API and open weights",
    detailUrl: "https://www.deepseek.com/"
  },
  {
    slug: "deepseek-v2",
    name: "DeepSeek-V2",
    maker: "DeepSeek",
    summary: "Efficient mixture-of-experts model family used for general text, code, and cost-sensitive deployment.",
    strengths: ["Efficiency", "Coding", "Open ecosystem", "Cost performance"],
    context: "Large",
    modality: "Text and code",
    access: "API and open weights",
    detailUrl: "https://www.deepseek.com/"
  },
  {
    slug: "qwen-2-5",
    name: "Qwen 2.5",
    maker: "Alibaba Cloud",
    summary: "Open model family with strong multilingual, coding, and general assistant capabilities across sizes.",
    strengths: ["Multilingual", "Coding", "Open weights", "Multiple sizes"],
    context: "Varies",
    modality: "Text and code",
    access: "API and open weights",
    detailUrl: "https://qwenlm.github.io/"
  },
  {
    slug: "command-r-plus",
    name: "Command R+",
    maker: "Cohere",
    summary: "Enterprise-focused model optimized for retrieval-augmented generation, tool use, and business workflows.",
    strengths: ["RAG", "Enterprise search", "Tool use", "Grounded generation"],
    context: "Large",
    modality: "Text",
    access: "API",
    detailUrl: "https://cohere.com/command"
  },
  {
    slug: "grok",
    name: "Grok",
    maker: "xAI",
    summary: "xAI assistant/model family integrated with X and positioned around real-time information access.",
    strengths: ["Realtime context", "Consumer assistant", "Social signal", "General reasoning"],
    context: "Large",
    modality: "Text and multimodal variants",
    access: "xAI and X",
    detailUrl: "https://x.ai/"
  },
  {
    slug: "stable-diffusion-3",
    name: "Stable Diffusion 3",
    maker: "Stability AI",
    summary: "Image generation model family focused on prompt adherence, typography, and open creative workflows.",
    strengths: ["Image generation", "Creative workflows", "Open ecosystem", "Prompt adherence"],
    context: "Image model",
    modality: "Image",
    access: "API and model releases",
    detailUrl: "https://stability.ai/"
  },
  {
    slug: "runway-gen-3",
    name: "Runway Gen-3",
    maker: "Runway",
    summary: "Video generation model family for cinematic generation, editing, and creative production workflows.",
    strengths: ["Video generation", "Creative production", "Editing workflows", "Motion control"],
    context: "Video model",
    modality: "Video",
    access: "Runway",
    detailUrl: "https://runwayml.com/"
  }
];

export const indexBaskets: IndexBasket[] = [
  {
    name: "Compute",
    companies: ["NVIDIA", "AMD", "Broadcom", "TSMC", "ASML", "Arm"],
    signal: "Accelerator supply, networking, packaging, and utilization remain the central AI bottleneck."
  },
  {
    name: "Cloud and platforms",
    companies: ["Microsoft", "Amazon", "Google", "Oracle", "CoreWeave"],
    signal: "Distribution and committed capacity shape which model companies can scale."
  },
  {
    name: "Applications",
    companies: ["OpenAI", "Anthropic", "Perplexity", "Runway", "Harvey"],
    signal: "The application layer is splitting into consumer assistants and vertical workflow systems."
  },
  {
    name: "Energy and infrastructure",
    companies: ["Utilities", "Data centers", "Cooling", "Storage", "Networking"],
    signal: "Power contracts and data center approvals are turning into AI growth indicators."
  }
];

export const dailyBriefing = [
  {
    label: "Launch",
    text: "Agent products are converging on supervised queues, status alerts, and workflow handoffs."
  },
  {
    label: "Market",
    text: "Prediction markets are repricing near-term frontier model release expectations."
  },
  {
    label: "Research",
    text: "Long-horizon agent evals are becoming the most important practical research theme."
  },
  {
    label: "Capital",
    text: "Infrastructure exposure is widening from chips into power, cooling, and networking."
  }
];

export const ingestionRoadmap = [
  {
    title: "Manual curation",
    description: "Start with admin-approved seed data and daily editorial briefs.",
    icon: Flame
  },
  {
    title: "Scheduled ingestion",
    description: "Pull RSS, arXiv, market APIs, launch feeds, and company updates every 15 minutes.",
    icon: BarChart3
  },
  {
    title: "Realtime surfaces",
    description: "Use Supabase Realtime for odds changes, breaking items, and admin publish events.",
    icon: TrendingUp
  }
];
