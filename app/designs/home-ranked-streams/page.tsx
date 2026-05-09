import { PageShell } from "@/components/page-shell";
import { getHomeData } from "@/lib/live-data";
import { DesignNav, RankedItem } from "../_components";

export const revalidate = 60;

export default async function RankedStreamsMock() {
  const { launches, marketSignals, feedItems, researchItems } = await getHomeData();
  const stream = [
    ...feedItems.slice(0, 8).map((item) => ({
      kind: item.type,
      title: item.title,
      meta: `${item.source} / ${item.why}`,
      score: `heat ${item.popularity_score ?? 0}`
    })),
    ...launches.slice(0, 6).map((launch) => ({
      kind: "Launch",
      title: launch.name,
      meta: `${launch.source ?? launch.category} / ${launch.summary}`,
      score: `+${launch.momentum}`
    })),
    ...marketSignals.slice(0, 8).map((market) => ({
      kind: "Market",
      title: market.question,
      meta: `${market.source ?? market.venue} / ${market.move > 0 ? "+" : ""}${market.move} move`,
      score: `${market.probability}%`
    })),
    ...researchItems.slice(0, 4).map((item) => ({
      kind: "Research",
      title: item.title,
      meta: `${item.label} / ${item.summary}`,
      score: item.level
    }))
  ].slice(0, 22);

  return (
    <PageShell>
      <DesignNav />
      <main className="bg-[#f2f0e8] text-ink">
        <section className="border-b-4 border-ink bg-[#f8f6ef]">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 py-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-ocean">Live ranked stream</p>
                <h1 className="text-5xl font-black leading-none md:text-7xl">Hot across AI</h1>
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-xs font-black uppercase">
                {["Hot", "Launches", "Markets", "Models", "Media", "Research"].map((tab, index) => (
                  <span className={index === 0 ? "border-2 border-ink bg-ink px-3 py-2 text-white" : "border-2 border-ink bg-white px-3 py-2"} key={tab}>
                    {tab}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="border-4 border-ink bg-white">
            <div className="grid grid-cols-[52px_minmax(0,1fr)_92px] border-b-4 border-ink bg-ink px-4 py-3 font-mono text-xs font-black uppercase tracking-wide text-white max-sm:grid-cols-[44px_minmax(0,1fr)]">
              <span>#</span>
              <span>Signal</span>
              <span className="text-right max-sm:hidden">Score</span>
            </div>
            {stream.map((item, index) => (
              <RankedItem key={`${item.kind}-${item.title}`} label={item.kind} meta={item.meta} rank={index + 1} score={item.score} title={item.title} />
            ))}
          </div>

          <aside className="grid content-start gap-4">
            <section className="border-4 border-ink bg-[#ffe45c] p-5 shadow-[6px_6px_0_#101316]">
              <p className="mb-2 font-mono text-xs font-black uppercase tracking-wide">Top signal</p>
              <h2 className="text-2xl font-black leading-tight">{stream[0]?.title}</h2>
              <p className="mt-3 text-sm font-bold">{stream[0]?.score}</p>
            </section>

            <section className="border-4 border-ink bg-white p-5">
              <h2 className="mb-4 text-2xl font-black">Market Movers</h2>
              {marketSignals.slice(0, 5).map((market) => (
                <article className="border-b border-line py-3 first:pt-0 last:border-b-0 last:pb-0" key={market.question}>
                  <p className="mb-1 font-mono text-xs font-black uppercase text-moss">{market.probability}%</p>
                  <h3 className="font-black leading-tight">{market.question}</h3>
                </article>
              ))}
            </section>

            <section className="border-4 border-ink bg-white p-5">
              <h2 className="mb-4 text-2xl font-black">Fresh Launches</h2>
              {launches.slice(0, 5).map((launch) => (
                <article className="border-b border-line py-3 first:pt-0 last:border-b-0 last:pb-0" key={launch.name}>
                  <p className="mb-1 font-mono text-xs font-black uppercase text-ocean">+{launch.momentum}</p>
                  <h3 className="font-black leading-tight">{launch.name}</h3>
                </article>
              ))}
            </section>
          </aside>
        </section>
      </main>
    </PageShell>
  );
}
