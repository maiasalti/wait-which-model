import { test } from "node:test";
import assert from "node:assert/strict";
import {
  shouldShowBanner,
  dismissedValue,
  subscribedValue,
  DISMISS_DAYS,
  BANNER_STORAGE_KEY,
} from "./banner-dismissal.ts";

const DAY_MS = 86_400_000;
const NOW = Date.parse("2026-09-03T00:00:00Z");

test("null stored value shows banner", () => {
  assert.equal(shouldShowBanner(null, NOW), true);
});

test("unparseable stored value shows banner", () => {
  assert.equal(shouldShowBanner("not json", NOW), true);
});

test("subscribed stored value never shows banner", () => {
  assert.equal(shouldShowBanner(JSON.stringify({ subscribed: true }), NOW), false);
});

test("dismissed 1 day ago hides banner", () => {
  const stored = JSON.stringify({ dismissedAt: NOW - DAY_MS });
  assert.equal(shouldShowBanner(stored, NOW), false);
});

test("dismissed 31 days ago shows banner again", () => {
  const stored = JSON.stringify({ dismissedAt: NOW - 31 * DAY_MS });
  assert.equal(shouldShowBanner(stored, NOW), true);
});

test("dismissed exactly 30 days ago shows banner again", () => {
  const stored = JSON.stringify({ dismissedAt: NOW - DISMISS_DAYS * DAY_MS });
  assert.equal(shouldShowBanner(stored, NOW), true);
});

test("dismissedValue round-trips through shouldShowBanner as hidden", () => {
  const stored = dismissedValue(NOW);
  assert.equal(shouldShowBanner(stored, NOW), false);
});

test("subscribedValue round-trips through shouldShowBanner as hidden", () => {
  const stored = subscribedValue();
  assert.equal(shouldShowBanner(stored, NOW), false);
});

test("BANNER_STORAGE_KEY is the expected constant", () => {
  assert.equal(BANNER_STORAGE_KEY, "wwm:subscribe-banner");
});
