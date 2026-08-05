import type { Model } from "@/lib/types";
import {
  companyById,
  formatContext,
  formatCostPerTask,
  formatPrice,
  formatSpeed,
} from "@/lib/data";

/** The spec cells shared by the drawer and the standalone model page. `cols`
 *  differs between the two surfaces — two-up in the drawer's narrow column,
 *  wider on the page — so the caller picks the grid rather than the component
 *  guessing from a viewport it can't see. */
export function ModelStatsGrid({
  model,
  className = "",
}: {
  model: Model;
  className?: string;
}) {
  const company = companyById.get(model.company);
  // Capitalised at source, not via a CSS `capitalize` on every <dd>: that
  // class also ran over Speed's "83 tok/s" and mangled it to "83 Tok/S".
  // `status` and `modality` are the only cells this class existed for.
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const cells: [string, string][] = [
    ["Status", capitalize(model.status)],
    ["Location", company?.country ?? "Unknown"],
    ["Modality", capitalize(model.modality)],
    ["Context window", formatContext(model.contextWindow)],
    ["Max output", formatContext(model.maxOutput)],
    [
      // Effort is disclosed in the label exactly as the Cost per task cell
      // below already does, because the setting dominates the measurement.
      model.speed.effort ? `Speed (${model.speed.effort} effort)` : "Speed",
      formatSpeed(model.speed.outputTokensPerSec, model.speed.timeToFirstTokenSec),
    ],
    [
      "Price ($/MTok in / out)",
      `${formatPrice(model.pricing.inputPerMTok)} / ${formatPrice(model.pricing.outputPerMTok)}`,
    ],
    [
      model.costPerTask.effort
        ? `Cost per task (${model.costPerTask.effort} effort)`
        : "Cost per task",
      formatCostPerTask(model.costPerTask.usd),
    ],
    ["Open weights", model.openWeights ? "Yes" : "No"],
  ];

  return (
    <dl className={`mono grid gap-3 text-sm ${className}`}>
      {cells.map(([k, v]) => (
        <div key={k} className="rounded border border-line p-2">
          <dt className="text-[10px] uppercase tracking-wider text-ink-3">{k}</dt>
          <dd className="mt-0.5 text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
