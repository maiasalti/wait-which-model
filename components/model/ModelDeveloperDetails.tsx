import Link from "next/link";
import type { Model } from "@/lib/types";
import { formatDate, modelById } from "@/lib/data";

const LICENSE_KIND_LABEL: Record<string, string> = {
  permissive: "Permissive",
  copyleft: "Copyleft",
  restricted: "Restricted",
  proprietary: "Proprietary",
};

/** Everything a developer wants and a beginner does not. Lives behind a
 *  collapsed section so a non-technical visitor never encounters it. */
export function ModelDeveloperDetails({ model }: { model: Model }) {
  const predecessor = model.predecessorId ? modelById.get(model.predecessorId) : null;

  return (
    <div className="mono space-y-4 text-xs">
      <section>
        <h4 className="text-[10px] uppercase tracking-wider text-ink-3">API model strings</h4>
        {model.apiIds.length === 0 ? (
          <p className="mt-1 text-ink-3">Not published</p>
        ) : (
          <ul className="mt-1 space-y-1">
            {model.apiIds.map((a) => (
              <li key={`${a.provider}:${a.id}`} className="flex items-baseline gap-2">
                <span className="shrink-0 text-ink-3">{a.provider}</span>
                <code className="break-all text-ink">{a.id}</code>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-wider text-ink-3">Licence</h4>
        {model.license == null ? (
          <p className="mt-1 text-ink-3">
            {model.openWeights ? "Not researched" : "Proprietary — weights not released"}
          </p>
        ) : (
          <p className="mt-1 text-ink">
            {model.license.url ? (
              <a href={model.license.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                {model.license.name}
              </a>
            ) : (
              model.license.name
            )}
            <span className="text-ink-3">
              {" "}· {LICENSE_KIND_LABEL[model.license.kind] ?? model.license.kind}
              {model.license.commercialUse != null &&
                ` · commercial use ${model.license.commercialUse ? "permitted" : "restricted"}`}
            </span>
          </p>
        )}
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-wider text-ink-3">Retirement</h4>
        <p className="mt-1 text-ink">
          {model.retirementDate ? formatDate(model.retirementDate) : (
            <span className="text-ink-3">No retirement announced</span>
          )}
        </p>
      </section>

      <section>
        <h4 className="text-[10px] uppercase tracking-wider text-ink-3">Lineage</h4>
        <p className="mt-1 text-ink">
          {predecessor ? (
            <>
              Replaces{" "}
              <Link href={`/models/${predecessor.id}`} className="underline hover:text-ink">
                {predecessor.name}
              </Link>
            </>
          ) : (
            <span className="text-ink-3">No recorded predecessor</span>
          )}
        </p>
      </section>
    </div>
  );
}
