const { test } = require("node:test");
const assert = require("node:assert/strict");
const { jobsFor, branchGuard, ROTATION, ENABLED_DIRECTORY_JOBS } = require("./sweep-jobs.js");

test("base cadence is unchanged when no directory job is enabled", () => {
  assert.deepEqual(jobsFor(1, []), ["health", "models", "news"]);
  assert.deepEqual(jobsFor(2, []), ["health", "models", "stats"]);
  assert.deepEqual(jobsFor(3, []), ["health", "models"]);
  assert.deepEqual(jobsFor(4, []), ["health", "models", "stats"]);
  assert.deepEqual(jobsFor(5, []), ["health", "models"]);
});

test("each directory job runs on its weekday once enabled", () => {
  assert.deepEqual(ROTATION, {
    1: ["image-models"],
    2: ["video-models"],
    3: ["agents", "world-models"],
    4: ["harnesses"],
    5: ["features"],
  });
  assert.deepEqual(jobsFor(3, ["world-models"]), ["health", "models", "world-models"]);
  assert.deepEqual(jobsFor(3, ENABLED_DIRECTORY_JOBS), ["health", "models", "agents", "world-models"]);
  assert.deepEqual(jobsFor(5, ["features"]), ["health", "models", "features"]);
  assert.deepEqual(jobsFor(1, ["features"]), ["health", "models", "news"]);
  assert.deepEqual(jobsFor(1, ["image-models", "features"]), ["health", "models", "news", "image-models"]);
});

test("weekends get no jobs", () => {
  assert.deepEqual(jobsFor(6, ["features"]), []);
  assert.deepEqual(jobsFor(7, []), []);
});

test("the sweep only runs from main", () => {
  assert.equal(branchGuard("main"), null);
  assert.match(branchGuard("data/kolibri-phonon-2"), /not on main/);
  assert.match(branchGuard("HEAD"), /not on main/); // detached
});

test("every directory with a rotation slot is enabled, and none twice", () => {
  const slotted = Object.values(ROTATION).flat();
  assert.equal(new Set(slotted).size, slotted.length);
  assert.deepEqual(slotted.slice().sort(), ENABLED_DIRECTORY_JOBS.slice().sort());
});
