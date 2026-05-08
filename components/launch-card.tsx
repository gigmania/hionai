import type { Launch } from "@/lib/data";

export function LaunchCard({ launch }: { launch: Launch }) {
  const statusClass =
    launch.status === "hot" ? "bg-ember text-white" : launch.status === "rising" ? "bg-moss text-white" : "bg-gold text-ink";

  return (
    <article className="grid grid-cols-[44px_minmax(0,1fr)_64px] gap-4 rounded-lg border border-line bg-white p-5 shadow-sm max-sm:grid-cols-[44px_minmax(0,1fr)]">
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-sm font-black text-white">
        {String(launch.rank).padStart(2, "0")}
      </span>
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="m-0 text-lg font-black leading-tight">{launch.name}</h3>
          <span className={`rounded-full px-2 py-1 text-[0.68rem] font-black uppercase tracking-wide ${statusClass}`}>
            {launch.status}
          </span>
        </div>
        <p className="mb-2 text-sm font-bold text-ocean">{launch.category}</p>
        <p className="m-0 text-muted">{launch.summary}</p>
      </div>
      <strong className="text-right text-xl text-moss max-sm:col-start-2 max-sm:text-left">+{launch.momentum}</strong>
    </article>
  );
}
