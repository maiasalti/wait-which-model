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
