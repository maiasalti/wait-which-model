/** Pure dismissal logic for the sticky subscribe banner. No React, no
 *  `window` — the component reads/writes localStorage and passes the raw
 *  string and current time in here. */

export const DISMISS_DAYS = 30;
export const BANNER_STORAGE_KEY = "wwm:subscribe-banner";

type StoredState = { subscribed: true } | { dismissedAt: number };

/** Whether the banner should be shown, given the raw localStorage value
 *  (or null if unset/unavailable) and the current time in ms. */
export function shouldShowBanner(stored: string | null, now: number): boolean {
  if (stored === null) return true;

  let parsed: StoredState;
  try {
    parsed = JSON.parse(stored) as StoredState;
  } catch {
    return true;
  }

  if (!parsed || typeof parsed !== "object") return true;

  if ("subscribed" in parsed && parsed.subscribed === true) return false;

  if ("dismissedAt" in parsed && typeof parsed.dismissedAt === "number") {
    return now - parsed.dismissedAt >= DISMISS_DAYS * 86_400_000;
  }

  return true;
}

export function dismissedValue(now: number): string {
  return JSON.stringify({ dismissedAt: now });
}

export function subscribedValue(): string {
  return JSON.stringify({ subscribed: true });
}
