import Link from "next/link";
import type { AnyEntry, EntryKind } from "@/lib/types";
import { alsoListedIn, entryModelIds, formatDate, modelById, newsForEntry } from "@/lib/data";
import { Collapsible } from "../Collapsible";
import { KINDS } from "./kinds";

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-2">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-2">
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

/** Everything below an entry's header. Shared by /<kind>/[id] and the drawer,
 *  so it holds no hooks and stays a server component on the standalone page. */
export function EntryDetail({ kind, entry, compact = false }: { kind: EntryKind; entry: AnyEntry; compact?: boolean }) {
  const config = KINDS[kind];
  const modelIds = entryModelIds(entry);
  const related = newsForEntry(kind, entry.id);
  const apiIds = "apiIds" in entry ? entry.apiIds : [];
  const scores = "scores" in entry && Array.isArray(entry.scores) ? entry.scores : [];
  const repo = "repo" in entry ? entry.repo : null;

  return (
    <div>
      <p className="text-ink-2">{entry.description}</p>
      {alsoListedIn(kind, entry.id).map((k) => (
        <Link
          key={k}
          href={`${KINDS[k].href}/${entry.id}`}
          className="mono mt-2 inline-block text-xs text-ink-3 underline hover:text-ink"
        >
          Also in {KINDS[k].title} →
        </Link>
      ))}

      {/* Each cell draws its own right and bottom rule, pulled 1px outward so the
          container's clipped border hides the outer ones: a short last row then
          leaves blank surface rather than a grey hole. */}
      <dl className={`mono mt-6 grid overflow-hidden rounded-lg border border-line bg-surface text-sm ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
        {config.detailFacts(entry).map((f) => (
          <div key={f.label} className="-mb-px -mr-px border-b border-r border-line p-3">
            <dt className="text-[10px] uppercase tracking-wider text-ink-3">{f.label}</dt>
            <dd className={f.value ? "mt-1 text-ink" : "mt-1 text-ink-3"}>{f.value ?? "—"}</dd>
          </div>
        ))}
      </dl>

      {modelIds.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-2">
            {kind === "features" ? "Models" : "Runs on"}
          </h3>
          <div className="mono mt-2 flex flex-wrap gap-1.5 text-xs">
            {modelIds.map((id) => (
              <Link
                key={id}
                href={`/models/${id}`}
                className="rounded border border-line px-2 py-1 text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
              >
                {modelById.get(id)?.name ?? id}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        {scores.length > 0 && (
          <Collapsible title="Terminal-Bench" meta={`v${[...new Set(scores.map((s) => s.version))].join(", v")} · per harness + model pairing`} defaultOpen>
            <table className="mono w-full text-sm">
              <tbody>
                {scores
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .map((s) => (
                    <tr key={s.modelId} className="border-b border-line last:border-0">
                      <td className="py-1.5">
                        <Link href={`/models/${s.modelId}`} className="text-ink-2 hover:text-ink">
                          {modelById.get(s.modelId)?.name ?? s.modelId}
                        </Link>
                      </td>
                      <td className="py-1.5 text-right text-ink">{s.score}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Collapsible>
        )}
        <Collapsible title="Strengths & weaknesses" defaultOpen={!compact}>
          <div className={compact ? "space-y-5" : "grid gap-6 sm:grid-cols-2"}>
            <List title="Strengths" items={entry.strengths} />
            <List title="Weaknesses" items={entry.weaknesses} />
          </div>
          {entry.notes && <p className="mt-5 text-sm italic text-ink-3">{entry.notes}</p>}
        </Collapsible>
        <Collapsible title="Links">
          <ul className="space-y-1.5 text-sm">
            <li>
              <a href={entry.links.official} target="_blank" rel="noopener noreferrer" className="text-ink-2 underline hover:text-ink">
                Official page
              </a>
            </li>
            {entry.links.docs && (
              <li>
                <a href={entry.links.docs} target="_blank" rel="noopener noreferrer" className="text-ink-2 underline hover:text-ink">
                  Documentation
                </a>
              </li>
            )}
            {repo && (
              <li>
                <a href={repo} target="_blank" rel="noopener noreferrer" className="text-ink-2 underline hover:text-ink">
                  Source repository
                </a>
              </li>
            )}
          </ul>
          {apiIds.length > 0 && (
            <div className="mono mt-4 text-sm">
              <h4 className="text-[10px] uppercase tracking-wider text-ink-3">API model strings</h4>
              <ul className="mt-1 space-y-1">
                {apiIds.map((a) => (
                  <li key={`${a.provider}:${a.id}`} className="flex items-baseline gap-2">
                    <span className="shrink-0 text-ink-3">{a.provider}</span>
                    <code className="break-all text-ink">{a.id}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Collapsible>
        {related.length > 0 && (
          <Collapsible title="News">
            <ul className="space-y-2">
              {related.map((n) => (
                <li key={n.id}>
                  <a
                    href={n.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded border border-line p-2 text-sm transition-colors hover:border-ink-3 hover:bg-white/5"
                  >
                    <span className="mono text-[10px] text-ink-3">{formatDate(n.date)}</span>
                    <p className="text-ink-2">{n.title}</p>
                  </a>
                </li>
              ))}
            </ul>
          </Collapsible>
        )}
      </div>
    </div>
  );
}
