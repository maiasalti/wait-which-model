#!/usr/bin/env node
/**
 * Derives how long each model held the top of its tier, into
 * data/frontier-reigns.json.
 *
 * This is a RECONSTRUCTION, not an observed log: frontier-status.js keeps no
 * history, so reigns are inferred from release dates and benchmark scores. The
 * composite is min-max normalised across the tier cohort and averaged over
 * whichever benchmarks each model reports, so models reporting different
 * benchmark subsets are not compared on identical ground. /info says so.
 *
 * Re-run after any benchmark data changes — reigns depend on them.
 *
 * Usage:
 *   node scripts/frontier-reigns.js           # print the derived reigns
 *   node scripts/frontier-reigns.js --apply   # write data/frontier-reigns.json
 */
const fs = require("fs");
const path = require("path");
const { isRankable, compositeScores } = require("./lib/composite.js");

const MODELS_PATH = path.join(__dirname, "..", "data", "models.json");
const REIGNS_PATH = path.join(__dirname, "..", "data", "frontier-reigns.json");

/** @returns {{modelId,tier,start,end,dethronedBy,composite}[]} */
function computeReigns(models) {
  const byTier = new Map();
  for (const m of models) {
    if (!byTier.has(m.tier)) byTier.set(m.tier, []);
    byTier.get(m.tier).push(m);
  }

  const reigns = [];
  for (const [tier, group] of byTier) {
    // Every model that ever existed in the tier, including deprecated ones —
    // a retired model still held the frontier while it was alive.
    const rankable = group.filter((m) => isRankable(m));
    if (rankable.length === 0) continue;

    const scores = compositeScores(rankable);
    const ordered = rankable
      .slice()
      .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.id.localeCompare(b.id));

    // Group by release date so a same-day cohort is judged as a unit: only the
    // day's strongest contender can take the crown. Walking same-day models one
    // at a time would crown a weaker sibling and dethrone it the same day,
    // fabricating a zero-length reign it never actually held.
    const byDate = new Map();
    for (const m of ordered) {
      if (!byDate.has(m.releaseDate)) byDate.set(m.releaseDate, []);
      byDate.get(m.releaseDate).push(m);
    }

    let champion = null;
    for (const [releaseDate, cohort] of byDate) {
      // Strict `>` keeps the lowest id on a score tie, matching `ordered`.
      const best = cohort.reduce((a, b) => (scores.get(b.id) > scores.get(a.id) ? b : a));
      if (champion === null || scores.get(best.id) > scores.get(champion.modelId)) {
        if (champion) {
          champion.end = releaseDate;
          champion.dethronedBy = best.id;
        }
        champion = {
          modelId: best.id,
          tier,
          start: releaseDate,
          end: null,
          dethronedBy: null,
          composite: Number(scores.get(best.id).toFixed(4)),
        };
        reigns.push(champion);
      }
    }
  }
  return reigns;
}

function main() {
  const apply = process.argv.includes("--apply");
  const models = JSON.parse(fs.readFileSync(MODELS_PATH, "utf8"));
  const reigns = computeReigns(models);

  for (const r of reigns) {
    console.log(
      `  ${r.tier.padEnd(9)} ${r.modelId.padEnd(24)} ${r.start} → ${r.end ?? "current"}` +
        (r.dethronedBy ? `  (dethroned by ${r.dethronedBy})` : "")
    );
  }
  console.log(`\n${reigns.length} reign(s) across ${new Set(reigns.map((r) => r.tier)).size} tier(s).`);

  if (apply) {
    fs.writeFileSync(REIGNS_PATH, JSON.stringify(reigns, null, 2) + "\n");
    console.log(`Wrote ${path.relative(process.cwd(), REIGNS_PATH)}.`);
  } else {
    console.log("Run again with --apply to write data/frontier-reigns.json.");
  }
}

if (require.main === module) main();

module.exports = { computeReigns };
