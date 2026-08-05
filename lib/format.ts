/** Pure formatters with no data imports, so they are testable under
 *  `node --test` (which cannot resolve the `@/` path alias). */

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
