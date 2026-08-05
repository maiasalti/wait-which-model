"use client";

import type { Model } from "@/lib/types";
import { models } from "@/lib/data";
import { comparable, visibleFields, verdict } from "@/lib/spec-diff";
import { CompanyLogo } from "./CompanyLogo";

const MAX_OTHERS = 4;

const VERDICT_CLASS: Record<string, string> = {
  better: "text-emerald-400",
  worse: "text-rose-400",
  same: "text-ink-3",
  na: "text-ink-3",
};

export function SpecDiff({
  baselineId,
  otherIds,
  setBaselineId,
  setOtherIds,
}: {
  baselineId: string | null;
  otherIds: string[];
  setBaselineId: (id: string | null) => void;
  setOtherIds: (ids: string[]) => void;
}) {
  const baseline = models.find((m) => m.id === baselineId) ?? null;
  const others = otherIds
    .map((id) => models.find((m) => m.id === id))
    .filter((m): m is Model => m != null);

  // No useMemo here: `shown` and `otherIds` are rebuilt every render, so a memo
  // keyed on them would never hit while still costing a dependency comparison.
  // Both computations are trivial — 18 fields across at most 5 models.
  const selectable = models.filter(
    (m) => m.status === "frontier" || m.id === baselineId || otherIds.includes(m.id)
  );

  const shown = baseline ? [baseline, ...others] : others;
  const fields = visibleFields(shown);

  const toggleOther = (id: string) => {
    if (id === baselineId) return;
    setOtherIds(
      otherIds.includes(id)
        ? otherIds.filter((x) => x !== id)
        : otherIds.length < MAX_OTHERS
          ? [...otherIds, id]
          : otherIds
    );
  };

  return (
    <section>
      <h3 className="mono text-[10px] uppercase tracking-widest text-ink-3">
        Spec comparison
      </h3>
      <p className="mt-1 text-xs text-ink-3">
        Pick a baseline, then the models to measure against it. Every other column
        shows the difference from the baseline.
      </p>

      <div className="mt-3">
        <p className="mono text-[10px] uppercase tracking-wider text-ink-3">Baseline</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {selectable.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setBaselineId(m.id === baselineId ? null : m.id);
                setOtherIds(otherIds.filter((x) => x !== m.id));
              }}
              aria-pressed={m.id === baselineId}
              className={`flex items-center gap-1.5 rounded border px-2 py-1 text-xs ${
                m.id === baselineId
                  ? "border-accent/60 bg-accent/15 text-ink"
                  : "border-line text-ink-2 hover:text-ink"
              }`}
            >
              <CompanyLogo companyId={m.company} size={12} />
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <p className="mono text-[10px] uppercase tracking-wider text-ink-3">
          Compare against ({others.length}/{MAX_OTHERS})
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {selectable
            .filter((m) => m.id !== baselineId)
            .map((m) => (
              <button
                key={m.id}
                onClick={() => toggleOther(m.id)}
                aria-pressed={otherIds.includes(m.id)}
                className={`rounded border px-2 py-1 text-xs ${
                  otherIds.includes(m.id)
                    ? "border-line-strong bg-surface-2 text-ink"
                    : "border-line text-ink-2 hover:text-ink"
                }`}
              >
                {m.name}
              </button>
            ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 text-sm text-ink-3">Pick at least one model to compare.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="mono w-full min-w-[36rem] border-collapse text-xs">
            <thead>
              <tr>
                <th className="border-b border-line py-2 text-left font-normal text-ink-3">Field</th>
                {shown.map((m) => (
                  <th key={m.id} className="border-b border-line px-2 py-2 text-left font-normal">
                    <span className="text-ink">{m.name}</span>
                    {m.id === baselineId && (
                      <span className="ml-1 text-[10px] uppercase text-accent">baseline</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.key}>
                  <td className="border-b border-line py-1.5 text-ink-3">{f.label}</td>
                  {shown.map((m) => {
                    const isBaseline = m.id === baselineId;
                    const v = baseline ? verdict(f.value(baseline), f.value(m), f.direction) : "na";
                    const bv = baseline ? f.value(baseline) : null;
                    const mv = f.value(m);
                    // An effort-sensitive figure measured at a different
                    // setting is not a comparison — showing a delta would sell
                    // effort noise as a capability gap.
                    const ok = baseline ? comparable(f, baseline, m) : false;
                    const delta =
                      isBaseline || !ok || bv == null || mv == null || f.direction === "neutral"
                        ? null
                        : Math.round((mv - bv) * 100) / 100;
                    return (
                      <td key={m.id} className="border-b border-line px-2 py-1.5">
                        <span className="text-ink">{f.display(m)}</span>
                        {delta != null && delta !== 0 && (
                          <span className={`ml-1.5 ${VERDICT_CLASS[v]}`}>
                            {delta > 0 ? "+" : ""}
                            {delta}
                          </span>
                        )}
                        {f.effortSensitive && m.speed.effort && (
                          <span className="ml-1.5 text-[10px] text-ink-3">
                            ({m.speed.effort})
                          </span>
                        )}
                        {!isBaseline && !ok && f.effortSensitive && bv != null && mv != null && (
                          <span
                            className="ml-1 text-[10px] text-ink-3"
                            title="Measured at a different reasoning effort — not comparable"
                          >
                            ⚠
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
