"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  DefaultZIndexes,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZIndexLayer,
  usePlotArea,
  useXAxisInverseScale,
  useXAxisScale,
  useYAxisScale,
} from "recharts";
import { activeBenchmarks, benchmarkByKey, companyColor, modelCompanies, companyName, formatCostPerTask, formatDate } from "@/lib/data";
import { hasActiveHighlight, isHighlighted } from "@/lib/filter";
import { doublingMonths, evalFit, fitExponential, monthlyCounts, type ExpFit } from "@/lib/projection";
import { useId, useState } from "react";
import { LOGO_PATHS } from "@/lib/logos";
import { CompanyLogo } from "./CompanyLogo";
import type { BenchmarkKey, Highlight, Model } from "@/lib/types";

const DIM = 0.14;
const MARK = 15; // logo mark size in px
const HIT = 12; // hover target radius in px, independent of the mark's own geometry

/** Scatter mark: the company logo, tinted in the company color, dimmed when not highlighted.
 *
 * Recharts puts the tooltip's mouse handlers on a <g> wrapping this shape, and a <g> only
 * receives pointer events where a child actually paints. Hovering a bare logo path therefore
 * means hitting its filled pixels — a target that is both tiny and full of holes, so the
 * tooltip misses between letter strokes. The transparent circle underneath gives every mark
 * one solid, predictable hit area. It needs fill="transparent" rather than fill="none":
 * "none" is not hit-tested. */
function logoShape(
  color: string,
  logo: (typeof LOGO_PATHS)[string] | undefined,
  dimming: boolean,
  size: number = MARK
) {
  return function LogoMark(props: unknown) {
    const { cx, cy, payload } = props as { cx?: number; cy?: number; payload?: Point };
    if (cx == null || cy == null) return <g />;
    const opacity = dimming && payload && !payload.hi ? DIM : 0.95;
    const hitArea = <circle cx={cx} cy={cy} r={HIT} fill="transparent" />;
    if (!logo)
      return (
        <g>
          {hitArea}
          <circle cx={cx} cy={cy} r={5} fill={color} fillOpacity={opacity} />
        </g>
      );
    return (
      <g>
        {hitArea}
        <svg
          x={cx - size / 2}
          y={cy - size / 2}
          width={size}
          height={size}
          viewBox={logo.viewBox ?? "0 0 24 24"}
          opacity={opacity}
          overflow="visible"
        >
          {logo.parts ? (
            logo.parts.map((part) => <path key={part.path} d={part.path} fill={part.color} />)
          ) : logo.stroke ? (
            <path
              d={logo.path}
              fill="none"
              stroke={color}
              strokeWidth={logo.stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path d={logo.path} fill={color} fillRule={logo.fillRule} />
          )}
        </svg>
      </g>
    );
  };
}

interface LabelBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Candidate label offsets: rings of increasing radius around the mark, so a dense
 * cluster still has somewhere to search before giving up on a clean placement. */
const LABEL_CANDIDATES: { dx: number; dy: number; anchor: "start" | "middle" | "end" }[] = [];
for (const radius of [11, 17, 24, 32, 42, 54, 68, 84]) {
  for (const angleDeg of [0, 45, 90, 135, 180, 225, 270, 315]) {
    const rad = (angleDeg * Math.PI) / 180;
    const dx = Math.round(Math.cos(rad) * radius);
    const dy = Math.round(Math.sin(rad) * radius);
    const anchor = dx > 3 ? "start" : dx < -3 ? "end" : "middle";
    LABEL_CANDIDATES.push({ dx, dy, anchor });
  }
}

function overlapArea(a: LabelBox, b: LabelBox): number {
  const w = Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1));
  const h = Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
  return w * h;
}

/** Shifts a label box back inside the plot area so corner/edge labels don't render
 * partly off-canvas and get clipped by the chart's container. */
function clampBox(box: LabelBox, bounds: LabelBox): LabelBox {
  const PAD = 4;
  let dx = 0;
  let dy = 0;
  if (box.x1 < bounds.x1 + PAD) dx = bounds.x1 + PAD - box.x1;
  else if (box.x2 > bounds.x2 - PAD) dx = bounds.x2 - PAD - box.x2;
  if (box.y1 < bounds.y1 + PAD) dy = bounds.y1 + PAD - box.y1;
  else if (box.y2 > bounds.y2 - PAD) dy = bounds.y2 - PAD - box.y2;
  if (dx === 0 && dy === 0) return box;
  return { x1: box.x1 + dx, y1: box.y1 + dy, x2: box.x2 + dx, y2: box.y2 + dy };
}

