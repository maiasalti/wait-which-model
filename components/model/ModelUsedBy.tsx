import Link from "next/link";
import type { Model } from "@/lib/types";
import { companyName, usedBy } from "@/lib/data";
import { KINDS } from "../directory/kinds";

/** Harnesses, agents and features that name this model. Derived from those
 *  entries on every build, never stored on the model. */
export function ModelUsedBy({ model }: { model: Model }) {
  const refs = usedBy(model.id);
  if (refs.length === 0) return null;
  return (
    <ul className="space-y-1.5 text-sm">
      {refs.map(({ kind, entry }) => (
        <li key={`${kind}:${entry.id}`} className="flex items-baseline gap-2">
          <span className="mono w-32 shrink-0 text-[10px] uppercase tracking-wider text-ink-3">{KINDS[kind].title}</span>
          <Link href={`${KINDS[kind].href}/${entry.id}`} className="text-ink-2 underline hover:text-ink">
            {entry.name}
          </Link>
          <span className="text-xs text-ink-3">{companyName(entry.company)}</span>
        </li>
      ))}
    </ul>
  );
}

export const usedByCount = (model: Model) => usedBy(model.id).length;
