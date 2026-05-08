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

Supabase is optional until live data is wired.

```sh
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Product Direction

The current app uses typed seed data so the product shape can evolve quickly. The next step is to replace seed data with:

- Admin-curated content in Supabase
- Scheduled ingestion from RSS and APIs
- Realtime updates for market probabilities and newly approved items
- Daily briefing generation and editorial workflow