function labelBox(cx: number, cy: number, dx: number, dy: number, anchor: string, width: number): LabelBox {
  const height = 13;
  let x1: number;
  if (anchor === "start") x1 = cx + dx;
  else if (anchor === "end") x1 = cx + dx - width;
  else x1 = cx + dx - width / 2;
  return { x1, y1: cy + dy - height / 2, x2: x1 + width, y2: cy + dy + height / 2 };
}

/** Finds a label position near (cx, cy) that overlaps the given obstacles as
 * little as possible. Every label always gets placed — in a very dense cluster
 * where no candidate is fully clear, picks whichever overlaps least rather than
 * dropping the label (a missing label reads as a bug, not restraint). */
function placeLabel(cx: number, cy: number, text: string, obstacles: LabelBox[], bounds: LabelBox) {
  const width = text.length * 5.9 + 8;
  let best = LABEL_CANDIDATES[0];
  let bestBox = labelBox(cx, cy, best.dx, best.dy, best.anchor, width);
  let bestOverlap = Infinity;
  for (const c of LABEL_CANDIDATES) {
    const box = clampBox(labelBox(cx, cy, c.dx, c.dy, c.anchor, width), bounds);
    const overlap = obstacles.reduce((sum, o) => sum + overlapArea(o, box), 0);
    if (overlap < bestOverlap) {
      best = c;
      bestBox = box;
      bestOverlap = overlap;
      if (overlap === 0) break;
    }
  }
  const textX = best.anchor === "start" ? bestBox.x1 : best.anchor === "end" ? bestBox.x2 : (bestBox.x1 + bestBox.x2) / 2;
  const textY = (bestBox.y1 + bestBox.y2) / 2;
  return { x: textX, y: textY, anchor: best.anchor, box: bestBox };
}

/**
 * Renders every point's label in a single pass, using Recharts' own axis scales
 * to get every mark's exact pixel position up front — so each label can avoid
 * every OTHER mark on the chart, not just its own. Must render as a child of the
 * chart (ScatterChart) so the axis-scale hooks have chart context to read from.
 */
function LabelLayer({ points, dimming }: { points: Point[]; dimming: boolean }) {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  const plotArea = usePlotArea();
  if (!xScale || !yScale || !plotArea) return null;

  const bounds: LabelBox = {
    x1: plotArea.x,
    y1: plotArea.y,
    x2: plotArea.x + plotArea.width,
    y2: plotArea.y + plotArea.height,
  };
  const markPad = MARK / 2 + 3;
  const resolved = points
    .map((p) => {
      const cx = xScale(p.x);
      const cy = yScale(p.y);
      return cx == null || cy == null ? null : { p, cx, cy };
    })
    .filter((r): r is { p: Point; cx: number; cy: number } => r != null);

  const markBoxes: LabelBox[] = resolved.map(({ cx, cy }) => ({
    x1: cx - markPad,
    y1: cy - markPad,
    x2: cx + markPad,
    y2: cy + markPad,
  }));

  const placedLabels: LabelBox[] = [];
  const labels = resolved.map(({ p, cx, cy }, i) => {
    const obstacles = [...markBoxes.slice(0, i), ...markBoxes.slice(i + 1), ...placedLabels];
    const label = placeLabel(cx, cy, p.model.name, obstacles, bounds);
    placedLabels.push(label.box);
    return { p, label };
  });

  return (
    <g>
      {labels.map(({ p, label }) => (
        <g key={p.model.id} opacity={dimming && !p.hi ? DIM : 0.95}>
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
            {p.model.name}
          </text>
        </g>
      ))}
    </g>
  );
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
  return modelCompanies
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
          : `${formatCostPerTask(m.costPerTask?.usd)}/task · ${formatDate(m.releaseDate)}`}
      </p>
      <p className="mono text-ink-3">{companyName(m.company)}</p>
    </div>
  );
}

