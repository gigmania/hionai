import { PageShell } from "@/components/page-shell";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { SectionHeading } from "@/components/section-heading";
import { feedItems } from "@/lib/data";

export default function MediaPage() {
  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
          <SectionHeading eyebrow="Media" title="AI news, podcasts, interviews, newsletters, and video." wide>
            <p>Every feed item should answer what happened, why it matters, and who should care.</p>
          </SectionHeading>
          <PlaceholderNotice />
          <div className="grid gap-4 md:grid-cols-2">
            {feedItems.map((item) => (
              <article className="rounded-lg border border-line bg-white p-6" key={item.title}>
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-ocean">
                  {item.type} / {item.source}
                </span>
                <h3 className="mb-3 text-xl font-black">{item.title}</h3>
                <p className="m-0 text-muted">{item.why}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
