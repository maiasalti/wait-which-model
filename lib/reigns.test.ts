import { test } from "node:test";
import assert from "node:assert/strict";
import { reignDays, type Reign } from "./reigns.ts";

const mk = (start: string, end: string | null): Reign => ({
  modelId: "m", tier: "flagship", start, end, dethronedBy: null, composite: 1,
});

test("a closed reign measures start to end", () => {
  assert.equal(reignDays(mk("2024-01-01", "2024-01-31"), new Date("2026-01-01")), 30);
});

test("an open reign measures start to today", () => {
  assert.equal(reignDays(mk("2024-01-01", null), new Date("2024-03-01")), 60);
});

test("a same-day dethroning is zero, not negative", () => {
  assert.equal(reignDays(mk("2024-01-01", "2024-01-01"), new Date("2026-01-01")), 0);
});

test("a future-dated reign clamps to zero rather than going negative", () => {
  assert.equal(reignDays(mk("2026-06-01", null), new Date("2026-01-01")), 0);
});
