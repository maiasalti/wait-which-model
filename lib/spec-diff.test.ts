import { test } from "node:test";
import assert from "node:assert/strict";
import { DIFF_FIELDS, verdict, comparable, visibleFields } from "./spec-diff.ts";
import type { DiffDirection, DiffField } from "./spec-diff.ts";
import type { Model } from "./types";

/** Minimal Model fixtures. `visibleFields` runs every DIFF_FIELDS `display`
 *  function against every model passed in, and those functions dereference
 *  nested objects (`m.pricing.inputPerMTok`, `m.speed.effort`, ...) directly —
 *  so an incomplete fixture would throw at runtime, not just fail an
 *  assertion. `baseModel` fills in every field the module touches with an
 *  "absent" value (null / empty), and each test overrides only what it's
 *  about. Cast through `unknown` because fields the module never reads
 *  (availability, apiIds, retirementDate, ...) are deliberately omitted to
 *  keep fixtures legible. */
function baseModel(overrides: Partial<Model> = {}): Model {
  return {
    id: "test-model",
    name: "Test Model",
    company: "test-co",
    releaseDate: "2026-01-01",
    status: "frontier",
    tier: "flagship",
    modality: "text",
    contextWindow: null,
    maxOutput: null,
    pricing: { inputPerMTok: null, outputPerMTok: null },
    costPerTask: { usd: null, effort: null },
    openWeights: false,
    knowledgeCutoff: null,
    speed: { outputTokensPerSec: null, timeToFirstTokenSec: null, effort: null },
    license: null,
    benchmarks: {},
    ...overrides,
  } as unknown as Model;
}

const field = (key: string): DiffField => {
  const f = DIFF_FIELDS.find((x) => x.key === key);
  if (!f) throw new Error(`no field ${key}`);
  return f;
};

test("higher is better for benchmarks", () => {
  assert.equal(verdict(50, 80, "higher-better"), "better");
  assert.equal(verdict(80, 50, "higher-better"), "worse");
});

test("lower is better for price and latency", () => {
  assert.equal(verdict(10, 2, "lower-better"), "better");
  assert.equal(verdict(2, 10, "lower-better"), "worse");
});

test("equal values are same regardless of direction", () => {
  assert.equal(verdict(5, 5, "higher-better"), "same");
  assert.equal(verdict(5, 5, "lower-better"), "same");
});

test("a missing value on either side is not a comparison", () => {
  assert.equal(verdict(null, 5, "higher-better"), "na");
  assert.equal(verdict(5, null, "higher-better"), "na");
  assert.equal(verdict(null, null, "lower-better"), "na");
});

test("neutral fields never claim better or worse", () => {
  assert.equal(verdict(1, 2, "neutral"), "na");
});

test("every field declares a direction and a label", () => {
  for (const f of DIFF_FIELDS) {
    assert.ok(f.label.length > 0, `${f.key} needs a label`);
    assert.ok(["higher-better", "lower-better", "neutral"].includes(f.direction));
  }
});

test("field keys are unique", () => {
  const keys = DIFF_FIELDS.map((f) => f.key);
  assert.equal(new Set(keys).size, keys.length);
});

// Written out explicitly rather than derived from DIFF_FIELDS: deriving would
// just restate the implementation and pin nothing. A future edit that flips
// e.g. ttft to "higher-better" (telling visitors a slower model is better)
// must fail this test.
test("every field's direction is pinned to what it actually measures", () => {
  const expected: Record<string, DiffDirection> = {
    contextWindow: "higher-better",
    maxOutput: "higher-better",
    inputPrice: "lower-better",
    outputPrice: "lower-better",
    costPerTask: "lower-better",
    outputSpeed: "higher-better",
    ttft: "lower-better",
    mmluPro: "higher-better",
    gpqaDiamond: "higher-better",
    sweBench: "higher-better",
    terminalBench: "higher-better",
    aime: "higher-better",
    hle: "higher-better",
    lmarenaElo: "higher-better",
    arcAgi2: "higher-better",
    openWeights: "neutral",
    license: "neutral",
    knowledgeCutoff: "neutral",
  };
  // Guards against a field being added without pinning its direction here —
  // without this, a new field would silently pass the loop below.
  assert.equal(
    Object.keys(expected).length,
    DIFF_FIELDS.length,
    "the pinned table must cover every field in DIFF_FIELDS"
  );
  for (const f of DIFF_FIELDS) {
    assert.equal(f.direction, expected[f.key], `${f.key} has the wrong direction`);
  }
});

