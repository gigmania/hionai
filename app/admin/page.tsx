import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { getAdminIngestionRuns, getAdminLaunches, getAdminMediaItems, getAdminSources } from "@/lib/admin-data";
import { createSource, publishLaunch, publishMediaItem, runIngestion, unpublishLaunch, unpublishMediaItem } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    { launches, error: launchError },
    { mediaItems, error: mediaError },
    { sources, error: sourceError },
    { runs, error: runsError }
  ] = await Promise.all([
    getAdminLaunches(),
    getAdminMediaItems(),
    getAdminSources(),
    getAdminIngestionRuns()
  ]);
  const pending = launches.filter((launch) => !launch.published);
  const published = launches.filter((launch) => launch.published);
  const pendingMedia = mediaItems.filter((item) => !item.published);
  const publishedMedia = mediaItems.filter((item) => item.published);
  const error = launchError ?? mediaError ?? sourceError ?? runsError;

  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
          <SectionHeading eyebrow="Admin" title="Review queues and source ingestion." wide>
            <p>Review submitted launches, publish imported media, and register feeds for scheduled ingestion.</p>
          </SectionHeading>

          {error ? <div className="rounded-lg border border-ember bg-white p-5 font-bold text-ember">{error}</div> : null}

          <section className="grid gap-4 rounded-lg border border-line bg-white p-5">
            <h2 className="text-2xl font-black">Ingestion runs</h2>
            {runs.length === 0 ? <p className="text-muted">No ingestion runs logged yet.</p> : null}
            <div className="grid gap-3">
              {runs.map((run) => (
                <article className="rounded-lg border border-line bg-paper p-4" key={run.id}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="m-0 font-mono text-xs font-black uppercase tracking-wide text-ocean">
                      {run.status} / {new Date(run.started_at).toLocaleString()}
                    </p>
                    <span className="rounded-full border border-line bg-white px-3 py-1 font-mono text-[0.68rem] font-black uppercase">
                      sources {run.active_sources}
                    </span>
                  </div>
                  <div className="grid gap-2 font-mono text-xs text-muted md:grid-cols-5">
                    <span>media {run.media_inserted}</span>
                    <span>raw {run.raw_inserted}</span>
                    <span>poly {run.polymarket_upserted}</span>
                    <span>kalshi {run.kalshi_upserted}</span>
                    <span>arxiv {run.arxiv_upserted}</span>
                  </div>
                  <details className="mt-3 rounded-lg border border-line bg-white p-3">
                    <summary className="cursor-pointer font-mono text-xs font-black uppercase tracking-wide">
                      Details {run.errors.length > 0 ? `/${run.errors.length} errors` : "/ no errors"}
                    </summary>
                    <p className="mt-3 text-sm text-muted">{run.summary ?? "No summary recorded."}</p>
                    {run.errors.length > 0 ? (
                      <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded bg-ink p-3 text-xs text-white">
                        {JSON.stringify(run.errors, null, 2)}
                      </pre>
                    ) : null}
                  </details>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 rounded-lg border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="mb-2 text-2xl font-black">Sources</h2>
                <p className="m-0 text-muted">Add RSS or Atom feeds. Cron and manual runs import and publish new media automatically.</p>
              </div>
              <form action={runIngestion}>
                <button className="rounded-lg border border-ink bg-ink px-5 py-2 font-black text-white" type="submit">
                  Run ingestion
                </button>
              </form>
            </div>
            <form action={createSource} className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_110px_auto]">
              <label className="grid gap-1 text-sm font-bold">
                Name
                <input className="rounded-lg border border-line px-3 py-2" name="name" placeholder="OpenAI Blog" required />
              </label>
              <label className="grid gap-1 text-sm font-bold">
                Site URL
                <input className="rounded-lg border border-line px-3 py-2" name="url" placeholder="https://..." type="url" />
              </label>
              <label className="grid gap-1 text-sm font-bold">
                Feed URL
                <input className="rounded-lg border border-line px-3 py-2" name="feedUrl" placeholder="https://.../feed.xml" required type="url" />
              </label>
              <label className="grid gap-1 text-sm font-bold">
                Score
                <input className="rounded-lg border border-line px-3 py-2" defaultValue="70" max="100" min="0" name="credibilityScore" type="number" />
              </label>
              <label className="grid gap-1 text-sm font-bold">
                Category
                <select className="rounded-lg border border-line px-3 py-2" defaultValue="news" name="category">
                  <option value="news">news</option>
                  <option value="podcast">podcast</option>
                  <option value="video">video</option>
                  <option value="research">research</option>
                </select>
              </label>
              <button className="rounded-lg border border-ink bg-ink px-5 py-2 font-black text-white lg:col-start-5" type="submit">
                Add source
              </button>
            </form>

            <div className="grid gap-3">
              {sources.length === 0 ? <p className="text-muted">No sources configured.</p> : null}
              {sources.map((source) => (
                <article className="rounded-lg border border-line bg-paper p-4" key={source.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="mb-1 text-xs font-black uppercase tracking-wide text-ocean">
                        {source.category} / score {source.credibility_score}
                      </p>
                      <h3 className="mb-1 text-lg font-black">{source.name}</h3>
                      <p className="m-0 break-all text-sm text-muted">{source.feed_url}</p>
                    </div>
                    <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-black uppercase tracking-wide">
                      {source.is_active ? "active" : "inactive"}
                    </span>
                  </div>
                  {source.last_error ? <p className="mt-3 text-sm font-bold text-ember">{source.last_error}</p> : null}
                  {source.last_fetched_at ? <p className="mt-3 text-sm text-muted">Last fetched {new Date(source.last_fetched_at).toLocaleString()}</p> : null}
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4">
            <h2 className="text-2xl font-black">Pending media</h2>
            {pendingMedia.length === 0 ? <p className="text-muted">No pending media items.</p> : null}
            {pendingMedia.map((item) => (
              <article className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-line bg-white p-5" key={item.id}>
                <div>
                  <p className="mb-1 text-xs font-black uppercase tracking-wide text-ocean">
                    {item.type} / {item.source}
                  </p>
                  <h3 className="mb-2 text-lg font-black">{item.title}</h3>
                  <p className="m-0 max-w-3xl text-muted">{item.why}</p>
                  {item.url ? (
                    <a className="mt-3 inline-block text-sm font-bold text-moss" href={item.url}>
                      Source
                    </a>
                  ) : null}
                </div>
                <form action={publishMediaItem}>
                  <input name="id" type="hidden" value={item.id} />
                  <button className="rounded-lg border border-ink bg-ink px-4 py-2 font-black text-white" type="submit">
                    Publish
                  </button>
                </form>
              </article>
            ))}
          </section>

          <section className="grid gap-4">
            <h2 className="text-2xl font-black">Pending submissions</h2>
            {pending.length === 0 ? <p className="text-muted">No pending launch submissions.</p> : null}
            {pending.map((launch) => (
              <article className="rounded-lg border border-line bg-white p-5" key={launch.id}>
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-black uppercase tracking-wide text-ocean">{launch.category}</p>
                    <h3 className="mb-2 text-xl font-black">{launch.name}</h3>
                    <p className="m-0 max-w-3xl text-muted">{launch.summary}</p>
                    {launch.source_url ? (
                      <a className="mt-3 inline-block text-sm font-bold text-moss" href={launch.source_url}>
                        Source
                      </a>
                    ) : null}
                  </div>
                  <span className="rounded-full border border-line px-3 py-1 text-xs font-black uppercase tracking-wide">
                    {launch.status}
                  </span>
                </div>

                <form action={publishLaunch} className="grid gap-3 md:grid-cols-[120px_160px_160px_auto]">
                  <input name="id" type="hidden" value={launch.id} />
                  <label className="grid gap-1 text-sm font-bold">
                    Rank
                    <input className="rounded-lg border border-line px-3 py-2" defaultValue={launch.rank} min="1" name="rank" type="number" />
                  </label>
                  <label className="grid gap-1 text-sm font-bold">
                    Momentum
                    <input className="rounded-lg border border-line px-3 py-2" defaultValue={launch.momentum} max="100" min="0" name="momentum" type="number" />
                  </label>
                  <label className="grid gap-1 text-sm font-bold">
                    Status
                    <select className="rounded-lg border border-line px-3 py-2" defaultValue={launch.status} name="status">
                      <option value="hot">hot</option>
                      <option value="rising">rising</option>
                      <option value="watch">watch</option>
                    </select>
                  </label>
                  <button className="self-end rounded-lg border border-ink bg-ink px-5 py-2 font-black text-white" type="submit">
                    Publish
                  </button>
                </form>
              </article>
            ))}
          </section>

          <section className="grid gap-4">
            <h2 className="text-2xl font-black">Published launches</h2>
            {published.map((launch) => (
              <article className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-white p-5" key={launch.id}>
                <div>
                  <p className="mb-1 text-xs font-black uppercase tracking-wide text-ocean">
                    #{launch.rank} / {launch.category} / +{launch.momentum}
                  </p>
                  <h3 className="mb-1 text-lg font-black">{launch.name}</h3>
                  <p className="m-0 text-muted">{launch.summary}</p>
                </div>
                <form action={unpublishLaunch}>
                  <input name="id" type="hidden" value={launch.id} />
                  <button className="rounded-lg border border-line px-4 py-2 font-black" type="submit">
                    Unpublish
                  </button>
                </form>
              </article>
            ))}
          </section>

          <section className="grid gap-4">
            <h2 className="text-2xl font-black">Published media</h2>
            {publishedMedia.map((item) => (
              <article className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-line bg-white p-5" key={item.id}>
                <div>
                  <p className="mb-1 text-xs font-black uppercase tracking-wide text-ocean">
                    {item.type} / {item.source}
                  </p>
                  <h3 className="mb-1 text-lg font-black">{item.title}</h3>
                  <p className="m-0 text-muted">{item.why}</p>
                </div>
                <form action={unpublishMediaItem}>
                  <input name="id" type="hidden" value={item.id} />
                  <button className="rounded-lg border border-line px-4 py-2 font-black" type="submit">
                    Unpublish
                  </button>
                </form>
              </article>
            ))}
          </section>
        </div>
      </main>
    </PageShell>
  );
}
