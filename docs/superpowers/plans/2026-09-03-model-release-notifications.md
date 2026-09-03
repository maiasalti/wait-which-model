---
type: Implementation Plan
title: Model release email notifications
description: Task-by-task plan for the subscribe form, the /api/subscribe route, the pure notify helpers, the GitHub Actions
  sender and the docs, implementing the 2026-09-03 design spec.
tags:
- docs
- superpowers
- plans
generated:
  by: human:maia
  at: '2026-09-03T00:00:00Z'
---

# Model Release Email Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Visitors can subscribe by email, and every push to `main` that adds a model to `data/models.json` sends them one Resend broadcast listing the new models.

**Architecture:** Two independent halves joined only by a Resend Segment. A footer form posts to a Node API route that creates a Resend contact in the segment. A GitHub Actions workflow on `push` to `main` runs a dependency-free Node script that diffs model ids between the before/after commits, waits for the site to serve the new pages, and creates a Resend broadcast with `send: true`. Pure logic (id diff, email builder, body validation) lives in small tested modules; the route and the runner are thin wires.

**Tech Stack:** Next.js 16 App Router (Node runtime route), React 19 client component, zod 4, Resend REST API via `fetch` (no SDK), GitHub Actions, `node --test`.

**Spec:** `docs/superpowers/specs/2026-09-03-model-release-notifications-design.md`

## Global Constraints

- Subject line is exactly `NEW model release: ` + every added model's `name`, comma-separated, never truncated.
- From address: `Wait Which Model? <notify@waitwhichmodel.fyi>`. Site URL default `https://www.waitwhichmodel.fyi`.
- Resend segment id: `bd776c75-cb49-47e2-b256-f25943d50ab9`, always read from `RESEND_SEGMENT_ID`, never hardcoded in code.
- Resend endpoints: `POST https://api.resend.com/contacts` body `{ email, segments: [{ id }] }`; `POST https://api.resend.com/broadcasts` body `{ segment_id, from, subject, html, text, name, send: true }`; unsubscribe placeholder `{{{RESEND_UNSUBSCRIBE_URL}}}` in both html and text.
- No new npm dependencies. Scripts are CommonJS like `scripts/*.js`; `lib/*.ts` value imports between lib modules use the literal `.ts` extension (see AGENTS.md) so `node --test` resolves them.
- Single opt-in. Honeypot field name `website`. Rate limit 5 requests per 10 minutes per IP, in memory.
- Without `RESEND_API_KEY` and `RESEND_SEGMENT_ID` the route returns `503 { error: "not_configured" }` and the form shows "Sign-ups are paused."
- Every task ends with `npm test` green and, where TSX/TS changed, `npm run build` green.
- Commit messages end with the two attribution lines used throughout this repo:
  `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01PvCtK42hHu7uq5pnZhqc61`.
- Branch: `feature/release-notifications` (already exists, cut from `main`; the spec is its first commit).

---

## File structure

| File | Responsibility |
|---|---|
| `scripts/lib/notify.js` | Pure: `newModelIds`, `buildEmail`, `isUsableSha`, `escapeHtml`, `TIER_LABELS`. No I/O. |
| `scripts/lib/notify.test.js` | Tests for the above. |
| `scripts/notify-new-models.js` | Runner: env + argv, `git show`, site polling, Resend broadcast, `--dry-run`. |
| `.github/workflows/notify-new-models.yml` | Trigger on push to main touching models.json; runs the runner with secrets. |
| `lib/subscribe.ts` | Pure: `parseSubscribeBody`, `resendSaysAlreadyExists`. |
| `lib/subscribe.test.ts` | Tests for the above. |
| `app/api/subscribe/route.ts` | POST handler: config check, parse, honeypot, rate limit, Resend contact call. |
| `components/SubscribeForm.tsx` | Client form with local status state. |
| `app/layout.tsx` | Renders `<SubscribeForm />` in the footer. |
| `app/privacy/page.tsx` | Says the site now collects emails for notifications, and how to stop. |
| `AGENTS.md`, `protocols/DAILY_SWEEP_PROTOCOL.md` | Document the pipeline. |

---

### Task 1: `newModelIds` and `isUsableSha` (pure diff helpers)

**Files:**
- Create: `scripts/lib/notify.js`
- Test: `scripts/lib/notify.test.js`

