"use client";

import { activeBenchmarks, modelCompanies, models } from "@/lib/data";
import { CompanyLogo } from "./CompanyLogo";
import { FRONTIER_LABS, WINDOW_LABELS } from "@/lib/filter";
import { countriesOf } from "@/lib/format";
import type { BenchmarkKey, Filters, Highlight, TimeWindow, WeightsFilter } from "@/lib/types";

const WINDOWS: TimeWindow[] = ["3m", "6m", "1y", "2y", "3y", "all"];
const WEIGHTS: [WeightsFilter, string][] = [
  ["all", "All"],
  ["open", "Open"],
  ["closed", "Closed"],
];
const HEADING = "mono text-xs font-semibold uppercase tracking-widest text-ink";

/** Countries with at least one model-making company, most companies first, for the
 *  one-click country selections. */
const COUNTRIES = (() => {
  const n = new Map<string, number>();
  for (const c of modelCompanies)
    for (const country of countriesOf(c.country)) n.set(country, (n.get(country) ?? 0) + 1);
  return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([c]) => c);
})();

export function FilterRail({
  filters,
  setFilters,
  highlight,
  setHighlight,
  shownCount,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  highlight: Highlight;
  setHighlight: (h: Highlight) => void;
  shownCount: number;
}) {
  const allIds = modelCompanies.map((c) => c.id);
  const selectCompanies = (ids: string[]) =>
    // an empty list is the canonical "every company" (keeps shared URLs short)
    setFilters({ ...filters, companies: ids.length === allIds.length ? [] : ids });
  const isSelected = (id: string) =>
    filters.companies.length === 0 || filters.companies.includes(id);
  /** With everything selected, clicking a lab switches just that lab off. */
  const toggleCompany = (id: string) => {
    const current = filters.companies.length === 0 ? allIds : filters.companies;
    selectCompanies(
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
    );
  };
  const sameSelection = (ids: string[]) => {
    const current = filters.companies.length === 0 ? allIds : filters.companies;
    return current.length === ids.length && ids.every((id) => current.includes(id));
  };

  const toggleHighlightModel = (id: string) => {
    const ids = highlight.kind === "models" ? highlight.ids : [];
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    setHighlight(next.length ? { kind: "models", ids: next } : { kind: "none" });
  };

  const quick: { label: string; ids: string[] }[] = [
    { label: "Select all", ids: allIds },
    { label: "Frontier labs", ids: FRONTIER_LABS.filter((id) => allIds.includes(id)) },
    ...COUNTRIES.map((country) => ({
      label: country,
      ids: modelCompanies.filter((c) => countriesOf(c.country).includes(country)).map((c) => c.id),
    })),
  ];

  return (
    <aside className="flex flex-col gap-5 rounded-lg border border-line p-4">
      <section>
        <h3 className={HEADING}>Companies</h3>
        <div className="mt-2 flex flex-wrap items-center gap-1.5" role="group" aria-label="Quick company selection">
          {quick.map((q) => (
            <button
              key={q.label}
              onClick={() => selectCompanies(q.ids)}
              aria-pressed={sameSelection(q.ids)}
              className={`mono rounded border px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                sameSelection(q.ids)
                  ? "border-accent/60 bg-accent/15 text-ink"
                  : "border-line text-ink-2 hover:text-ink"
              }`}
            >
              {q.label}
              <span className="ml-1.5 text-ink-3">{q.ids.length}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Company filter">
          {modelCompanies.map((c) => {
            const on = isSelected(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCompany(c.id)}
                aria-pressed={on}
                className={`flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs transition-opacity ${
                  on
                    ? "border-line-strong bg-surface-2 text-ink"
                    : "border-line text-ink-2 opacity-40 hover:opacity-80"
                }`}
              >
                <CompanyLogo companyId={c.id} size={12} />
                {c.name.replace(" DeepMind", "").replace(" AI", "").replace(" (Qwen)", "")}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <section>
          <h3 className={HEADING}>Released within</h3>
          <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label="Release window">
            {WINDOWS.map((w) => (
              <button
                key={w}
                onClick={() => setFilters({ ...filters, window: w })}
                aria-pressed={filters.window === w}
                className={`mono rounded px-2 py-1 text-xs ${
                  filters.window === w
                    ? "bg-accent/20 text-accent"
                    : "border border-line text-ink-2 hover:text-ink"
                }`}
              >
                {WINDOW_LABELS[w]}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className={HEADING}>Weights</h3>
          <div className="flex gap-1" role="group" aria-label="Open or closed weights">
            {WEIGHTS.map(([w, label]) => (
              <button
                key={w}
                onClick={() => setFilters({ ...filters, weights: w })}
                aria-pressed={filters.weights === w}
                className={`mono rounded px-2 py-1 text-xs ${
                  filters.weights === w
                    ? "bg-accent/20 text-accent"
                    : "border border-line text-ink-2 hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="mt-1 flex items-center gap-2 text-sm text-ink-2">
            <input
              type="checkbox"
              checked={filters.frontierOnly}
              onChange={(e) => setFilters({ ...filters, frontierOnly: e.target.checked })}
            />
            Current frontier only
          </label>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className={HEADING}>Benchmark &amp; thresholds</h3>
          <select
            value={filters.benchmark}
            onChange={(e) => setFilters({ ...filters, benchmark: e.target.value as BenchmarkKey })}
            className="w-full rounded border border-line bg-surface px-2 py-1.5 text-sm"
            aria-label="Benchmark for charts"
          >
            {activeBenchmarks.map((b) => (
              <option key={b.key} value={b.key}>
                {b.name}
              </option>
            ))}
          </select>
          <label className="flex items-center justify-between gap-2 text-sm text-ink-2">
            Score ≥
            <input
              type="number"
              value={filters.minScore ?? ""}
              placeholder="any"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minScore: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className="mono w-20 rounded border border-line bg-surface px-2 py-1 text-right text-sm"
            />
          </label>
          <label className="flex items-center justify-between gap-2 text-sm text-ink-2">
            Input $/MTok ≤
            <input
              type="number"
              step="0.1"
              value={filters.maxInputPrice ?? ""}
              placeholder="any"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  maxInputPrice: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className="mono w-20 rounded border border-line bg-surface px-2 py-1 text-right text-sm"
            />
          </label>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className={HEADING}>Highlight</h3>
          <select
            value={highlight.kind === "company" ? `co:${highlight.companyId}` : highlight.kind}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "none") setHighlight({ kind: "none" });
              else if (v === "models")
                setHighlight({ kind: "models", ids: highlight.kind === "models" ? highlight.ids : [] });
              else setHighlight({ kind: "company", companyId: v.slice(3) });
            }}
            className="w-full rounded border border-line bg-surface px-2 py-1.5 text-sm"
            aria-label="Highlight mode"
          >
            <option value="none">No highlight</option>
            <option value="models">Pick specific models…</option>
            {modelCompanies.map((c) => (
              <option key={c.id} value={`co:${c.id}`}>
                All {c.name} models
              </option>
            ))}
          </select>
          {highlight.kind === "models" && (
            <div className="max-h-48 overflow-y-auto rounded border border-line p-2">
              {models.map((m) => (
                <label key={m.id} className="flex items-center gap-2 py-0.5 text-xs text-ink-2">
                  <input
                    type="checkbox"
                    checked={highlight.ids.includes(m.id)}
                    onChange={() => toggleHighlightModel(m.id)}
                  />
                  {m.name}
                </label>
              ))}
            </div>
          )}
          <p className="mono mt-auto text-[11px] text-ink-3">
            {shownCount} model{shownCount === 1 ? "" : "s"} in view
          </p>
        </section>
      </div>
    </aside>
  );
}
