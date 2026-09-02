import type { BenchmarkKey, Filters, TimeWindow } from "./types";
import { DEFAULT_FILTERS } from "./filter.ts";

export interface CompareState {
  filters: Filters;
  picks: string[];
  diffBaseline: string | null;
  diffOthers: string[];
}

/** The Compare page opens with these four selected. They live here rather than
 *  in the component so they are the CANONICAL default: `stateToQuery` can then
 *  omit them, keeping an untouched Compare page on a clean bare URL instead of
 *  rewriting the address bar to `?picks=...` the moment it mounts. */
export const DEFAULT_PICKS = [
  "claude-fable-5",
  "claude-opus-4-8",
  "gpt-5-5",
  "gemini-3-1-pro",
];

export const DEFAULT_COMPARE_STATE: CompareState = {
  filters: DEFAULT_FILTERS,
  picks: DEFAULT_PICKS,
  diffBaseline: null,
  diffOthers: [],
};

const sameList = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const WINDOWS: TimeWindow[] = ["3m", "6m", "1y", "2y", "3y", "all"];
/** Mirrors the non-retired keys in data/benchmarks.json (a test pins the two
 *  together). Kept literal because this module runs under `node --test`, which
 *  cannot resolve the `@/` JSON alias. A retired key in a shared link falls back
 *  to the default benchmark rather than selecting something the picker no longer
 *  offers. */
const BENCHMARKS: BenchmarkKey[] = [
  "gpqaDiamond", "sweBench", "sweBenchPro", "terminalBench",
  "hle", "lmarenaElo", "gdpvalAA", "arcAgi2",
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
  if (!sameList(state.picks, DEFAULT_PICKS)) p.set("picks", state.picks.join(","));
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
    // `has` not `get`: an absent param means "untouched, use defaults", while
    // an explicitly empty `picks=` means the user deselected everything and
    // wants that shared.
    picks: params.has("picks") ? list(params.get("picks")) : DEFAULT_PICKS,
    diffBaseline: params.get("base"),
    diffOthers: list(params.get("vs")),
  };
}
