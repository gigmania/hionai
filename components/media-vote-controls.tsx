"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useState } from "react";

export function MediaVoteControls({
  id,
  initialUpvotes,
  initialDownvotes,
  initialPopularity
}: {
  id?: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialPopularity: number;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [popularity, setPopularity] = useState(initialPopularity);
  const [busy, setBusy] = useState<"up" | "down" | null>(null);

  async function vote(direction: "up" | "down") {
    if (!id || busy) return;
    setBusy(direction);

    const response = await fetch("/api/media/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, direction })
    });

    if (response.ok) {
      const data = (await response.json()) as {
        upvotes: number;
        downvotes: number;
        popularity_score: number;
      };
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
      setPopularity(data.popularity_score);
    }

    setBusy(null);
  }

  return (
    <div className="grid justify-items-center gap-1 font-mono text-xs">
      <button
        aria-label="Vote story up"
        className="grid h-8 w-8 place-items-center border border-ink bg-white text-ink disabled:opacity-40"
        disabled={!id || busy !== null}
        onClick={() => vote("up")}
        type="button"
      >
        <ArrowBigUp size={18} />
      </button>
      <strong className="text-base leading-none">{popularity}</strong>
      <span className="text-[0.65rem] uppercase text-muted">heat</span>
      <button
        aria-label="Vote story down"
        className="grid h-8 w-8 place-items-center border border-line bg-white text-muted disabled:opacity-40"
        disabled={!id || busy !== null}
        onClick={() => vote("down")}
        type="button"
      >
        <ArrowBigDown size={18} />
      </button>
      <span className="text-[0.65rem] text-muted">
        {upvotes}/{downvotes}
      </span>
    </div>
  );
}
