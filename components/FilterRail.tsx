"use client";

import { benchmarks, companies, models } from "@/lib/data";
import { CompanyLogo } from "./CompanyLogo";
import { WINDOW_LABELS } from "@/lib/filter";
import type { BenchmarkKey, Filters, Highlight, TimeWindow } from "@/lib/types";

const WINDOWS: TimeWindow[] = ["3m", "6m", "1y", "2y", "3y", "all"];

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
  const toggleCompany = (id: string) => {
    const has = filters.companies.includes(id);
    setFilters({
      ...filters,
      companies: has
        ? filters.companies.filter((c) => c !== id)
        : [...filters.companies, id],
    });
  };

  const toggleHighlightModel = (id: string) => {
    const ids = highlight.kind === "models" ? highlight.ids : [];
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    setHighlight(next.length ? { kind: "models", ids: next } : { kind: "none" });
  };

  return (
    <aside className="flex flex-col gap-5 lg:w-64 lg:shrink-0">
      <section>
        <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
          Released within
        </h3>
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

      <section>
        <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
          Companies
        </h3>
        <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label="Company filter">
          {companies.map((c) => {
            const active =
              filters.companies.length === 0 || filters.companies.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCompany(c.id)}
                aria-pressed={filters.companies.includes(c.id)}
                className={`flex items-center gap-1.5 rounded border px-2 py-1 text-xs ${
                  filters.companies.includes(c.id)
                    ? "border-line-strong bg-surface-2 text-ink"
                    : "border-line text-ink-2 hover:text-ink"
                } ${active ? "" : "opacity-40"}`}
              >
                <CompanyLogo companyId={c.id} size={12} />
                {c.name.replace(" DeepMind", "").replace(" AI", "").replace(" (Qwen)", "")}
              </button>
            );
          })}
          {filters.companies.length > 0 && (
            <button
              onClick={() => setFilters({ ...filters, companies: [] })}
              className="mono px-2 py-1 text-[11px] text-ink-3 underline hover:text-ink"
            >
              clear
            </button>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
          Scope
        </h3>
        <label className="flex items-center gap-2 text-sm text-ink-2">
          <input
            type="checkbox"
            checked={filters.openWeightsOnly}
            onChange={(e) =>
              setFilters({ ...filters, openWeightsOnly: e.target.checked })
            }
          />
          Open weights only
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-2">
          <input
            type="checkbox"
            checked={filters.frontierOnly}
            onChange={(e) =>
              setFilters({ ...filters, frontierOnly: e.target.checked })
            }
          />
          Current frontier only
        </label>
      </section>

      <section>
        <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
          Benchmark
        </h3>
        <select
          value={filters.benchmark}
          onChange={(e) =>
            setFilters({ ...filters, benchmark: e.target.value as BenchmarkKey })
          }
          className="mt-2 w-full rounded border border-line bg-surface px-2 py-1.5 text-sm"
          aria-label="Benchmark for charts"
        >
          {benchmarks.map((b) => (
            <option key={b.key} value={b.key}>
              {b.name}
            </option>
          ))}
        </select>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
          Thresholds
        </h3>
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

      <section>
        <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
          Highlight
        </h3>
        <select
          value={highlight.kind === "company" ? `co:${highlight.companyId}` : highlight.kind}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "none") setHighlight({ kind: "none" });
            else if (v === "models")
              setHighlight({ kind: "models", ids: highlight.kind === "models" ? highlight.ids : [] });
            else setHighlight({ kind: "company", companyId: v.slice(3) });
          }}
          className="mt-2 w-full rounded border border-line bg-surface px-2 py-1.5 text-sm"
          aria-label="Highlight mode"
        >
          <option value="none">No highlight</option>
          <option value="models">Pick specific models…</option>
          {companies.map((c) => (
            <option key={c.id} value={`co:${c.id}`}>
              All {c.name} models
            </option>
          ))}
        </select>
        {highlight.kind === "models" && (
          <div className="mt-2 max-h-48 overflow-y-auto rounded border border-line p-2">
            {models.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-2 py-0.5 text-xs text-ink-2"
              >
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
      </section>

      <p className="mono text-[11px] text-ink-3">
        {shownCount} model{shownCount === 1 ? "" : "s"} in view
      </p>
    </aside>
  );
}