**Interfaces:**
- Produces: `newModelIds(before: {id:string}[], after: {id:string}[]): string[]` — ids in `after` not in `before`, in `after` order. `isUsableSha(sha: string|undefined): boolean` — false for undefined, empty, or all-zero shas.

- [ ] **Step 1: Write the failing tests**

```js
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test scripts/lib/notify.test.js`
Expected: FAIL — `Cannot find module './notify.js'`

- [ ] **Step 3: Write the minimal implementation**

```js
// scripts/lib/notify.js
/** Pure helpers behind scripts/notify-new-models.js — no I/O, so they run
 *  under `node --test` without git, network or secrets. */

/** Ids present in `after` and absent from `before`, in `after` order. This is
 *  the site's own definition of "a model was added": a new id in models.json. */
function newModelIds(before, after) {
  const seen = new Set(before.map((m) => m.id));
  return after.filter((m) => !seen.has(m.id)).map((m) => m.id);
}

/** GitHub sends an all-zero `before` sha on branch creation; a rewritten
 *  history can leave one that no longer exists. Neither is a diff base. */
function isUsableSha(sha) {
  return typeof sha === "string" && sha.length > 0 && !/^0+$/.test(sha);
}

module.exports = { newModelIds, isUsableSha };
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test scripts/lib/notify.test.js`
Expected: 4 passing. Then `npm test` — all passing (the glob `scripts/**/*.test.js` picks the new file up).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/notify.js scripts/lib/notify.test.js
git commit -m "$(printf 'Add newModelIds and isUsableSha notify helpers\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01PvCtK42hHu7uq5pnZhqc61')"
```

---

### Task 2: `buildEmail` (subject, html, text)

**Files:**
- Modify: `scripts/lib/notify.js`
- Test: `scripts/lib/notify.test.js`

**Interfaces:**
- Consumes: nothing from Task 1 beyond living in the same module.
- Produces: `buildEmail(models: Model[], companies: {id,name}[], siteUrl: string): { subject: string, html: string, text: string }` where `Model` is a `data/models.json` record (`id, name, company, tier, releaseDate, availability, strengths`). `escapeHtml(s: string): string`. `TIER_LABELS = { flagship: "Flagship", balanced: "Balanced", fast: "Fast" }`.

- [ ] **Step 1: Write the failing tests**

Append to `scripts/lib/notify.test.js`:

```js
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

test("html links each model to its page and carries lab, tier, date and first strength", () => {
  const { html } = buildEmail([model()], companies, SITE);
  assert.match(html, /href="https:\/\/www\.waitwhichmodel\.fyi\/models\/gemini-3-8-flash"/);
  assert.match(html, /Google DeepMind/);
  assert.match(html, /Fast/);
  assert.match(html, /2026-09-02/);
  assert.match(html, /Streams fast and stays on task/);
  assert.match(html, /href="https:\/\/www\.waitwhichmodel\.fyi"/);
});

