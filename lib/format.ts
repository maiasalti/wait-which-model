/** Pure formatters with no data imports, so they are testable under
 *  `node --test` (which cannot resolve the `@/` path alias). */

export function formatSpeed(
  outputTokensPerSec: number | null,
  timeToFirstTokenSec: number | null
): string {
  const parts: string[] = [];
  if (outputTokensPerSec != null) parts.push(`${Math.round(outputTokensPerSec)} tok/s`);
  if (timeToFirstTokenSec != null) parts.push(`${timeToFirstTokenSec.toFixed(2)}s to first token`);
  return parts.length ? parts.join(" · ") : "—";
}
