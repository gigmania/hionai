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
```

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Copy the project URL and anon key into Vercel env vars.
5. Copy the service role key into Vercel as `SUPABASE_SERVICE_ROLE_KEY`.
6. Set `CRON_SECRET` to a long random string.

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
