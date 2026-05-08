import { PageShell } from "@/components/page-shell";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { SectionHeading } from "@/components/section-heading";
import { getIndexBaskets } from "@/lib/live-data";

export const revalidate = 60;

export default async function AiIndexPage() {
  const indexBaskets = await getIndexBaskets();

  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
          <SectionHeading eyebrow="AI Index" title="Public and private AI exposure across the stack." wide>
            <p>Track the companies, categories, and signals that show how AI value is moving through markets.</p>
          </SectionHeading>
          <PlaceholderNotice />
          <div className="grid gap-4 md:grid-cols-2">
            {indexBaskets.map((basket) => (
              <article className="rounded-lg border border-line bg-white p-6" key={basket.name}>
                <h3 className="mb-3 text-2xl font-black">{basket.name}</h3>
                <p className="mb-4 font-bold text-ocean">{basket.companies.join(" / ")}</p>
                <p className="m-0 text-muted">{basket.signal}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
