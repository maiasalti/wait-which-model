const { test } = require("node:test");
const assert = require("node:assert/strict");
const { BENCHMARK_KEYS, compositeScores, countBenchmarks, isRankable } = require("./composite.js");
const benchmarkMeta = require("../../data/benchmarks.json");

const mk = (id, benchmarks) => ({ id, benchmarks });

test("countBenchmarks ignores nulls", () => {
  assert.equal(countBenchmarks(mk("a", { gpqaDiamond: 1, hle: null, sweBench: 2 })), 2);
});

test("isRankable enforces the minimum", () => {
  const m = mk("a", { gpqaDiamond: 1, hle: 2 });
  assert.equal(isRankable(m, 3), false);
  assert.equal(isRankable(m, 2), true);
});

test("compositeScores normalises to 0..1 within the cohort", () => {
  const cohort = [
    mk("low", { gpqaDiamond: 0, hle: 0, sweBench: 0 }),
    mk("high", { gpqaDiamond: 100, hle: 100, sweBench: 100 }),
  ];
  const s = compositeScores(cohort);
  assert.equal(s.get("low"), 0);
  assert.equal(s.get("high"), 1);
});

test("a single-member cohort scores 1 rather than dividing by zero", () => {
  const s = compositeScores([mk("only", { gpqaDiamond: 42, hle: 7, sweBench: 9 })]);
  assert.equal(s.get("only"), 1);
});

test("models are scored only on benchmarks they report", () => {
  const cohort = [
    mk("full", { gpqaDiamond: 100, hle: 0, sweBench: 50 }),
    mk("partial", { gpqaDiamond: 100, hle: null, sweBench: null }),
  ];
  const s = compositeScores(cohort);
  // "partial" reports only gpqaDiamond, where it ties the max, so it scores 1.
  assert.equal(s.get("partial"), 1);
});

test("BENCHMARK_KEYS follows data/benchmarks.json and skips retired keys", () => {
  const retired = benchmarkMeta.filter((b) => b.retired).map((b) => b.key);
  assert.ok(retired.length > 0, "fixture: at least one key is retired");
  assert.deepEqual(BENCHMARK_KEYS, benchmarkMeta.filter((b) => !b.retired).map((b) => b.key));
  for (const k of retired) assert.ok(!BENCHMARK_KEYS.includes(k), k + " should not be scored");
});

test("retired benchmarks count toward neither rankability nor the composite", () => {
  const retired = benchmarkMeta.filter((b) => b.retired).map((b) => b.key);
  const [k1, k2] = BENCHMARK_KEYS;
  const onlyRetired = Object.fromEntries(retired.map((k) => [k, 99]));
  assert.equal(countBenchmarks(mk("r", onlyRetired)), 0);
  const s = compositeScores([
    mk("a", { ...onlyRetired, [k1]: 0, [k2]: 0 }),
    mk("b", { [k1]: 100, [k2]: 100 }),
  ]);
  // "a" tops every retired key, but only k1/k2 count, where it is the floor.
  assert.equal(s.get("a"), 0);
  assert.equal(s.get("b"), 1);
});
