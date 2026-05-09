create extension if not exists pgcrypto;

do $$ begin
  create type launch_status as enum ('hot', 'rising', 'watch');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type media_type as enum ('News', 'Podcast', 'Video', 'Newsletter');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type research_level as enum ('Beginner', 'Practitioner', 'Researcher');
exception
  when duplicate_object then null;
end $$;

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  url text,
  feed_url text,
  category text not null,
  credibility_score integer not null default 50 check (credibility_score between 0 and 100),
  is_active boolean not null default true,
  last_fetched_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table sources add column if not exists feed_url text;
alter table sources add column if not exists last_fetched_at timestamptz;
alter table sources add column if not exists last_error text;

create table if not exists raw_ingest_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sources(id) on delete cascade,
  external_id text not null,
  title text not null,
  url text,
  summary text,
  published_at timestamptz,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (source_id, external_id)
);

create table if not exists ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'success',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  active_sources integer not null default 0,
  raw_inserted integer not null default 0,
  media_inserted integer not null default 0,
  product_hunt_upserted integer not null default 0,
  polymarket_upserted integer not null default 0,
  kalshi_upserted integer not null default 0,
  arxiv_upserted integer not null default 0,
  errors jsonb not null default '[]'::jsonb,
  summary text
);

alter table ingestion_runs add column if not exists product_hunt_upserted integer not null default 0;

