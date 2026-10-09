import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DIRECTORY_TABS,
  activeDirectoryTab,
  companiesWithEntries,
  visibleDirectoryTabs,
} from "./directory.ts";

const ZERO = { models: 0, "image-models": 0, "video-models": 0, harnesses: 0, agents: 0, features: 0 };

test("tabs are in the spec's order", () => {
  assert.deepEqual(
    DIRECTORY_TABS.map((t) => t.label),
    ["Models", "Image models", "Video models", "Harnesses", "Agents", "Frontier Features"]
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
