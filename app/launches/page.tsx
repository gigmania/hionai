import { LaunchCard } from "@/components/launch-card";
import { PageShell } from "@/components/page-shell";
import { PlaceholderNotice } from "@/components/placeholder-notice";
import { SectionHeading } from "@/components/section-heading";
import { getLaunches } from "@/lib/live-data";

export const revalidate = 60;

export default async function LaunchesPage() {
  const launches = await getLaunches();

  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8">
          <SectionHeading eyebrow="Launches" title="AI products, agents, models, APIs, and open-source releases." wide>
            <p>Ranked by launch momentum, category heat, workflow usefulness, and editorial review.</p>
          </SectionHeading>
          <PlaceholderNotice />
          <div className="grid gap-3">
            {launches.map((launch) => (
              <LaunchCard launch={launch} key={launch.name} />
            ))}
          </div>
        </div>
      </main>
    </PageShell>
  );
}
