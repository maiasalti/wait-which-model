"use client";

import { MESSAGES, useSubscribe } from "./useSubscribe";

/** The full-size sign-up form on /subscribe. Same submit logic as the
 *  footer form and the sticky banner, just laid out to be the point of
 *  the page rather than an afterthought at the bottom of it. */
export function SubscribePanel() {
  const { email, setEmail, status, submit } = useSubscribe();
  const done = status === "done";

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-line bg-surface p-5 sm:p-6"
      aria-label="Get an email when a new model is added"
    >
      <label htmlFor="subscribe-page-email" className="block text-sm font-semibold text-ink">
        Your email
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="subscribe-page-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending" || done}
          className="min-w-0 flex-1 rounded border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-3 focus:border-line-strong focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending" || done}
          className="rounded border border-line-strong bg-surface-2 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white/5 disabled:opacity-60"
        >
          {status === "sending" ? "Adding…" : done ? "Subscribed" : "Notify me"}
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
      <p
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm ${done ? "text-ink" : "text-ink-3"}`}
      >
        {status === "idle" || status === "sending" ? "" : MESSAGES[status]}
      </p>
    </form>
  );
}
