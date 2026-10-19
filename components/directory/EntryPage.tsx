import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { EntryKind } from "@/lib/types";
import { companyName, entries, entryById, formatDate } from "@/lib/data";
import { entryDate } from "@/lib/directory";
import { EntryDetail } from "./EntryDetail";
import { EntryHeader } from "./EntryHeader";
import { KINDS } from "./kinds";

export const entryParams = (kind: EntryKind) => entries[kind].map((e) => ({ id: e.id }));

export const entryMetadata =
  (kind: EntryKind) =>
  async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const entry = entryById(kind, (await params).id);
    if (!entry) return {};
    const when = entryDate(entry) ? ` · ${formatDate(entryDate(entry))}` : "";
    const description = `${companyName(entry.company)}${when} · ${entry.description}`;
    return {
      title: entry.name,
      description,
      openGraph: {
        title: `${entry.name} · Wait Which Model?`,
        description,
        url: `${KINDS[kind].href}/${entry.id}`,
        type: "article",
      },
    };
  };

/** The standalone page a cold load or shared link lands on. */
export function EntryPage({ kind, id }: { kind: EntryKind; id: string }) {
  const entry = entryById(kind, id);
  if (!entry) notFound();
  const config = KINDS[kind];

  return (
    <div className="pb-8 pt-10">
      <Link
        href={config.href}
        className="mono text-xs uppercase tracking-[0.2em] text-ink-3 transition-colors hover:text-ink"
      >
        ← Back to {config.title}
      </Link>
      <header className="mt-6">
        <EntryHeader entry={entry} />
      </header>
      <div className="mt-6 max-w-3xl">
        <EntryDetail kind={kind} entry={entry} />
      </div>
    </div>
  );
}
