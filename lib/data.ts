import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  Flame,
  Newspaper,
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
};

export type FeedItem = {
  source: string;
  type: "News" | "Podcast" | "Video" | "Newsletter";
  title: string;
  why: string;
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

export const navItems = [
  { href: "/launches", label: "Launches" },
  { href: "/markets", label: "Markets" },
  { href: "/media", label: "Media" },
  { href: "/research", label: "Research" },
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
    venue: "Prediction markets"
  },
  {
    question: "Open-weight model tops coding benchmark",
    probability: 51,
    move: 5,
    venue: "Model markets"
  },
  {
    question: "Major AI regulation passes this year",
    probability: 38,
    move: -4,
    venue: "Policy markets"
  },
  {
    question: "AI infrastructure capex beats consensus",
    probability: 72,
    move: 0,
    venue: "Equity-linked"
  }
];

export const feedItems: FeedItem[] = [
  {
    source: "Operator Brief",
    type: "News",
    title: "Enterprise AI budgets move from pilots to renewal scrutiny.",
    why: "Procurement teams are asking for measurable workflow impact instead of demo velocity."
  },
  {
    source: "Founder Interview",
    type: "Podcast",
    title: "What real agent adoption looks like inside technical teams.",
    why: "The adoption pattern is supervised queues first, autonomous work later."
  },
  {
    source: "Benchmark Desk",
    type: "Video",
    title: "Why eval design now matters more than headline model scores.",
    why: "Teams need task-specific regressions, not generalized leaderboard confidence."
  },
  {
    source: "Infra Weekly",
    type: "Newsletter",
    title: "Power constraints are becoming product constraints for AI platforms.",
    why: "Data center availability is now a core competitive variable."
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
