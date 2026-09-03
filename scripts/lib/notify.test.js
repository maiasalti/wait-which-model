// scripts/lib/notify.test.js
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { newModelIds, isUsableSha } = require("./notify.js");

const mk = (...ids) => ids.map((id) => ({ id }));

test("newModelIds returns ids present after but not before, in after order", () => {
  assert.deepEqual(newModelIds(mk("a", "b"), mk("b", "c", "a", "d")), ["c", "d"]);
});

test("newModelIds is empty when nothing was added, even if something was removed or reordered", () => {
  assert.deepEqual(newModelIds(mk("a", "b"), mk("b")), []);
  assert.deepEqual(newModelIds(mk("a", "b"), mk("b", "a")), []);
});

test("newModelIds treats an empty before list as everything new", () => {
  assert.deepEqual(newModelIds([], mk("x")), ["x"]);
});

test("isUsableSha rejects missing and all-zero shas", () => {
  assert.equal(isUsableSha(undefined), false);
  assert.equal(isUsableSha(""), false);
  assert.equal(isUsableSha("0000000000000000000000000000000000000000"), false);
  assert.equal(isUsableSha("b6f2a4e"), true);
});
