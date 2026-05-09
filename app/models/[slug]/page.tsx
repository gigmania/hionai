import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { aiModels } from "@/lib/data";

export function generateStaticParams() {
  return aiModels.map((model) => ({ slug: model.slug }));
}

export default async function ModelDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = aiModels.find((item) => item.slug === slug);

  if (!model) {
    notFound();
  }

  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(980px,calc(100%-32px))] gap-8">
          <Link className="font-mono text-xs font-black uppercase tracking-[0.12em] text-muted hover:text-ink" href="/models">
            Back to models
          </Link>
          <section className="rounded-lg border border-line bg-white p-8">
            <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-ocean">{model.maker}</p>
            <h1 className="mb-5 text-5xl font-black leading-none md:text-7xl">{model.name}</h1>
            <p className="mb-8 text-xl text-muted">{model.summary}</p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-line p-4">
                <p className="mb-1 font-mono text-xs font-black uppercase text-muted">Context</p>
                <strong>{model.context}</strong>
              </div>
              <div className="rounded-lg border border-line p-4">
                <p className="mb-1 font-mono text-xs font-black uppercase text-muted">Modality</p>
                <strong>{model.modality}</strong>
              </div>
              <div className="rounded-lg border border-line p-4">
                <p className="mb-1 font-mono text-xs font-black uppercase text-muted">Access</p>
                <strong>{model.access}</strong>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-8">
            <h2 className="mb-4 text-2xl font-black">Strengths</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {model.strengths.map((strength) => (
                <div className="rounded-lg border border-line p-4 font-bold" key={strength}>
                  {strength}
                </div>
              ))}
            </div>
          </section>

          <a className="inline-flex w-fit rounded-lg border border-ink bg-ink px-5 py-3 font-black text-white" href={model.detailUrl}>
            Read source documentation
          </a>
        </div>
      </main>
    </PageShell>
  );
}
