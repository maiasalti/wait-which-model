import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_COMPARE_STATE, DEFAULT_PICKS, stateToQuery, queryToState } from "./compare-url.ts";

test("default state serialises to an empty query", () => {
  assert.equal(stateToQuery(DEFAULT_COMPARE_STATE), "");
});

test("round-trips a fully populated state", () => {
  const state = {
    filters: {
      window: "1y" as const,
      companies: ["openai", "anthropic"],
      openWeightsOnly: true,
      frontierOnly: true,
      benchmark: "hle" as const,
      minScore: 40,
      maxInputPrice: 5,
      search: "opus",
    },
    picks: ["gpt-4", "claude-opus-4-8"],
    diffBaseline: "gpt-4",
    diffOthers: ["claude-opus-4-8"],
  };
  assert.deepEqual(queryToState(new URLSearchParams(stateToQuery(state))), state);
});

test("omits every parameter still at its default", () => {
  const q = stateToQuery({ ...DEFAULT_COMPARE_STATE, filters: { ...DEFAULT_COMPARE_STATE.filters, search: "gpt" } });
  assert.equal(q, "q=gpt");
});

test("an empty query yields the defaults", () => {
  assert.deepEqual(queryToState(new URLSearchParams("")), DEFAULT_COMPARE_STATE);
});

test("ignores junk values rather than throwing", () => {
  const s = queryToState(new URLSearchParams("window=banana&min=notanumber&bench=nope"));
  assert.equal(s.filters.window, DEFAULT_COMPARE_STATE.filters.window);
  assert.equal(s.filters.minScore, null);
  assert.equal(s.filters.benchmark, DEFAULT_COMPARE_STATE.filters.benchmark);
});

test("a baseline with no comparison models still round-trips", () => {
  const state = { ...DEFAULT_COMPARE_STATE, diffBaseline: "gpt-4", diffOthers: [] };
  assert.deepEqual(queryToState(new URLSearchParams(stateToQuery(state))), state);
});

test("the four default picks are omitted from the query", () => {
  assert.equal(stateToQuery(DEFAULT_COMPARE_STATE), "");
});

test("an absent picks param yields the defaults, an empty one yields none", () => {
  assert.deepEqual(queryToState(new URLSearchParams("")).picks, DEFAULT_PICKS);
  assert.deepEqual(queryToState(new URLSearchParams("picks=")).picks, []);
});

test("a deselected-everything state round-trips", () => {
  const state = { ...DEFAULT_COMPARE_STATE, picks: [] };
  assert.deepEqual(queryToState(new URLSearchParams(stateToQuery(state))), state);
});
