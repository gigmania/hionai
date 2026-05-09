import type { MarketSignal } from "@/lib/data";

export function MarketCard({ signal }: { signal: MarketSignal }) {
  const moveClass = signal.move > 0 ? "text-moss" : signal.move < 0 ? "text-ember" : "text-muted";
  const moveText = signal.move > 0 ? `+${signal.move}` : String(signal.move);

  return (
    <article className="rounded-lg border border-line bg-white p-5">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.1em] text-ocean">{signal.source ?? signal.venue}</p>
      <h3 className="min-h-16 text-base font-black leading-snug">
        {signal.url ? (
          <a className="hover:underline" href={signal.url}>
            {signal.question}
          </a>
        ) : (
          signal.question
        )}
      </h3>
      <div className="mt-5 flex items-end justify-between gap-4">
        <strong className="text-5xl font-black leading-none">{signal.probability}%</strong>
        <span className={`font-black ${moveClass}`}>{moveText} today</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-3 font-mono text-[0.68rem] uppercase text-muted">
        {signal.volume ? <span>Vol ${Math.round(signal.volume).toLocaleString()}</span> : null}
        {signal.liquidity ? <span>Liq ${Math.round(signal.liquidity).toLocaleString()}</span> : null}
        <span>{signal.venue}</span>
      </div>
    </article>
  );
}
