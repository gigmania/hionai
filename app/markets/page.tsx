import { MarketCard } from "@/components/market-card";
import { PageShell } from "@/components/page-shell";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { SectionHeading } from "@/components/section-heading";
import { getMarketSignals } from "@/lib/live-data";

export const revalidate = 60;

export default async function MarketsPage() {
  const marketSignals = await getMarketSignals();

  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
          <SectionHeading eyebrow="Markets" title="Prediction markets for the AI story." wide>
            <p>Track model release odds, regulatory outcomes, benchmark events, capex surprises, and probability changes.</p>
          </SectionHeading>
          <PlaceholderNotice />
          <div className="grid gap-4 md:grid-cols-2">
            {marketSignals.map((signal) => (
              <MarketCard signal={signal} key={signal.question} />
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
