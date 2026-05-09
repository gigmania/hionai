import Link from "next/link";
import { MarketCard } from "@/components/market-card";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { getMarketSignals } from "@/lib/live-data";

export const revalidate = 60;

export default async function MarketsPage({
  searchParams
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const params = await searchParams;
  const marketSignals = await getMarketSignals();
  const sources = [...new Set(marketSignals.map((signal) => signal.source ?? signal.venue))].sort();
  const selectedSource = params.source ?? "all";
  const filteredSignals =
    selectedSource === "all"
      ? marketSignals
      : marketSignals.filter((signal) => (signal.source ?? signal.venue).toLowerCase() === selectedSource.toLowerCase());
  const topSignals = filteredSignals.slice(0, 100);

  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
          <SectionHeading eyebrow="Markets" title="Prediction markets for the AI story." wide>
            <p>Top 100 AI-related markets by volume, with filters for each source.</p>
          </SectionHeading>

          <div className="flex flex-wrap gap-2">
            <Link
              className={`rounded-full border px-4 py-2 text-sm font-black ${selectedSource === "all" ? "border-ink bg-ink text-white" : "border-line bg-white"}`}
              href="/markets"
            >
              All sources
            </Link>
            {sources.map((source) => (
              <Link
                className={`rounded-full border px-4 py-2 text-sm font-black ${selectedSource.toLowerCase() === source.toLowerCase() ? "border-ink bg-ink text-white" : "border-line bg-white"}`}
                href={`/markets?source=${encodeURIComponent(source)}`}
                key={source}
              >
                {source}
              </Link>
            ))}
          </div>

          <div className="grid gap-3 font-mono text-xs uppercase tracking-wide text-muted md:grid-cols-3">
            <span>{topSignals.length} shown</span>
            <span>{filteredSignals.length} matching</span>
            <span>{marketSignals.length} total tracked</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {topSignals.map((signal) => (
              <MarketCard signal={signal} key={`${signal.source}-${signal.question}`} />
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