test("restricted-access line appears only when availability is not general", () => {
  assert.doesNotMatch(buildEmail([model()], companies, SITE).html, /Restricted access/);
  assert.match(buildEmail([model({ availability: "restricted" })], companies, SITE).html, /Restricted access/);
  assert.match(buildEmail([model({ availability: "restricted" })], companies, SITE).text, /Restricted access/);
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test scripts/lib/notify.test.js`
Expected: the new tests FAIL with `buildEmail is not a function`.

- [ ] **Step 3: Write the implementation**

Add to `scripts/lib/notify.js` above `module.exports`, and extend the export:

```js
const TIER_LABELS = { flagship: "Flagship", balanced: "Balanced", fast: "Fast" };

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** One email per push: every added model, in models.json order. Inline styles
 *  only — email clients strip <style>. Names and strengths are data, so they
 *  are escaped; the unsubscribe placeholder is substituted by Resend per
 *  recipient and must appear verbatim. */
function buildEmail(models, companies, siteUrl) {
  const companyName = (id) => companies.find((c) => c.id === id)?.name ?? id;
  const subject = "NEW model release: " + models.map((m) => m.name).join(", ");

  const blocks = models.map((m) => {
    const url = `${siteUrl}/models/${m.id}`;
    const meta = [companyName(m.company), TIER_LABELS[m.tier] ?? m.tier, `released ${m.releaseDate}`].join(" · ");
    const restricted = m.availability !== "general";
    const teaser = m.strengths?.[0] ?? "";
    return {
      html: `
        <div style="padding:16px 0;border-bottom:1px solid #e5e7eb">
          <a href="${escapeHtml(url)}" style="font-size:18px;font-weight:600;color:#1d4ed8;text-decoration:none">${escapeHtml(m.name)}</a>
          <div style="margin-top:4px;font-size:13px;color:#6b7280">${escapeHtml(meta)}</div>
          ${restricted ? `<div style="margin-top:4px;font-size:13px;color:#b45309">Restricted access — not generally available yet.</div>` : ""}
          ${teaser ? `<div style="margin-top:8px;font-size:14px;color:#111827">${escapeHtml(teaser)}</div>` : ""}
        </div>`,
      text: [
        m.name,
        meta,
        restricted ? "Restricted access — not generally available yet." : null,
        teaser || null,
        url,
      ].filter(Boolean).join("\n"),
    };
  });

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:24px">
    <h1 style="margin:0 0 4px;font-size:20px">${escapeHtml(subject)}</h1>
    <p style="margin:0 0 8px;font-size:13px;color:#6b7280">${models.length === 1 ? "A new model" : `${models.length} new models`} just landed on Wait Which Model?</p>
    ${blocks.map((b) => b.html).join("")}
    <p style="margin:20px 0 0;font-size:14px"><a href="${escapeHtml(siteUrl)}" style="color:#1d4ed8">See every model →</a></p>
    <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">You're getting this because you subscribed at waitwhichmodel.fyi. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#9ca3af">Unsubscribe</a>.</p>
  </div>
</body></html>`;

  const text = [
    subject,
    "",
    ...blocks.map((b) => b.text + "\n"),
    `See every model: ${siteUrl}`,
    "",
    "You're getting this because you subscribed at waitwhichmodel.fyi.",
    "Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}",
  ].join("\n");

  return { subject, html, text };
}

module.exports = { newModelIds, isUsableSha, buildEmail, escapeHtml, TIER_LABELS };
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test scripts/lib/notify.test.js`
Expected: 12 passing. Then `npm test` all green.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/notify.js scripts/lib/notify.test.js
git commit -m "$(printf 'Add buildEmail for model release notifications\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01PvCtK42hHu7uq5pnZhqc61')"
```

---

### Task 3: The runner `scripts/notify-new-models.js`

**Files:**
- Create: `scripts/notify-new-models.js`

**Interfaces:**
- Consumes: `newModelIds`, `isUsableSha`, `buildEmail` from `scripts/lib/notify.js` (Task 1–2).
- Produces: a CLI. Env: `BEFORE_SHA`, `AFTER_SHA` (required), `RESEND_API_KEY`, `RESEND_SEGMENT_ID` (required unless `--dry-run`), `SITE_URL` (default `https://www.waitwhichmodel.fyi`), `NOTIFY_FROM` (default `Wait Which Model? <notify@waitwhichmodel.fyi>`), `POLL_TIMEOUT_MS` (default 600000), `POLL_INTERVAL_MS` (default 20000). Flag `--dry-run`. Exit 0 on nothing-to-do, 1 on a failed send.

- [ ] **Step 1: Write the runner**

```js
#!/usr/bin/env node
/** Sends one Resend broadcast for every model added to data/models.json
 *  between BEFORE_SHA and AFTER_SHA. Run by .github/workflows/notify-new-models.yml
 *  on every push to main; see docs/superpowers/specs/2026-09-03-model-release-notifications-design.md.
 *
 *  Dry run against a real range (the 09-03 sweep merge, three models):
 *    BEFORE_SHA=2c55e20 AFTER_SHA=b6f2a4e node scripts/notify-new-models.js --dry-run
 */
const { execFileSync } = require("child_process");
const { newModelIds, isUsableSha, buildEmail } = require("./lib/notify.js");

const DRY_RUN = process.argv.includes("--dry-run");
const SITE_URL = (process.env.SITE_URL || "https://www.waitwhichmodel.fyi").replace(/\/$/, "");
const FROM = process.env.NOTIFY_FROM || "Wait Which Model? <notify@waitwhichmodel.fyi>";
const POLL_TIMEOUT_MS = Number(process.env.POLL_TIMEOUT_MS || 10 * 60_000);
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 20_000);

const log = (...a) => console.log("[notify]", ...a);

function gitJson(sha, path) {
  return JSON.parse(execFileSync("git", ["show", `${sha}:${path}`], { maxBuffer: 64 << 20 }).toString());
}

function shaExists(sha) {
  try {
    execFileSync("git", ["cat-file", "-e", `${sha}^{commit}`], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wait until the production site serves every new model page, so links in
 *  the email work when it lands. On timeout we still send: a link that works
 *  in a minute beats a notification that never goes out. */
async function waitForPages(ids) {
  const pending = new Set(ids);
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (pending.size && Date.now() < deadline) {
    for (const id of [...pending]) {
      try {
        const res = await fetch(`${SITE_URL}/models/${id}`, { method: "HEAD", redirect: "follow" });
        if (res.ok) pending.delete(id);
      } catch {
        /* network blip — retry on the next tick */
      }
    }
    if (pending.size) {
      log(`waiting for ${[...pending].join(", ")} to deploy…`);
      await sleep(POLL_INTERVAL_MS);
    }
  }
  if (pending.size) log(`WARNING: ${[...pending].join(", ")} not live after ${POLL_TIMEOUT_MS / 1000}s — sending anyway`);
}

async function sendBroadcast({ subject, html, text }, dateLabel) {
  const res = await fetch("https://api.resend.com/broadcasts", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      segment_id: process.env.RESEND_SEGMENT_ID,
      from: FROM,
      subject,
      html,
      text,
      name: `Model release ${dateLabel}`,
      send: true,
    }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${body}`);
  return body;
}

async function main() {
  const { BEFORE_SHA, AFTER_SHA } = process.env;
  if (!AFTER_SHA) throw new Error("AFTER_SHA is required");
  if (!isUsableSha(BEFORE_SHA) || !shaExists(BEFORE_SHA)) {
    log(`no usable before-commit (${BEFORE_SHA || "unset"}); nothing to diff, exiting`);
    return;
  }

  const before = gitJson(BEFORE_SHA, "data/models.json");
  const after = gitJson(AFTER_SHA, "data/models.json");
  const companies = gitJson(AFTER_SHA, "data/companies.json");
  const ids = newModelIds(before, after);
  if (ids.length === 0) {
    log("no new models between", BEFORE_SHA, "and", AFTER_SHA);
    return;
  }
  log("new models:", ids.join(", "));

  const added = after.filter((m) => ids.includes(m.id));
  const email = buildEmail(added, companies, SITE_URL);
  const dateLabel = new Date().toISOString().slice(0, 10);

  if (DRY_RUN) {
    log("dry run — would send to segment", process.env.RESEND_SEGMENT_ID || "(unset)", "from", FROM);
    console.log("\nSubject:", email.subject, "\n\n" + email.text);
    return;
  }

  for (const k of ["RESEND_API_KEY", "RESEND_SEGMENT_ID"]) if (!process.env[k]) throw new Error(`${k} is required`);
  await waitForPages(ids);
  const result = await sendBroadcast(email, dateLabel);
  log("broadcast sent:", result);
}

main().catch((err) => {
  console.error("[notify] FAILED:", err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Dry-run against the real sweep merge**

Run: `BEFORE_SHA=2c55e20 AFTER_SHA=b6f2a4e node scripts/notify-new-models.js --dry-run`
Expected output includes `new models: gemini-3-8-flash, deepseek-v4-flash-vision-exp, qwen3-8-max-0902` and `Subject: NEW model release: Gemini 3.8 Flash, DeepSeek V4 Flash Vision (exp), Qwen3.8-Max-0902` (names as they appear in models.json at `b6f2a4e` — read them from the output, not from this plan), followed by the text body with three `https://www.waitwhichmodel.fyi/models/…` links.

- [ ] **Step 3: Dry-run the no-op and unusable-sha paths**

Run: `BEFORE_SHA=b6f2a4e AFTER_SHA=b6f2a4e node scripts/notify-new-models.js --dry-run`
Expected: `[notify] no new models between b6f2a4e and b6f2a4e`, exit 0.

Run: `BEFORE_SHA=0000000000000000000000000000000000000000 AFTER_SHA=b6f2a4e node scripts/notify-new-models.js --dry-run; echo "exit $?"`
Expected: `[notify] no usable before-commit …`, `exit 0`.

Run: `BEFORE_SHA=b6f2a4e AFTER_SHA=b6f2a4e node scripts/notify-new-models.js; echo "exit $?"` (no dry-run, no secrets)
Expected: still `no new models`, `exit 0` — the diff runs before secrets are demanded.

- [ ] **Step 4: Commit**

```bash
git add scripts/notify-new-models.js
git commit -m "$(printf 'Add notify-new-models runner (diff, poll, Resend broadcast)\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01PvCtK42hHu7uq5pnZhqc61')"
```

---

### Task 4: The GitHub Actions workflow

**Files:**
- Create: `.github/workflows/notify-new-models.yml`

**Interfaces:**
- Consumes: `scripts/notify-new-models.js` (Task 3) and repository secrets `RESEND_API_KEY`, `RESEND_SEGMENT_ID` (already set).

- [ ] **Step 1: Write the workflow**

```yaml
# Emails subscribers when a push to main adds a model to data/models.json.
# Design: docs/superpowers/specs/2026-09-03-model-release-notifications-design.md
name: Notify subscribers of new models

on:
  push:
    branches: [main]
    paths: [data/models.json]

# Pushes in quick succession run one at a time, in order.
concurrency: notify-new-models

permissions:
  contents: read

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # the script reads data/models.json at the before-commit
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - name: Diff models.json and send one broadcast
        run: node scripts/notify-new-models.js
        env:
          BEFORE_SHA: ${{ github.event.before }}
          AFTER_SHA: ${{ github.sha }}
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          RESEND_SEGMENT_ID: ${{ secrets.RESEND_SEGMENT_ID }}
```

- [ ] **Step 2: Validate the YAML parses**

Run: `node -e "const y=require('fs').readFileSync('.github/workflows/notify-new-models.yml','utf8');if(!/on:\n\s+push:/.test(y)||!/secrets\.RESEND_API_KEY/.test(y))throw 'shape';console.log('ok')"`
Expected: `ok`. (No YAML parser is installed; `actionlint` is optional — if `brew list actionlint` succeeds, run `actionlint .github/workflows/notify-new-models.yml` and expect no output.)

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/notify-new-models.yml
git commit -m "$(printf 'Add workflow: notify subscribers on push to main adding models\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01PvCtK42hHu7uq5pnZhqc61')"
```

---

### Task 5: `lib/subscribe.ts` (pure request/response logic)

**Files:**
- Create: `lib/subscribe.ts`
- Test: `lib/subscribe.test.ts`

**Interfaces:**
- Produces: `parseSubscribeBody(body: unknown): { ok: true; email: string; honeypot: boolean } | { ok: false }` — trims and lowercases; `honeypot` true when `website` is a non-empty string. `resendSaysAlreadyExists(status: number, bodyText: string): boolean` — true for 409, or any 4xx whose body mentions "already exists" (case-insensitive).

- [ ] **Step 1: Write the failing tests**

```ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test lib/subscribe.test.ts`
Expected: FAIL — `Cannot find module './subscribe.ts'`

- [ ] **Step 3: Write the implementation**

```ts
// lib/subscribe.ts
import { z } from "zod";

/** Body shape for POST /api/subscribe. `website` is the honeypot: real
 *  visitors never see the field, so anything in it means a bot. */
const Body = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  website: z.string().optional(),
});

export type ParsedSubscribe =
  | { ok: true; email: string; honeypot: boolean }
  | { ok: false };

export function parseSubscribeBody(body: unknown): ParsedSubscribe {
  const r = Body.safeParse(body);
  if (!r.success) return { ok: false };
  return { ok: true, email: r.data.email, honeypot: (r.data.website ?? "").length > 0 };
}

/** A returning subscriber is not an error to them. Resend answers a duplicate
 *  contact with 409, or a 4xx whose message says so. */
export function resendSaysAlreadyExists(status: number, bodyText: string): boolean {
  if (status === 409) return true;
  return status >= 400 && status < 500 && /already exists/i.test(bodyText);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test lib/subscribe.test.ts`
Expected: 4 passing. Then `npm test` all green.

- [ ] **Step 5: Commit**

```bash
git add lib/subscribe.ts lib/subscribe.test.ts
git commit -m "$(printf 'Add subscribe body parsing and Resend duplicate detection\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01PvCtK42hHu7uq5pnZhqc61')"
```

---

### Task 6: `POST /api/subscribe`

**Files:**
- Create: `app/api/subscribe/route.ts`

**Interfaces:**
- Consumes: `parseSubscribeBody`, `resendSaysAlreadyExists` from `@/lib/subscribe` (Task 5). Env `RESEND_API_KEY`, `RESEND_SEGMENT_ID`.
- Produces: JSON responses `{ ok: true }` (200), `{ error: "invalid_email" }` (400), `{ error: "rate_limited" }` (429), `{ error: "not_configured" }` (503), `{ error: "upstream" }` (502). The form (Task 7) switches on `error`.

- [ ] **Step 1: Write the route**

```ts
// app/api/subscribe/route.ts
import { parseSubscribeBody, resendSaysAlreadyExists } from "@/lib/subscribe";

export const runtime = "nodejs";
export const maxDuration = 10;

// Best-effort, in-memory: Fluid Compute reuses instances, a cold one starts
// empty. Enough for a sign-up form; see the spec's risks section.
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count += 1;
  return false;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;
  // Preview deployments and local dev get no key on purpose, so a test build
  // can never add real contacts.
  if (!apiKey || !segmentId) return json({ error: "not_configured" }, 503);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) return json({ error: "rate_limited" }, 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_email" }, 400);
  }
  const parsed = parseSubscribeBody(body);
  if (!parsed.ok) return json({ error: "invalid_email" }, 400);
  if (parsed.honeypot) return json({ ok: true }); // bots see success and nothing happens

  const res = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: parsed.email, segments: [{ id: segmentId }] }),
  });
  if (res.ok) return json({ ok: true });

  const text = await res.text();
  if (resendSaysAlreadyExists(res.status, text)) return json({ ok: true });
  console.error(`[subscribe] Resend ${res.status}: ${text.slice(0, 300)}`);
  return json({ error: "upstream" }, 502);
}
```

- [ ] **Step 2: Build to type-check**

Run: `npm run build`
Expected: `✓ Compiled successfully` and `/api/subscribe` listed as a dynamic (ƒ) route.

- [ ] **Step 3: Exercise the unconfigured path against the dev server**

Make sure `.env.local` does NOT contain `RESEND_API_KEY` yet. Run `npm run dev` in one terminal, then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/subscribe -H 'content-type: application/json' -d '{"email":"a@b.co"}'
```
Expected: `503`.

