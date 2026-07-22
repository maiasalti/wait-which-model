#!/usr/bin/env node
/**
 * Recomputes "frontier" status per protocols/FRONTIER_STATUS_PROTOCOL.md.
 *
 * Two ways a model qualifies as "frontier":
 *
 *   A. Major-lab recency override: if the model is from a lab in MAJOR_LABS
 *      and is the single most recent release in its (company, tier) group,
 *      released within MAJOR_LAB_RECENCY_MONTHS, it's automatically
 *      "frontier" — no benchmark data required. These labs' newest flagship
 *      releases are trusted to be near-SOTA even before benchmarks are
 *      published, and a model must never lose frontier status just because
 *      data isn't published yet.
 *
 *   B. General rule, for everyone else, within its tier (flagship / balanced
 *      / fast):
 *      1. Released within RECENCY_MONTHS of today, AND
 *      2. Has at least MIN_BENCHMARKS non-null benchmark scores (else it's
 *         "unrankable" and left untouched — needs a stats-filler pass), AND
 *      3. Composite score is within CAPABILITY_THRESHOLD of the best
 *         composite score among rankable candidates in its tier.
 *
 * Everything else becomes "superseded". Models already "deprecated" are
 * never touched — that status is a manual signal (lab retired the model)
 * this script has no way to infer.
 *
 * Usage:
 *   node scripts/frontier-status.js            # print proposed changes only
 *   node scripts/frontier-status.js --apply     # write changes to models.json
 */

const fs = require("fs");
const path = require("path");

const RECENCY_MONTHS = 9;
const CAPABILITY_THRESHOLD = 0.85; // must be within 15% of the tier's top composite score
const MIN_BENCHMARKS = 3; // non-null benchmarks required to be rankable
const MAJOR_LABS = ["openai", "anthropic", "google", "meta"];
const MAJOR_LAB_RECENCY_MONTHS = 3;

const MODELS_PATH = path.join(__dirname, "..", "data", "models.json");
const BENCHMARK_KEYS = [
  "mmluPro",
  "gpqaDiamond",
  "sweBench",
  "aime",
  "hle",
  "lmarenaElo",
  "arcAgi2",
];

function monthsAgo(dateStr, now) {
  const d = new Date(dateStr);
  return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
}

function main() {
  const apply = process.argv.includes("--apply");
  const now = new Date();
  const models = JSON.parse(fs.readFileSync(MODELS_PATH, "utf8"));

  const byTier = new Map();
  for (const m of models) {
    if (!byTier.has(m.tier)) byTier.set(m.tier, []);
    byTier.get(m.tier).push(m);
  }

  const changes = []; // { id, from, to, reason }
  const unrankable = []; // { id, tier, reason }
  const nextStatus = new Map(); // id -> status (only for models this script decides)
  const overridden = new Set(); // ids decided by the major-lab override, skip general rule

  // A. Major-lab recency override, computed per (company, tier).
  const byCompanyTier = new Map();
  for (const m of models) {
    if (!MAJOR_LABS.includes(m.company)) continue;
    const key = `${m.company}::${m.tier}`;
    if (!byCompanyTier.has(key)) byCompanyTier.set(key, []);
    byCompanyTier.get(key).push(m);
  }
  for (const group of byCompanyTier.values()) {
    const newest = group.reduce((a, b) => (a.releaseDate > b.releaseDate ? a : b));
    if (newest.status === "deprecated") continue;
    if (monthsAgo(newest.releaseDate, now) > MAJOR_LAB_RECENCY_MONTHS) continue;
    overridden.add(newest.id);
    nextStatus.set(newest.id, "frontier");
    if (newest.status !== "frontier") {
      changes.push({
        id: newest.id,
        from: newest.status,
        to: "frontier",
        reason: `most recent ${newest.company} release in its tier, within ${MAJOR_LAB_RECENCY_MONTHS}mo (major-lab override)`,
      });
    }
  }

  // B. General rule for everything not covered by the override above.
  for (const [tier, fullGroup] of byTier) {
    const group = fullGroup.filter((m) => !overridden.has(m.id));
    const candidates = group.filter((m) => monthsAgo(m.releaseDate, now) <= RECENCY_MONTHS);
    const rankable = candidates.filter(
      (m) => BENCHMARK_KEYS.filter((k) => m.benchmarks[k] != null).length >= MIN_BENCHMARKS
    );

    // Per-benchmark min/max across rankable candidates in this tier, for normalization.
    const ranges = {};
    for (const key of BENCHMARK_KEYS) {
      const vals = rankable.map((m) => m.benchmarks[key]).filter((v) => v != null);
      if (vals.length === 0) continue;
      ranges[key] = { min: Math.min(...vals), max: Math.max(...vals) };
    }

    const composite = new Map(); // id -> score
    for (const m of rankable) {
      const scores = [];
      for (const key of BENCHMARK_KEYS) {
        const v = m.benchmarks[key];
        if (v == null) continue;
        const r = ranges[key];
        scores.push(r.max === r.min ? 1 : (v - r.min) / (r.max - r.min));
      }
      composite.set(m.id, scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    const topScore = rankable.length ? Math.max(...rankable.map((m) => composite.get(m.id))) : 0;

    for (const m of group) {
      if (m.status === "deprecated") continue; // manual-only, never auto-touched

      const inWindow = monthsAgo(m.releaseDate, now) <= RECENCY_MONTHS;
      const isRankable = rankable.includes(m);

      if (inWindow && !isRankable) {
        unrankable.push({
          id: m.id,
          tier,
          reason: `only ${BENCHMARK_KEYS.filter((k) => m.benchmarks[k] != null).length}/${MIN_BENCHMARKS} required benchmarks — needs stats-filler pass`,
        });
        continue; // leave status untouched, don't factor into other decisions
      }

      let decided;
      if (!inWindow) {
        decided = "superseded";
      } else {
        decided = composite.get(m.id) >= topScore * CAPABILITY_THRESHOLD ? "frontier" : "superseded";
      }

      nextStatus.set(m.id, decided);
      if (decided !== m.status) {
        changes.push({
          id: m.id,
          from: m.status,
          to: decided,
          reason: !inWindow
            ? `released ${monthsAgo(m.releaseDate, now)}mo ago (> ${RECENCY_MONTHS}mo recency window)`
            : `composite ${composite.get(m.id).toFixed(2)} vs tier top ${topScore.toFixed(2)} (need >= ${(CAPABILITY_THRESHOLD * topScore).toFixed(2)})`,
        });
      }
    }
  }

  if (changes.length === 0) {
    console.log("No status changes needed.");
  } else {
    console.log(`Proposed status changes (${changes.length}):`);
    for (const c of changes) {
      console.log(`  ${c.id.padEnd(24)} ${c.from} -> ${c.to}   (${c.reason})`);
    }
  }

  if (unrankable.length > 0) {
    console.log(`\nSkipped — insufficient benchmark data to rank (${unrankable.length}):`);
    for (const u of unrankable) {
      console.log(`  ${u.id.padEnd(24)} [${u.tier}] ${u.reason}`);
    }
  }

  if (apply && changes.length > 0) {
    const updated = models.map((m) =>
      nextStatus.has(m.id) ? { ...m, status: nextStatus.get(m.id) } : m
    );
    fs.writeFileSync(MODELS_PATH, JSON.stringify(updated, null, 2) + "\n");
    console.log(`\nApplied ${changes.length} change(s) to ${path.relative(process.cwd(), MODELS_PATH)}.`);
  } else if (changes.length > 0) {
    console.log("\nRun again with --apply to write these changes.");
  }
}

main();
