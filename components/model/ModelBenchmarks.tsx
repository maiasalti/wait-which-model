"use client";

import { useEffect, useMemo, useState } from "react";
import type { Model } from "@/lib/types";
import { CompanyLogo } from "../CompanyLogo";
import { benchmarks, companyColor, models } from "@/lib/data";

// Re-exported for existing client-side importers (e.g. the drawer). Server
// Components must import benchmarkCoverage from "./benchmarkCoverage"
// directly — see that file's comment for why.
export { benchmarkCoverage } from "./benchmarkCoverage";

const ELO_VALUES = models
  .map((m) => m.benchmarks.lmarenaElo)
  .filter((v): v is number => v != null);
const ELO_MIN = Math.floor(Math.min(...ELO_VALUES) / 50) * 50;
const ELO_MAX = Math.ceil(Math.max(...ELO_VALUES) / 50) * 50;

function barPct(value: number | null | undefined, domainMin: number, domainMax: number): number {
  if (value == null) return 0;
  const pct = ((value - domainMin) / (domainMax - domainMin)) * 100;
  return Math.max(2, Math.min(100, pct));
}

/** Darkens a hex color so a same-company compare bar stays visually distinct
 * from the primary model's bar instead of rendering as an identical color. */
function darken(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Benchmark bars plus the quick-compare picker. Compare state lives here rather
 *  than in the drawer so the drawer and the standalone page both get the feature
 *  without either having to own or thread it. */
export function ModelBenchmarks({ model }: { model: Model }) {
  const [compareQuery, setCompareQuery] = useState("");
  const [compareId, setCompareId] = useState<string | null>(null);

  useEffect(() => {
    setCompareQuery("");
    setCompareId(null);
  }, [model.id]);

  const compareModel = useMemo(
    () => models.find((m) => m.id === compareId) ?? null,
    [compareId]
  );

  const suggestions = useMemo(() => {
    if (!compareQuery.trim() || compareModel) return [];
    const q = compareQuery.trim().toLowerCase();
    return models.filter((m) => m.id !== model.id && m.name.toLowerCase().includes(q)).slice(0, 6);
  }, [model.id, compareQuery, compareModel]);

  const compareColor = compareModel
    ? compareModel.company === model.company
      ? darken(companyColor(compareModel.company), 0.4)
      : companyColor(compareModel.company)
    : undefined;

  // Benchmarks the model actually has float to the top, so a sparse model isn't
  // a wall of dashes before its one real score.
  const sortedBenchmarks = benchmarks
    .map((b, i) => ({ b, i }))
    .sort((a, z) => {
      const aHas = model.benchmarks[a.b.key] != null;
      const zHas = model.benchmarks[z.b.key] != null;
      if (aHas === zHas) return a.i - z.i;
      return aHas ? -1 : 1;
    })
    .map(({ b }) => b);

  return (
    <div>
      <div className="mt-2">
        {compareModel ? (
          <div className="flex items-center justify-between gap-2 rounded border border-line bg-surface-2 px-2 py-1.5 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: companyColor(model.company) }}
                />
                <span className="text-ink">{model.name}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: compareColor }}
                />
                <span className="text-ink-2">{compareModel.name}</span>
              </span>
            </div>
            <button
              onClick={() => setCompareId(null)}
              aria-label="Clear comparison"
              className="shrink-0 text-ink-3 hover:text-ink"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="search"
              value={compareQuery}
              onChange={(e) => setCompareQuery(e.target.value)}
              placeholder="Quick compare — search a model…"
              className="w-full rounded border border-line bg-surface px-2 py-1.5 text-xs placeholder:text-ink-3"
              aria-label="Quick compare with another model"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded border border-line-strong bg-surface-2 shadow-xl">
                {suggestions.map((m) => (
                  <li key={m.id}>
                    <button
                      onClick={() => {
                        setCompareId(m.id);
                        setCompareQuery("");
                      }}
                      className="flex w-full items-center gap-1.5 px-2 py-1.5 text-left text-xs text-ink-2 hover:bg-white/5 hover:text-ink"
                    >
                      <CompanyLogo companyId={m.company} size={12} />
                      {m.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="mono mt-3">
        {sortedBenchmarks.map((b) => {
          const v1 = model.benchmarks[b.key];
          const v2 = compareModel?.benchmarks[b.key];
          const isElo = b.key === "lmarenaElo";
          const domainMin = isElo ? ELO_MIN : 0;
          const domainMax = isElo ? ELO_MAX : b.max ?? 100;
          const unit = b.unit === "%" ? "%" : "";
          const entries = compareModel
            ? [
                { v: v1, color: companyColor(model.company) },
                { v: v2, color: compareColor! },
              ]
            : [{ v: v1, color: companyColor(model.company) }];
          return (
            <div key={b.key} className="border-b border-line py-2 last:border-0">
              <p className="text-xs text-ink-2" title={b.description}>
                {b.name}
              </p>
              <div className="mt-1 space-y-1">
                {entries.map((e, i) => (
                  <div key={i}>
                    <div className="text-right text-[10px] text-ink">
                      {e.v != null ? `${e.v}${unit}` : "—"}
                    </div>
                    <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-[width]"
                        style={{ width: `${barPct(e.v, domainMin, domainMax)}%`, background: e.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
