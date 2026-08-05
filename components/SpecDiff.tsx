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

  // Sanitise the URL-seeded selection. Two things a hand-edited query can do:
  // name ids that match no model, and name the baseline again under `vs`.
  // The second is the nastier one — `?base=X&vs=X,Y` would put X into `shown`
  // twice, giving duplicate React keys, and the user could not clear it
  // because X's compare button is hidden while X is the baseline.
  const others = otherIds
    .filter((id) => id !== baselineId)
    .map((id) => models.find((m) => m.id === id))
    .filter((m): m is Model => m != null);

  // Cap on RESOLVED models, never on the raw id list: unresolvable ids would
  // otherwise fill the cap invisibly and make real selections silently no-op.
  const atCap = others.length >= MAX_OTHERS;

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
    if (otherIds.includes(id)) {
      setOtherIds(otherIds.filter((x) => x !== id));
      return;
    }
    if (atCap) return;
    // Write back the sanitised list, so any junk ids from a hand-edited URL
    // are flushed out of state (and therefore the URL) on first interaction.
    setOtherIds([...others.map((m) => m.id), id]);
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
            .map((m) => {
              const selected = otherIds.includes(m.id);
              // At the cap, unselected buttons must LOOK unavailable. Leaving
              // them interactive means a fifth click silently does nothing.
              const disabled = !selected && atCap;
              return (
                <button
                  key={m.id}
                  onClick={() => toggleOther(m.id)}
                  aria-pressed={selected}
                  disabled={disabled}
                  className={`rounded border px-2 py-1 text-xs ${
                    selected
                      ? "border-line-strong bg-surface-2 text-ink"
                      : disabled
                        ? "cursor-not-allowed border-line text-ink-3 opacity-40"
                        : "border-line text-ink-2 hover:text-ink"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-6 text-sm text-ink-3">Pick at least one model to compare.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="mono w-full min-w-[36rem] border-collapse text-xs">
            <thead>
              <tr>
                <th scope="col" className="border-b border-line py-2 text-left font-normal text-ink-3">
                  Field
                </th>
                {shown.map((m) => (
                  <th
                    key={m.id}
                    scope="col"
                    className="border-b border-line px-2 py-2 text-left font-normal"
                  >
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
                  <th scope="row" className="border-b border-line py-1.5 text-left font-normal text-ink-3">
                    {f.label}
                  </th>
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
                            role="img"
                            aria-label="Measured at a different reasoning effort — not comparable"
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
