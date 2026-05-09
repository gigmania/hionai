import { ExternalLink } from "lucide-react";
import { MediaVoteControls } from "@/components/media-vote-controls";
import { PageShell } from "@/components/page-shell";
import { getFeedItems } from "@/lib/live-data";

export const revalidate = 60;

export default async function MediaPage() {
  const feedItems = await getFeedItems();
  const rankedItems = [...feedItems].sort((a, b) => b.popularity_score - a.popularity_score);
  const totalHeat = rankedItems.reduce((sum, item) => sum + item.popularity_score, 0);
  const sourceCount = new Set(rankedItems.map((item) => item.source)).size;

  return (
    <PageShell>
      <main className="bg-[#f2f0e8] text-ink">
        <section className="border-b-4 border-ink bg-[#f8f6ef] py-8">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 lg:grid-cols-[1fr_340px]">
            <div>
              <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-muted">AI media wire</p>
              <h1 className="mb-4 max-w-4xl text-5xl font-black leading-[0.94] tracking-normal md:text-7xl">
                The AI stories the internet is pushing up.
              </h1>
              <p className="max-w-3xl text-lg text-muted">
                Ranked AI news, podcasts, research-adjacent posts, and videos from the source feeds. Vote stories up or down to
                shape the front page signal.
              </p>
            </div>
            <aside className="border-4 border-ink bg-white p-5 shadow-[8px_8px_0_#101316]">
              <p className="mb-4 font-mono text-xs font-black uppercase tracking-[0.16em]">Crawl status</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="border border-line p-3">
                  <strong className="block text-2xl font-black">{rankedItems.length}</strong>
                  <span className="font-mono text-[0.68rem] uppercase text-muted">stories</span>
                </div>
                <div className="border border-line p-3">
                  <strong className="block text-2xl font-black">{sourceCount}</strong>
                  <span className="font-mono text-[0.68rem] uppercase text-muted">sources</span>
                </div>
                <div className="border border-line p-3">
                  <strong className="block text-2xl font-black">{totalHeat}</strong>
                  <span className="font-mono text-[0.68rem] uppercase text-muted">heat</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">Auto-published from approved sources. Admin can unpublish anything that misses.</p>
            </aside>
          </div>
        </section>

        <section className="py-8">
          <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-6 lg:grid-cols-[1fr_300px]">
            <div className="border-4 border-ink bg-white">
              <div className="grid grid-cols-[64px_minmax(0,1fr)_110px] border-b-4 border-ink bg-ink px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-white max-md:grid-cols-[54px_minmax(0,1fr)]">
                <span>Rank</span>
                <span>Story</span>
                <span className="text-right max-md:hidden">Signal</span>
              </div>

              {rankedItems.map((item, index) => {
                const story = (
                  <>
                    <span>{item.title}</span>
                    {item.url ? <ExternalLink className="inline-block translate-y-0.5" size={16} /> : null}
                  </>
                );

                return (
                  <article
                    className="grid grid-cols-[64px_minmax(0,1fr)_110px] gap-4 border-b border-line px-4 py-5 last:border-b-0 max-md:grid-cols-[54px_minmax(0,1fr)]"
                    key={`${item.source}-${item.title}`}
                  >
                    <div className="font-mono text-2xl font-black leading-none">{String(index + 1).padStart(2, "0")}</div>
                    <div>
                      <div className="mb-2 flex flex-wrap gap-2 font-mono text-[0.7rem] font-black uppercase tracking-[0.1em] text-muted">
                        <span>{item.type}</span>
                        <span>/</span>
                        <span>{item.source}</span>
                        <span>/</span>
                        <span>{item.upvotes - item.downvotes} net</span>
                      </div>
                      <h2 className="mb-3 text-2xl font-black leading-tight tracking-normal">
                        {item.url ? (
                          <a className="inline-flex items-start gap-2 hover:underline" href={item.url}>
                            {story}
                          </a>
                        ) : (
                          story
                        )}
                      </h2>
                      <p className="m-0 max-w-3xl text-muted">{item.why}</p>
                    </div>
                    <div className="justify-self-end max-md:col-start-2 max-md:justify-self-start">
                      <MediaVoteControls
                        id={item.id}
                        initialDownvotes={item.downvotes}
                        initialPopularity={item.popularity_score}
                        initialUpvotes={item.upvotes}
                      />
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="grid content-start gap-4">
              <div className="border-4 border-ink bg-[#ffe45c] p-5 shadow-[6px_6px_0_#101316]">
                <p className="mb-2 font-mono text-xs font-black uppercase tracking-[0.14em]">How ranking works</p>
                <p className="m-0 text-sm">
                  Source credibility sets initial heat. Reader votes move stories up or down. Newer items break ties.
                </p>
              </div>
              <div className="border-4 border-ink bg-white p-5">
                <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.14em]">Popular sources</p>
                <div className="grid gap-2">
                  {[...new Set(rankedItems.map((item) => item.source))].slice(0, 8).map((source) => (
                    <div className="flex items-center justify-between border-b border-line pb-2 text-sm last:border-b-0" key={source}>
                      <span className="font-bold">{source}</span>
                      <span className="font-mono text-muted">{rankedItems.filter((item) => item.source === source).length}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