- [ ] **Step 4: Exercise the configured paths**

Add to `.env.local` (values from Resend / the segment id) and restart `npm run dev`:
```
RESEND_API_KEY=re_…
RESEND_SEGMENT_ID=bd776c75-cb49-47e2-b256-f25943d50ab9
```
Then:
```bash
# invalid → 400
curl -s -X POST localhost:3000/api/subscribe -H 'content-type: application/json' -d '{"email":"nope"}'
# honeypot → 200 and NO contact appears in Resend
curl -s -X POST localhost:3000/api/subscribe -H 'content-type: application/json' -d '{"email":"bot@example.com","website":"x"}'
# real → 200 and the address appears under the segment in Resend's dashboard
curl -s -X POST localhost:3000/api/subscribe -H 'content-type: application/json' -d '{"email":"YOUR-OWN-ADDRESS"}'
# same again → 200 (duplicate treated as success)
curl -s -X POST localhost:3000/api/subscribe -H 'content-type: application/json' -d '{"email":"YOUR-OWN-ADDRESS"}'
# 6th call within 10 minutes → 429
for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w "%{http_code} " -X POST localhost:3000/api/subscribe -H 'content-type: application/json' -d '{"email":"nope"}'; done; echo
```
Expected: `{"error":"invalid_email"}`, `{"ok":true}`, `{"ok":true}`, `{"ok":true}`, and the loop ends with `429`. Check the Resend dashboard: only your own address was added. Use your own address here — it doubles as the recipient for the live send in Task 9.

