export interface Reign {
  modelId: string;
  tier: string;
  start: string;
  end: string | null;
  dethronedBy: string | null;
  composite: number;
}

const DAY = 86_400_000;

/** Elapsed days, computed rather than stored: an open reign grows daily, so a
 *  committed `days` in frontier-reigns.json would churn the file every day.
 *
 *  `floor`, not `round`. Both endpoints of a CLOSED reign are UTC midnight, so
 *  the difference is always whole and either works. But an OPEN reign is
 *  measured against the live clock, and rounding would count a day the model
 *  has not finished holding — every open reign would read one day too high
 *  from 12:00 UTC onwards, correcting itself at midnight. Dates are parsed as
 *  UTC so the count cannot shift with the viewer's timezone. */
export function reignDays(reign: Reign, now: Date): number {
  const start = Date.parse(`${reign.start}T00:00:00Z`);
  const end = reign.end ? Date.parse(`${reign.end}T00:00:00Z`) : now.getTime();
  return Math.max(0, Math.floor((end - start) / DAY));
}
