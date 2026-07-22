"use client";

import { useEffect, useMemo, useState } from "react";
import type { Model } from "@/lib/types";
import { CompanyLogo } from "./CompanyLogo";
import {
  benchmarks,
  companyById,
  companyColor,
  companyName,
  formatContext,
  formatDate,
  formatPrice,
  models,
  news,
} from "@/lib/data";

const ELO_VALUES = models
  .map((m) => m.benchmarks.lmarenaElo)
  .filter((v): v is number => v != null);
const ELO_MIN = Math.floor(Math.min(...ELO_VALUES) / 50) * 50;
const ELO_MAX = Math.ceil(Math.max(...ELO_VALUES) / 50) * 50;

function barPct(value: number | null | undefined, domainMin: number, domainMax: number): number {
  if (value == null) return 0;
  const pct = ((value - domainMin) / (domainMax - domainMin)) * 100;
  return Math.max(2, Math.min(100, pct));
}

export function ModelDrawer({ model, onClose }: { model: Model | null; onClose: () => void }) {
  const [compareQuery, setCompareQuery] = useState("");
  const [compareId, setCompareId] = useState<string | null>(null);

  useEffect(() => {
    if (!model) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [model, onClose]);

  useEffect(() => {
    setCompareQuery("");
    setCompareId(null);
  }, [model?.id]);

  const compareModel = useMemo(
    () => models.find((m) => m.id === compareId) ?? null,
    [compareId]
  );

  const suggestions = useMemo(() => {
    if (!model || !compareQuery.trim() || compareModel) return [];
    const q = compareQuery.trim().toLowerCase();
    return models.filter((m) => m.id !== model.id && m.name.toLowerCase().includes(q)).slice(0, 6);
  }, [model, compareQuery, compareModel]);

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
            ["Location", company?.country ?? "Unknown"],
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

        <div className="mt-6 flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-2">
            Benchmarks (launch-time reported)
          </h3>
        </div>

        <div className="mt-2">
          {compareModel ? (
            <div className="flex items-center justify-between gap-2 rounded border border-line bg-surface-2 px-2 py-1.5 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: companyColor(model.company) }}
                  />
                  <span className="text-ink">{model.name}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: companyColor(compareModel.company) }}
                  />
                  <span className="text-ink-2">{compareModel.name}</span>
                </span>
              </div>
              <button
                onClick={() => setCompareId(null)}
                aria-label="Clear comparison"
                className="shrink-0 text-ink-3 hover:text-ink"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="search"
                value={compareQuery}
                onChange={(e) => setCompareQuery(e.target.value)}
                placeholder="Quick compare — search a model…"
                className="w-full rounded border border-line bg-surface px-2 py-1.5 text-xs placeholder:text-ink-3"
                aria-label="Quick compare with another model"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded border border-line-strong bg-surface-2 shadow-xl">
                  {suggestions.map((m) => (
                    <li key={m.id}>
                      <button
                        onClick={() => {
                          setCompareId(m.id);
                          setCompareQuery("");
                        }}
                        className="flex w-full items-center gap-1.5 px-2 py-1.5 text-left text-xs text-ink-2 hover:bg-white/5 hover:text-ink"
                      >
                        <CompanyLogo companyId={m.company} size={12} />
                        {m.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="mono mt-3">
          {benchmarks.map((b) => {
            const v1 = model.benchmarks[b.key];
            const v2 = compareModel?.benchmarks[b.key];
            const isElo = b.key === "lmarenaElo";
            const domainMin = isElo ? ELO_MIN : 0;
            const domainMax = isElo ? ELO_MAX : b.max ?? 100;
            const unit = b.unit === "%" ? "%" : "";
            const entries = compareModel
              ? [
                  { v: v1, color: companyColor(model.company) },
                  { v: v2, color: companyColor(compareModel.company) },
                ]
              : [{ v: v1, color: companyColor(model.company) }];
            return (
              <div key={b.key} className="border-b border-line py-2 last:border-0">
                <p className="text-xs text-ink-2" title={b.description}>
                  {b.name}
                </p>
                <div className="mt-1 space-y-1">
                  {entries.map((e, i) => (
                    <div key={i}>
                      <div className="text-right text-[10px] text-ink">
                        {e.v != null ? `${e.v}${unit}` : "—"}
                      </div>
                      <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full transition-[width]"
                          style={{ width: `${barPct(e.v, domainMin, domainMax)}%`, background: e.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

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
