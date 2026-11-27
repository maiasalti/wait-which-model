/** Exponential fit y = k·e^(a·x) for monthly release counts, used by Compare's
 *  "Show projection" toggle. Pure, so it is unit-tested under node --test. */

export interface ExpFit {
  k: number;
  /** growth rate per month */
  a: number;
}

/** Fits y = k·e^(a·x) by Poisson maximum likelihood (Newton–Raphson on log k and a).
 *  Unlike a straight line through log(y), this copes with months that had zero
 *  releases, which are common early on and carry real information. Returns null
 *  when there is too little to fit: fewer than 3 months or fewer than 2 releases. */
export function fitExponential(points: { x: number; y: number }[]): ExpFit | null {
  const total = points.reduce((s, p) => s + p.y, 0);
  if (points.length < 3 || total < 2) return null;

  let b0 = Math.log(total / points.length); // log k
  let b1 = 0; // a
  for (let iter = 0; iter < 100; iter++) {
    let g0 = 0, g1 = 0, h00 = 0, h01 = 0, h11 = 0;
    for (const { x, y } of points) {
      const mu = Math.exp(b0 + b1 * x);
      g0 += y - mu;
      g1 += (y - mu) * x;
      h00 += mu;
      h01 += mu * x;
      h11 += mu * x * x;
    }
    const det = h00 * h11 - h01 * h01;
    if (!(det > 0)) return null;
    const d0 = (h11 * g0 - h01 * g1) / det;
    const d1 = (h00 * g1 - h01 * g0) / det;
    // damp large steps so a poor starting point can't overshoot into overflow
    const scale = Math.min(1, 2 / Math.max(Math.abs(d0), Math.abs(d1)));
    b0 += d0 * scale;
    b1 += d1 * scale;
    if (Math.abs(d0) < 1e-10 && Math.abs(d1) < 1e-10) break;
  }
  if (!Number.isFinite(b0) || !Number.isFinite(b1)) return null;
  return { k: Math.exp(b0), a: b1 };
}

export function evalFit(fit: ExpFit, x: number): number {
  return fit.k * Math.exp(fit.a * x);
}

/** Months for the fitted value to double (ln 2 / a); null when not growing. */
export function doublingMonths(fit: ExpFit): number | null {
  return fit.a > 0 ? Math.LN2 / fit.a : null;
}

/** Counts per calendar month from the first to the last month present, zero-filled,
 *  with x = months since the first month. `exclude` drops one month key ("YYYY-MM")
 *  from the fit input — used for the current, still-incomplete month. */
export function monthlyCounts(
  dates: string[],
  exclude?: string
): { key: string; x: number; y: number }[] {
  if (dates.length === 0) return [];
  const idx = (d: string) => {
    const [y, m] = d.split("-").map(Number);
    return y * 12 + (m - 1);
  };
  const counts = new Map<number, number>();
  for (const d of dates) counts.set(idx(d), (counts.get(idx(d)) ?? 0) + 1);
  const first = Math.min(...counts.keys());
  const last = Math.max(...counts.keys());
  const out: { key: string; x: number; y: number }[] = [];
  for (let i = first; i <= last; i++) {
    const key = `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;
    if (key === exclude) continue;
    out.push({ key, x: i - first, y: counts.get(i) ?? 0 });
  }
  return out;
}