function CompanyLegend({ shown }: { shown: Model[] }) {
  const present = modelCompanies.filter((c) => shown.some((m) => m.company === c.id));
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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STACK_STEP = 19; // px per stacked release at full logo size
const PROJ_HEADROOM = 1.25;
const MAX_RELEASES_HEIGHT = 460; // keeps the chart within one screen, projection or not

function ReleaseTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Point }> }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  const m = p.model;
  return (
    <div className="rounded border border-line-strong bg-surface-2 p-3 text-xs shadow-xl">
      <p className="flex items-center gap-1.5 font-semibold text-ink">
        <CompanyLogo companyId={m.company} size={12} />
        {m.name}
      </p>
      <p className="mono mt-1 text-ink-2">{formatDate(m.releaseDate)}</p>
      <p className="mono text-ink-3">{companyName(m.company)}</p>
    </div>
  );
}

const HORIZON = 6; // months the projection extends past the last month in view

/** Month offset (fractional) since the fit's first month → x timestamp, matching the
 *  15th-of-month placement of the stacked marks. */
function monthTs(firstIdx: number, off: number): number {
  const i = firstIdx + Math.floor(off);
  const t0 = Date.UTC(Math.floor(i / 12), i % 12, 15);
  const t1 = Date.UTC(Math.floor((i + 1) / 12), (i + 1) % 12, 15);
  return t0 + (t1 - t0) * (off - Math.floor(off));
}

/** Draws the fitted curve: solid across the months fitted, dashed for the projection.
 *  Hovering the dashed part shows the projected value for that month. */
function ProjectionCurve({ fit, firstIdx, lastOff }: { fit: ExpFit; firstIdx: number; lastOff: number }) {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  const xInverse = useXAxisInverseScale();
  const plot = usePlotArea();
  const [hoverOff, setHoverOff] = useState<number | null>(null);
  const clipId = useId();
  if (!xScale || !yScale || !xInverse || !plot) return null;
  const end = lastOff + HORIZON;
  const path = (from: number, to: number) => {
    const pts: string[] = [];
    for (let off = from; off <= to + 1e-9; off += 0.25) {
      const px = xScale(monthTs(firstIdx, off));
      const py = yScale(evalFit(fit, off));
      if (px != null && py != null) pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return pts.length ? `M${pts.join("L")}` : "";
  };

  // pixel x → month offset, inverting monthTs one month at a time
  const offAt = (px: number): number => {
    const ts = Number(xInverse(px));
    let i = Math.floor((ts - monthTs(firstIdx, 0)) / (YEAR_MS / 12));
    i = Math.max(0, Math.min(Math.ceil(end), i));
    while (i > 0 && monthTs(firstIdx, i) > ts) i--;
    while (i < end && monthTs(firstIdx, i + 1) <= ts) i++;
    const t0 = monthTs(firstIdx, i);
    const t1 = monthTs(firstIdx, i + 1);
    return Math.max(lastOff, Math.min(end, i + (ts - t0) / (t1 - t0)));
  };
  const onMove = (e: React.MouseEvent<SVGPathElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    setHoverOff(offAt(pt.x));
  };

  let hover: React.ReactNode = null;
  if (hoverOff != null) {
    const month = Math.round(hoverOff);
    const idx = firstIdx + month;
    const value = evalFit(fit, month);
    const px = xScale(monthTs(firstIdx, month));
    const py = yScale(value);
    if (px != null && py != null && py >= plot.y) {
      const projected = month > lastOff;
      const line1 = `${MONTHS[idx % 12]} ${Math.floor(idx / 12)}`;
      const line2 = `${projected ? "projected" : "fit"} ≈ ${value.toFixed(1)} releases`;
      const w = Math.max(line1.length, line2.length) * 6.8 + 18;
      const h = 36;
      const bx = px + 10 + w > plot.x + plot.width ? px - 10 - w : px + 10;
      const by = Math.max(plot.y, Math.min(plot.y + plot.height - h, py - h - 6));
      hover = (
        <g pointerEvents="none">
          <circle cx={px} cy={py} r={4} fill="var(--accent)" />
          <rect x={bx} y={by} width={w} height={h} rx={3} fill="var(--surface-2)" stroke="var(--line-strong)" />
          <text x={bx + 8} y={by + 15} fontSize={11} fontWeight={600} fill="var(--ink)">
            {line1}
          </text>
          <text
            x={bx + 8}
            y={by + 29}
            fontSize={10.5}
            fontFamily="var(--font-plex-mono), ui-monospace, monospace"
            fill="var(--ink-2)"
          >
            {line2}
          </text>
        </g>
      );
    }
  }

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={plot.x} y={plot.y} width={plot.width} height={plot.height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path d={path(0, lastOff)} fill="none" stroke="var(--accent)" strokeWidth={1.5} opacity={0.8} pointerEvents="none" />
      <path
        d={path(lastOff, end)}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.5}
        strokeDasharray="5 4"
        opacity={0.8}
        pointerEvents="none"
      />
      {/* wide invisible hit area along the projected (dashed) part only, so it never
          sits over a company logo and steals that logo's tooltip */}
      <path
        d={path(lastOff, end)}
        fill="none"
        stroke="transparent"
        strokeWidth={16}
        pointerEvents="stroke"
        style={{ cursor: "crosshair" }}
        onMouseMove={onMove}
        onMouseLeave={() => setHoverOff(null)}
      />
      </g>
      {hover && <ZIndexLayer zIndex={DefaultZIndexes.label}>{hover}</ZIndexLayer>}
    </g>
  );
}

