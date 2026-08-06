"use client";

import { useState } from "react";
import type { Model } from "@/lib/types";
import { models } from "@/lib/data";
import { comparable, visibleFields, verdict } from "@/lib/spec-diff";
import { renderDiffPng, type DiffPngRow } from "@/lib/diff-png";
import { CompanyLogo } from "./CompanyLogo";

const MAX_OTHERS = 4;

const VERDICT_CLASS: Record<string, string> = {
  better: "text-emerald-400",
  worse: "text-rose-400",
  same: "text-ink-3",
  na: "text-ink-3",
  // Reserved for the baseline when it beats every model it is compared with.
  // Deliberately not green: green answers "how does this compare to the
  // baseline", blue answers "the baseline won".
  best: "text-sky-400",
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
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");

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

  const downloadPng = () => {
    const rows: DiffPngRow[] = fields.map((f) => ({
      label: f.label,
      cells: shown.map((m) => {
        const isBaseline = m.id === baselineId;
        const bv = baseline ? f.value(baseline) : null;
        const mv = f.value(m);
        // Same "baseline beat everything" test the table runs, so the exported
        // image cannot disagree with what the reader saw on screen.
        const baselineBest =
          baseline != null &&
          f.direction !== "neutral" &&
          bv != null &&
          (() => {
            const rivals = others.filter(
              (o) => comparable(f, baseline, o) && f.value(o) != null
            );
            return (
              rivals.length > 0 &&
              rivals.every((o) => verdict(bv, f.value(o), f.direction) === "worse")
            );
          })();
        // Mirror the on-screen suppression exactly: an effort-mismatched pair
        // must not be coloured better/worse in the image either, or the PNG
        // would assert a capability gap the table explicitly declines to show.
        const ok = baseline ? comparable(f, baseline, m) : false;
        const v = baseline && ok ? verdict(bv, mv, f.direction) : "na";
        // The screen shows the effort tag and the not-comparable warning
        // alongside the figure — the PNG is what gets pasted into Slack, so
        // it needs the same caveat baked into the text, not just the colour.
        const effort = f.effortSensitive ? (f.effortOf ?? ((mm) => mm.speed.effort))(m) : null;
        const notComparable = !isBaseline && !ok && f.effortSensitive && bv != null && mv != null;
        let text = f.display(m);
        if (effort) text += ` (${effort})`;
        if (notComparable) text += " — different effort, not comparable";
        return {
          text,
          tone: isBaseline
            ? baselineBest
              ? ("best" as const)
              : ("plain" as const)
            : v === "na" || v === "same"
              ? ("plain" as const)
              : v,
        };
      }),
    }));
    const canvas = renderDiffPng({
      title: baseline ? `Spec comparison — baseline ${baseline.name}` : "Spec comparison",
      headers: shown.map((m) => m.name),
      rows,
    });
    const link = document.createElement("a");
    link.download = "spec-comparison.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  /** `navigator.clipboard` is undefined in non-secure contexts and older
   *  browsers, so an unguarded call throws synchronously; permission denial
   *  rejects. Either way the user needs to be told, rather than clicking a
   *  button that silently does nothing. */
  const copyLink = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(window.location.href);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied("idle"), 2500);
  };

  return (
    <section>
      <h3 className="mono text-xs font-semibold uppercase tracking-widest text-ink">
        Spec comparison
      </h3>
      <p className="mt-1 text-xs text-ink-3">
        Pick a baseline, then the models to measure against it. Each value is
        coloured against the baseline.
      </p>

      <div className="mt-3">
        <p className="mono text-xs font-semibold uppercase tracking-wider text-ink">Baseline</p>
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
        <p className="mono text-xs font-semibold uppercase tracking-wider text-ink">
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
              {fields.map((f) => {
                // Does the baseline win this row outright? Only counts rivals it
                // can validly be compared against, and requires at least one —
                // "best of one" is not a win. Strictly better, so a tie loses.
                const baselineBest =
                  baseline != null &&
                  f.direction !== "neutral" &&
                  f.value(baseline) != null &&
                  (() => {
                    const rivals = others.filter(
                      (o) => comparable(f, baseline, o) && f.value(o) != null
                    );
                    return (
                      rivals.length > 0 &&
                      rivals.every(
                        (o) => verdict(f.value(baseline), f.value(o), f.direction) === "worse"
                      )
                    );
                  })();

                return (
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
                    // setting is not a comparison — colouring it would sell
                    // effort noise as a capability gap.
                    const ok = baseline ? comparable(f, baseline, m) : false;
                    // The VALUE carries the verdict, rather than a delta beside
                    // it: the number people read is the number that is coloured.
                    // Colour follows each field's own direction, so a cheaper or
                    // faster figure is green even though it is the smaller one —
                    // green means better, never merely bigger.
                    const toned =
                      !isBaseline && ok && (v === "better" || v === "worse");
                    // Blue on the baseline is a different claim from green on a
                    // rival — not "better than the baseline" but "the baseline
                    // beat everything here" — so it gets its own hue.
                    const wins = isBaseline && baselineBest;
                    return (
                      <td key={m.id} className="border-b border-line px-2 py-1.5">
                        <span
                          className={
                            wins ? VERDICT_CLASS.best : toned ? VERDICT_CLASS[v] : "text-ink"
                          }
                          title={wins ? "Best of the models being compared" : undefined}
                        >
                          {f.display(m)}
                        </span>
                        {f.effortSensitive &&
                          (f.effortOf ? f.effortOf(m) : m.speed.effort) && (
                            <span className="ml-1.5 text-[10px] text-ink-3">
                              ({f.effortOf ? f.effortOf(m) : m.speed.effort})
                            </span>
                          )}
                        {/* Spelled out, not a ⚠ glyph. These rows stay
                            uncoloured on purpose, and an uncoloured row with a
                            tiny symbol reads as broken rather than as a
                            deliberate refusal to compare. */}
                        {!isBaseline && !ok && f.effortSensitive && bv != null && mv != null && (
                          <span className="mt-0.5 block text-[10px] leading-tight text-amber-400/70">
                            different effort — not comparable
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                );
              })}
            </tbody>
          </table>
          {/* Three colours now carry meaning, and "green = better, not bigger"
              is the non-obvious one — a cheaper model is green on price while
              being the smaller number. Say so rather than making people infer it. */}
          <p className="mono mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-ink-3">
            <span>
              <span className="text-emerald-400">green</span> better than baseline
            </span>
            <span>
              <span className="text-rose-400">red</span> worse
            </span>
            <span>
              <span className="text-sky-400">blue</span> baseline beat them all
            </span>
            <span>better, not bigger — a cheaper or faster figure is green</span>
            <span className="text-amber-400/70">
              uncoloured + noted = measured at different efforts, not comparable
            </span>
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={copyLink}
              aria-live="polite"
              className="mono rounded border border-line px-2.5 py-1.5 text-xs uppercase tracking-wider text-ink-2 hover:text-ink"
            >
              {copied === "ok"
                ? "Link copied"
                : copied === "fail"
                  ? "Copy failed — use the address bar"
                  : "Copy link"}
            </button>
            <button
              onClick={downloadPng}
              className="mono rounded border border-line px-2.5 py-1.5 text-xs uppercase tracking-wider text-ink-2 hover:text-ink"
            >
              Download PNG
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
