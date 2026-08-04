const { test } = require("node:test");
const assert = require("node:assert/strict");
const { computeReigns } = require("./frontier-reigns.js");

const mk = (id, releaseDate, tier, benchmarks) => ({ id, releaseDate, tier, benchmarks, status: "superseded" });
const THREE = (v) => ({ aime: v, hle: v, sweBench: v });

test("the first rankable model in a tier takes the crown", () => {
  const reigns = computeReigns([mk("a", "2024-01-01", "flagship", THREE(50))]);
  assert.equal(reigns.length, 1);
  assert.equal(reigns[0].modelId, "a");
  assert.equal(reigns[0].start, "2024-01-01");
  assert.equal(reigns[0].end, null);
  assert.equal(reigns[0].dethronedBy, null);
});

test("a later, better model dethrones the incumbent", () => {
  const reigns = computeReigns([
    mk("a", "2024-01-01", "flagship", THREE(50)),
    mk("b", "2024-06-01", "flagship", THREE(90)),
  ]);
  assert.equal(reigns.length, 2);
  const a = reigns.find((r) => r.modelId === "a");
  assert.equal(a.end, "2024-06-01");
  assert.equal(a.dethronedBy, "b");
  assert.equal(reigns.find((r) => r.modelId === "b").end, null);
});

test("a later but weaker model never takes the crown", () => {
  const reigns = computeReigns([
    mk("a", "2024-01-01", "flagship", THREE(90)),
    mk("b", "2024-06-01", "flagship", THREE(50)),
  ]);
  assert.deepEqual(reigns.map((r) => r.modelId), ["a"]);
  assert.equal(reigns[0].end, null);
});

test("models below the benchmark minimum cannot be crowned", () => {
  const reigns = computeReigns([
    mk("a", "2024-01-01", "flagship", THREE(50)),
    mk("sparse", "2024-06-01", "flagship", { aime: 100 }),
  ]);
  assert.deepEqual(reigns.map((r) => r.modelId), ["a"]);
});

test("tiers are ranked independently", () => {
  const reigns = computeReigns([
    mk("big", "2024-01-01", "flagship", THREE(90)),
    mk("small", "2024-02-01", "fast", THREE(10)),
  ]);
  assert.equal(reigns.length, 2);
  assert.equal(reigns.find((r) => r.modelId === "small").tier, "fast");
});

test("deprecated models still count — they held the frontier historically", () => {
  const dep = { ...mk("old", "2023-01-01", "flagship", THREE(50)), status: "deprecated" };
  const reigns = computeReigns([dep, mk("new", "2025-01-01", "flagship", THREE(90))]);
  assert.deepEqual(reigns.map((r) => r.modelId).sort(), ["new", "old"]);
});

test("reigns within a tier never overlap", () => {
  const reigns = computeReigns([
    mk("a", "2024-01-01", "flagship", THREE(10)),
    mk("b", "2024-06-01", "flagship", THREE(50)),
    mk("c", "2025-01-01", "flagship", THREE(90)),
  ]).filter((r) => r.tier === "flagship").sort((x, y) => x.start.localeCompare(y.start));
  for (let i = 0; i < reigns.length - 1; i++) {
    assert.equal(reigns[i].end, reigns[i + 1].start);
  }
});

test("no days field is stored — it would go stale daily", () => {
  const reigns = computeReigns([mk("a", "2024-01-01", "flagship", THREE(50))]);
  assert.equal("days" in reigns[0], false);
});

test("a same-day pair crowns only the stronger — no phantom zero-day reign", () => {
  const reigns = computeReigns([
    mk("incumbent", "2024-01-01", "flagship", THREE(10)),
    mk("aaa", "2024-06-01", "flagship", THREE(50)),
    mk("zzz", "2024-06-01", "flagship", THREE(90)),
  ]);
  assert.deepEqual(reigns.map((r) => r.modelId), ["incumbent", "zzz"]);
  assert.equal(reigns.find((r) => r.modelId === "incumbent").dethronedBy, "zzz");
  for (const r of reigns) assert.notEqual(r.start, r.end);
});