const monthLabel = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return `${MONTHS[m - 1]} '${String(y).slice(2)}`;
};

/** Model releases per month: one column per month, one company logo per release stacked
 *  upward in release order, so every release has its own slot and none overlap. Taller
 *  columns = busier months. Reads the models in view, so the filter rail still applies.
 *  "Show projection" overlays an exponential fit y = k·e^(ax) and extends it HORIZON months. */
export function ReleasesTimeline({
  shown,
  highlight,
  showLabels = false,
}: {
  shown: Model[];
  highlight: Highlight;
  showLabels?: boolean;
}) {
  const [projecting, setProjecting] = useState(false);
  const order = [...shown].sort(
    (a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.name.localeCompare(b.name)
  );
  const slot = new Map<string, { x: number; y: number }>();
  const perMonth = new Map<string, number>();
  for (const m of order) {
    const [yr, mo] = m.releaseDate.split("-").map(Number);
    const key = `${yr}-${mo}`;
    const n = (perMonth.get(key) ?? 0) + 1;
    perMonth.set(key, n);
    slot.set(m.id, { x: Date.UTC(yr, mo - 1, 15), y: n });
  }
  const series = buildSeries(
    shown,
    highlight,
    (m) => slot.get(m.id)?.x ?? null,
    (m) => slot.get(m.id)?.y ?? null
  );
  const dimming = hasActiveHighlight(highlight);
  const all = series.flatMap((s) => s.points);
  if (all.length === 0) return <EmptyChart label="No models in view." />;
  const minX = Math.min(...all.map((p) => p.x));
  const dataMaxX = Math.max(...all.map((p) => p.x));
  const tallest = Math.max(...perMonth.values());

  // Projection: fit on zero-filled monthly counts, leaving out the current month
  // because it is still incomplete and would drag the curve down.
  let proj: null | {
    fit: ExpFit;
    firstIdx: number;
    lastOff: number;
    first: string;
    last: string;
    excluded: string | null;
    endKey: string;
    endValue: number;
  } = null;
  if (projecting) {
    const now = new Date();
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const dates = order.map((m) => m.releaseDate);
    const counts = monthlyCounts(dates, current);
    const fit = counts.length ? fitExponential(counts) : null;
    if (fit) {
      const [fy, fm] = dates[0].split("-").map(Number);
      const firstIdx = fy * 12 + fm - 1;
      const [ly, lm] = dates[dates.length - 1].split("-").map(Number);
      const lastOff = ly * 12 + lm - 1 - firstIdx;
      const endIdx = firstIdx + lastOff + HORIZON;
      proj = {
        fit,
        firstIdx,
        lastOff,
        first: counts[0].key,
        last: counts[counts.length - 1].key,
        excluded: dates.some((d) => d.startsWith(current)) ? current : null,
        endKey: `${Math.floor(endIdx / 12)}-${String((endIdx % 12) + 1).padStart(2, "0")}`,
        endValue: evalFit(fit, lastOff + HORIZON),
      };
    }
  }

  const maxX = proj ? monthTs(proj.firstIdx, proj.lastOff + HORIZON) : dataMaxX;
  // The projection may lift the axis to at most PROJ_HEADROOM × the busiest real month;
  // beyond that the dashed curve runs off the top (clipped) so the logos stay legible.
  const top = Math.max(
    tallest,
    proj ? Math.min(Math.ceil(proj.endValue), Math.ceil(tallest * PROJ_HEADROOM)) : 0
  );
  const MARGIN_Y = 24 + 4 + 30; // chart margins + x-axis
  // Height grows with the tallest stack up to a cap; past it, the logos shrink so each
  // release still gets its own slot (busy views and the projection use smaller marks).
  const height = Math.max(300, Math.min(MAX_RELEASES_HEIGHT, (top + 1) * STACK_STEP + MARGIN_Y));
  const pxPerRelease = (height - MARGIN_Y) / (top + 1);
  const markSize = Math.max(6, Math.min(MARK, Math.floor(pxPerRelease * 0.85)));
  const yStep = [1, 2, 5, 10, 20, 50, 100].find((st) => top / st <= 6) ?? 200;
  const yTicks = Array.from({ length: Math.floor(top / yStep) }, (_, i) => (i + 1) * yStep);
  const spanMonths = (maxX - minX) / (YEAR_MS / 12);
  const ticks =
    spanMonths <= 18
      ? Array.from({ length: Math.round(spanMonths) + 1 }, (_, i) => {
          const d = new Date(minX);
          return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + i, 15);
        })
      : dateTicks(minX, maxX);

  return (
    <figure>
      <figcaption className="mb-1 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
        Model releases per month
        <span className="font-normal text-ink-3">one mark per release, stacked in release order</span>
        <button
          onClick={() => setProjecting((v) => !v)}
          aria-pressed={projecting}
          className={`mono ml-auto rounded border px-2.5 py-1 text-[11px] font-normal uppercase tracking-wider transition-colors ${
            projecting
              ? "border-accent/60 bg-accent/15 text-ink"
              : "border-line text-ink-2 hover:text-ink"
          }`}
        >
          {projecting ? "Hide projection" : "Show projection"}
        </button>
      </figcaption>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 24, right: 56, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="2 4" vertical={false} />
          <XAxis
            type="number"
            dataKey="x"
            domain={[minX - YEAR_MS / 24, maxX + YEAR_MS / 24]}
            ticks={ticks}
            tickFormatter={(t) => {
              const d = new Date(t);
              if (spanMonths <= 18) return `${MONTHS[d.getUTCMonth()]} '${String(d.getUTCFullYear()).slice(2)}`;
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
            domain={[0.4, top + 0.6]}
            allowDataOverflow
            ticks={yTicks}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip cursor={false} content={<ReleaseTooltip />} />
          {series.map((s) => (
            <Scatter
              key={s.company.id}
              name={s.company.name}
              data={s.points}
              isAnimationActive={false}
              shape={logoShape(companyColor(s.company.id), LOGO_PATHS[s.company.id], dimming, markSize)}
            />
          ))}
          {showLabels && <LabelLayer points={all} dimming={dimming} />}
          {proj && <ProjectionCurve fit={proj.fit} firstIdx={proj.firstIdx} lastOff={proj.lastOff} />}
        </ScatterChart>
      </ResponsiveContainer>
      {projecting && (
        <p className="mono px-1 pt-1 text-[11px] leading-relaxed text-ink-3">
          {proj ? (
            <>
              <span className="text-ink-2">
                y = {proj.fit.k.toPrecision(3)} · e^({proj.fit.a.toFixed(3)}x)
              </span>
              , x = months since {monthLabel(proj.first)}
              {doublingMonths(proj.fit) != null &&
                ` · doubles every ${doublingMonths(proj.fit)!.toFixed(1)} months`}
              {` · projected ${monthLabel(proj.endKey)}: ~${Math.round(proj.endValue)} releases/month`}
              . Fitted to {monthLabel(proj.first)}–{monthLabel(proj.last)}, months with no releases
              included
              {proj.excluded && `; ${monthLabel(proj.excluded)} left out as still incomplete`}. Solid =
              fit, dashed = projection. Counts only the models in view and tracked on this site.
            </>
          ) : (
            "Not enough months in view to fit a curve."
          )}
        </p>
      )}
      <CompanyLegend shown={shown} />
    </figure>
  );
}

function median(vals: number[]): number {
  const v = [...vals].sort((a, b) => a - b);
  const mid = v.length >> 1;
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

/** Log-axis ticks at 1-3-10 steps covering [min, max]. */
function logTicks(min: number, max: number): number[] {
  const ticks: number[] = [];
  for (let e = Math.floor(Math.log10(min)) - 1; e <= Math.ceil(Math.log10(max)); e++) {
    for (const m of [1, 3]) {
      const t = Number((m * 10 ** e).toPrecision(2));
      if (t >= min / 1.5 && t <= max * 1.5) ticks.push(t);
    }
  }
  return ticks;
}

/** Names each of the four quadrants in its outer corner. Rendered inside the chart so
 *  it can read the plot area; sits under the marks so it never hides a model. */
function QuadrantLabels() {
  const plot = usePlotArea();
  if (!plot) return null;
  const PAD = 8;
  const left = plot.x + PAD;
  const right = plot.x + plot.width - PAD;
  const top = plot.y + PAD + 9;
  const bottom = plot.y + plot.height - PAD;
  const style = {
    fontSize: 10,
    fontFamily: "var(--font-plex-mono), ui-monospace, monospace",
    letterSpacing: "0.08em",
    fill: "var(--ink-3)",
  } as const;
  return (
    <g aria-hidden>
      <text x={left} y={top} textAnchor="start" style={{ ...style, fill: "var(--good)" }}>
        CHEAPER · STRONGER
      </text>
      <text x={right} y={top} textAnchor="end" style={style}>
        PRICIER · STRONGER
      </text>
      <text x={left} y={bottom} textAnchor="start" style={style}>
        CHEAPER · WEAKER
      </text>
      <text x={right} y={bottom} textAnchor="end" style={{ ...style, fill: "var(--bad)" }}>
        PRICIER · WEAKER
      </text>
    </g>
  );
}

/** Cost vs intelligence as a four-quadrant chart: x = Artificial Analysis cost per task
 *  (log), y = the selected benchmark, split at the median of each among the models in
 *  view. Top-left is the best value. */
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
  const series = buildSeries(
    shown,
    highlight,
    (m) => m.costPerTask?.usd ?? null,
    (m) => m.benchmarks[benchmark] ?? null
  );
  const dimming = hasActiveHighlight(highlight);
  const all = series.flatMap((s) => s.points);
  if (all.length === 0)
    return (
      <EmptyChart label={`No models in view have both a cost per task and ${meta?.name}.`} />
    );
  const xs = all.map((p) => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const midX = median(xs);
  const midY = median(all.map((p) => p.y));
  const ticks = logTicks(minX, maxX);

  return (
    <figure>
      <figcaption className="mb-1 text-sm font-semibold">
        Cost vs {meta?.name}
        <span className="ml-2 font-normal text-ink-3">
          cost per task (log) × score — split at the median of each; top left is best value
        </span>
      </figcaption>
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 24, right: 56, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="2 4" vertical={false} />
          <XAxis
            type="number"
            dataKey="x"
            scale="log"
            domain={[minX / 1.4, maxX * 1.4]}
            allowDataOverflow
            ticks={ticks}
            tickFormatter={(v) => `$${v}`}
            tickLine={false}
            axisLine={{ stroke: "var(--line-strong)" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            unit={meta?.unit === "%" ? "%" : undefined}
            domain={meta?.unit === "Elo" ? ["auto", "auto"] : [0, 100]}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <QuadrantLabels />
          <ReferenceLine x={midX} stroke="var(--line-strong)" strokeDasharray="4 3" />
          <ReferenceLine y={midY} stroke="var(--line-strong)" strokeDasharray="4 3" />
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
              shape={logoShape(companyColor(s.company.id), LOGO_PATHS[s.company.id], dimming)}
            />
          ))}
          {showLabels && <LabelLayer points={all} dimming={dimming} />}
        </ScatterChart>
      </ResponsiveContainer>
      <p className="mono px-1 pt-1 text-[11px] text-ink-3">
        Dashed lines: median cost {formatCostPerTask(midX)}/task · median score {midY}
        {meta?.unit === "%" ? "%" : ""}. Only models Artificial Analysis has priced per task appear.
      </p>
      <CompanyLegend shown={all.map((p) => p.model)} />
    </figure>
  );
}

const PCT_KEYS: BenchmarkKey[] = activeBenchmarks
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
            cursor={{ fill: "var(--cursor-fill)" }}
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
