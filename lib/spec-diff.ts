import type { Model } from "./types";
import { formatSpeed } from "./format.ts";

export type DiffDirection = "higher-better" | "lower-better" | "neutral";

export interface DiffField {
  key: string;
  label: string;
  direction: DiffDirection;
  /** Numeric value used for the delta, or null when not comparable. */
  value: (m: Model) => number | null;
  /** Human-readable cell text. */
  display: (m: Model) => string;
  /** True for figures Artificial Analysis measures at a reasoning-effort
   *  setting. Two models measured at different efforts are not comparable —
   *  the setting dominates the number — so the diff must suppress the delta
   *  and say why rather than presenting effort noise as a capability gap. */
  effortSensitive?: boolean;
}

/** Whether a delta between these two models is meaningful for this field.
 *  Effort-sensitive fields require both models measured at the same setting. */
export function comparable(field: DiffField, a: Model, b: Model): boolean {
  if (!field.effortSensitive) return true;
  return a.speed.effort != null && a.speed.effort === b.speed.effort;
}

/** "Better" follows each field's own direction — lower is better for price and
 *  latency, higher for benchmarks. Fields with no meaningful ordering are
 *  `neutral` and never render a verdict colour. */
export function verdict(
  baseline: number | null,
  other: number | null,
  direction: DiffDirection
): "better" | "worse" | "same" | "na" {
  if (direction === "neutral") return "na";
  if (baseline == null || other == null) return "na";
  if (baseline === other) return "same";
  const higher = other > baseline;
  return (direction === "higher-better") === higher ? "better" : "worse";
}

const dash = (v: number | null, suffix = "") => (v == null ? "—" : `${v}${suffix}`);

export const DIFF_FIELDS: DiffField[] = [
  {
    key: "contextWindow",
    label: "Context window",
    direction: "higher-better",
    value: (m) => m.contextWindow,
    display: (m) =>
      m.contextWindow == null
        ? "—"
        : m.contextWindow >= 1_000_000
          ? `${Math.round((m.contextWindow / 1_000_000) * 10) / 10}M`
          : `${Math.round(m.contextWindow / 1000)}K`,
  },
  {
    key: "maxOutput",
    label: "Max output",
    direction: "higher-better",
    value: (m) => m.maxOutput,
    display: (m) => (m.maxOutput == null ? "—" : `${Math.round(m.maxOutput / 1000)}K`),
  },
  {
    key: "inputPrice",
    label: "Input $/MTok",
    direction: "lower-better",
    value: (m) => m.pricing.inputPerMTok,
    display: (m) => dash(m.pricing.inputPerMTok, ""),
  },
  {
    key: "outputPrice",
    label: "Output $/MTok",
    direction: "lower-better",
    value: (m) => m.pricing.outputPerMTok,
    display: (m) => dash(m.pricing.outputPerMTok, ""),
  },
  {
    key: "costPerTask",
    label: "Cost per task",
    direction: "lower-better",
    value: (m) => m.costPerTask.usd,
    display: (m) => (m.costPerTask.usd == null ? "—" : `$${m.costPerTask.usd}`),
  },
  {
    key: "outputSpeed",
    label: "Output speed",
    direction: "higher-better",
    effortSensitive: true,
    value: (m) => m.speed.outputTokensPerSec,
    display: (m) => formatSpeed(m.speed.outputTokensPerSec, null),
  },
  {
    key: "ttft",
    label: "Time to first answer token",
    direction: "lower-better",
    effortSensitive: true,
    value: (m) => m.speed.timeToFirstTokenSec,
    display: (m) => formatSpeed(null, m.speed.timeToFirstTokenSec),
  },
  {
    key: "mmluPro", label: "MMLU-Pro", direction: "higher-better",
    value: (m) => m.benchmarks.mmluPro ?? null, display: (m) => dash(m.benchmarks.mmluPro ?? null, "%"),
  },
  {
    key: "gpqaDiamond", label: "GPQA Diamond", direction: "higher-better",
    value: (m) => m.benchmarks.gpqaDiamond ?? null, display: (m) => dash(m.benchmarks.gpqaDiamond ?? null, "%"),
  },
  {
    key: "sweBench", label: "SWE-bench Verified", direction: "higher-better",
    value: (m) => m.benchmarks.sweBench ?? null, display: (m) => dash(m.benchmarks.sweBench ?? null, "%"),
  },
  {
    key: "terminalBench", label: "Terminal-Bench 2.1", direction: "higher-better",
    value: (m) => m.benchmarks.terminalBench ?? null, display: (m) => dash(m.benchmarks.terminalBench ?? null, "%"),
  },
  {
    key: "aime", label: "AIME", direction: "higher-better",
    value: (m) => m.benchmarks.aime ?? null, display: (m) => dash(m.benchmarks.aime ?? null, "%"),
  },
  {
    key: "hle", label: "Humanity's Last Exam", direction: "higher-better",
    value: (m) => m.benchmarks.hle ?? null, display: (m) => dash(m.benchmarks.hle ?? null, "%"),
  },
  {
    key: "lmarenaElo", label: "LMArena Elo", direction: "higher-better",
    value: (m) => m.benchmarks.lmarenaElo ?? null, display: (m) => dash(m.benchmarks.lmarenaElo ?? null),
  },
  {
    key: "arcAgi2", label: "ARC-AGI-2", direction: "higher-better",
    value: (m) => m.benchmarks.arcAgi2 ?? null, display: (m) => dash(m.benchmarks.arcAgi2 ?? null, "%"),
  },
  {
    key: "openWeights", label: "Open weights", direction: "neutral",
    value: () => null, display: (m) => (m.openWeights ? "Yes" : "No"),
  },
  {
    key: "license", label: "Licence", direction: "neutral",
    value: () => null, display: (m) => m.license?.name ?? (m.openWeights ? "—" : "Proprietary"),
  },
  {
    key: "knowledgeCutoff", label: "Knowledge cutoff", direction: "neutral",
    value: () => null, display: (m) => m.knowledgeCutoff ?? "—",
  },
];

/** Rows where every selected model is blank add nothing but height. */
export function visibleFields(models: Model[]): DiffField[] {
  return DIFF_FIELDS.filter((f) => models.some((m) => f.display(m) !== "—"));
}
