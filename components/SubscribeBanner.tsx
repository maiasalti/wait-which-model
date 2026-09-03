"use client";

import { useEffect, useState } from "react";
import {
  BANNER_STORAGE_KEY,
  dismissedValue,
  shouldShowBanner,
  subscribedValue,
} from "@/lib/banner-dismissal";
import { MESSAGES, useSubscribe } from "./useSubscribe";

/** Sticky bottom bar inviting visitors to subscribe to release emails.
 *  Stays hidden until mounted client-side (so there's no flash on pages
 *  where it was already dismissed, and no hydration mismatch), then shows
 *  itself after the visitor scrolls past 120px or after 4 seconds,
 *  whichever comes first — unless localStorage says it was already
 *  dismissed (within the last 30 days) or the visitor already subscribed. */
export function SubscribeBanner() {
  const [visible, setVisible] = useState(false);
  const { email, setEmail, status, submit } = useSubscribe();

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(BANNER_STORAGE_KEY);
    } catch {
      // Private mode / storage disabled — treat as unset.
    }
    if (!shouldShowBanner(stored, Date.now())) return;

    let shown = false;
    let timer: number;
    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
      cleanup();
    };

    const onScroll = () => {
      if (window.scrollY > 120) show();
    };
    const scrollOptions: AddEventListenerOptions = { passive: true };
    window.addEventListener("scroll", onScroll, scrollOptions);
    timer = window.setTimeout(show, 4000);

    function cleanup() {
      window.removeEventListener("scroll", onScroll, scrollOptions);
      window.clearTimeout(timer);
    }

    return cleanup;
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "6rem";
    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [visible]);

  useEffect(() => {
    if (status !== "done") return;
    try {
      localStorage.setItem(BANNER_STORAGE_KEY, subscribedValue());
    } catch {
      // Ignore storage failures — the banner still hides for this visit.
    }
    const timer = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(timer);
  }, [status]);

  function dismiss() {
    try {
      localStorage.setItem(BANNER_STORAGE_KEY, dismissedValue(Date.now()));
    } catch {
      // Ignore storage failures — the banner still hides for this visit.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Subscribe to model release emails"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-surface-2/95 backdrop-blur px-4 py-3"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink">Get an email when new models are released</p>
        <div className="flex items-center gap-3">
          <form onSubmit={submit} className="flex items-center gap-2">
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
              className="min-w-0 flex-1 rounded border border-line bg-surface px-2 py-1.5 text-xs text-ink placeholder:text-ink-3"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded border border-line-strong bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-white/5 disabled:opacity-60"
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
            <p role="status" aria-live="polite" className="text-xs text-ink-3">
              {status === "idle" || status === "sending" ? "" : MESSAGES[status]}
            </p>
          </form>
          <button
            type="button"
            aria-label="Close"
            onClick={dismiss}
            className="text-ink-3 hover:text-ink"
          >
            ×
          </button>
        </div>
      </div>
    </aside>
  );
}
