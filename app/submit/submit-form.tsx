"use client";

import { useState, type FormEvent } from "react";

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

export function SubmitLaunchForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle", message: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({ status: "submitting", message: "Submitting launch..." });

    const response = await fetch("/api/launches/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.get("name"),
        category: formData.get("category"),
        summary: formData.get("summary"),
        sourceUrl: formData.get("sourceUrl")
      })
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setState({ status: "error", message: payload.message || "Submission failed." });
      return;
    }

    form.reset();
    setState({ status: "success", message: payload.message || "Launch submitted for review." });
  }

  return (
    <form className="grid gap-5 rounded-lg border border-line bg-white p-6 shadow-sm" onSubmit={onSubmit}>
      <label className="grid gap-2 font-bold">
        Product name
        <input className="rounded-lg border border-line px-4 py-3 font-normal" maxLength={120} minLength={2} name="name" required />
      </label>
      <label className="grid gap-2 font-bold">
        Category
        <input className="rounded-lg border border-line px-4 py-3 font-normal" maxLength={80} minLength={2} name="category" placeholder="Coding agents, research, model evals..." required />
      </label>
      <label className="grid gap-2 font-bold">
        Link
        <input className="rounded-lg border border-line px-4 py-3 font-normal" name="sourceUrl" placeholder="https://..." type="url" />
      </label>
      <label className="grid gap-2 font-bold">
        Why it matters
        <textarea className="min-h-36 rounded-lg border border-line px-4 py-3 font-normal" maxLength={500} minLength={20} name="summary" required />
      </label>
      <button
        className="rounded-lg border border-ink bg-ink px-5 py-3 font-black text-white disabled:opacity-60"
        disabled={state.status === "submitting"}
        type="submit"
      >
        Submit launch
      </button>
      {state.message ? (
        <p className={state.status === "error" ? "m-0 font-bold text-ember" : "m-0 font-bold text-moss"}>{state.message}</p>
      ) : null}
    </form>
  );
}
