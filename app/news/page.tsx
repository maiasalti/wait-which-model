"use client";

import { useMemo, useState } from "react";
import { companies, companyName, formatDate, news } from "@/lib/data";
import type { NewsCategory } from "@/lib/types";

const CATEGORIES: { key: NewsCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "release", label: "Releases" },
  { key: "benchmark", label: "Benchmarks" },
  { key: "company", label: "Company" },
  { key: "research", label: "Research" },
  { key: "policy", label: "Policy" },
];

const CATEGORY_STYLE: Record<NewsCategory, string> = {
  release: "bg-accent/15 text-accent",
  benchmark: "bg-white/10 text-ink",
  company: "bg-white/5 text-ink-2",
  research: "bg-white/5 text-ink-2",
  policy: "bg-white/5 text-ink-2",
};

function monthKey(date: string) {
  return date.slice(0, 7);
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  return `${months[m - 1]} ${y}`;
}

export default function NewsPage() {
  const [category, setCategory] = useState<NewsCategory | "all">("all");
  const [company, setCompany] = useState<string>("all");

  const shown = useMemo(
    () =>
      news.filter((n) => {
        if (category !== "all" && n.category !== category) return false;
        if (company !== "all" && !n.companies.includes(company)) return false;
        return true;
      }),
    [category, company]
  );

  const byMonth = useMemo(() => {
    const groups = new Map<string, typeof shown>();
    for (const n of shown) {
      const k = monthKey(n.date);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(n);
    }
    return Array.from(groups.entries());
  }, [shown]);

  return (
    <div>
      <section className="pt-10 pb-8">
        <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">
          Model news
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
          The frontier log.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-ink-2">
          Releases, benchmark milestones, company moves, research results and
          policy — everything that shifts the frontier, in one dated record.
        </p>
      </section>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Category filter">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              aria-pressed={category === c.key}
              className={`mono rounded px-2.5 py-1 text-xs ${
                category === c.key
                  ? "bg-accent/20 text-accent"
                  : "border border-line text-ink-2 hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="ml-auto rounded border border-line bg-surface px-2 py-1.5 text-sm"
          aria-label="Filter news by company"
        >
          <option value="all">All companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {byMonth.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-3">
          No news matches these filters.
        </p>
      ) : (
        byMonth.map(([month, items]) => (
          <section key={month} className="mb-10">
            <h2 className="mono mb-4 border-b border-line pb-2 text-xs uppercase tracking-[0.2em] text-ink-3">
              {monthLabel(month)}
            </h2>
            <ol className="space-y-4">
              {items.map((n) => (
                <li key={n.id} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                  <span className="mono w-20 shrink-0 pt-0.5 text-xs text-ink-3">
                    {formatDate(n.date).replace(`, ${n.date.slice(0, 4)}`, "")}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`mono rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${CATEGORY_STYLE[n.category]}`}
                      >
                        {n.category}
                      </span>
                      {n.companies.map((c) => (
                        <span key={c} className="mono text-[11px] text-ink-3">
                          {companyName(c)}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-1 font-semibold leading-snug">{n.title}</h3>
                    <p className="mt-1 text-sm text-ink-2">{n.summary}</p>
                    <a
                      href={n.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono mt-1 inline-block text-xs text-accent hover:underline"
                    >
                      {n.sourceName} ↗
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </div>
  );
}
