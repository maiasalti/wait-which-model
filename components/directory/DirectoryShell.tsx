"use client";

import { useMemo, useState } from "react";
import type { AnyEntry, EntryKind, FeatureEntry } from "@/lib/types";
import { companies, companyColor, companyName, entries } from "@/lib/data";
import { companiesWithEntries, filterEntries, sortEntries, type EntrySort } from "@/lib/directory";
import { DirectoryTabs } from "./DirectoryTabs";
import { EntryCard } from "./EntryCard";
import { FeatureTimeline } from "./FeatureTimeline";
import { KINDS } from "./kinds";

/** The page body every non-Models directory shares. Takes the kind rather
 *  than its config so the server page can pass it across the client boundary. */
export function DirectoryShell({ kind }: { kind: EntryKind }) {
  const config = KINDS[kind];
  const all: AnyEntry[] = entries[kind];
  const isFeatures = kind === "features";
  const developers = useMemo(() => companiesWithEntries(companies, all), [all]);

  const [search, setSearch] = useState("");
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [notableOnly, setNotableOnly] = useState(false);
  const [sort, setSort] = useState<EntrySort>("newest");

  const shown = useMemo(
    () => sortEntries(filterEntries(all, { search, companyIds, notableOnly }, companyName), isFeatures ? "newest" : sort),
    [all, search, companyIds, notableOnly, sort, isFeatures]
  );

  const toggle = (id: string) =>
    setCompanyIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  const notableCount = all.filter((e) => "notable" in e && e.notable).length;

  return (
    <div>
      <DirectoryTabs />
      <section className="pt-10 pb-8">
        <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">Directory</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{config.title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-2">
          {config.intro} {all.length} {config.plural} from {developers.length}{" "}
          {developers.length === 1 ? "developer" : "developers"}
          {!isFeatures && notableCount > 0 ? `, ${notableCount} marked Notable` : ""}.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder={`Search ${config.plural}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48 rounded border border-line bg-surface px-3 py-1.5 text-sm placeholder:text-ink-3"
          aria-label={`Search ${config.plural}`}
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by developer (multi-select)">
          {developers.map((c) => {
            const active = companyIds.includes(c.id);
            const color = companyColor(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                aria-pressed={active}
                className={`mono flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                  active ? "text-ink" : "border-line text-ink-2 hover:text-ink"
                }`}
                style={active ? { background: `${color}3D`, borderColor: color } : undefined}
              >
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: color }} />
                {c.name}
              </button>
            );
          })}
          {companyIds.length > 0 && (
            <button
              onClick={() => setCompanyIds([])}
              className="mono self-center px-1.5 text-[11px] text-ink-3 underline hover:text-ink"
            >
              clear
            </button>
          )}
        </div>
        {!isFeatures && notableCount > 0 && (
          <label className="flex items-center gap-1.5 text-sm text-ink-2">
            <input type="checkbox" checked={notableOnly} onChange={(e) => setNotableOnly(e.target.checked)} />
            Notable only
          </label>
        )}
        {!isFeatures && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as EntrySort)}
            className="ml-auto rounded border border-line bg-surface px-2 py-1.5 text-sm"
            aria-label={`Sort ${config.plural}`}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name A–Z</option>
          </select>
        )}
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-3">
          No {config.plural} match these filters. Clear one to widen the view.
        </p>
      ) : isFeatures ? (
        <FeatureTimeline features={shown as FeatureEntry[]} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((e) => (
            <EntryCard key={e.id} entry={e} config={config} />
          ))}
        </div>
      )}
    </div>
  );
}
