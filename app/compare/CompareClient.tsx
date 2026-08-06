"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { models } from "@/lib/data";
import { applyFilters } from "@/lib/filter";
import { DEFAULT_COMPARE_STATE, queryToState, stateToQuery } from "@/lib/compare-url";
import type { Filters, Highlight } from "@/lib/types";
import { FilterRail } from "@/components/FilterRail";
import { CostPerfScatter, HeadToHead, TimelineScatter } from "@/components/charts";
import { SpecDiff } from "@/components/SpecDiff";

const MAX_PICKS = 5;

export default function CompareClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initial = useMemo(
    () => queryToState(new URLSearchParams(searchParams.toString())),
    // Seed once on mount; later updates flow outward to the URL, not back in,
    // so the user's typing is never fought by a re-parse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [filters, setFilters] = useState<Filters>(initial.filters);
  const [highlight, setHighlight] = useState<Highlight>({ kind: "none" });
  // No fallback here — DEFAULT_PICKS in lib/compare-url.ts is the single
  // source of truth, so an untouched page serialises to a bare URL.
  const [picks, setPicks] = useState<string[]>(initial.picks);
  const [showLabels, setShowLabels] = useState(true);
  const [now] = useState(() => new Date());
  const [diffBaseline, setDiffBaseline] = useState<string | null>(initial.diffBaseline);
  const [diffOthers, setDiffOthers] = useState<string[]>(initial.diffOthers);

  const shown = useMemo(
    () => applyFilters(models, filters, now),
    [filters, now]
  );
  const picked = useMemo(
    () => models.filter((m) => picks.includes(m.id)),
    [picks]
  );

  // `replace`, not `push`: filtering is not navigation, and every keystroke in
  // the search box would otherwise become a back-button entry.
  useEffect(() => {
    const q = stateToQuery({ ...DEFAULT_COMPARE_STATE, filters, picks, diffBaseline, diffOthers });
    router.replace(q ? `?${q}` : "/compare", { scroll: false });
  }, [filters, picks, diffBaseline, diffOthers, router]);

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

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pb-4">
          <FilterRail
            filters={filters}
            setFilters={setFilters}
            highlight={highlight}
            setHighlight={setHighlight}
            shownCount={shown.length}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <button
            onClick={() => setShowLabels((v) => !v)}
            aria-pressed={showLabels}
            className={`mono self-start rounded border px-2.5 py-1.5 text-xs uppercase tracking-wider transition-colors ${
              showLabels
                ? "border-accent/60 bg-accent/15 text-ink"
                : "border-line text-ink-2 hover:text-ink"
            }`}
          >
            {showLabels ? "Turn off labels" : "Turn on labels"}
          </button>
          <TimelineScatter
            shown={shown}
            benchmark={filters.benchmark}
            highlight={highlight}
            showLabels={showLabels}
          />
          <CostPerfScatter
            shown={shown}
            benchmark={filters.benchmark}
            highlight={highlight}
            showLabels={showLabels}
          />

          <section>
            <h3 className="mono text-xs font-semibold uppercase tracking-widest text-ink">
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

          <hr className="border-line-strong" />

          <SpecDiff
            baselineId={diffBaseline}
            otherIds={diffOthers}
            setBaselineId={setDiffBaseline}
            setOtherIds={setDiffOthers}
          />
        </div>
      </div>
    </div>
  );
}
