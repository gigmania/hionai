import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { getModels } from "@/lib/live-data";

export const revalidate = 60;

export default async function ModelsPage() {
  const models = await getModels();

  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
          <SectionHeading eyebrow="Models" title="Top AI models to track." wide>
            <p>Frontier, open-weight, coding, multimodal, and specialist models with practical notes and links to deeper information.</p>
          </SectionHeading>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model, index) => (
              <Link className="group rounded-lg border border-line bg-white p-6 transition hover:border-ink" href={`/models/${model.slug}`} key={model.slug}>
                <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-ocean">
                  {String(model.rank ?? index + 1).padStart(2, "0")} / {model.maker}
                </p>
                <h2 className="mb-3 text-2xl font-black leading-tight group-hover:underline">{model.name}</h2>
                <p className="mb-5 text-muted">{model.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {model.strengths.slice(0, 3).map((strength) => (
                    <span className="rounded-full border border-line px-3 py-1 text-xs font-bold" key={strength}>
                      {strength}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
