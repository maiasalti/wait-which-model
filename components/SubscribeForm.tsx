"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "invalid" | "paused" | "error";

const MESSAGES: Record<Exclude<Status, "idle" | "sending">, string> = {
  done: "You're on the list.",
  invalid: "That address didn't work — try again?",
  paused: "Sign-ups are paused.",
  error: "Something went wrong — try again in a minute.",
};

/** Footer sign-up for model-release emails. Posts to /api/subscribe; the
 *  hidden `website` field is a honeypot that real visitors never see. */
export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("done");
        setEmail("");
      } else if (data.error === "invalid_email") setStatus("invalid");
      else if (data.error === "not_configured") setStatus("paused");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-2" aria-label="Get an email when a new model is added">
      <label htmlFor="subscribe-email" className="text-ink-2">
        Get an email when a new model is added
      </label>
      <div className="flex w-full max-w-sm gap-2">
        <input
          id="subscribe-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
          className="min-w-0 flex-1 rounded border border-line bg-surface px-2 py-1.5 text-xs text-ink placeholder:text-ink-3"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded border border-line-strong bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-white/5 disabled:opacity-60"
        >
          {status === "sending" ? "Adding…" : "Notify me"}
        </button>
        {/* Honeypot: hidden from people, filled by bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
      </div>
      <p role="status" aria-live="polite" className="min-h-4 text-ink-3">
        {status === "idle" || status === "sending" ? "" : MESSAGES[status]}
      </p>
    </form>
  );
}
