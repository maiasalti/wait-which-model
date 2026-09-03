// lib/subscribe.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSubscribeBody, resendSaysAlreadyExists } from "./subscribe.ts";

test("accepts a valid email, trimmed and lowercased", () => {
  assert.deepEqual(parseSubscribeBody({ email: "  Maia@Example.COM " }), {
    ok: true, email: "maia@example.com", honeypot: false,
  });
});

test("flags the honeypot when website is filled", () => {
  const r = parseSubscribeBody({ email: "a@b.co", website: "http://spam" });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.honeypot, true);
});

test("rejects missing, malformed and oversized emails", () => {
  assert.deepEqual(parseSubscribeBody({}), { ok: false });
  assert.deepEqual(parseSubscribeBody({ email: "not-an-email" }), { ok: false });
  assert.deepEqual(parseSubscribeBody({ email: "a@" + "b".repeat(250) + ".com" }), { ok: false });
  assert.deepEqual(parseSubscribeBody(null), { ok: false });
  assert.deepEqual(parseSubscribeBody("a@b.co"), { ok: false });
});

test("resendSaysAlreadyExists recognises 409 and an already-exists 4xx message", () => {
  assert.equal(resendSaysAlreadyExists(409, "{}"), true);
  assert.equal(resendSaysAlreadyExists(422, '{"message":"Contact already exists"}'), true);
  assert.equal(resendSaysAlreadyExists(422, '{"message":"Invalid segment"}'), false);
  assert.equal(resendSaysAlreadyExists(500, '{"message":"already exists"}'), false);
});
