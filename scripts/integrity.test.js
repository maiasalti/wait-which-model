const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { checkData, loadData } = require("./integrity.js");

const base = () => ({
  companies: [
    { id: "anthropic", color: "#D97757", notable: true },
    { id: "tiny-lab", color: null, notable: false },
  ],
  models: [{ id: "m1", company: "anthropic", releaseDate: "2026-01-01", openWeights: false, license: null, predecessorId: null, retirementDate: null }],
  news: [{ id: "n1", modelIds: ["m1"] }],
  reigns: [],
  directory: {},
});

test("clean data passes", () => assert.deepEqual(checkData(base()), []));

test("missing directory files are fine (none exist until their stage ships)", () => {
  assert.deepEqual(checkData({ ...base(), directory: {} }), []);
});

test("the existing model rules still hold", () => {
  const d = base();
  d.models.push({ ...d.models[0] });
  d.models.push({ ...d.models[0], id: "m2", company: "nope" });
  d.models.push({ ...d.models[0], id: "m3", predecessorId: "m3" });
  d.models.push({ ...d.models[0], id: "m4", license: { spdx: "MIT" } });
  d.models.push({ ...d.models[0], id: "m5", retirementDate: "2025-01-01" });
  const errs = checkData(d).join("\n");
  for (const s of ["duplicate model id m1", "unknown company nope", "self-predecessor m3", "closed model with license m4", "retirement before release m5"])
    assert.match(errs, new RegExp(s));
});

test("predecessor cycles are caught", () => {
  const d = base();
  d.models = [
    { ...d.models[0], id: "a", predecessorId: "b" },
    { ...d.models[0], id: "b", predecessorId: "a" },
  ];
  assert.match(checkData(d).join("\n"), /predecessor cycle/);
});

test("overlapping reigns in a tier are caught", () => {
  const d = base();
  d.reigns = [
    { modelId: "m1", tier: "flagship", start: "2026-01-01", end: "2026-06-01" },
    { modelId: "m1", tier: "flagship", start: "2026-03-01", end: null },
  ];
  assert.match(checkData(d).join("\n"), /overlapping reigns in tier flagship/);
});

test("a null colour is only allowed on a non-notable company", () => {
  const d = base();
  d.companies[0].color = null;
  assert.match(checkData(d).join("\n"), /notable company anthropic has no colour/);
});

test("directory entries: unique ids, known companies, resolvable model refs", () => {
  const d = base();
  d.directory.harnesses = [
    { id: "h1", company: "anthropic", supportedModels: ["m1", "ghost"], scores: [{ benchmark: "terminalBench", modelId: "ghost2", score: 50 }] },
    { id: "h1", company: "nobody", supportedModels: "any", scores: [] },
  ];
  d.directory.agents = [{ id: "a1", company: "tiny-lab", underlyingModels: ["ghost3"] }];
  const errs = checkData(d).join("\n");
  for (const s of ["duplicate harnesses id h1", "harnesses h1: unknown company nobody", "harnesses h1: unknown model ghost$", "harnesses h1: unknown model ghost2", "agents a1: unknown model ghost3"])
    assert.match(errs, new RegExp(s, "m"));
});

test("features are limited to the five frontier labs", () => {
  const d = base();
  d.directory.features = [{ id: "f1", company: "tiny-lab", modelIds: [] }];
  assert.match(checkData(d).join("\n"), /features f1: company tiny-lab is not one of/);
});

test("news refs must resolve to their type's file", () => {
  const d = base();
  d.directory.agents = [{ id: "a1", company: "anthropic", underlyingModels: [] }];
  d.news[0].refs = [{ type: "agent", id: "a1" }, { type: "agent", id: "a2" }, { type: "widget", id: "x" }];
  const errs = checkData(d).join("\n");
  assert.match(errs, /news n1: unknown agent a2/);
  assert.match(errs, /news n1: unknown ref type widget/);
  assert.doesNotMatch(errs, /a1/);
});

test("duplicate news ids are caught", () => {
  const d = base();
  d.news.push({ id: "n1", modelIds: [] });
  assert.match(checkData(d).join("\n"), /duplicate news id n1/);
});

test("the repo's real data passes", () => {
  assert.deepEqual(checkData(loadData(path.join(__dirname, "..", "data"))), []);
});

test("a news item without a modelIds array is caught (model pages call .includes on it)", () => {
  const d = base();
  d.news.push({ id: "n2" });
  assert.match(checkData(d).join("\n"), /news n2: modelIds missing/);
});
