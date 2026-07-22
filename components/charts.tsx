"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { benchmarkByKey, companies, companyColor, companyName, formatDate, formatPrice } from "@/lib/data";
import { hasActiveHighlight, isHighlighted } from "@/lib/filter";
import { LOGO_PATHS } from "@/lib/logos";
import { CompanyLogo } from "./CompanyLogo";
import type { BenchmarkKey, Highlight, Model } from "@/lib/types";

const DIM = 0.14;
const MARK = 15; // logo mark size in px

interface LabelBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Candidate label offsets: rings of increasing radius around the mark, so a dense
 * cluster still has somewhere to search before giving up on that label entirely. */
const LABEL_CANDIDATES: { dx: number; dy: number; anchor: "start" | "middle" | "end" }[] = [];
for (const radius of [11, 17, 24, 32, 42, 54]) {
  for (const angleDeg of [0, 45, 90, 135, 180, 225, 270, 315]) {
    const rad = (angleDeg * Math.PI) / 180;
    const dx = Math.round(Math.cos(rad) * radius);
    const dy = Math.round(Math.sin(rad) * radius);
    const anchor = dx > 3 ? "start" : dx < -3 ? "end" : "middle";
    LABEL_CANDIDATES.push({ dx, dy, anchor });
  }
}

function boxesOverlap(a: LabelBox, b: LabelBox): boolean {
  return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2);
}

function labelBox(cx: number, cy: number, dx: number, dy: number, anchor: string, width: number): LabelBox {
  const height = 13;
  let x1: number;
  if (anchor === "start") x1 = cx + dx;
  else if (anchor === "end") x1 = cx + dx - width;
  else x1 = cx + dx - width / 2;
  return { x1, y1: cy + dy - height / 2, x2: x1 + width, y2: cy + dy + height / 2 };
}

/** Finds a label position near (cx, cy) that doesn't overlap already-placed labels.
 * Returns null if every candidate in the search rings collides — better to drop a
 * label in a dense cluster than render overlapping, unreadable text. */
function placeLabel(cx: number, cy: number, text: string, placed: LabelBox[]) {
  const width = text.length * 5.4 + 6;
  for (const c of LABEL_CANDIDATES) {
    const box = labelBox(cx, cy, c.dx, c.dy, c.anchor, width);
    if (!placed.some((p) => boxesOverlap(p, box))) {
      placed.push(box);
      const textX = c.anchor === "start" ? box.x1 : c.anchor === "end" ? box.x2 : cx + c.dx;
      return { x: textX, y: cy + c.dy, anchor: c.anchor, box };
    }
  }
  return null;
}

/** Scatter mark: the company logo, tinted in the company color, dimmed when not highlighted; optional collision-avoided label. */
function logoShape(
  color: string,
  path: string | undefined,
  dimming: boolean,
  showLabels: boolean,
  placed: LabelBox[]
) {
  return function LogoMark(props: unknown) {
    const { cx, cy, payload } = props as { cx?: number; cy?: number; payload?: Point };
    if (cx == null || cy == null) return <g />;
    const opacity = dimming && payload && !payload.hi ? DIM : 0.95;
    const mark = !path ? (
      <circle cx={cx} cy={cy} r={5} fill={color} fillOpacity={opacity} />
    ) : (
      <g
        transform={`translate(${cx - MARK / 2}, ${cy - MARK / 2}) scale(${MARK / 24})`}
        opacity={opacity}
      >
        <path d={path} fill={color} />
      </g>
    );
    if (!showLabels || !payload) return mark;
    const label = placeLabel(cx, cy, payload.model.name, placed);
    if (!label) return mark;
    return (
      <g opacity={opacity}>
        {mark}
        <rect
          x={label.box.x1 - 2}
          y={label.box.y1}
          width={label.box.x2 - label.box.x1 + 4}
          height={label.box.y2 - label.box.y1}
          fill="var(--surface)"
          fillOpacity={0.8}
          rx={2}
        />
        <text
          x={label.x}
          y={label.y + 3}
          textAnchor={label.anchor}
          fontSize={10}
          fontFamily="var(--font-plex-mono), ui-monospace, monospace"
          fill="var(--ink-2)"
        >
          {payload.model.name}
        </text>
      </g>
    );
  };
}

interface Point {
  x: number;
  y: number;
  model: Model;
  hi: boolean;
}