- [ ] **Step 5: Commit**

```bash
git add app/api/subscribe/route.ts
git commit -m "$(printf 'Add POST /api/subscribe: Resend contact into the notifications segment\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01PvCtK42hHu7uq5pnZhqc61')"
```

---

### Task 7: `SubscribeForm` in the footer

**Files:**
- Create: `components/SubscribeForm.tsx`
- Modify: `app/layout.tsx` (the `<footer>` block, currently lines 69–87)

**Interfaces:**
- Consumes: `POST /api/subscribe` response shapes from Task 6.

- [ ] **Step 1: Write the component**

```tsx
// components/SubscribeForm.tsx
"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "invalid" | "paused" | "error";

const MESSAGES: Record<Exclude<Status, "idle" | "sending">, string> = {
  done: "You're on the list.",
  invalid: "That address didn't work — try again?",
  paused: "Sign-ups are paused.",
  error: "Something went wrong — try again in a minute.",
};

/** Footer sign-up for model-release emails. Posts to /api/subscribe; the
 *  hidden `website` field is a honeypot that real visitors never see. */
export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("done");
        setEmail("");
      } else if (data.error === "invalid_email") setStatus("invalid");
      else if (data.error === "not_configured") setStatus("paused");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-2" aria-label="Get an email when a new model is added">
      <label htmlFor="subscribe-email" className="text-ink-2">
        Get an email when a new model is added
      </label>
      <div className="flex w-full max-w-sm gap-2">
        <input
          id="subscribe-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
          className="min-w-0 flex-1 rounded border border-line bg-surface px-2 py-1.5 text-xs text-ink placeholder:text-ink-3"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded border border-line-strong bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-white/5 disabled:opacity-60"
        >
          {status === "sending" ? "Adding…" : "Notify me"}
        </button>
        {/* Honeypot: hidden from people, filled by bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
      </div>
      <p role="status" aria-live="polite" className="min-h-4 text-ink-3">
        {status === "idle" || status === "sending" ? "" : MESSAGES[status]}
      </p>
    </form>
  );
}
```

