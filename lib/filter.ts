import type { Filters, Highlight, Model, TimeWindow } from "./types";

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

export const DEFAULT_FILTERS: Filters = {
  window: "all",
  companies: [],
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
