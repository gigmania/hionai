# HI on AI

The dynamic product repo for HI on AI: a daily AI intelligence dashboard covering launches, prediction markets, media, research, models, and AI investment signals.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase-ready data client
- Vercel-ready deployment and cron configuration

## Local Development

```sh
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Supabase is optional locally because the app falls back to typed seed data when credentials are not present. Once configured, pages read published rows from Supabase and revalidate every 60 seconds.

```sh
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=
PRODUCT_HUNT_TOKEN=
```

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Copy the project URL and anon key into Vercel env vars.
5. Copy the service role key into Vercel as `SUPABASE_SERVICE_ROLE_KEY`.
6. Set `CRON_SECRET` to a long random string.
7. Set `ADMIN_PASSWORD` to protect `/admin` with basic auth. Optionally set `ADMIN_USERNAME`.
8. Optional: set `PRODUCT_HUNT_TOKEN` to ingest AI launches from Product Hunt.

Public reads are protected by row level security policies that only expose published rows. Server-side ingestion should use the service role key from API routes or cron jobs only.

## Product Direction

The current app uses Supabase first and typed seed data as a fallback so the product shape can evolve quickly. The next step is to add:

- Admin-curated content in Supabase
- Scheduled ingestion from RSS and APIs
- Realtime updates for market probabilities and newly approved items
- Daily briefing generation and editorial workflow

## Live Data Flow

```text
Sources/APIs/RSS
      ↓
/api/cron/ingest
      ↓
Supabase published tables
      ↓
Next.js pages with 60 second revalidation
```

The default Vercel cron schedule runs once daily at 12:00 UTC. Use the `/admin` **Run ingestion** button for immediate imports, or increase the cron frequency later if the Vercel plan supports it.

## Admin and Submissions

- `/submit` accepts public launch submissions.
- `/api/launches/submit` validates submissions and inserts them as unpublished launches.
- `/admin` shows pending and published launches.
- Admins can publish, rank, score, or unpublish launches.
- `/admin` also manages RSS/Atom sources and imported media.
- `/api/cron/ingest` fetches active source feeds, dedupes raw items, and auto-publishes imported media items.
- The admin Sources panel has a manual **Run ingestion** button for immediate imports.
- The schema seeds starter feeds for OpenAI News, arXiv cs.AI, arXiv cs.LG, and Hacker News.
- `/media` ranks stories by `popularity_score`; anonymous up/down votes update that score.
- Ingestion also searches Polymarket's public Gamma API for AI-related markets and publishes them to `/markets`.
- Ingestion also imports open AI-related Kalshi markets and recent arXiv AI/ML/NLP papers.
- `/admin` shows recent ingestion run logs with media, Polymarket, Kalshi, arXiv, and error counts.
- `/markets` shows top 100 markets overall and can filter to the top 100 by source.
- `/models` lists tracked AI models and links to detail pages for each model.
- Ingestion imports Product Hunt posts when `PRODUCT_HUNT_TOKEN` is configured and filters for AI-related launches.

## Model Freshness

The current `/models` page uses an expanded seed list. To keep it current long term, models should move into Supabase and be updated by provider/model-card ingestion from official model docs, release feeds, and curated admin edits. Treat the seed list as the initial index, not the final source of truth.

The admin route is open in local/dev when `ADMIN_PASSWORD` is unset. In production, set `ADMIN_PASSWORD`.
On Vercel/production, `/admin` fails closed with a 503 if `ADMIN_PASSWORD` is missing.
