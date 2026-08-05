import type { Model } from "./types";

/** A fixed 30-day month, so the same inputs always give the same answer
 *  regardless of which calendar month you ask in. Stated on /info. */
export const DAYS_PER_MONTH = 30;

export interface CostRow {
  model: Model;
  monthly: number;
}

export function monthlyCost(costPerTaskUsd: number, tasksPerDay: number): number {
  return Math.max(0, tasksPerDay) * DAYS_PER_MONTH * costPerTaskUsd;
}

/** A model with no measured cost-per-task is excluded and reported, never
 *  treated as free — a $0 row would be a lie by omission. */
export function rankByCost(
  all: Model[],
  tasksPerDay: number
): { included: CostRow[]; excluded: Model[] } {
  const included: CostRow[] = [];
  const excluded: Model[] = [];

  for (const m of all) {
    if (m.costPerTask.usd == null) excluded.push(m);
    else included.push({ model: m, monthly: monthlyCost(m.costPerTask.usd, tasksPerDay) });
  }
  included.sort((a, b) => a.monthly - b.monthly);
  return { included, excluded };
}

export const VOLUME_MIN = 10;
export const VOLUME_MAX = 50_000;

/** Two significant figures, so dragging a slider lands on numbers a person
 *  would actually say out loud — 250, 1,200, 47,000 — rather than 1,237. */
function round2sf(n: number): number {
  if (n <= 0) return 0;
  const mag = Math.pow(10, Math.floor(Math.log10(n)) - 1);
  return Math.round(n / mag) * mag;
}

/** Slider position (0–100) → tasks per day, on a LOG scale. Realistic usage
 *  spans three orders of magnitude; a linear slider would cram everything
 *  below a few thousand into the first few pixels and make the useful range
 *  unreachable. */
export function positionToTasks(pos: number): number {
  const p = Math.min(100, Math.max(0, pos));
  return round2sf(VOLUME_MIN * Math.pow(VOLUME_MAX / VOLUME_MIN, p / 100));
}

/** Inverse of positionToTasks, for seeding the slider from a typed number. */
export function tasksToPosition(tasks: number): number {
  const t = Math.min(VOLUME_MAX, Math.max(VOLUME_MIN, tasks));
  return (100 * Math.log(t / VOLUME_MIN)) / Math.log(VOLUME_MAX / VOLUME_MIN);
}
