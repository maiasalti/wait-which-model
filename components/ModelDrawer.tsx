"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Model } from "@/lib/types";
import { CompanyLogo } from "./CompanyLogo";
import { companyName, formatDate } from "@/lib/data";
import { ModelStatsGrid } from "./model/ModelStatsGrid";
import { ModelBenchmarks } from "./model/ModelBenchmarks";
import { ModelProsCons } from "./model/ModelProsCons";
import { ModelNewsList } from "./model/ModelNewsList";
import { Collapsible } from "./Collapsible";
import { ModelDeveloperDetails } from "./model/ModelDeveloperDetails";
import { benchmarkCoverage } from "./model/benchmarkCoverage";

/** Rendered into the root layout's @modal slot by the intercepting route at
 *  app/@modal/(.)models/[id]. Closing pops the history entry the card's <Link>
 *  pushed, which returns to the directory with its filters still mounted. */
export function ModelDrawer({ model }: { model: Model }) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={model.name}>
      <div className="absolute inset-0 bg-black/60" onClick={() => router.back()} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col gap-6 overflow-y-auto border-l border-line bg-surface p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CompanyLogo companyId={model.company} size={15} />
              <span className="mono text-xs uppercase tracking-wider text-ink-2">
                {companyName(model.company)}
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-semibold">{model.name}</h2>
            <p className="mono mt-1 text-xs text-ink-3">
              Released {formatDate(model.releaseDate)} · knowledge cutoff{" "}
              {model.knowledgeCutoff ?? "unpublished"}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            aria-label="Close details"
            className="rounded border border-line px-2 py-1 text-sm text-ink-2 hover:text-ink"
          >
            Esc
          </button>
        </div>

        <ModelStatsGrid model={model} className="grid-cols-2 sm:grid-cols-3" />

        <div>
          <Collapsible
            title="Benchmarks"
            meta={`${benchmarkCoverage(model).reported} of ${benchmarkCoverage(model).total} reported`}
            defaultOpen
          >
            <ModelBenchmarks model={model} />
          </Collapsible>
          <Collapsible title="Strengths & weaknesses">
            <ModelProsCons model={model} className="space-y-5" />
          </Collapsible>
          <Collapsible title="For developers">
            <ModelDeveloperDetails model={model} />
          </Collapsible>
          <Collapsible title="News">
            <ModelNewsList model={model} />
          </Collapsible>
        </div>
      </aside>
    </div>
  );
}
