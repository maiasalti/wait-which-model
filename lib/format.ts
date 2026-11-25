/** Pure formatters with no data imports, so they are testable under
 *  `node --test` (which cannot resolve the `@/` path alias). */

import type { Model } from "./types";

/** Display names for `status`. The stored value stays "unknown" (the frontier
 *  status script and the URL filter use it); only the wording shown to readers
 *  changes, because a yellow "UNKNOWN" read as a data error rather than "not
 *  enough published scores to judge yet". */
export const STATUS_LABEL: Record<Model["status"], string> = {
  frontier: "Frontier",
  superseded: "Superseded",
  unknown: "Not yet rated",
  deprecated: "Deprecated",
};

export const STATUS_HINT: Record<Model["status"], string> = {
  frontier: "Near the top of its tier on recent benchmark scores",
  superseded: "No longer near the top of its tier",
  unknown: "Not enough published benchmark scores to judge yet",
  deprecated: "Retired by the lab that made it",
};

/** System One and world models have no generative benchmarks, so a rating can
 *  never arrive; showing "Not yet rated" on them would promise one. */
export function showsStatus(model: Pick<Model, "type">): boolean {
  return model.type === "llm";
}

/** "first answer token", not "first token": for a model with a thinking phase
 *  the measurement starts counting after reasoning completes, so at max effort
 *  it reaches minutes. "202s to first token" would read as broken inference.
 *
 *  Precision scales with magnitude — hundredths below 10s, whole seconds above.
 *  Two decimals on a three-minute measurement is false precision, since
 *  server and network variance at that scale dwarfs a hundredth of a second. */
export function formatSpeed(
  outputTokensPerSec: number | null,
  timeToFirstTokenSec: number | null
): string {
  const parts: string[] = [];
  if (outputTokensPerSec != null) parts.push(`${Math.round(outputTokensPerSec)} tok/s`);
  if (timeToFirstTokenSec != null) {
    const t =
      timeToFirstTokenSec < 10
        ? timeToFirstTokenSec.toFixed(2)
        : String(Math.round(timeToFirstTokenSec));
    parts.push(`${t}s to first answer token`);
  }
  return parts.length ? parts.join(" · ") : "—";
}

/** Only notable companies get a palette slot; everyone else is null in
 *  companies.json and renders in this neutral grey, never as the string
 *  "null" inside a CSS colour. */
export const NEUTRAL_COMPANY_COLOR = "#8A93A6";

export function resolveColor(color: string | null | undefined): string {
  return color ?? NEUTRAL_COMPANY_COLOR;
}
