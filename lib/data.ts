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
    slug: "deepseek-coder",
    name: "DeepSeek Coder",
    maker: "DeepSeek",
    summary: "A coding-focused model family popular for code generation, repository tasks, and open model experimentation.",
    strengths: ["Code generation", "Open model ecosystem", "Developer workflows", "Cost efficiency"],
    context: "Varies",
    modality: "Text and code",
    access: "API and open weights",
    detailUrl: "https://www.deepseek.com/"
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
