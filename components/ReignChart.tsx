"use client";

import { useMemo } from "react";
import { companyColor, modelById, reigns } from "@/lib/data";
import { reignDays } from "@/lib/reigns";

const TIER_LABEL: Record<string, string> = {
  flagship: "Flagship",
  balanced: "Balanced",
  fast: "Fast",
};

export function ReignChart() {
  const now = useMemo(() => new Date(), []);
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
