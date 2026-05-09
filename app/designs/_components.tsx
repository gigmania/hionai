import Link from "next/link";
import type { FeedItem, Launch, MarketSignal, ResearchItem } from "@/lib/data";

export function DesignNav() {
  const links = [
    ["/designs/home-front-page", "Front Page"],
    ["/designs/home-command-center", "Command Center"],
    ["/designs/home-ranked-streams", "Ranked Streams"]
  ];

  return (
    <nav className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-wrap gap-2 py-3">
        {links.map(([href, label]) => (
          <Link className="rounded-full border border-line px-3 py-1 text-xs font-black uppercase tracking-wide hover:border-ink" href={href} key={href}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function MetricStrip({
  launches,
  markets,
  media,
  research
}: {
  launches: Launch[];
  markets: MarketSignal[];
  media: FeedItem[];
  research: ResearchItem[];
}) {
  const metrics = [
    ["Launches", launches.length],
    ["Markets", markets.length],
    ["Media", media.length],
    ["Research", research.length]
  ];

  return (
    <div className="grid grid-cols-2 border-y border-ink md:grid-cols-4">
      {metrics.map(([label, value]) => (
        <div className="border-r border-ink p-4 last:border-r-0" key={label}>
          <p className="mb-2 font-mono text-[0.68rem] font-black uppercase tracking-wide text-muted">{label}</p>
          <strong className="text-4xl font-black leading-none">{value}</strong>
        </div>
      ))}
    </div>
  );
}

export function MarketTicker({ markets }: { markets: MarketSignal[] }) {
  return (
    <div className="flex overflow-hidden border-y border-ink bg-ink text-white">
      <div className="flex min-w-full animate-[marquee_38s_linear_infinite] gap-8 whitespace-nowrap px-4 py-3 font-mono text-xs uppercase">
        {markets.slice(0, 12).map((market) => (
          <span key={market.question}>
            {market.source ?? market.venue} / {market.probability}% / {market.question}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CompactStory({ item, index }: { item: FeedItem; index: number }) {
  return (
    <article className="grid grid-cols-[42px_minmax(0,1fr)_72px] gap-3 border-b border-line py-4 last:border-b-0">
      <strong className="font-mono text-xl">{String(index + 1).padStart(2, "0")}</strong>
      <div>
        <p className="mb-1 font-mono text-[0.68rem] font-black uppercase tracking-wide text-ocean">
          {item.type} / {item.source}
        </p>
        <h3 className="text-lg font-black leading-tight">{item.title}</h3>
      </div>
      <span className="text-right font-mono text-xs font-black text-moss">heat {item.popularity_score ?? 0}</span>
    </article>
  );
}

export function RankedItem({
  rank,
  label,
  title,
  meta,
  score
}: {
  rank: number;
  label: string;
  title: string;
  meta: string;
  score: string;
}) {
  return (
    <article className="grid grid-cols-[52px_minmax(0,1fr)_92px] gap-4 border-b-2 border-ink bg-white p-4 last:border-b-0 max-sm:grid-cols-[44px_minmax(0,1fr)]">
      <strong className="grid h-10 w-10 place-items-center border-2 border-ink bg-[#ffe45c] font-mono text-sm">{rank}</strong>
      <div>
        <p className="mb-1 font-mono text-[0.68rem] font-black uppercase tracking-wide text-muted">{label}</p>
        <h2 className="text-xl font-black leading-tight">{title}</h2>
        <p className="mt-2 text-sm text-muted">{meta}</p>
      </div>
      <strong className="text-right font-mono text-sm text-moss max-sm:col-start-2 max-sm:text-left">{score}</strong>
    </article>
  );
}
