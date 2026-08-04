/** Benchmark normalisation shared by frontier-status.js and frontier-reigns.js.
 *  Extracted so the two derivations cannot drift apart. */

const BENCHMARK_KEYS = [
  "mmluPro",
  "gpqaDiamond",
  "sweBench",
  "terminalBench",
  "aime",
  "hle",
  "lmarenaElo",
  "arcAgi2",
];

const MIN_BENCHMARKS = 3;

function countBenchmarks(model) {
  return BENCHMARK_KEYS.filter((k) => model.benchmarks[k] != null).length;
}

function isRankable(model, min = MIN_BENCHMARKS) {
  return countBenchmarks(model) >= min;
}

/** Min-max normalises each benchmark across the cohort, then averages each
 *  model over whichever benchmarks it reports. Note this means two models
 *  reporting different benchmark subsets are not compared on identical
 *  ground — a documented limitation, surfaced on /info. */
function compositeScores(cohort) {
  const ranges = {};
  for (const key of BENCHMARK_KEYS) {
    const vals = cohort.map((m) => m.benchmarks[key]).filter((v) => v != null);
    if (vals.length === 0) continue;
    ranges[key] = { min: Math.min(...vals), max: Math.max(...vals) };
  }

  const scores = new Map();
  for (const m of cohort) {
    const parts = [];
    for (const key of BENCHMARK_KEYS) {
      const v = m.benchmarks[key];
      if (v == null) continue;
      const r = ranges[key];
      parts.push(r.max === r.min ? 1 : (v - r.min) / (r.max - r.min));
    }
    scores.set(m.id, parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0);
  }
  return scores;
}

module.exports = { BENCHMARK_KEYS, MIN_BENCHMARKS, countBenchmarks, isRankable, compositeScores };