test("comparable: a non-effort-sensitive field ignores mismatched effort", () => {
  const a = baseModel({ speed: { outputTokensPerSec: null, timeToFirstTokenSec: null, effort: "low" } });
  const b = baseModel({ speed: { outputTokensPerSec: null, timeToFirstTokenSec: null, effort: "high" } });
  assert.equal(comparable(field("contextWindow"), a, b), true);
});

test("comparable: an effort-sensitive field is comparable at equal non-null effort", () => {
  const a = baseModel({ speed: { outputTokensPerSec: null, timeToFirstTokenSec: 1, effort: "medium" } });
  const b = baseModel({ speed: { outputTokensPerSec: null, timeToFirstTokenSec: 2, effort: "medium" } });
  assert.equal(comparable(field("ttft"), a, b), true);
});

test("comparable: an effort-sensitive field is not comparable at different efforts", () => {
  const a = baseModel({ speed: { outputTokensPerSec: 10, timeToFirstTokenSec: null, effort: "low" } });
  const b = baseModel({ speed: { outputTokensPerSec: 20, timeToFirstTokenSec: null, effort: "high" } });
  assert.equal(comparable(field("outputSpeed"), a, b), false);
});

test("comparable: false when a's effort is null", () => {
  const a = baseModel({ speed: { outputTokensPerSec: 10, timeToFirstTokenSec: null, effort: null } });
  const b = baseModel({ speed: { outputTokensPerSec: 20, timeToFirstTokenSec: null, effort: "high" } });
  assert.equal(comparable(field("outputSpeed"), a, b), false);
});

// The implementation only checks `a.speed.effort != null` explicitly, then
// leans on `a.speed.effort === b.speed.effort` to catch a null b — pin that
// path deliberately rather than trusting it stays true incidentally.
test("comparable: false when b's effort is null", () => {
  const a = baseModel({ speed: { outputTokensPerSec: 10, timeToFirstTokenSec: null, effort: "high" } });
  const b = baseModel({ speed: { outputTokensPerSec: 20, timeToFirstTokenSec: null, effort: null } });
  assert.equal(comparable(field("outputSpeed"), a, b), false);
});

// costPerTask is measured at a different effort setting than speed
// (`costPerTask.effort`, not `speed.effort`) — a field that fell back to
// speed's effort would wrongly call two cost figures comparable whenever
// their speed efforts happened to match. This pins that a cost-per-task
// delta is suppressed based on ITS OWN effort field.
test("comparable: cost per task is not comparable across different measured efforts", () => {
  const a = baseModel({
    costPerTask: { usd: 0.01, effort: "medium" },
    speed: { outputTokensPerSec: null, timeToFirstTokenSec: null, effort: "high" },
  });
  const b = baseModel({
    costPerTask: { usd: 5, effort: "max" },
    speed: { outputTokensPerSec: null, timeToFirstTokenSec: null, effort: "high" },
  });
  assert.equal(comparable(field("costPerTask"), a, b), false);
});

test("comparable: cost per task IS comparable at equal non-null effort, even if speed effort differs", () => {
  const a = baseModel({
    costPerTask: { usd: 0.01, effort: "medium" },
    speed: { outputTokensPerSec: null, timeToFirstTokenSec: null, effort: "low" },
  });
  const b = baseModel({
    costPerTask: { usd: 0.02, effort: "medium" },
    speed: { outputTokensPerSec: null, timeToFirstTokenSec: null, effort: "high" },
  });
  assert.equal(comparable(field("costPerTask"), a, b), true);
});

test("visibleFields keeps a field when at least one model has a value", () => {
  const blank = baseModel({ id: "blank", contextWindow: null });
  const withValue = baseModel({ id: "has-value", contextWindow: 128000 });
  const fields = visibleFields([blank, withValue]);
  assert.ok(fields.some((f) => f.key === "contextWindow"));
});

test("visibleFields hides a field only when every model renders a dash", () => {
  const blankA = baseModel({ id: "a", contextWindow: null });
  const blankB = baseModel({ id: "b", contextWindow: null });
  const fields = visibleFields([blankA, blankB]);
  assert.ok(!fields.some((f) => f.key === "contextWindow"));
});

test("visibleFields on an empty model list returns an empty array without throwing", () => {
  assert.deepEqual(visibleFields([]), []);
});
