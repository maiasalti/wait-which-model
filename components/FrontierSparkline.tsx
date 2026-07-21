import { companyColor, models } from "@/lib/data";

/**
 * The signature strip: every model release as a tick on a shared time axis,
 * y = SWE-bench Verified (the era's defining benchmark), colored by company.
 * A quiet, always-visible record of the frontier advancing.
 */
export function FrontierSparkline() {
  const points = models
    .filter((m) => m.benchmarks.sweBench != null)
    .map((m) => ({
      t: new Date(m.releaseDate).getTime(),
      v: m.benchmarks.sweBench as number,
      color: companyColor(m.company),
      id: m.id,
    }))
    .sort((a, b) => a.t - b.t);

  if (points.length < 2) return null;

  const t0 = points[0].t;
  const t1 = points[points.length - 1].t;
  const W = 220;
  const H = 36;
  const PAD = 3;
  const x = (t: number) => PAD + ((t - t0) / (t1 - t0)) * (W - PAD * 2);
  const y = (v: number) => H - PAD - (v / 100) * (H - PAD * 2);

  // running best — the frontier line itself
  let best = 0;
  const frontier: string[] = [];
  for (const p of points) {
    if (p.v > best) best = p.v;
    frontier.push(`${x(p.t).toFixed(1)},${y(best).toFixed(1)}`);
  }

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Best SWE-bench Verified score over time, by release"
      className="hidden md:block"
    >
      <polyline
        points={frontier.join(" ")}
        fill="none"
        stroke="var(--line-strong)"
        strokeWidth="1"
      />
      {points.map((p) => (
        <circle
          key={p.id}
          cx={x(p.t)}
          cy={y(p.v)}
          r="1.8"
          fill={p.color}
          opacity="0.9"
        />
      ))}
    </svg>
  );
}
