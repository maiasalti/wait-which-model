import { benchmarks, models } from "@/lib/data";

/** Coverage doubles as an honesty signal and a to-do list for the
 *  stats-filler protocol. */
export function BenchmarkCoverage() {
  const rows = benchmarks.map((b) => ({
    name: b.name,
    reported: models.filter((m) => m.benchmarks[b.key] != null).length,
  }));
  const total = models.length;

  return (
    <ul className="mono space-y-2 text-xs">
      {rows.map((r) => (
        <li key={r.name} className="flex items-center gap-3">
          <span className="w-44 shrink-0 truncate text-ink-2">{r.name}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
            <span
              className="block h-full rounded-full bg-accent"
              style={{ width: `${(r.reported / total) * 100}%` }}
            />
          </span>
          <span className="w-24 shrink-0 text-right text-[10px] text-ink-3">
            {r.reported} of {total}
          </span>
        </li>
      ))}
    </ul>
  );
}
