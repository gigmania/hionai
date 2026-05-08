import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { getAdminLaunches } from "@/lib/admin-data";
import { publishLaunch, unpublishLaunch } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { launches, error } = await getAdminLaunches();
  const pending = launches.filter((launch) => !launch.published);
  const published = launches.filter((launch) => launch.published);

  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
          <SectionHeading eyebrow="Admin" title="Launch review queue." wide>
            <p>Review submitted launches, tune ranking metadata, and publish items to the public homepage.</p>
          </SectionHeading>

          {error ? <div className="rounded-lg border border-ember bg-white p-5 font-bold text-ember">{error}</div> : null}

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
        </div>
      </main>
    </PageShell>
  );
}