function buildSeries(
  shown: Model[],
  highlight: Highlight,
  x: (m: Model) => number | null,
  y: (m: Model) => number | null
) {
  return companies
    .map((c) => ({
      company: c,
      points: shown
        .filter((m) => m.company === c.id)
        .flatMap<Point>((m) => {
          const xv = x(m);
          const yv = y(m);
          return xv == null || yv == null
            ? []
            : [{ x: xv, y: yv, model: m, hi: isHighlighted(m, highlight) }];
        }),
    }))
    .filter((s) => s.points.length > 0);
}

function ChartTooltip({
  active,
  payload,
  benchmark,
  xLabel,
}: {
  active?: boolean;
  payload?: Array<{ payload: Point }>;
  benchmark: BenchmarkKey;
  xLabel: "date" | "price";
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  const m = p.model;
  const b = benchmarkByKey.get(benchmark);
  return (
    <div className="rounded border border-line-strong bg-surface-2 p-3 text-xs shadow-xl">
      <p className="flex items-center gap-1.5 font-semibold text-ink">
        <CompanyLogo companyId={m.company} size={12} />
        {m.name}
      </p>
      <p className="mono mt-1 text-ink-2">
        {b?.name}: {p.y}
        {b?.unit === "%" ? "%" : ""}
      </p>
      <p className="mono text-ink-3">
        {xLabel === "date"
          ? formatDate(m.releaseDate)
          : `${formatPrice(m.pricing.inputPerMTok)}/MTok input · ${formatDate(m.releaseDate)}`}
      </p>
      <p className="mono text-ink-3">{companyName(m.company)}</p>
    </div>
  );
}

function CompanyLegend({ shown }: { shown: Model[] }) {
  const present = companies.filter((c) => shown.some((m) => m.company === c.id));
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 px-1 pt-2">
      {present.map((c) => (
        <span key={c.id} className="mono flex items-center gap-1.5 text-[11px] text-ink-2">
          <CompanyLogo companyId={c.id} size={11} />
          {c.name}
        </span>
      ))}
    </div>
  );
}

const YEAR_MS = 31557600000;

function dateTicks(min: number, max: number): number[] {
  const ticks: number[] = [];
  const start = new Date(min);
  const d = new Date(start.getFullYear(), 0, 1);
  const stepMonths = max - min > 3 * YEAR_MS ? 12 : 6;
  while (d.getTime() <= max) {
    if (d.getTime() >= min) ticks.push(d.getTime());
    d.setMonth(d.getMonth() + stepMonths);
  }
  return ticks;
}

