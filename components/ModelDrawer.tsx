"use client";

import { useEffect } from "react";
import type { Model } from "@/lib/types";
import { CompanyLogo } from "./CompanyLogo";
import {
  benchmarks,
  companyById,
  companyName,
  formatContext,
  formatDate,
  formatPrice,
  news,
} from "@/lib/data";

export function ModelDrawer({ model, onClose }: { model: Model | null; onClose: () => void }) {
  useEffect(() => {
    if (!model) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [model, onClose]);

  if (!model) return null;
  const company = companyById.get(model.company);
  const related = news.filter((n) => n.modelIds.includes(model.id));

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={model.name}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto border-l border-line bg-surface p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CompanyLogo companyId={model.company} size={15} />
              <span className="mono text-xs uppercase tracking-wider text-ink-2">
                {companyName(model.company)}
                {company ? ` · ${company.country}` : ""}
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-semibold">{model.name}</h2>
            <p className="mono mt-1 text-xs text-ink-3">
              Released {formatDate(model.releaseDate)} · knowledge cutoff{" "}
              {model.knowledgeCutoff ?? "unpublished"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="rounded border border-line px-2 py-1 text-sm text-ink-2 hover:text-ink"
          >
            Esc
          </button>
        </div>

        <dl className="mono mt-6 grid grid-cols-2 gap-3 text-sm">
          {[
            ["Status", model.status],
            ["Modality", model.modality],
            ["Context window", formatContext(model.contextWindow)],
            ["Max output", formatContext(model.maxOutput)],
            [
              "Price ($/MTok in / out)",
              `${formatPrice(model.pricing.inputPerMTok)} / ${formatPrice(model.pricing.outputPerMTok)}`,
            ],
            ["Open weights", model.openWeights ? "Yes" : "No"],
          ].map(([k, v]) => (
            <div key={k} className="rounded border border-line p-2">
              <dt className="text-[10px] uppercase tracking-wider text-ink-3">{k}</dt>
              <dd className="mt-0.5 capitalize text-ink">{v}</dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-ink-2">
          Benchmarks (launch-time reported)
        </h3>
        <table className="mono mt-2 w-full text-sm">
          <tbody>
            {benchmarks.map((b) => {
              const v = model.benchmarks[b.key];
              return (
                <tr key={b.key} className="border-b border-line last:border-0">
                  <td className="py-1.5 pr-2 text-ink-2" title={b.description}>
                    {b.name}
                  </td>
                  <td className="py-1.5 text-right">
                    {v != null ? `${v}${b.unit === "%" ? "%" : ""}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {model.strengths.length > 0 && (
          <>
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-ink-2">
              Strengths
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-2">
              {model.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </>
        )}
        {model.weaknesses.length > 0 && (
          <>
            <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-2">
              Weaknesses
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-2">
              {model.weaknesses.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </>
        )}

        {model.notes && <p className="mt-5 text-sm italic text-ink-3">{model.notes}</p>}

        {related.length > 0 && (
          <>
            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-ink-2">
              In the news
            </h3>
            <ul className="mt-2 space-y-2">
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
          </>
        )}
      </aside>
    </div>
  );
}
