"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { models } from "@/lib/data";
import { rankByCost } from "@/lib/cost-calc";
import { CompanyLogo } from "@/components/CompanyLogo";

const usd = (v: number) =>
  v >= 100 ? `$${Math.round(v).toLocaleString()}` : `$${v.toFixed(2)}`;

export default function CostCalculatorPage() {
  const [tasksPerDay, setTasksPerDay] = useState(250);

  // Retired models are not something anyone is costing out a deployment against.
  const candidates = useMemo(
    () => models.filter((m) => m.status !== "deprecated"),
    []
  );
  const { included, excluded } = useMemo(
    () => rankByCost(candidates, tasksPerDay),
    [candidates, tasksPerDay]
  );

  return (
    <div className="pb-16 pt-10">
      <p className="mono text-xs uppercase tracking-[0.25em] text-ink-3">Tools</p>
      <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
        Cost Calculator
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-ink-2">
        What a month costs, by model. Every figure here is measured — nothing is
        estimated. See{" "}
        <Link href="/info" className="underline hover:text-ink">
          Methodology
        </Link>{" "}
        for exactly how it is calculated.
      </p>

      <div className="mt-8 max-w-md rounded border border-line p-4">
        <label htmlFor="tasks" className="mono text-[10px] uppercase tracking-wider text-ink-3">
          How many tasks per day?
        </label>
        <input
          id="tasks"
          type="number"
          min={0}
          value={tasksPerDay}
          onChange={(e) => setTasksPerDay(Math.max(0, Number(e.target.value) || 0))}
          className="mono mt-2 w-full rounded border border-line bg-surface px-3 py-2 text-lg text-ink"
        />
        <p className="mt-2 text-xs text-ink-3">
          A task is one Artificial Analysis Intelligence Index task — one
          self-contained question or job.
        </p>
      </div>

      <div className="mt-8 max-w-2xl">
        <h2 className="mono text-[10px] uppercase tracking-widest text-ink-3">
          Estimated monthly cost
        </h2>
        <ul className="mono mt-3">
          {included.map((row) => (
            <li key={row.model.id} className="flex items-center gap-3 border-b border-line py-2">
              <CompanyLogo companyId={row.model.company} size={13} />
              <Link href={`/models/${row.model.id}`} className="flex-1 truncate text-sm text-ink hover:underline">
                {row.model.name}
              </Link>
              <span className="text-[10px] text-ink-3">
                ${row.model.costPerTask.usd}/task
              </span>
              <span className="w-24 text-right text-sm text-ink">{usd(row.monthly)}</span>
            </li>
          ))}
        </ul>

        {excluded.length > 0 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-xs text-ink-3 hover:text-ink">
              {excluded.length} of {candidates.length} active models have no
              measured cost-per-task figure and are excluded
              {models.length - candidates.length > 0 &&
                ` (${models.length - candidates.length} more are deprecated and not shown)`}
            </summary>
            <p className="mt-2 text-xs text-ink-3">
              {excluded.map((m) => m.name).join(", ")}
            </p>
          </details>
        )}
      </div>
    </div>
  );
}
