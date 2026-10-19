import type { AnyEntry } from "@/lib/types";
import { companyName, formatDate } from "@/lib/data";
import { entryDate } from "@/lib/directory";
import { CompanyLogo } from "../CompanyLogo";

export function EntryHeader({ entry, as: H = "h1" }: { entry: AnyEntry; as?: "h1" | "h2" }) {
  const notable = "notable" in entry && entry.notable;
  return (
    <div>
      <div className="flex items-center gap-2">
        <CompanyLogo companyId={entry.company} size={15} />
        <span className="mono text-xs uppercase tracking-wider text-ink-2">{companyName(entry.company)}</span>
        {notable && (
          <span className="mono rounded bg-accent/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">
            Notable
          </span>
        )}
      </div>
      <H className={H === "h1" ? "mt-2 text-3xl font-semibold sm:text-4xl" : "mt-1 text-2xl font-semibold"}>
        {entry.name}
      </H>
      <p className="mono mt-1 text-xs text-ink-3">
        {entryDate(entry)
          ? `${"launchDate" in entry ? "Launched" : "Released"} ${formatDate(entryDate(entry))}`
          : "Release date unpublished"}
      </p>
    </div>
  );
}
