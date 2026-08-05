"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { models } from "@/lib/data";
import { rankByCost, positionToTasks, tasksToPosition } from "@/lib/cost-calc";
import { CompanyLogo } from "@/components/CompanyLogo";

const usd = (v: number) =>
  v >= 100 ? `$${Math.round(v).toLocaleString()}` : `$${v.toFixed(2)}`;

/** Anchors turn an abstract count into something a person can place themselves
 *  against. Without them "how many tasks per day?" is a question almost nobody
 *  can answer, which was the whole problem with the bare number box. */
const ANCHORS = [
  { tasks: 20, label: "Light", hint: "personal use" },
  { tasks: 250, label: "Steady", hint: "daily driver" },
  { tasks: 2000, label: "Heavy", hint: "a team, or an app" },
  { tasks: 20000, label: "Always-on", hint: "production scale" },
];

const TOP_N = 8;

export default function CostCalculatorPage() {
  const [tasksPerDay, setTasksPerDay] = useState(250);
  /** Holds what the user is literally typing. The box used to be bound
   *  straight to the number, so it could never be empty — clearing it snapped
   *  back to "0" and the next keystroke produced "0100". While this is
   *  non-null the input shows the raw text; on blur it falls back to the
   *  canonical number. */
  const [typed, setTyped] = useState<string | null>(null);
  const [pickId, setPickId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Retired models are not something anyone is costing out a deployment against.
  const candidates = useMemo(
    () => models.filter((m) => m.status !== "deprecated"),
    []
  );
  const { included, excluded } = useMemo(
    () => rankByCost(candidates, tasksPerDay),
    [candidates, tasksPerDay]
  );

  const pick = included.find((r) => r.model.id === pickId) ?? null;
  // With a pick, the question becomes "what could I switch to and save?", so
  // only cheaper models are worth listing. Without one it's a plain ranking.
  const listed = pick ? included.filter((r) => r.monthly < pick.monthly) : included;
  const visible = showAll ? listed : listed.slice(0, TOP_N);
  // Scaled to the priciest row ON SCREEN, deliberately excluding the pick.
  // Including it flattened every alternative into a 2%-wide sliver — the pick
  // can be 50x the cheapest option, and the bars exist to separate the options
  // from each other, which is the actual choice being made. The pick's own
  // figure is stated in full in its own panel above.
  const barMax = Math.max(...visible.map((r) => r.monthly), 1);

  const setTasks = (n: number) => setTasksPerDay(Math.max(0, Math.round(n)));

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

      <div className="mt-8 max-w-2xl rounded border border-line p-4">
        <p className="mono text-[10px] uppercase tracking-wider text-ink-3">
          How much will you use it?
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {ANCHORS.map((a) => (
            <button
              key={a.label}
              onClick={() => {
                setTasks(a.tasks);
                setTyped(null);
              }}
              aria-pressed={tasksPerDay === a.tasks}
              className={`rounded border px-2.5 py-1.5 text-left text-xs transition-colors ${
                tasksPerDay === a.tasks
                  ? "border-accent/60 bg-accent/15 text-ink"
                  : "border-line text-ink-2 hover:text-ink"
              }`}
            >
              <span className="block">{a.label}</span>
              <span className="mono block text-[10px] text-ink-3">
                ~{a.tasks.toLocaleString()}/day · {a.hint}
              </span>
            </button>
          ))}
        </div>

        <label htmlFor="volume" className="sr-only">
          Tasks per day
        </label>
        <input
          id="volume"
          type="range"
          min={0}
          max={100}
          step={1}
          value={tasksToPosition(tasksPerDay)}
          onChange={(e) => {
            setTasks(positionToTasks(Number(e.target.value)));
            setTyped(null);
          }}
          className="mt-5 w-full accent-[color:var(--accent)]"
        />

        <div className="mt-3 flex items-baseline gap-2">
          <input
            type="text"
            inputMode="numeric"
            aria-label="Exact tasks per day"
            value={typed ?? String(tasksPerDay)}
            onChange={(e) => {
              const raw = e.target.value;
              setTyped(raw);
              const n = Number(raw);
              if (raw.trim() !== "" && Number.isFinite(n)) setTasks(n);
            }}
            onBlur={() => setTyped(null)}
            className="mono w-28 rounded border border-line bg-surface px-2 py-1 text-lg text-ink"
          />
          <span className="mono text-xs text-ink-3">tasks per day</span>
        </div>

        <p className="mt-3 text-xs text-ink-3">
          A task is one Artificial Analysis Intelligence Index task — one
          self-contained question or job. The anchors are rough guides, not
          measurements; type an exact figure if you know it.
        </p>
      </div>

      <div className="mt-8 max-w-2xl">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="mono text-[10px] uppercase tracking-widest text-ink-3">
            {pick ? "Cheaper than your pick" : "Monthly cost"}
          </h2>
          <select
            aria-label="Model you are currently using"
            value={pickId ?? ""}
            onChange={(e) => {
              setPickId(e.target.value || null);
              setShowAll(false);
            }}
            className="mono rounded border border-line bg-surface px-2 py-1 text-xs text-ink-2"
          >
            <option value="">Compare against a model…</option>
            {included.map((r) => (
              <option key={r.model.id} value={r.model.id}>
                {r.model.name}
              </option>
            ))}
          </select>
        </div>

        {pick && (
          <div className="mt-3 rounded border border-accent/40 bg-accent/10 p-3">
            <div className="flex items-center gap-3">
              <CompanyLogo companyId={pick.model.company} size={14} />
              <Link
                href={`/models/${pick.model.id}`}
                className="flex-1 truncate text-sm text-ink hover:underline"
              >
                {pick.model.name}
              </Link>
              <span className="mono text-sm text-ink">{usd(pick.monthly)}/mo</span>
            </div>
            <p className="mono mt-1.5 text-[10px] text-ink-3">
              {listed.length === 0
                ? "Nothing measured here costs less."
                : `${listed.length} measured model${listed.length === 1 ? "" : "s"} cost less.`}
            </p>
          </div>
        )}

        <ul className="mono mt-3">
          {visible.map((row) => (
            <li key={row.model.id} className="border-b border-line py-2">
              <div className="flex items-center gap-3">
                <CompanyLogo companyId={row.model.company} size={13} />
                <Link
                  href={`/models/${row.model.id}`}
                  className="flex-1 truncate text-sm text-ink hover:underline"
                >
                  {row.model.name}
                </Link>
                {pick && (
                  <span className="text-[10px] text-emerald-400">
                    save {usd(pick.monthly - row.monthly)}
                  </span>
                )}
                <span className="w-24 text-right text-sm text-ink">
                  {usd(row.monthly)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3">
                {/* Bar is relative to the priciest row on screen, so the spread
                    is visible at a glance. The exact figure sits beside it, so
                    the bar never has to be read as precise. */}
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
                  <span
                    className="block h-full rounded-full bg-accent/70"
                    style={{ width: `${Math.max(1.5, (row.monthly / barMax) * 100)}%` }}
                  />
                </span>
                <span className="w-40 shrink-0 text-right text-[10px] text-ink-3">
                  ${row.model.costPerTask.usd}/task
                  {row.model.costPerTask.effort
                    ? ` (${row.model.costPerTask.effort} effort)`
                    : ""}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {listed.length > TOP_N && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="mono mt-3 text-xs text-ink-3 underline hover:text-ink"
          >
            {showAll
              ? "Show fewer"
              : `Show all ${listed.length} model${listed.length === 1 ? "" : "s"}`}
          </button>
        )}

        <p className="mt-3 text-xs text-ink-3">
          Figures measured at different reasoning efforts are not strictly
          comparable — see{" "}
          <Link href="/info" className="underline hover:text-ink">
            Methodology
          </Link>
          .
        </p>

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