export function TimelineScatter({
  shown,
  benchmark,
  highlight,
  showLabels = false,
}: {
  shown: Model[];
  benchmark: BenchmarkKey;
  highlight: Highlight;
  showLabels?: boolean;
}) {
  const meta = benchmarkByKey.get(benchmark);
  const placed: LabelBox[] = [];
  const series = buildSeries(
    shown,
    highlight,
    (m) => new Date(m.releaseDate).getTime(),
    (m) => m.benchmarks[benchmark] ?? null
  );
  const dimming = hasActiveHighlight(highlight);
  const all = series.flatMap((s) => s.points);
  if (all.length === 0)
    return <EmptyChart label={`No models in view report ${meta?.name}.`} />;
  const minX = Math.min(...all.map((p) => p.x));
  const maxX = Math.max(...all.map((p) => p.x));

  return (
    <figure>
      <figcaption className="mb-1 text-sm font-semibold">
        {meta?.name} over time
        <span className="ml-2 font-normal text-ink-3">release date × score</span>
      </figcaption>
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 12, right: 16, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="2 4" vertical={false} />
          <XAxis
            type="number"
            dataKey="x"
            domain={[minX - YEAR_MS / 24, maxX + YEAR_MS / 24]}
            ticks={dateTicks(minX, maxX)}
            tickFormatter={(t) => {
              const d = new Date(t);
              return d.getMonth() === 0
                ? String(d.getFullYear())
                : `Jul '${String(d.getFullYear()).slice(2)}`;
            }}
            tickLine={false}
            axisLine={{ stroke: "var(--line-strong)" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            unit={meta?.unit === "%" ? "%" : undefined}
            domain={meta?.key === "lmarenaElo" ? ["auto", "auto"] : [0, 100]}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "var(--line-strong)" }}
            content={<ChartTooltip benchmark={benchmark} xLabel="date" />}
          />
          {series.map((s) => (
            <Scatter
              key={s.company.id}
              name={s.company.name}
              data={s.points}
              isAnimationActive={false}
              shape={logoShape(s.company.color, LOGO_PATHS[s.company.id]?.path, dimming, showLabels, placed)}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <CompanyLegend shown={shown} />
    </figure>
  );
}

export function CostPerfScatter({
  shown,
  benchmark,
  highlight,
  showLabels = false,
}: {
  shown: Model[];
  benchmark: BenchmarkKey;
  highlight: Highlight;
  showLabels?: boolean;
}) {
  const meta = benchmarkByKey.get(benchmark);
  const placed: LabelBox[] = [];
  const series = buildSeries(
    shown,
    highlight,
    (m) => m.pricing.inputPerMTok,
    (m) => m.benchmarks[benchmark] ?? null
  );
  const dimming = hasActiveHighlight(highlight);
  const all = series.flatMap((s) => s.points);
  if (all.length === 0)
    return (
      <EmptyChart label={`No models in view report both pricing and ${meta?.name}.`} />
    );

  return (
    <figure>
      <figcaption className="mb-1 text-sm font-semibold">
        Cost vs {meta?.name}
        <span className="ml-2 font-normal text-ink-3">
          input $/MTok (log) × score — up and left is the frontier
        </span>
      </figcaption>
      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 12, right: 16, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="2 4" vertical={false} />
          <XAxis
            type="number"
            dataKey="x"
            scale="log"
            domain={["auto", "auto"]}
            ticks={[0.1, 0.3, 1, 3, 10, 30]}
            tickFormatter={(v) => `$${v}`}
            tickLine={false}
            axisLine={{ stroke: "var(--line-strong)" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            unit={meta?.unit === "%" ? "%" : undefined}
            domain={meta?.key === "lmarenaElo" ? ["auto", "auto"] : [0, 100]}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "var(--line-strong)" }}
            content={<ChartTooltip benchmark={benchmark} xLabel="price" />}
          />
          {series.map((s) => (
            <Scatter
              key={s.company.id}
              name={s.company.name}
              data={s.points}
              isAnimationActive={false}
              shape={logoShape(s.company.color, LOGO_PATHS[s.company.id]?.path, dimming, showLabels, placed)}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <CompanyLegend shown={shown} />
    </figure>
  );
}

const PCT_KEYS: BenchmarkKey[] = [...benchmarkByKey.values()]
  .filter((b) => b.unit === "%")
  .map((b) => b.key);

export function HeadToHead({ picked }: { picked: Model[] }) {
  if (picked.length < 2)
    return (
      <EmptyChart label="Pick two to five models above to compare them across every benchmark." />
    );

  const data = PCT_KEYS.map((k) => {
    const row: Record<string, string | number | null> = {
      bench: benchmarkByKey.get(k)?.name ?? k,
    };
    for (const m of picked) row[m.id] = m.benchmarks[k] ?? null;
    return row;
  }).filter((row) => picked.some((m) => row[m.id] != null));

  return (
    <figure>
      <figcaption className="mb-1 text-sm font-semibold">
        Head to head
        <span className="ml-2 font-normal text-ink-3">
          launch-time reported scores; missing bars = not reported
        </span>
      </figcaption>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 12, right: 8, bottom: 4, left: -8 }} barCategoryGap="22%" barGap={2}>
          <CartesianGrid strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="bench" tickLine={false} axisLine={{ stroke: "var(--line-strong)" }} interval={0} />
          <YAxis unit="%" domain={[0, 100]} tickLine={false} axisLine={false} width={48} />
          <Tooltip
            cursor={{ fill: "rgba(190,205,240,0.06)" }}
            contentStyle={{
              background: "var(--surface-2)",
              border: "1px solid var(--line-strong)",
              borderRadius: 6,
              fontSize: 12,
            }}
            formatter={(v, id) => [
              `${v}%`,
              picked.find((m) => m.id === String(id))?.name ?? String(id),
            ]}
          />
          <Legend
            formatter={(id: string) => (
              <span className="mono text-[11px] text-ink-2">
                {picked.find((m) => m.id === id)?.name ?? id}
              </span>
            )}
          />
          {picked.map((m, i) => {
            const nthOfCompany = picked
              .slice(0, i)
              .filter((p) => p.company === m.company).length;
            return (
              <Bar
                key={m.id}
                dataKey={m.id}
                fill={companyColor(m.company)}
                fillOpacity={1 - Math.min(nthOfCompany, 2) * 0.35}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-72 items-center justify-center rounded border border-dashed border-line text-sm text-ink-3">
      {label}
    </div>
  );
}
