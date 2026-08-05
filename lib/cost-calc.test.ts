import { test } from "node:test";
import assert from "node:assert/strict";
import { monthlyCost, rankByCost, DAYS_PER_MONTH } from "./cost-calc.ts";
import type { Model } from "./types.ts";

const mk = (id: string, usd: number | null) =>
  ({ id, name: id, costPerTask: { usd, effort: null } }) as unknown as Model;

test("uses a fixed 30-day month", () => {
  assert.equal(DAYS_PER_MONTH, 30);
  assert.equal(monthlyCost(0.1, 100), 300);
});

test("zero tasks costs nothing", () => {
  assert.equal(monthlyCost(0.5, 0), 0);
});

test("ranks cheapest first", () => {
  const { included } = rankByCost([mk("pricey", 0.5), mk("cheap", 0.05)], 10);
  assert.deepEqual(included.map((r) => r.model.id), ["cheap", "pricey"]);
});

test("models with no measured figure are excluded, not treated as free", () => {
  const { included, excluded } = rankByCost([mk("known", 0.1), mk("unmeasured", null)], 10);
  assert.deepEqual(included.map((r) => r.model.id), ["known"]);
  assert.deepEqual(excluded.map((m) => m.id), ["unmeasured"]);
});

test("negative task counts are clamped rather than producing negative bills", () => {
  assert.equal(monthlyCost(0.1, -5), 0);
});
