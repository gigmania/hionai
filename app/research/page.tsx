import { PageShell } from "@/components/page-shell";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { SectionHeading } from "@/components/section-heading";
import { researchItems } from "@/lib/data";

export default function ResearchPage() {
  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
          <SectionHeading eyebrow="Research" title="Papers, model cards, benchmarks, evals, and safety reports." wide>
            <p>Research summaries should be source-linked, difficulty-labeled, and translated into practical implications.</p>
          </SectionHeading>
          <PlaceholderNotice />
          <div className="grid gap-4 md:grid-cols-3">
            {researchItems.map((item) => (
              <article className="rounded-lg border border-line bg-white p-6" key={item.title}>
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-ocean">{item.label}</span>
                <h3 className="mb-3 text-xl font-black">{item.title}</h3>
                <p className="mb-5 text-muted">{item.summary}</p>
                <span className="rounded-full border border-line px-3 py-1 text-xs font-black uppercase tracking-wide">
                  {item.level}
                </span>
              </article>
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
