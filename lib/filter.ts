import type { BenchmarkKey, Filters, Highlight, Model, TimeWindow } from "./types";

export const WINDOW_LABELS: Record<TimeWindow, string> = {
  "3m": "3 months",
  "6m": "6 months",
  "1y": "1 year",
  "2y": "2 years",
  "3y": "3 years",
  all: "All time",
};

const WINDOW_MONTHS: Record<Exclude<TimeWindow, "all">, number> = {
  "3m": 3,
  "6m": 6,
  "1y": 12,
  "2y": 24,
  "3y": 36,
};

/** The five frontier labs (the same set the Frontier Features directory is
 *  limited to). Compare opens with only these selected; an empty `companies`
 *  list still means "every company". */
export const FRONTIER_LABS = ["anthropic", "openai", "google", "xai", "meta"];

export const DEFAULT_FILTERS: Filters = {
  window: "all",
  companies: FRONTIER_LABS,
  openWeightsOnly: false,
  frontierOnly: false,
  benchmark: "sweBench",
  minScore: null,
  maxInputPrice: null,
  search: "",
};

export function windowCutoff(window: TimeWindow, now: Date): Date | null {
  if (window === "all") return null;
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - WINDOW_MONTHS[window]);
  return cutoff;
}

export function applyFilters(all: Model[], f: Filters, now: Date): Model[] {
  const cutoff = windowCutoff(f.window, now);
  const q = f.search.trim().toLowerCase();
  return all.filter((m) => {
    if (cutoff && new Date(m.releaseDate) < cutoff) return false;
    if (f.companies.length > 0 && !f.companies.includes(m.company)) return false;
    if (f.openWeightsOnly && !m.openWeights) return false;
    if (f.frontierOnly && m.status !== "frontier") return false;
    if (f.minScore != null) {
      const score = m.benchmarks[f.benchmark];
      if (score == null || score < f.minScore) return false;
    }
    if (f.maxInputPrice != null) {
      const price = m.pricing.inputPerMTok;
      if (price == null || price > f.maxInputPrice) return false;
    }
    if (q && !`${m.name} ${m.company}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function isHighlighted(m: Model, h: Highlight): boolean {
  switch (h.kind) {
    case "none":
      return true;
    case "models":
      return h.ids.includes(m.id);
    case "company":
      return m.company === h.companyId;
  }
}

export function hasActiveHighlight(h: Highlight): boolean {
  return h.kind !== "none" && (h.kind !== "models" || h.ids.length > 0);
}

/** The benchmark Compare opens on: whichever of `keys` (the non-retired ones,
 *  in benchmarks.json order) has a score on the most models released in the
 *  `months` before the NEWEST release in the data. Anchored to the data rather
 *  than today's date so the server render and the browser always agree, and so
 *  the choice only moves when the data does. Ties go to the earlier key; with
 *  no scores at all it falls back to the first key. */
export function mostReportedBenchmark(
  all: Pick<Model, "releaseDate" | "benchmarks">[],
  keys: BenchmarkKey[],
  months = 3
): BenchmarkKey {
  if (all.length === 0 || keys.length === 0) return keys[0] ?? DEFAULT_FILTERS.benchmark;
  const newest = all.reduce((a, m) => (m.releaseDate > a ? m.releaseDate : a), all[0].releaseDate);
  const cutoff = new Date(`${newest}T00:00:00Z`);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months);
  const from = cutoff.toISOString().slice(0, 10);
  const recent = all.filter((m) => m.releaseDate >= from);
  let best = keys[0];
  let bestCount = -1;
  for (const k of keys) {
    const n = recent.filter((m) => m.benchmarks[k] != null).length;
    if (n > bestCount) {
      best = k;
      bestCount = n;
    }
  }
  return best;
}
