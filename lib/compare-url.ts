import type { BenchmarkKey, Filters, TimeWindow } from "./types";
import { DEFAULT_FILTERS } from "./filter.ts";

export interface CompareState {
  filters: Filters;
  picks: string[];
  diffBaseline: string | null;
  diffOthers: string[];
}

export const DEFAULT_COMPARE_STATE: CompareState = {
  filters: DEFAULT_FILTERS,
  picks: [],
  diffBaseline: null,
  diffOthers: [],
};

const WINDOWS: TimeWindow[] = ["3m", "6m", "1y", "2y", "3y", "all"];
const BENCHMARKS: BenchmarkKey[] = [
  "mmluPro", "gpqaDiamond", "sweBench", "terminalBench",
  "aime", "hle", "lmarenaElo", "arcAgi2",
];

const num = (raw: string | null): number | null => {
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const list = (raw: string | null): string[] =>
  raw ? raw.split(",").filter(Boolean) : [];

/** Only non-default values are emitted, so an untouched Compare page keeps a
 *  clean bare URL and a shared link shows exactly what was changed. */
export function stateToQuery(state: CompareState): string {
  const p = new URLSearchParams();
  const f = state.filters;
  const d = DEFAULT_FILTERS;

  if (f.window !== d.window) p.set("window", f.window);
  if (f.companies.length) p.set("co", f.companies.join(","));
  if (f.openWeightsOnly) p.set("open", "1");
  if (f.frontierOnly) p.set("frontier", "1");
  if (f.benchmark !== d.benchmark) p.set("bench", f.benchmark);
  if (f.minScore != null) p.set("min", String(f.minScore));
  if (f.maxInputPrice != null) p.set("max", String(f.maxInputPrice));
  if (f.search) p.set("q", f.search);
  if (state.picks.length) p.set("picks", state.picks.join(","));
  if (state.diffBaseline) p.set("base", state.diffBaseline);
  if (state.diffOthers.length) p.set("vs", state.diffOthers.join(","));

  return p.toString();
}

/** Unrecognised values fall back to defaults rather than throwing — a shared
 *  link must never break the page, however mangled it arrives. */
export function queryToState(params: URLSearchParams): CompareState {
  const window = params.get("window");
  const bench = params.get("bench");

  return {
    filters: {
      window: WINDOWS.includes(window as TimeWindow)
        ? (window as TimeWindow)
        : DEFAULT_FILTERS.window,
      companies: list(params.get("co")),
      openWeightsOnly: params.get("open") === "1",
      frontierOnly: params.get("frontier") === "1",
      benchmark: BENCHMARKS.includes(bench as BenchmarkKey)
        ? (bench as BenchmarkKey)
        : DEFAULT_FILTERS.benchmark,
      minScore: num(params.get("min")),
      maxInputPrice: num(params.get("max")),
      search: params.get("q") ?? "",
    },
    picks: list(params.get("picks")),
    diffBaseline: params.get("base"),
    diffOthers: list(params.get("vs")),
  };
}
