import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { LaunchCard } from "@/components/launch-card";
import { MarketCard } from "@/components/market-card";
import { PageShell } from "@/components/page-shell";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { SectionHeading } from "@/components/section-heading";
import {
  dailyBriefing,
  feedItems,
  indexBaskets,
  ingestionRoadmap,
  launches,
  marketSignals,
  productPillars,
  researchItems
} from "@/lib/data";

export default function Home() {
  return (
    <PageShell>
      <main>
        <section className="bg-[linear-gradient(125deg,rgba(13,107,87,0.18),transparent_32%),linear-gradient(310deg,rgba(36,95,159,0.14),transparent_32%)] py-16 md:min-h-[calc(100vh-72px)] md:py-24">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] items-center gap-12 lg:grid-cols-[1.08fr_0.72fr]">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.12em] text-moss">Daily AI intelligence</p>
              <h1 className="mb-6 max-w-4xl text-6xl font-black leading-[0.92] tracking-normal md:text-8xl">
                The homepage for everything moving in AI.
              </h1>
              <p className="mb-8 max-w-2xl text-xl text-muted">
                Track new AI products, prediction markets, research, media, models, public equities, private funding, and the
                signals that matter before they become consensus.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-ink bg-ink px-5 font-black text-white" href="/launches">
                  Explore launches <ArrowUpRight size={18} />
                </Link>
                <a className="inline-flex min-h-12 items-center rounded-lg border border-ink bg-white/40 px-5 font-black" href="mailto:tyson@hionai.net">
                  Submit a signal
                </a>
              </div>
            </div>

            <aside className="rounded-lg border border-ink/15 bg-white/80 p-6 shadow-panel">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-moss">Today on HI on AI</p>
              <h2 className="mb-5 text-3xl font-black">Daily Briefing</h2>
              <ol className="grid gap-3">
                {dailyBriefing.map((item) => (
                  <li className="rounded-lg border border-ink/10 bg-white/80 p-4" key={item.label}>
                    <span className="mb-1 block text-xs font-black uppercase tracking-wide text-ocean">{item.label}</span>
                    {item.text}
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="bg-ink text-white">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] grid-cols-2 md:grid-cols-5">
            {["Launches", "Markets", "Media", "Research", "Index"].map((item) => (
              <div className="min-h-24 border-l border-white/15 p-5 last:border-r" key={item}>
                <strong>{item}</strong>
                <span className="mt-1 block text-sm text-white/65">Live signal layer</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
            <SectionHeading eyebrow="Product surface" title="Built as a daily operating dashboard, not a news archive." wide>
              <p>Each module is designed to become dynamic through source ingestion, scoring, human curation, and realtime updates.</p>
            </SectionHeading>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {productPillars.map((pillar) => (
                <article className="rounded-lg border border-line bg-white p-6" key={pillar.title}>
                  <pillar.icon className="mb-5 text-moss" size={28} />
                  <h3 className="mb-2 text-xl font-black">{pillar.title}</h3>
                  <p className="m-0 text-muted">{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper py-20">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 lg:grid-cols-[0.72fr_1fr]">
            <SectionHeading eyebrow="Launch rankings" title="Daily AI launches ranked by momentum.">
              <p>Product Hunt-style discovery for AI tools, models, agents, APIs, and open-source releases.</p>
            </SectionHeading>
            <div className="grid gap-3">
              {launches.slice(0, 3).map((launch) => (
                <LaunchCard launch={launch} key={launch.name} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
            <SectionHeading eyebrow="Prediction markets" title="AI bets, odds, and probability moves in one dashboard." wide />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {marketSignals.map((signal) => (
                <MarketCard signal={signal} key={signal.question} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper py-20">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Media feed" title="News, podcasts, and interviews without the noise." />
              <div className="mt-6 grid gap-3">
                {feedItems.slice(0, 3).map((item) => (
                  <article className="rounded-lg border border-line bg-white p-5" key={item.title}>
                    <span className="mb-2 block text-xs font-black uppercase tracking-wide text-ocean">{item.type}</span>
                    <h3 className="mb-2 text-lg font-black">{item.title}</h3>
                    <p className="m-0 text-muted">{item.why}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="Research corner" title="Papers, model cards, and evals translated for operators." />
              <div className="mt-6 grid gap-3">
                {researchItems.map((item) => (
                  <article className="rounded-lg border border-line bg-white p-5" key={item.title}>
                    <span className="mb-2 block text-xs font-black uppercase tracking-wide text-ocean">{item.label}</span>
                    <h3 className="mb-2 text-lg font-black">{item.title}</h3>
                    <p className="m-0 text-muted">{item.summary}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
            <SectionHeading eyebrow="Investment index" title="Public and private AI exposure, organized by the stack." wide />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {indexBaskets.map((basket) => (
                <article className="rounded-lg border border-line bg-white p-5" key={basket.name}>
                  <h3 className="mb-3 text-xl font-black">{basket.name}</h3>
                  <p className="mb-4 text-sm font-bold text-ocean">{basket.companies.join(" / ")}</p>
                  <p className="m-0 text-muted">{basket.signal}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-moss py-20 text-white">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 lg:grid-cols-[0.85fr_1fr]">
            <SectionHeading eyebrow="Realtime plan" title="Dynamic data from day one, editorial quality before automation." />
            <div className="grid gap-3">
              {ingestionRoadmap.map((item) => (
                <article className="rounded-lg border border-white/20 bg-white/10 p-5" key={item.title}>
                  <item.icon className="mb-4 text-white" size={26} />
                  <h3 className="mb-2 text-lg font-black">{item.title}</h3>
                  <p className="m-0 text-white/75">{item.description}</p>
                </article>
              ))}
              <PlaceholderNotice />
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
