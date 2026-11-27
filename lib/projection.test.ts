import { test } from "node:test";
import assert from "node:assert/strict";
import { doublingMonths, evalFit, fitExponential, monthlyCounts } from "./projection.ts";

test("recovers k and a from exact exponential data", () => {
  const pts = Array.from({ length: 12 }, (_, x) => ({ x, y: 2 * Math.exp(0.3 * x) }));
  const fit = fitExponential(pts)!;
  assert.ok(Math.abs(fit.k - 2) < 1e-6);
  assert.ok(Math.abs(fit.a - 0.3) < 1e-6);
  assert.ok(Math.abs(evalFit(fit, 12) - 2 * Math.exp(3.6)) < 1e-3);
});

test("copes with zero-count months", () => {
  const fit = fitExponential([0, 0, 1, 0, 2, 3, 5, 8].map((y, x) => ({ x, y })))!;
  assert.ok(fit.a > 0);
});

test("flat data gives no growth and no doubling time", () => {
  const fit = fitExponential([3, 3, 3, 3].map((y, x) => ({ x, y })))!;
  assert.ok(Math.abs(fit.a) < 1e-9);
  assert.equal(doublingMonths(fit), null);
});

test("too little data returns null", () => {
  assert.equal(fitExponential([{ x: 0, y: 1 }, { x: 1, y: 2 }]), null);
  assert.equal(fitExponential([0, 0, 1].map((y, x) => ({ x, y }))), null);
});

test("monthlyCounts zero-fills gaps and can exclude a month", () => {
  const c = monthlyCounts(["2026-01-05", "2026-03-02", "2026-03-20", "2026-04-01"], "2026-04");
  assert.deepEqual(c, [
    { key: "2026-01", x: 0, y: 1 },
    { key: "2026-02", x: 1, y: 0 },
    { key: "2026-03", x: 2, y: 2 },
  ]);
});

test("monthlyCounts crosses a year boundary", () => {
  const c = monthlyCounts(["2025-12-31", "2026-01-01"]);
  assert.deepEqual(c.map((p) => p.key), ["2025-12", "2026-01"]);
});
