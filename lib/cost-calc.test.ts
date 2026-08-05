import { test } from "node:test";
import assert from "node:assert/strict";
import {
  monthlyCost,
  rankByCost,
  DAYS_PER_MONTH,
  positionToTasks,
  tasksToPosition,
  VOLUME_MIN,
  VOLUME_MAX,
} from "./cost-calc.ts";
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

test("the slider spans the full realistic range", () => {
  assert.equal(positionToTasks(0), VOLUME_MIN);
  assert.equal(positionToTasks(100), VOLUME_MAX);
});

test("slider positions round to numbers a person would say", () => {
  for (let p = 0; p <= 100; p += 3) {
    const t = positionToTasks(p);
    const digits = String(t).replace(/0+$/, "").length;
    assert.ok(digits <= 2, `${t} at position ${p} has more than 2 significant figures`);
  }
});

test("slider is monotonic — dragging right never lowers the volume", () => {
  let prev = -1;
  for (let p = 0; p <= 100; p += 1) {
    const t = positionToTasks(p);
    assert.ok(t >= prev, `position ${p} gave ${t}, lower than the previous ${prev}`);
    prev = t;
  }
});

test("position round-trips a typed number back to roughly itself", () => {
  for (const t of [20, 250, 2000, 20000]) {
    assert.equal(positionToTasks(tasksToPosition(t)), t);
  }
});

test("out-of-range input is clamped, not wrapped", () => {
  assert.equal(positionToTasks(-50), VOLUME_MIN);
  assert.equal(positionToTasks(999), VOLUME_MAX);
  assert.equal(tasksToPosition(1), 0);
  assert.equal(tasksToPosition(9_999_999), 100);
});