- [ ] **Step 2: Render it in the footer**

In `app/layout.tsx`, add the import next to `Nav`:
```tsx
import { SubscribeForm } from "@/components/SubscribeForm";
```
and insert `<SubscribeForm />` as the first child of the `<footer>`, before the existing `<p>Wait Which Model? · data curated…</p>`. Change the footer's `gap-1.5` to `gap-3` so the form has breathing room above the two existing lines.

- [ ] **Step 3: Build and check in the browser**

Run: `npm run build` — expected `✓ Compiled successfully`.
Run: `npm run dev`, open http://localhost:3000, scroll to the footer. Expected: the label, input and "Notify me" button centred above the existing footer lines; the honeypot is not visible; tabbing from the input goes to the button, not to a hidden field. Submit your own address → "You're on the list." Remove the two env vars from `.env.local`, restart, submit → "Sign-ups are paused." Submit `nope` → the browser's own email validation blocks it; submit `a@b` (passes the browser, fails zod) → "That address didn't work — try again?".

- [ ] **Step 4: Commit**

```bash
git add components/SubscribeForm.tsx app/layout.tsx
git commit -m "$(printf 'Add footer subscribe form for model release emails\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01PvCtK42hHu7uq5pnZhqc61')"
```

---

### Task 8: Privacy policy and docs

