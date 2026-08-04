const { test } = require("node:test");
const assert = require("node:assert/strict");
const { compositeScores, countBenchmarks, isRankable } = require("./composite.js");

const mk = (id, benchmarks) => ({ id, benchmarks });

test("countBenchmarks ignores nulls", () => {
  assert.equal(countBenchmarks(mk("a", { aime: 1, hle: null, sweBench: 2 })), 2);
});

test("isRankable enforces the minimum", () => {
  const m = mk("a", { aime: 1, hle: 2 });
  assert.equal(isRankable(m, 3), false);
  assert.equal(isRankable(m, 2), true);
});

test("compositeScores normalises to 0..1 within the cohort", () => {
  const cohort = [
    mk("low", { aime: 0, hle: 0, sweBench: 0 }),
    mk("high", { aime: 100, hle: 100, sweBench: 100 }),
  ];
  const s = compositeScores(cohort);
  assert.equal(s.get("low"), 0);
  assert.equal(s.get("high"), 1);
});

test("a single-member cohort scores 1 rather than dividing by zero", () => {
  const s = compositeScores([mk("only", { aime: 42, hle: 7, sweBench: 9 })]);
  assert.equal(s.get("only"), 1);
});

test("models are scored only on benchmarks they report", () => {
  const cohort = [
    mk("full", { aime: 100, hle: 0, sweBench: 50 }),
    mk("partial", { aime: 100, hle: null, sweBench: null }),
  ];
  const s = compositeScores(cohort);
  // "partial" reports only aime, where it ties the max, so it scores 1.
  assert.equal(s.get("partial"), 1);
});
