import type { MarketSignal } from "@/lib/data";

export function MarketCard({ signal }: { signal: MarketSignal }) {
  const moveClass = signal.move > 0 ? "text-moss" : signal.move < 0 ? "text-ember" : "text-muted";
  const moveText = signal.move > 0 ? `+${signal.move}` : String(signal.move);

  return (
    <article className="rounded-lg border border-line bg-white p-5">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.1em] text-ocean">{signal.venue}</p>
      <h3 className="min-h-16 text-base font-black leading-snug">{signal.question}</h3>
      <div className="mt-5 flex items-end justify-between gap-4">
        <strong className="text-5xl font-black leading-none">{signal.probability}%</strong>
        <span className={`font-black ${moveClass}`}>{moveText} today</span>
      </div>
    </article>
  );
}