**Files:**
- Modify: `app/privacy/page.tsx` (intro paragraph at lines 20–24, "What this site doesn't do" at lines 45–52, "Last updated" at line 16)
- Modify: `AGENTS.md` (add a "Notifications" section after "Data files")
- Modify: `protocols/DAILY_SWEEP_PROTOCOL.md` (after the "An unattended run…" paragraph near line 18)

- [ ] **Step 1: Update the privacy page**

Replace the intro paragraph:
```tsx
        <p>
          Wait Which Model? is a static reference site. It has no user accounts and
          nothing to log in to. The one thing it can collect is an email address, and
          only if you type it into the sign-up box in the footer.
        </p>

        <div>
          <h2 className="text-base font-semibold text-ink">Email notifications</h2>
          <p className="mt-2">
            If you subscribe, your address is stored with{" "}
            <a
              href="https://resend.com/legal/privacy-policy"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resend
            </a>
            , the service that sends the emails, and used for exactly one thing: an email
            when a new model is added to this site. Nothing else is sent to it, and it is
            not shared or sold. Every email has an unsubscribe link, which removes you
            immediately.
          </p>
        </div>
```
In "What this site doesn't do", change `no data is collected, stored, or shared beyond what's described above` to `no data is collected, stored, or shared beyond the analytics and the optional email sign-up described above`. Change "Last updated Jul 22, 2026" to "Last updated Sep 3, 2026".

- [ ] **Step 2: Document the pipeline in AGENTS.md**

Insert after the "Data files" section's integrity-check code block and before "## Code layout":