create table if not exists launches (
  id uuid primary key default gen_random_uuid(),
  rank integer not null default 999,
  name text not null unique,
  category text not null,
  summary text not null,
  momentum integer not null default 0 check (momentum between 0 and 100),
  status launch_status not null default 'watch',
  source_url text,
  source text,
  external_id text,
  votes_count integer not null default 0,
  launched_at timestamptz,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table launches add column if not exists source text;
alter table launches add column if not exists external_id text;
alter table launches add column if not exists votes_count integer not null default 0;
alter table launches add column if not exists launched_at timestamptz;

create table if not exists market_signals (
  id uuid primary key default gen_random_uuid(),
  question text not null unique,
  probability integer not null check (probability between 0 and 100),
  move integer not null default 0,
  venue text not null,
  source text,
  external_id text,
  url text,
  volume numeric,
  liquidity numeric,
  source_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table market_signals add column if not exists source text;
alter table market_signals add column if not exists external_id text;
alter table market_signals add column if not exists url text;
alter table market_signals add column if not exists volume numeric;
alter table market_signals add column if not exists liquidity numeric;

create table if not exists media_items (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  type media_type not null,
  title text not null unique,
  why text not null,
  url text,
  upvotes integer not null default 0 check (upvotes >= 0),
  downvotes integer not null default 0 check (downvotes >= 0),
  popularity_score integer not null default 0,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table media_items add column if not exists upvotes integer not null default 0 check (upvotes >= 0);
alter table media_items add column if not exists downvotes integer not null default 0 check (downvotes >= 0);
alter table media_items add column if not exists popularity_score integer not null default 0;

create table if not exists research_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  title text not null unique,
  summary text not null,
  level research_level not null default 'Practitioner',
  source_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists index_baskets (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  companies text[] not null default '{}',
  signal text not null,
  display_order integer not null default 999,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists daily_briefings (
  id uuid primary key default gen_random_uuid(),
  briefing_date date not null default current_date,
  label text not null,
  text text not null,
  display_order integer not null default 999,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (briefing_date, label)
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_sources_updated_at on sources;
create trigger set_sources_updated_at before update on sources
for each row execute function set_updated_at();

drop trigger if exists set_launches_updated_at on launches;
create trigger set_launches_updated_at before update on launches
for each row execute function set_updated_at();

drop trigger if exists set_market_signals_updated_at on market_signals;
create trigger set_market_signals_updated_at before update on market_signals
for each row execute function set_updated_at();

drop trigger if exists set_media_items_updated_at on media_items;
create trigger set_media_items_updated_at before update on media_items
for each row execute function set_updated_at();

drop trigger if exists set_research_items_updated_at on research_items;
create trigger set_research_items_updated_at before update on research_items
for each row execute function set_updated_at();

drop trigger if exists set_index_baskets_updated_at on index_baskets;
create trigger set_index_baskets_updated_at before update on index_baskets
for each row execute function set_updated_at();

drop trigger if exists set_daily_briefings_updated_at on daily_briefings;
create trigger set_daily_briefings_updated_at before update on daily_briefings
for each row execute function set_updated_at();

alter table sources enable row level security;
alter table raw_ingest_items enable row level security;
alter table ingestion_runs enable row level security;
alter table launches enable row level security;
alter table market_signals enable row level security;
alter table media_items enable row level security;
alter table research_items enable row level security;
alter table index_baskets enable row level security;
alter table daily_briefings enable row level security;

drop policy if exists "Public can read active sources" on sources;
create policy "Public can read active sources" on sources
for select using (is_active = true);

drop policy if exists "Raw ingest items are private" on raw_ingest_items;
create policy "Raw ingest items are private" on raw_ingest_items
for select using (false);

drop policy if exists "Ingestion runs are private" on ingestion_runs;
create policy "Ingestion runs are private" on ingestion_runs
for select using (false);

drop policy if exists "Public can read published launches" on launches;
create policy "Public can read published launches" on launches
for select using (published = true);

drop policy if exists "Public can read published market signals" on market_signals;
create policy "Public can read published market signals" on market_signals
for select using (published = true);

drop policy if exists "Public can read published media items" on media_items;
create policy "Public can read published media items" on media_items
for select using (published = true);

drop policy if exists "Public can read published research items" on research_items;
create policy "Public can read published research items" on research_items
for select using (published = true);

drop policy if exists "Public can read published index baskets" on index_baskets;
create policy "Public can read published index baskets" on index_baskets
for select using (published = true);

drop policy if exists "Public can read published daily briefings" on daily_briefings;
create policy "Public can read published daily briefings" on daily_briefings
for select using (published = true);

insert into launches (rank, name, category, summary, momentum, status, published, published_at)
values
  (1, 'Runloop Agent Desk', 'Coding agents', 'Queues long-running repo tasks, posts completion alerts, and keeps humans in the approval loop.', 94, 'hot', true, now()),
  (2, 'EvalForge', 'Model evaluation', 'Builds repeatable eval suites from internal tickets, transcripts, and regression examples.', 86, 'rising', true, now()),
  (3, 'Briefly Labs', 'Research', 'Turns papers, filings, and podcasts into source-linked analyst briefs for operators.', 78, 'rising', true, now()),
  (4, 'VoiceOps Copilot', 'Voice AI', 'Captures calls, creates follow-ups, and routes updates into CRM and ticketing tools.', 71, 'watch', true, now())
on conflict do nothing;

insert into market_signals (question, probability, move, venue, published, published_at)
values
  ('Frontier model released before quarter end', 64, 8, 'Prediction markets', true, now()),
  ('Open-weight model tops coding benchmark', 51, 5, 'Model markets', true, now()),
  ('Major AI regulation passes this year', 38, -4, 'Policy markets', true, now()),
  ('AI infrastructure capex beats consensus', 72, 0, 'Equity-linked', true, now())
on conflict do nothing;

insert into media_items (source, type, title, why, published, published_at)
values
  ('Operator Brief', 'News', 'Enterprise AI budgets move from pilots to renewal scrutiny.', 'Procurement teams are asking for measurable workflow impact instead of demo velocity.', true, now()),
  ('Founder Interview', 'Podcast', 'What real agent adoption looks like inside technical teams.', 'The adoption pattern is supervised queues first, autonomous work later.', true, now()),
  ('Benchmark Desk', 'Video', 'Why eval design now matters more than headline model scores.', 'Teams need task-specific regressions, not generalized leaderboard confidence.', true, now()),
  ('Infra Weekly', 'Newsletter', 'Power constraints are becoming product constraints for AI platforms.', 'Data center availability is now a core competitive variable.', true, now())
on conflict do nothing;

insert into research_items (label, title, summary, level, published, published_at)
values
  ('Paper of the day', 'Reliability evaluation for long-horizon agents', 'A practical framework for testing recovery, tool use, uncertainty, memory, and human handoff.', 'Practitioner', true, now()),
  ('Benchmark', 'Maintenance-oriented coding evals', 'A benchmark suite focused on debugging, dependency drift, repo context, and refactor safety.', 'Researcher', true, now()),
  ('Model card', 'Multimodal risk and refusal update', 'Tracks behavior changes across image understanding, sensitive requests, and safety boundaries.', 'Practitioner', true, now())
on conflict do nothing;

insert into index_baskets (name, companies, signal, display_order, published, published_at)
values
  ('Compute', array['NVIDIA', 'AMD', 'Broadcom', 'TSMC', 'ASML', 'Arm'], 'Accelerator supply, networking, packaging, and utilization remain the central AI bottleneck.', 1, true, now()),
  ('Cloud and platforms', array['Microsoft', 'Amazon', 'Google', 'Oracle', 'CoreWeave'], 'Distribution and committed capacity shape which model companies can scale.', 2, true, now()),
  ('Applications', array['OpenAI', 'Anthropic', 'Perplexity', 'Runway', 'Harvey'], 'The application layer is splitting into consumer assistants and vertical workflow systems.', 3, true, now()),
  ('Energy and infrastructure', array['Utilities', 'Data centers', 'Cooling', 'Storage', 'Networking'], 'Power contracts and data center approvals are turning into AI growth indicators.', 4, true, now())
on conflict do nothing;

insert into daily_briefings (briefing_date, label, text, display_order, published, published_at)
values
  (current_date, 'Launch', 'Agent products are converging on supervised queues, status alerts, and workflow handoffs.', 1, true, now()),
  (current_date, 'Market', 'Prediction markets are repricing near-term frontier model release expectations.', 2, true, now()),
  (current_date, 'Research', 'Long-horizon agent evals are becoming the most important practical research theme.', 3, true, now()),
  (current_date, 'Capital', 'Infrastructure exposure is widening from chips into power, cooling, and networking.', 4, true, now())
on conflict do nothing;

insert into sources (name, url, feed_url, category, credibility_score, is_active)
values
  ('OpenAI News', 'https://openai.com/news/', 'https://openai.com/news/rss.xml', 'news', 95, true),
  ('arXiv cs.AI', 'https://arxiv.org/list/cs.AI/recent', 'https://export.arxiv.org/rss/cs.AI', 'research', 90, true),
  ('arXiv cs.LG', 'https://arxiv.org/list/cs.LG/recent', 'https://export.arxiv.org/rss/cs.LG', 'research', 90, true),
  ('Hacker News Front Page', 'https://news.ycombinator.com/', 'https://news.ycombinator.com/rss', 'news', 65, true)
on conflict (name) do update set
  url = excluded.url,
  feed_url = excluded.feed_url,
  category = excluded.category,
  credibility_score = excluded.credibility_score,
  is_active = excluded.is_active;
