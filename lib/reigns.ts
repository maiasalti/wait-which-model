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
 *  committed `days` in frontier-reigns.json would churn the file every day. */
export function reignDays(reign: Reign, now: Date): number {
  const start = Date.parse(`${reign.start}T00:00:00Z`);
  const end = reign.end ? Date.parse(`${reign.end}T00:00:00Z`) : now.getTime();
  return Math.max(0, Math.round((end - start) / DAY));
}
