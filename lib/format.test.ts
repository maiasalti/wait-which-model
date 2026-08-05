import { test } from "node:test";
import assert from "node:assert/strict";
import { formatSpeed } from "./format.ts";

test("formats both figures when present", () => {
  assert.equal(formatSpeed(120.4, 0.42), "120 tok/s · 0.42s to first token");
});

test("shows only what is known", () => {
  assert.equal(formatSpeed(120.4, null), "120 tok/s");
  assert.equal(formatSpeed(null, 0.42), "0.42s to first token");
});

test("unmeasured speed renders as a dash, not a zero", () => {
  assert.equal(formatSpeed(null, null), "—");
});
