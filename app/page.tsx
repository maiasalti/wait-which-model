"use client";

import { useMemo, useState } from "react";
import { companies, companyById, models } from "@/lib/data";
import type { Model, ModelStatus } from "@/lib/types";
import { ModelCard } from "@/components/ModelCard";
import { ModelDrawer } from "@/components/ModelDrawer";
import { CompanyLogo } from "@/components/CompanyLogo";

type SortKey =
  | "newest"
  | "oldest"
  | "priceAsc"
  | "priceOutputAsc"
  | "sweBench"
  | "gpqaDiamond"
  | "hle";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "priceAsc", label: "Cheapest input $" },
  { key: "priceOutputAsc", label: "Cheapest output $" },
  { key: "sweBench", label: "Best SWE-bench" },
  { key: "gpqaDiamond", label: "Best GPQA" },
  { key: "hle", label: "Best HLE" },
];

// A company can span countries ("United States / United Kingdom") — filter on each part.
const countriesOf = (country: string) => country.split("/").map((s) => s.trim());

const LOCATIONS = Array.from(
  new Set(companies.flatMap((c) => countriesOf(c.country)))
).sort();

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [status, setStatus] = useState<ModelStatus | "all">("all");
  const [location, setLocation] = useState<string>("all");
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("newest");
  const [selected, setSelected] = useState<Model | null>(null);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = models.filter((m) => {
      if (companyIds.length > 0 && !companyIds.includes(m.company)) return false;
      if (status !== "all" && m.status !== status) return false;
      if (
        location !== "all" &&
        !countriesOf(companyById.get(m.company)?.country ?? "").includes(location)
      )
        return false;
      if (openOnly && !m.openWeights) return false;
      if (q && !m.name.toLowerCase().includes(q)) return false;
      return true;
    });
    const bench = (m: Model, k: "sweBench" | "gpqaDiamond" | "hle") =>
      m.benchmarks[k] ?? -1;
    return filtered.sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.releaseDate.localeCompare(a.releaseDate);
        case "oldest":
          return a.releaseDate.localeCompare(b.releaseDate);
        case "priceAsc":
          return (a.pricing.inputPerMTok ?? Infinity) - (b.pricing.inputPerMTok ?? Infinity);
        case "priceOutputAsc":
          return (a.pricing.outputPerMTok ?? Infinity) - (b.pricing.outputPerMTok ?? Infinity);
        default:
          return bench(b, sort) - bench(a, sort);
      }
    });
  }, [search, companyIds, status, location, openOnly, sort]);

  const toggleCompany = (id: string) =>
    setCompanyIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const frontierCount = models.filter((m) => m.status === "frontier").length;
  const startYear = Math.min(
    ...models.map((m) => new Date(m.releaseDate).getFullYear())
  );

  return (
    <div>
      <section className="pt-10 pb-8">
        <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">
          Models Directory
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
          AI Model Directory
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-2">
          {models.length} models from {companies.length} labs, {startYear} to today —{" "}
          {frontierCount} currently at the frontier. Click a card for full
          stats, strengths and weaknesses, and related news.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search models…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48 rounded border border-line bg-surface px-3 py-1.5 text-sm placeholder:text-ink-3"
          aria-label="Search models"
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by company (multi-select)">
          {companies.map((c) => {
            const active = companyIds.includes(c.id);
            return (
              <div key={c.id} className="group relative">
                <button
                  onClick={() => toggleCompany(c.id)}
                  aria-pressed={active}
                  aria-label={c.name}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border transition-all ${
                    active
                      ? "scale-105 border-transparent"
                      : "border-line opacity-80 hover:opacity-100"
                  }`}
                  style={{
                    background: `${c.color}${active ? "3D" : "14"}`,
                    borderColor: active ? c.color : undefined,
                  }}
                >
                  <CompanyLogo companyId={c.id} size={17} />
                </button>
                <span
                  role="tooltip"
                  className="mono pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded border border-line-strong bg-surface-2 px-2 py-1 text-[11px] text-ink opacity-0 shadow-xl transition-opacity delay-150 group-hover:opacity-100"
                >
                  {c.name}
                </span>
              </div>
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
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ModelStatus | "all")}
          className="rounded border border-line bg-surface px-2 py-1.5 text-sm"
          aria-label="Filter by status"
        >
          <option value="all">Any status</option>
          <option value="frontier">Frontier</option>
          <option value="superseded">Superseded</option>
          <option value="unknown">Unknown</option>
          <option value="deprecated">Deprecated</option>
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded border border-line bg-surface px-2 py-1.5 text-sm"
          aria-label="Filter by location"
        >
          <option value="all">Any location</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-ink-2">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
          />
          Open weights
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="ml-auto rounded border border-line bg-surface px-2 py-1.5 text-sm"
          aria-label="Sort models"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-3">
          No models match these filters. Clear one to widen the view.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((m) => (
            <ModelCard key={m.id} model={m} onOpen={setSelected} />
          ))}
        </div>
      )}

      <ModelDrawer model={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
