import { Activity, Boxes, Newspaper, Rocket, Sigma } from "lucide-react";
import type { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";
import { getHomeData } from "@/lib/live-data";
import { DesignNav } from "../_components";

export const revalidate = 60;

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-[#d7d9d3] bg-[#fbfbf8] p-5">
      <h2 className="mb-4 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#45645d]">{title}</h2>
      {children}
    </section>
  );
}

export default async function CommandCenterMock() {
  const { launches, marketSignals, feedItems, researchItems, indexBaskets } = await getHomeData();
  const widgets = [
    ["Market Pulse", `${marketSignals[0]?.probability ?? 0}%`, marketSignals[0]?.question ?? "", Activity],
    ["Launch Radar", launches[0]?.name ?? "", `+${launches[0]?.momentum ?? 0} momentum`, Rocket],
    ["Media Heat", feedItems[0]?.title ?? "", `heat ${feedItems[0]?.popularity_score ?? 0}`, Newspaper],
    ["Research", researchItems[0]?.title ?? "", researchItems[0]?.label ?? "", Sigma]
  ];

  return (
    <PageShell>
      <DesignNav />
      <main className="bg-[#ecefeb] text-[#111714]">
        <section className="mx-auto grid w-[min(1220px,calc(100%-32px))] gap-5 py-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {widgets.map(([label, value, sub, Icon]) => (
              <article className="rounded-lg border border-[#c9cec8] bg-[#fbfbf8] p-5" key={label as string}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-[#45645d]">{label as string}</p>
                  <Icon size={18} />
                </div>
                <h1 className="mb-2 text-3xl font-black leading-none">{value as string}</h1>
                <p className="m-0 text-sm text-[#65716b]">{sub as string}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Panel title="Prediction Markets">
              <div className="grid gap-3">
                {marketSignals.slice(0, 10).map((market) => (
                  <article className="grid grid-cols-[72px_minmax(0,1fr)_64px] items-center gap-4 border-b border-[#d7d9d3] pb-3 last:border-b-0 last:pb-0" key={market.question}>
                    <strong className="text-2xl font-black">{market.probability}%</strong>
                    <div>
                      <h3 className="font-black leading-tight">{market.question}</h3>
                      <p className="mt-1 font-mono text-xs uppercase text-[#65716b]">{market.source ?? market.venue}</p>
                    </div>
                    <span className={market.move >= 0 ? "text-right font-mono text-sm font-black text-[#1e7b52]" : "text-right font-mono text-sm font-black text-[#b33131]"}>
                      {market.move > 0 ? "+" : ""}
                      {market.move}
                    </span>
                  </article>
                ))}
              </div>
            </Panel>

            <Panel title="Model And Launch Watch">
              <div className="grid gap-3">
                {launches.slice(0, 7).map((launch) => (
                  <article className="rounded border border-[#d7d9d3] bg-white p-3" key={launch.name}>
                    <p className="mb-1 font-mono text-xs font-black uppercase text-[#1e7b52]">+{launch.momentum} / {launch.source ?? launch.category}</p>
                    <h3 className="font-black leading-tight">{launch.name}</h3>
                    <p className="mt-2 text-sm text-[#65716b]">{launch.summary}</p>
                  </article>
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Panel title="Media Heat">
              {feedItems.slice(0, 6).map((item) => (
                <article className="border-b border-[#d7d9d3] py-3 first:pt-0 last:border-b-0 last:pb-0" key={item.title}>
                  <p className="mb-1 font-mono text-xs font-black uppercase text-[#65716b]">{item.type} / heat {item.popularity_score ?? 0}</p>
                  <h3 className="font-black leading-tight">{item.title}</h3>
                </article>
              ))}
            </Panel>

            <Panel title="Research Queue">
              {researchItems.slice(0, 6).map((item) => (
                <article className="border-b border-[#d7d9d3] py-3 first:pt-0 last:border-b-0 last:pb-0" key={item.title}>
                  <p className="mb-1 font-mono text-xs font-black uppercase text-[#65716b]">{item.label}</p>
                  <h3 className="font-black leading-tight">{item.title}</h3>
                </article>
              ))}
            </Panel>

            <Panel title="AI Index">
              {indexBaskets.map((basket) => (
                <article className="border-b border-[#d7d9d3] py-3 first:pt-0 last:border-b-0 last:pb-0" key={basket.name}>
                  <div className="mb-2 flex items-center gap-2">
                    <Boxes size={16} />
                    <h3 className="font-black">{basket.name}</h3>
                  </div>
                  <p className="text-sm text-[#65716b]">{basket.companies.join(" / ")}</p>
                </article>
              ))}
            </Panel>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
