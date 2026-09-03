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

const { buildEmail, escapeHtml } = require("./notify.js");

const companies = [{ id: "google", name: "Google DeepMind" }, { id: "anthropic", name: "Anthropic" }];
const model = (over) => ({
  id: "gemini-3-8-flash", name: "Gemini 3.8 Flash", company: "google", tier: "fast",
  releaseDate: "2026-09-02", availability: "general",
  strengths: ["Streams fast and stays on task in long agent loops"], ...over,
});
const SITE = "https://www.waitwhichmodel.fyi";

test("subject lists every model name, comma-separated, untruncated", () => {
  const one = buildEmail([model()], companies, SITE);
  assert.equal(one.subject, "NEW model release: Gemini 3.8 Flash");
  const three = buildEmail(
    [model(), model({ id: "b", name: "Gemini 3.8 Flash Cyber" }), model({ id: "c", name: "Qwen3.8-Max-0902" })],
    companies, SITE,
  );
  assert.equal(three.subject, "NEW model release: Gemini 3.8 Flash, Gemini 3.8 Flash Cyber, Qwen3.8-Max-0902");
});

test("subject strips CR/LF from model names so header injection can't smuggle a Bcc", () => {
  const { subject } = buildEmail([model({ name: "Foo\r\nBcc: x@y" })], companies, SITE);
  assert.equal(subject, "NEW model release: Foo Bcc: x@y");
  assert.doesNotMatch(subject, /[\r\n]/);
});

test("html links each model to its page and carries lab, tier, date and first strength", () => {
  const { html } = buildEmail([model()], companies, SITE);
  assert.match(html, /href="https:\/\/www\.waitwhichmodel\.fyi\/models\/gemini-3-8-flash"/);
  assert.match(html, /Google DeepMind/);
  assert.match(html, /Fast/);
  assert.match(html, /2026-09-02/);
  assert.match(html, /Streams fast and stays on task/);
  assert.match(html, /href="https:\/\/www\.waitwhichmodel\.fyi"/);
});

test("restricted-access line appears only when availability is restricted", () => {
  assert.doesNotMatch(buildEmail([model()], companies, SITE).html, /Restricted access/);
  assert.match(buildEmail([model({ availability: "restricted" })], companies, SITE).html, /Restricted access/);
  assert.match(buildEmail([model({ availability: "restricted" })], companies, SITE).text, /Restricted access/);
});

test("restricted-access line does not appear for self-host availability", () => {
  const { html, text } = buildEmail([model({ availability: "self-host" })], companies, SITE);
  assert.doesNotMatch(html, /Restricted access/);
  assert.doesNotMatch(text, /Restricted access/);
});

test("model names and strengths are escaped in html", () => {
  const { html } = buildEmail([model({ name: "Foo <Bar> & Baz", strengths: ["a < b"] })], companies, SITE);
  assert.match(html, /Foo &lt;Bar&gt; &amp; Baz/);
  assert.match(html, /a &lt; b/);
  assert.doesNotMatch(html, /<Bar>/);
});

test("the unsubscribe placeholder is present in html and text", () => {
  const { html, text } = buildEmail([model()], companies, SITE);
  assert.match(html, /\{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}/);
  assert.match(text, /\{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}/);
});

test("text version has one paragraph per model with the link", () => {
  const { text } = buildEmail([model(), model({ id: "b", name: "Second" })], companies, SITE);
  assert.match(text, /Gemini 3\.8 Flash\n/);
  assert.match(text, /https:\/\/www\.waitwhichmodel\.fyi\/models\/b/);
});

test("a model with no strengths and an unknown company still renders", () => {
  const { html } = buildEmail([model({ strengths: [], company: "nobody" })], companies, SITE);
  assert.match(html, /nobody/);
});

test("escapeHtml covers the five characters", () => {
  assert.equal(escapeHtml(`<a href="x">'&'</a>`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
});
