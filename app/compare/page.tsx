"use client";

import { useMemo, useState } from "react";
import { models } from "@/lib/data";
import { DEFAULT_FILTERS, applyFilters } from "@/lib/filter";
import type { Filters, Highlight } from "@/lib/types";
import { FilterRail } from "@/components/FilterRail";
import { CostPerfScatter, HeadToHead, TimelineScatter } from "@/components/charts";

const MAX_PICKS = 5;

export default function ComparePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [highlight, setHighlight] = useState<Highlight>({ kind: "none" });
  const [picks, setPicks] = useState<string[]>([
    "claude-fable-5",
    "claude-opus-4-8",
    "gpt-5-5",
    "gemini-3-1-pro",
  ]);
  const [now] = useState(() => new Date());

  const shown = useMemo(
    () => applyFilters(models, filters, now),
    [filters, now]
  );
  const picked = useMemo(
    () => models.filter((m) => picks.includes(m.id)),
    [picks]
  );

  const togglePick = (id: string) => {
    setPicks((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : p.length < MAX_PICKS ? [...p, id] : p
    );
  };

  return (
    <div>
      <section className="pt-10 pb-8">
        <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">
          Visual comparison
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
          Model Analytics
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-2">
          Customizable model analytics. Filter by time, company, price and
          score; highlight a model, a group, or a whole lab. Every chart
          reads from the same filter rail.
        </p>
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterRail
          filters={filters}
          setFilters={setFilters}
          highlight={highlight}
          setHighlight={setHighlight}
          shownCount={shown.length}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <TimelineScatter shown={shown} benchmark={filters.benchmark} highlight={highlight} />
          <CostPerfScatter shown={shown} benchmark={filters.benchmark} highlight={highlight} />

          <section>
            <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
              Head-to-head picks ({picked.length}/{MAX_PICKS})
            </h3>
            <div className="mt-2 mb-4 flex flex-wrap gap-1.5">
              {models
                .filter((m) => m.status === "frontier" || picks.includes(m.id))
                .map((m) => (
                  <button
                    key={m.id}
                    onClick={() => togglePick(m.id)}
                    aria-pressed={picks.includes(m.id)}
                    className={`rounded border px-2 py-1 text-xs ${
                      picks.includes(m.id)
                        ? "border-line-strong bg-surface-2 text-ink"
                        : "border-line text-ink-2 hover:text-ink"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
            </div>
            <HeadToHead picked={picked} />
          </section>
        </div>
      </div>
    </div>
  );
}
