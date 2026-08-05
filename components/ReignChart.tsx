"use client";

import { useEffect, useMemo, useState } from "react";
import { companyColor, modelById, reigns } from "@/lib/data";
import { reignDays } from "@/lib/reigns";

const TIER_LABEL: Record<string, string> = {
  flagship: "Flagship",
  balanced: "Balanced",
  fast: "Fast",
};

export function ReignChart() {
  // /info is statically prerendered, so a `new Date()` computed during render
  // bakes in the build day's date forever — from the next calendar day on,
  // every open reign's day count would disagree between the prerendered HTML
  // and the hydrating client, a text-content mismatch on every visit.
  //
  // The initial state below still reads `new Date()` at module-eval time (the
  // same instant the server would compute it during prerendering), so the
  // FIRST client render matches the prerendered HTML exactly — hydration
  // succeeds. The effect then re-derives "now" a tick after mount, so a
  // visitor loading the page on any day after the build sees correct counts
  // rather than a frozen build-day snapshot. `suppressHydrationWarning` was
  // the other option and would have been simpler, but it only silences the
  // console error — the visitor would still see a wrong, stale day count
  // (and briefly a flicker to the right one only on the days it happens to
  // already match). Correct-after-a-tick beats silently wrong.
  const [now, setNow] = useState(() => new Date());
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

  const longest = useMemo(
    () => Math.max(1, ...reigns.map((r) => reignDays(r, now))),
    [now]
  );

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
              const days = reignDays(r, now);
              return (
                <li key={`${r.tier}-${r.modelId}`} className="flex items-center gap-3">
                  <span className="mono w-40 shrink-0 truncate text-xs text-ink-2">
                    {model?.name ?? r.modelId}
                  </span>
                  <span className="h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${Math.max(1.5, (days / longest) * 100)}%`,
                        background: model ? companyColor(model.company) : "#8A93A6",
                        opacity: r.end === null ? 1 : 0.75,
                      }}
                    />
                  </span>
                  <span className="mono w-24 shrink-0 text-right text-[10px] text-ink-3">
                    {days} days{r.end === null ? " · current" : ""}
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
