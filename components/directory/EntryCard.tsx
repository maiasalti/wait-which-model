import Link from "next/link";
import type { AnyEntry } from "@/lib/types";
import { companyName, formatDate } from "@/lib/data";
import { entryDate } from "@/lib/directory";
import { CompanyLogo } from "../CompanyLogo";
import type { KindConfig } from "./kinds";

/** A <Link> like ModelCard: from the directory it opens the drawer, and a cold
 *  load of the same URL renders the full entry page. */
export function EntryCard({ entry, config }: { entry: AnyEntry; config: KindConfig }) {
  const notable = "notable" in entry && entry.notable;
  const badges = config.badges(entry);
  const chips = config.chips(entry);

  return (
    <Link
      href={`${config.href}/${entry.id}`}
      className="group flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong hover:bg-surface-2"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CompanyLogo companyId={entry.company} size={13} />
            <span className="mono truncate text-[11px] uppercase tracking-wider text-ink-2">
              {companyName(entry.company)}
            </span>
          </div>
          <h3 className="mt-1 text-base font-semibold leading-tight">{entry.name}</h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {notable && (
            <span className="mono rounded bg-accent/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">
              Notable
            </span>
          )}
          {badges.map((b) => (
            <span key={b} className="mono rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-ink-2">
              {b}
            </span>
          ))}
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-ink-2">{entry.description}</p>

      <dl className="mono grid grid-cols-3 gap-x-2 gap-y-1 text-xs">
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-ink-3">Released</dt>
          <dd className="text-ink-2">{entryDate(entry) ? formatDate(entryDate(entry)) : "Undated"}</dd>
        </div>
        {config.cardFacts(entry).slice(0, 2).map((f) => (
          <div key={f.label} className="min-w-0">
            <dt className="text-[10px] uppercase tracking-wider text-ink-3">{f.label}</dt>
            <dd className="truncate text-ink-2" title={f.value ?? undefined}>{f.value ?? "—"}</dd>
          </div>
        ))}
      </dl>

      {chips.length > 0 && (
        <div className="mono flex flex-wrap gap-1.5 text-[11px]">
          {chips.slice(0, 4).map((c) => (
            <span key={c} className="rounded border border-line px-1.5 py-0.5 text-ink-2">
              {c}
            </span>
          ))}
          {chips.length > 4 && <span className="px-1 py-0.5 text-ink-3">+{chips.length - 4}</span>}
        </div>
      )}
    </Link>
  );
}
