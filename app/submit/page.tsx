import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SubmitLaunchForm } from "./submit-form";

export default function SubmitPage() {
  return (
    <PageShell>
      <main className="bg-paper py-16">
        <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 lg:grid-cols-[0.72fr_1fr]">
          <SectionHeading eyebrow="Submit" title="Send us an AI launch worth tracking.">
            <p>
              Submit new AI products, agents, models, APIs, open-source projects, infrastructure tools, or research products.
              Submissions enter the review queue before appearing publicly.
            </p>
          </SectionHeading>
          <SubmitLaunchForm />
        </div>
      </main>
    </PageShell>
  );
}
