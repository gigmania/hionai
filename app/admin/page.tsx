import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { getAdminIngestionRuns, getAdminLaunches, getAdminMediaItems, getAdminModels, getAdminSources } from "@/lib/admin-data";
import {
  createSource,
  publishLaunch,
  publishMediaItem,
  publishModel,
  runIngestion,
  unpublishLaunch,
  unpublishMediaItem,
  unpublishModel,
  upsertModel
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [
    { launches, error: launchError },
    { mediaItems, error: mediaError },
    { sources, error: sourceError },
    { runs, error: runsError },
    { models, error: modelsError }
  ] = await Promise.all([
    getAdminLaunches(),
    getAdminMediaItems(),
    getAdminSources(),
    getAdminIngestionRuns(),
    getAdminModels()
  ]);
  const pending = launches.filter((launch) => !launch.published);
  const published = launches.filter((launch) => launch.published);
  const pendingMedia = mediaItems.filter((item) => !item.published);
  const publishedMedia = mediaItems.filter((item) => item.published);
  const pendingModels = models.filter((model) => !model.published);
  const publishedModels = models.filter((model) => model.published);
  const error = launchError ?? mediaError ?? sourceError ?? runsError ?? modelsError;

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
                  <div className="grid gap-2 font-mono text-xs text-muted md:grid-cols-7">
                    <span>media {run.media_inserted}</span>
                    <span>raw {run.raw_inserted}</span>
                    <span>ph {run.product_hunt_upserted}</span>
                    <span>poly {run.polymarket_upserted}</span>
                    <span>kalshi {run.kalshi_upserted}</span>
                    <span>arxiv {run.arxiv_upserted}</span>
                    <span>models {run.models_upserted}</span>
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

          <section className="grid gap-4 rounded-lg border border-line bg-white p-5">
            <div>
              <h2 className="mb-2 text-2xl font-black">Models</h2>
              <p className="m-0 text-muted">
                Provider model-card ingestion refreshes this list. Use the editor for corrections, ranking, and manual additions.
              </p>
            </div>

            <details className="rounded-lg border border-line bg-paper p-4">
              <summary className="cursor-pointer font-mono text-xs font-black uppercase tracking-wide">Add model</summary>
              <form action={upsertModel} className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-sm font-bold">
                  Name
                  <input className="rounded-lg border border-line px-3 py-2" name="name" placeholder="GPT-5.5" required />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Slug
                  <input className="rounded-lg border border-line px-3 py-2" name="slug" placeholder="gpt-5-5" />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Maker
                  <input className="rounded-lg border border-line px-3 py-2" name="maker" placeholder="OpenAI" required />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Rank
                  <input className="rounded-lg border border-line px-3 py-2" defaultValue="999" min="1" name="rank" type="number" />
                </label>
                <label className="grid gap-1 text-sm font-bold md:col-span-2">
                  Summary
                  <textarea className="min-h-24 rounded-lg border border-line px-3 py-2" name="summary" required />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Strengths
                  <input className="rounded-lg border border-line px-3 py-2" name="strengths" placeholder="Reasoning, Coding, Research" />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Context
                  <input className="rounded-lg border border-line px-3 py-2" name="context" placeholder="Large" />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Modality
                  <input className="rounded-lg border border-line px-3 py-2" name="modality" placeholder="Text, tools, multimodal" />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Access
                  <input className="rounded-lg border border-line px-3 py-2" name="access" placeholder="API and ChatGPT" />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Detail URL
                  <input className="rounded-lg border border-line px-3 py-2" name="detailUrl" placeholder="https://..." type="url" />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Source URL
                  <input className="rounded-lg border border-line px-3 py-2" name="sourceUrl" placeholder="https://..." type="url" />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Source
                  <input className="rounded-lg border border-line px-3 py-2" defaultValue="Provider model card" name="source" />
                </label>
                <label className="flex items-center gap-2 self-end text-sm font-bold">
                  <input defaultChecked name="published" type="checkbox" />
                  Published
                </label>
                <button className="rounded-lg border border-ink bg-ink px-5 py-2 font-black text-white md:w-fit" type="submit">
                  Save model
                </button>
              </form>
            </details>

            {pendingModels.length > 0 ? <h3 className="text-xl font-black">Pending models</h3> : null}
            {pendingModels.map((model) => (
              <article className="rounded-lg border border-line bg-paper p-4" key={model.id}>
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-xs font-black uppercase tracking-wide text-ocean">
                      #{model.rank} / {model.maker}
                    </p>
                    <h3 className="mb-1 text-lg font-black">{model.name}</h3>
                    <p className="m-0 text-muted">{model.summary}</p>
                  </div>
                  <form action={publishModel}>
                    <input name="id" type="hidden" value={model.id} />
                    <input name="slug" type="hidden" value={model.slug} />
                    <button className="rounded-lg border border-ink bg-ink px-4 py-2 font-black text-white" type="submit">
                      Publish
                    </button>
                  </form>
                </div>
              </article>
            ))}

            <h3 className="text-xl font-black">Published models</h3>
            <div className="grid gap-3">
              {publishedModels.map((model) => (
                <details className="rounded-lg border border-line bg-paper p-4" key={model.id}>
                  <summary className="cursor-pointer">
                    <span className="font-black">{model.name}</span>
                    <span className="ml-2 font-mono text-xs font-black uppercase tracking-wide text-muted">
                      #{model.rank} / {model.maker}
                    </span>
                  </summary>
                  <form action={upsertModel} className="mt-4 grid gap-3 md:grid-cols-2">
                    <input name="id" type="hidden" value={model.id} />
                    <label className="grid gap-1 text-sm font-bold">
                      Name
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.name} name="name" required />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">
                      Slug
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.slug} name="slug" required />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">
                      Maker
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.maker} name="maker" required />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">
                      Rank
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.rank} min="1" name="rank" type="number" />
                    </label>
                    <label className="grid gap-1 text-sm font-bold md:col-span-2">
                      Summary
                      <textarea className="min-h-24 rounded-lg border border-line px-3 py-2" defaultValue={model.summary} name="summary" required />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">
                      Strengths
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.strengths.join(", ")} name="strengths" />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">
                      Context
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.context} name="context" />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">
                      Modality
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.modality} name="modality" />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">
                      Access
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.access} name="access" />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">
                      Detail URL
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.detail_url ?? ""} name="detailUrl" type="url" />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">
                      Source URL
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.source_url ?? ""} name="sourceUrl" type="url" />
                    </label>
                    <label className="grid gap-1 text-sm font-bold">
                      Source
                      <input className="rounded-lg border border-line px-3 py-2" defaultValue={model.source ?? "Provider model card"} name="source" />
                    </label>
                    <label className="flex items-center gap-2 self-end text-sm font-bold">
                      <input defaultChecked={model.published} name="published" type="checkbox" />
                      Published
                    </label>
                    <div className="flex flex-wrap gap-3 md:col-span-2">
                      <button className="rounded-lg border border-ink bg-ink px-5 py-2 font-black text-white" type="submit">
                        Save model
                      </button>
                      <button className="rounded-lg border border-line px-5 py-2 font-black" formAction={unpublishModel} type="submit">
                        Unpublish
                      </button>
                    </div>
                  </form>
                </details>
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
