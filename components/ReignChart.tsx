"use client";

import { useEffect, useMemo, useState } from "react";
import { companyColor, modelById, reigns } from "@/lib/data";
import { reignDays, type Reign } from "@/lib/reigns";

const TIER_LABEL: Record<string, string> = {
  flagship: "Flagship",
  balanced: "Balanced",
  fast: "Fast",
};

// A fixed, arbitrary date, never the live clock. `reignDays` only reads its
// `now` argument for OPEN reigns (`end === null`) — for a closed reign the
// argument is unused, so any constant Date is a safe stand-in. Using a
// hardcoded constant here (instead of `new Date()`) is what keeps this
// module free of any current-time read outside the mount effect below.
const UNUSED_NOW = new Date(0);

/** Day count for one reign, or `null` when it isn't knowable yet (an open
 *  reign before the client clock has been read). Closed reigns never return
 *  null — their day count is fixed history, independent of `now`. Defined at
 *  module scope, not inside the component, so it's stable across renders and
 *  doesn't need to appear in any hook's dependency array. */
function daysFor(r: Reign, now: Date | null): number | null {
  if (r.end !== null) return reignDays(r, UNUSED_NOW);
  return now ? reignDays(r, now) : null;
}

export function ReignChart() {
  // /info is statically prerendered: this component's first render runs once
  // on the server at build time, and that output is baked verbatim into the
  // HTML served to every visitor thereafter. If the first render depended on
  // the current date, the server's build-day answer would permanently
  // disagree with whatever the visitor's browser computes on ITS first
  // (hydrating) render — a React text-content mismatch, on every visit,
  // until the next deploy resets the build day.
  //
  // A lazy `useState(() => new Date())` initializer does NOT avoid this. The
  // initializer function runs during the component's first render, not at
  // module-eval or build time — so on the server it still runs at build time
  // and bakes in the build day, exactly like a bare `new Date()` in the
  // render body would. A previous version of this file used that pattern
  // believing it ran at build time; it didn't, and the bug remained. Do not
  // reintroduce it.
  //
  // The only real fix: make the first render not depend on the date at all.
  // `now` starts `null` — a fixed, date-independent value — and the mount
  // effect below supplies the real clock a tick after hydration, at which
  // point the component re-renders with live values. Closed reigns are
  // unaffected by any of this: their day counts are fixed history, not
  // derived from `now` (see `daysFor`), so they render their real counts on
  // the very first pass. Open reigns (`end === null`) are the only
  // date-dependent ones — until `now` arrives they render with no day count
  // and their bar pinned to the chart's minimum width, then fill in once the
  // client clock is available.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);
  const byTier = useMemo(() => {
    const groups = new Map<string, typeof reigns>();
    for (const r of reigns) {
      if (!groups.has(r.tier)) groups.set(r.tier, []);
      groups.get(r.tier)!.push(r);
    }
    for (const list of groups.values()) list.sort((a, b) => a.start.localeCompare(b.start));
    return groups;
  }, []);

  // Scale factor for bar widths. Only knowable day counts feed into it, so
  // before `now` arrives this reflects closed reigns alone; open reigns are
  // excluded rather than guessed, and render at the minimum width until
  // `daysFor` can resolve them for real.
  const longest = useMemo(() => {
    const known = reigns.map((r) => daysFor(r, now)).filter((d): d is number => d !== null);
    return Math.max(1, ...known);
  }, [now]);

  return (
    <div className="space-y-8">
      {[...byTier.entries()].map(([tier, list]) => (
        <section key={tier}>
          <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
            {TIER_LABEL[tier] ?? tier}
          </h3>
          <ul className="mt-3 space-y-2">
            {list.map((r) => {
              const model = modelById.get(r.modelId);
              const days = daysFor(r, now);
              return (
                <li key={`${r.tier}-${r.modelId}`} className="flex items-center gap-3">
                  <span className="mono w-40 shrink-0 truncate text-xs text-ink-2">
                    {model?.name ?? r.modelId}
                  </span>
                  <span className="h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${days === null ? 1.5 : Math.max(1.5, (days / longest) * 100)}%`,
                        background: model ? companyColor(model.company) : "#8A93A6",
                        opacity: r.end === null ? 1 : 0.75,
                      }}
                    />
                  </span>
                  <span className="mono w-24 shrink-0 text-right text-[10px] text-ink-3">
                    {days === null ? "— · current" : `${days} days${r.end === null ? " · current" : ""}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