```markdown
## Notifications

Subscribers (a Resend **Segment**, id in `RESEND_SEGMENT_ID`) get one email per push to `main` that adds a model to `data/models.json`. Two halves, nothing shared but the segment:

- **Sign-up:** `components/SubscribeForm` in the footer → `app/api/subscribe/route.ts` → Resend `POST /contacts`. Needs `RESEND_API_KEY` + `RESEND_SEGMENT_ID` in Vercel (production only — previews deliberately return 503 "not_configured"). Pure parsing in `lib/subscribe.ts`.
- **Sender:** `.github/workflows/notify-new-models.yml` (push to main, `paths: data/models.json`) runs `scripts/notify-new-models.js`: diffs model ids between `github.event.before` and `github.sha`, waits up to 10 min for the site to serve each new `/models/<id>`, then Resend `POST /broadcasts` with `send: true`. Pure helpers (`newModelIds`, `buildEmail`) in `scripts/lib/notify.js`, tested under `npm test`. Secrets are GitHub repository secrets of the same names.
- Subject is `NEW model release: <every added model name, comma-separated>`. Deleting or editing a model never notifies. Re-running a workflow run by hand **resends** — don't.
- Dry run: `BEFORE_SHA=<sha> AFTER_SHA=<sha> node scripts/notify-new-models.js --dry-run`. Design: `docs/superpowers/specs/2026-09-03-model-release-notifications-design.md`.
```

- [ ] **Step 3: One line in the daily sweep protocol**

After the paragraph ending "It never writes to `main` and never deploys." add:

```markdown
Merging a sweep PR that adds models is what triggers the subscriber email (see
`AGENTS.md` → Notifications), so a wrong model merged is a wrong email sent — review the
PR's `models.json` additions before merging.
```

- [ ] **Step 4: Build, then commit**

Run: `npm run build` — expected green (the privacy page is static).

```bash
git add app/privacy/page.tsx AGENTS.md protocols/DAILY_SWEEP_PROTOCOL.md
git commit -m "$(printf 'Document email notifications in privacy policy, AGENTS.md and sweep protocol\n\nCo-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01PvCtK42hHu7uq5pnZhqc61')"
```

---

### Task 9: Live send to Maia only, then PR

**Files:** none new.

- [ ] **Step 1: Confirm the segment holds only Maia's address**

In Resend → Audience → Segments → "Model release notifications": the only contact should be the address subscribed in Task 6/7. If test addresses were added, delete them there first.

- [ ] **Step 2: Live send from the real range**

With `RESEND_API_KEY` and `RESEND_SEGMENT_ID` in `.env.local`:
```bash
set -a; source .env.local; set +a
BEFORE_SHA=2c55e20 AFTER_SHA=b6f2a4e POLL_TIMEOUT_MS=60000 node scripts/notify-new-models.js
```
Expected: `[notify] new models: …`, possibly `waiting for … to deploy…` lines (these pages already exist on production so it should pass immediately), then `[notify] broadcast sent: {"id":"…"}`. An email titled `NEW model release: Gemini 3.8 Flash, …` arrives at Maia's address with three linked model blocks and a working unsubscribe link. Check the broadcast under Resend → Broadcasts.

- [ ] **Step 3: Run everything once more**

Run: `npm test && npm run build`
Expected: all tests pass, build green.

- [ ] **Step 4: Push and open the PR**

```bash
git push -u origin feature/release-notifications
gh pr create --base main --head feature/release-notifications \
  --title "Email notifications when a new model is added" \
  --body "$(printf 'Subscribe form in the footer → /api/subscribe → Resend segment. GitHub Actions on push to main diffs data/models.json and sends one Resend broadcast per push listing the added models (subject: NEW model release: …).\n\nSpec: docs/superpowers/specs/2026-09-03-model-release-notifications-design.md\nPlan: docs/superpowers/plans/2026-09-03-model-release-notifications.md\n\nVerified: unit tests, dry run against the 09-03 sweep range, one live send to a single-address segment.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\nhttps://claude.ai/code/session_01PvCtK42hHu7uq5pnZhqc61')"
```

- [ ] **Step 5: After merge, watch the first real run**

The next merge that adds a model (a daily-sweep PR, typically) triggers the workflow. Open the repo's Actions tab → "Notify subscribers of new models" and confirm it went green and the email arrived. If it failed, the log's last `[notify]` line says why.
