import { test } from "node:test";
import assert from "node:assert/strict";
import { DIFF_FIELDS, verdict } from "./spec-diff.ts";

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
