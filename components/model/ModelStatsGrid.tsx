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
  const cells: [string, string][] = [
    ["Status", model.status],
    ["Location", company?.country ?? "Unknown"],
    ["Modality", model.modality],
    ["Context window", formatContext(model.contextWindow)],
    ["Max output", formatContext(model.maxOutput)],
    ["Speed", formatSpeed(model.speed.outputTokensPerSec, model.speed.timeToFirstTokenSec)],
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
          <dd className="mt-0.5 capitalize text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
