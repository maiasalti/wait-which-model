import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DIRECTORY_TABS,
  activeDirectoryTab,
  companiesWithEntries,
  visibleDirectoryTabs,
  filterEntries,
  sortEntries,
  groupByMonth,
} from "./directory.ts";

const ZERO = { models: 0, "image-models": 0, "video-models": 0, "world-models": 0, harnesses: 0, agents: 0, features: 0 };

test("tabs are in the spec's order", () => {
  assert.deepEqual(
    DIRECTORY_TABS.map((t) => t.label),
    ["Models", "Image models", "Video models", "World models", "Harnesses", "Agents", "Frontier Features"]
  );
});

test("models is always visible; others only once their file has an entry", () => {
  assert.deepEqual(visibleDirectoryTabs(ZERO).map((t) => t.key), ["models"]);
  assert.deepEqual(
    visibleDirectoryTabs({ ...ZERO, models: 120, features: 3 }).map((t) => t.key),
    ["models", "features"]
  );
});

test("home and model pages belong to the Models tab", () => {
  assert.equal(activeDirectoryTab("/"), "models");
  assert.equal(activeDirectoryTab("/models/claude-sonnet-5-5"), "models");
});

test("matches whole path segments only", () => {
  assert.equal(activeDirectoryTab("/agents"), "agents");
  assert.equal(activeDirectoryTab("/agents/devin"), "agents");
  assert.equal(activeDirectoryTab("/agentsfoo"), null);
  assert.equal(activeDirectoryTab("/compare"), null);
  assert.equal(activeDirectoryTab("/modelsx"), null);
});

test("companiesWithEntries keeps order and drops companies with nothing listed", () => {
  const cs = [{ id: "a" }, { id: "b" }, { id: "c" }];
  assert.deepEqual(
    companiesWithEntries(cs, [{ company: "c" }, { company: "a" }]).map((c) => c.id),
    ["a", "c"]
  );
});

const E = (id: string, date: string, extra: object = {}) => ({
  id, name: id.toUpperCase(), company: "acme", description: "", releaseDate: date, notable: false, ...extra,
});

test("filterEntries matches name, description and company name, case-insensitively", () => {
  const list = [E("alpha", "2026-01-01", { description: "Makes pictures" }), E("beta", "2026-02-01", { company: "zeta" })];
  const q = { search: "", companyIds: [], notableOnly: false };
  assert.deepEqual(filterEntries(list, { ...q, search: "PICT" }).map((e) => e.id), ["alpha"]);
  assert.deepEqual(filterEntries(list, { ...q, search: "zeta labs" }, (id) => `${id} Labs`).map((e) => e.id), ["beta"]);
  assert.deepEqual(filterEntries(list, { ...q, companyIds: ["zeta"] }).map((e) => e.id), ["beta"]);
});

test("filterEntries notableOnly drops non-notable and entries without the flag", () => {
  const list = [E("a", "2026-01-01", { notable: true }), E("b", "2026-01-01"), { ...E("c", "2026-01-01"), notable: undefined }];
  assert.deepEqual(filterEntries(list, { search: "", companyIds: [], notableOnly: true }).map((e) => e.id), ["a"]);
});

test("sortEntries reads launchDate when releaseDate is absent, breaks ties by name", () => {
  const f = { id: "f", name: "F", company: "x", description: "", launchDate: "2026-03-01" };
  const list = [E("b", "2026-01-01"), E("a", "2026-01-01"), f];
  assert.deepEqual(sortEntries(list, "newest").map((e) => e.id), ["f", "a", "b"]);
  assert.deepEqual(sortEntries(list, "oldest").map((e) => e.id), ["a", "b", "f"]);
  assert.deepEqual(sortEntries(list, "name").map((e) => e.id), ["a", "b", "f"]);
});

test("undated entries sort last whichever way dates run", () => {
  const list = [E("u", null as unknown as string), E("a", "2026-01-01"), E("b", "2026-02-01")];
  assert.deepEqual(sortEntries(list, "newest").map((e) => e.id), ["b", "a", "u"]);
  assert.deepEqual(sortEntries(list, "oldest").map((e) => e.id), ["a", "b", "u"]);
});

test("groupByMonth buckets consecutive entries by YYYY-MM", () => {
  const groups = groupByMonth([E("a", "2026-10-02"), E("b", "2026-10-01"), E("c", "2026-08-30")]);
  assert.deepEqual(groups.map((g) => [g.month, g.entries.map((e) => e.id)]), [
    ["2026-10", ["a", "b"]],
    ["2026-08", ["c"]],
  ]);
});
