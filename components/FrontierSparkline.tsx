import { companyColor, models } from "@/lib/data";

/**
 * The signature strip: every model release as a dot on a shared time axis,
 * y = running count of releases so far, colored by company.
 * A quiet, always-visible record of how fast models are shipping.
 */
export function FrontierSparkline() {
  const releases = models
    .map((m) => ({
      t: new Date(m.releaseDate).getTime(),
      color: companyColor(m.company),
      id: m.id,
    }))
    .sort((a, b) => a.t - b.t);

  if (releases.length < 2) return null;

  const t0 = releases[0].t;
  const t1 = releases[releases.length - 1].t;
  const n = releases.length;
  const W = 220;
  const H = 36;
  const PAD = 3;
  const x = (t: number) => PAD + ((t - t0) / (t1 - t0 || 1)) * (W - PAD * 2);
  const y = (count: number) => H - PAD - ((count - 1) / (n - 1)) * (H - PAD * 2);

  const points = releases.map((r, i) => ({ ...r, cx: x(r.t), cy: y(i + 1) }));
  const line = points.map((p) => `${p.cx.toFixed(1)},${p.cy.toFixed(1)}`).join(" ");

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Model releases over time: ${n} models tracked`}
      className="hidden md:block"
    >
      <polyline points={line} fill="none" stroke="var(--line-strong)" strokeWidth="1" />
      {points.map((p) => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r="1.8" fill={p.color} opacity="0.9" />
      ))}
    </svg>
  );
}
