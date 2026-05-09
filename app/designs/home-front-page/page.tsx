import { PageShell } from "@/components/page-shell";
import { getHomeData } from "@/lib/live-data";
import { CompactStory, DesignNav, MarketTicker, MetricStrip } from "../_components";

export const revalidate = 60;

export default async function FrontPageMock() {
  const { launches, marketSignals, feedItems, researchItems, indexBaskets, dailyBriefing } = await getHomeData();

  return (
    <PageShell>
      <DesignNav />
      <main className="bg-[#f8f6ef] text-ink">
        <MarketTicker markets={marketSignals} />
        <section className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 py-8">
          <MetricStrip launches={launches} markets={marketSignals} media={feedItems} research={researchItems} />

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="border-4 border-ink bg-white">
              <div className="border-b-4 border-ink bg-[#ffe45c] p-4">
                <p className="font-mono text-xs font-black uppercase tracking-[0.14em]">Top ranked media</p>
              </div>
              <div className="p-5">
                <h1 className="mb-4 text-5xl font-black leading-none md:text-7xl">{feedItems[0]?.title}</h1>
                <p className="max-w-3xl text-lg text-muted">{feedItems[0]?.why}</p>
              </div>
            </section>

            <aside className="grid gap-4">
              {dailyBriefing.slice(0, 4).map((item) => (
                <article className="border-4 border-ink bg-white p-4" key={item.label}>
                  <p className="mb-2 font-mono text-xs font-black uppercase tracking-wide text-ocean">{item.label}</p>
                  <p className="m-0 text-lg font-bold leading-snug">{item.text}</p>
                </article>
              ))}
            </aside>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="border-4 border-ink bg-white">
              <div className="grid grid-cols-[64px_minmax(0,1fr)_92px] border-b-4 border-ink bg-ink px-4 py-3 font-mono text-xs font-black uppercase tracking-wide text-white">
                <span>Rank</span>
                <span>Story</span>
                <span className="text-right">Heat</span>
              </div>
              <div className="px-5">
                {feedItems.slice(0, 9).map((item, index) => (
                  <CompactStory item={item} index={index} key={item.title} />
                ))}
              </div>
            </section>

            <aside className="grid gap-4">
              <section className="border-4 border-ink bg-white p-5">
                <h2 className="mb-4 text-2xl font-black">Launches</h2>
                <div className="grid gap-3">
                  {launches.slice(0, 4).map((launch) => (
                    <article className="border-b border-line pb-3 last:border-b-0 last:pb-0" key={launch.name}>
                      <p className="mb-1 font-mono text-xs font-black uppercase text-ocean">+{launch.momentum}</p>
                      <h3 className="font-black leading-tight">{launch.name}</h3>
                    </article>
                  ))}
                </div>
              </section>

              <section className="border-4 border-ink bg-white p-5">
                <h2 className="mb-4 text-2xl font-black">Markets</h2>
                <div className="grid gap-3">
                  {marketSignals.slice(0, 4).map((market) => (
                    <article className="border-b border-line pb-3 last:border-b-0 last:pb-0" key={market.question}>
                      <p className="mb-1 font-mono text-xs font-black uppercase text-moss">{market.probability}%</p>
                      <h3 className="font-black leading-tight">{market.question}</h3>
                    </article>
                  ))}
                </div>
              </section>

              <section className="border-4 border-ink bg-white p-5">
                <h2 className="mb-4 text-2xl font-black">Index</h2>
                {indexBaskets.slice(0, 3).map((basket) => (
                  <p className="mb-2 border-b border-line pb-2 text-sm font-bold last:mb-0 last:border-b-0 last:pb-0" key={basket.name}>
                    {basket.name} / {basket.companies.slice(0, 3).join(", ")}
                  </p>
                ))}
              </section>
            </aside>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
