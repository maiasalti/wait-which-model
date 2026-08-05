import { test } from "node:test";
import assert from "node:assert/strict";
import { formatSpeed } from "./format.ts";

test("formats both figures when present", () => {
  assert.equal(formatSpeed(120.4, 0.42), "120 tok/s · 0.42s to first answer token");
});

test("shows only what is known", () => {
  assert.equal(formatSpeed(120.4, null), "120 tok/s");
  assert.equal(formatSpeed(null, 0.42), "0.42s to first answer token");
});

test("unmeasured speed renders as a dash, not a zero", () => {
  assert.equal(formatSpeed(null, null), "—");
});

test("drops false precision on long reasoning latencies", () => {
  // Two decimals on a three-minute measurement claims accuracy that does not
  // exist; below 10s, hundredths are still meaningful.
  assert.equal(formatSpeed(83, 202.22), "83 tok/s · 202s to first answer token");
  assert.equal(formatSpeed(null, 9.99), "9.99s to first answer token");
  assert.equal(formatSpeed(null, 10.4), "10s to first answer token");
});
