import Link from "next/link";
import type { FeatureEntry } from "@/lib/types";
import { companyName, formatDate } from "@/lib/data";
import { groupByMonth } from "@/lib/directory";
import { CompanyLogo } from "../CompanyLogo";
import { accessLabel, surfaceLabel } from "./kinds";

const monthLabel = (ym: string) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

/** Frontier Features as one newest-first timeline across the five labs,
 *  grouped by month. Expects entries already filtered and sorted. */
export function FeatureTimeline({ features }: { features: FeatureEntry[] }) {
  return (
    <div className="space-y-10">
      {groupByMonth(features).map((g) => (
        <section key={g.month}>
          <h2 className="mono sticky top-0 z-10 -mx-1 bg-bg/90 px-1 py-2 text-xs uppercase tracking-[0.2em] text-ink-3 backdrop-blur">
            {monthLabel(g.month)}
          </h2>
          <ol className="mt-2 border-l border-line">
            {g.entries.map((f) => (
              <li key={f.id} className="relative pl-5">
                <span aria-hidden className="absolute -left-[5px] top-5 h-2.5 w-2.5 rounded-full border border-line-strong bg-surface" />
                <Link
                  href={`/features/${f.id}`}
                  className="block rounded-lg px-3 py-3 transition-colors hover:bg-surface-2"
                >
                  <div className="mono flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wider text-ink-3">
                    <span>{formatDate(f.launchDate)}</span>
                    <span className="flex items-center gap-1.5 text-ink-2">
                      <CompanyLogo companyId={f.company} size={12} />
                      {companyName(f.company)}
                    </span>
                    <span>{surfaceLabel(f.surface)}</span>
                    {f.availability !== "ga" && <span className="text-amber-400">{accessLabel(f.availability)}</span>}
                    {f.retiredDate && <span>Retired {formatDate(f.retiredDate)}</span>}
                  </div>
                  <h3 className="mt-1 font-semibold">{f.name}</h3>
                  <p className="mt-0.5 text-sm text-ink-2">{f.description}</p>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
