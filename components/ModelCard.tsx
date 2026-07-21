"use client";

import type { Model } from "@/lib/types";
import { companyName, formatContext, formatDate, formatPrice } from "@/lib/data";
import { CompanyLogo } from "./CompanyLogo";

const STATUS_LABEL: Record<Model["status"], string> = {
  frontier: "Frontier",
  superseded: "Superseded",
  deprecated: "Deprecated",
};

export function ModelCard({ model, onOpen }: { model: Model; onOpen: (m: Model) => void }) {
  return (
    <button
      onClick={() => onOpen(model)}
      className="group flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong hover:bg-surface-2"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <CompanyLogo companyId={model.company} size={13} />
            <span className="mono text-[11px] uppercase tracking-wider text-ink-2">
              {companyName(model.company)}
            </span>
          </div>
          <h3 className="mt-1 text-base font-semibold leading-tight">{model.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`mono rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
              model.status === "frontier"
                ? "bg-accent/15 text-accent"
                : "bg-white/5 text-ink-3"
            }`}
          >
            {STATUS_LABEL[model.status]}
          </span>
          {model.openWeights && (
            <span className="mono rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-ink-2">
              Open weights
            </span>
          )}
        </div>
      </div>

      <dl className="mono grid grid-cols-3 gap-x-2 gap-y-1 text-xs">
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-ink-3">Released</dt>
          <dd className="text-ink-2">{formatDate(model.releaseDate)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-ink-3">Context</dt>
          <dd className="text-ink-2">{formatContext(model.contextWindow)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-ink-3">$ in / out</dt>
          <dd className="text-ink-2">
            {formatPrice(model.pricing.inputPerMTok)} / {formatPrice(model.pricing.outputPerMTok)}
          </dd>
        </div>
      </dl>

      <div className="mono flex flex-wrap gap-1.5 text-[11px]">
        {model.benchmarks.sweBench != null && (
          <span className="rounded border border-line px-1.5 py-0.5 text-ink-2">
            SWE {model.benchmarks.sweBench}%
          </span>
        )}
        {model.benchmarks.gpqaDiamond != null && (
          <span className="rounded border border-line px-1.5 py-0.5 text-ink-2">
            GPQA {model.benchmarks.gpqaDiamond}%
          </span>
        )}
        {model.benchmarks.hle != null && (
          <span className="rounded border border-line px-1.5 py-0.5 text-ink-2">
            HLE {model.benchmarks.hle}%
          </span>
        )}
      </div>
    </button>
  );
}
