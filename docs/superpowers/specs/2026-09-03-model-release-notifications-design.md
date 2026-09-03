---
type: Design Spec
title: Model release email notifications
description: Design for a subscribe form on the site and a GitHub Actions sender that emails every subscriber, via Resend,
  whenever a push to main adds a model to data/models.json.
tags:
- docs
- superpowers
- specs
generated:
  by: human:maia
  at: '2026-09-03T00:00:00Z'
---

# Model release email notifications

**Date:** 2026-09-03
**Status:** approved in conversation — awaiting spec review

## Problem

The site tracks new frontier models within a day of release, but nobody is told. A visitor
who wants to know when something new lands has to keep coming back. Maia wants an email
notification for every new model, and she wants it automatic: no "send" step for her.

## Goal

1. A visitor can enter their email on the site and be subscribed.
2. Every time a push to `main` adds one or more models to `data/models.json`, every
   subscriber gets **one** email listing the models added, with links to their pages.
3. Nothing about this runs by hand. Once the secrets are in place it is fully unattended.

## Non-goals

- No confirmation email (single opt-in). A honeypot field and a per-IP rate limit are the
  only abuse controls.
- No notifications for anything other than model additions: no news, no stat fills, no
  status changes.
- No database. Subscribers live in Resend.
- No email design system. One plain HTML email built from the data files.
- No per-subscriber preferences (by lab, by tier). Resend's unsubscribe link is the only
  control a subscriber has.

## Decisions already made

| Question | Decision |
|---|---|
| Where subscribers live | Resend. Contacts are team-wide; a **Segment** (`bd776c75-cb49-47e2-b256-f25943d50ab9`, "Model release notifications") groups this site's subscribers. Resend replaced Audiences with Segments; the API takes `segment_id`. |
| From address | `Wait Which Model? <notify@waitwhichmodel.fyi>` — the site's domain is verified in Resend. |
| Opt-in | Single. Submitting the form subscribes immediately. |
| Batching | One email per push to `main`, however many models it adds. |
| Subject | `NEW model release: ` + every added model's `name`, comma-separated, never truncated. |
| Trigger | GitHub Actions on `push` to `main` (Approach A). Rejected: a Vercel deploy webhook into an API route (the site has no state to diff against) and a manual script. |

## Architecture

Two halves that share nothing but the Resend segment:

```
visitor ──form──▶ POST /api/subscribe ──▶ Resend: POST /contacts {segments:[{id}]}
                  (Vercel, Node runtime)

push to main ──▶ GitHub Actions: notify-new-models.yml
                    └─ scripts/notify-new-models.js
                         1. diff model ids  before → after commit
                         2. wait until the site serves each new /models/<id>
                         3. Resend: POST /broadcasts {segment_id, send:true}
```

The site stays static and data-driven; nothing in the Next.js app knows about releases.
The sender never touches the site's code path; it reads the two JSON files at the pushed
commit and the public site over HTTP.

## Half 1 — the subscribe form and endpoint

**Component:** `components/SubscribeForm.tsx`, a small client component rendered inside the
existing `<footer>` in `app/layout.tsx`, so it appears on every page. One email input, one
button, a visually-hidden honeypot text input named `website`, and a status line that shows
"You're on the list." / "That address didn't work — try again?" / "Sign-ups are paused."
It never redirects; state is local.

**Route:** `app/api/subscribe/route.ts`, `runtime = "nodejs"`, POST only, modelled on
`app/api/which-model/route.ts`.

1. If `RESEND_API_KEY` or `RESEND_SEGMENT_ID` is unset → `503 { error: "not_configured" }`.
   Preview deployments and local dev without the vars show "Sign-ups are paused" rather than
   adding real contacts from a test build.
2. Parse the JSON body with zod: `{ email: string (trimmed, lowercased, max 254, must satisfy
   z.email()), website?: string }`. Invalid → `400 { error: "invalid_email" }`.
3. Honeypot: if `website` is non-empty → `200 { ok: true }` and do nothing. Bots see success.
4. Rate limit: in-memory `Map<ip, timestamps[]>`, 5 requests per 10 minutes per IP, IP from
   `x-forwarded-for`'s first entry. Over the limit → `429 { error: "rate_limited" }`.
   Best-effort by design — Fluid Compute reuses instances, but a cold instance starts empty
   and that is acceptable for a sign-up form.
5. Call `POST https://api.resend.com/contacts` with
   `{ email, segments: [{ id: RESEND_SEGMENT_ID }] }` and `Authorization: Bearer`.
   - 2xx → `200 { ok: true }`.
   - Resend reports the contact already exists (409, or a 4xx whose message says so) →
     `200 { ok: true }`. A returning subscriber is not an error to them.
   - anything else → log the status and body server-side, `502 { error: "upstream" }`.

No Resend SDK: one `fetch` call is smaller than a dependency, and the sender script must run
under plain Node in Actions anyway.

## Half 2 — the sender

**Workflow:** `.github/workflows/notify-new-models.yml`

```yaml
on:
  push:
    branches: [main]
    paths: [data/models.json]
concurrency: notify-new-models          # pushes in quick succession run one at a time
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }         # the script needs the before-commit
      - uses: actions/setup-node@v4
        with: { node-version: 24 }
      - run: node scripts/notify-new-models.js
        env:
          BEFORE_SHA: ${{ github.event.before }}
          AFTER_SHA:  ${{ github.sha }}
          RESEND_API_KEY:    ${{ secrets.RESEND_API_KEY }}
          RESEND_SEGMENT_ID: ${{ secrets.RESEND_SEGMENT_ID }}
```

`paths:` means the workflow doesn't even start for pushes that don't touch models.json.

**Script:** `scripts/notify-new-models.js` (CommonJS, no dependencies, like the other
scripts). It is a thin wire around pure functions in `scripts/lib/notify.js`:

- `newModelIds(beforeModels, afterModels)` → ids present in `after` and not in `before`,
  in `after` order. This is what "a model was added" means, and it is exactly the site's own
  definition: a new `id` in `data/models.json`.
- `buildEmail(models, companies, siteUrl)` → `{ subject, html, text }`. See "The email".

The script:

1. Reads `BEFORE_SHA`/`AFTER_SHA`. If `BEFORE_SHA` is all zeros (branch creation) or
   `git cat-file -e` fails for it (history rewritten), log and exit 0 — better to miss one
   notification than to email the whole directory as "new".
2. `git show <sha>:data/models.json` for both commits, plus `companies.json` at `AFTER_SHA`.
   Computes `newModelIds`. None → log "no new models" and exit 0.
3. Polls `GET <siteUrl>/models/<id>` for each new id every 20 s until every one returns
   200, up to 10 minutes. Vercel normally deploys `main` in two or three minutes; this keeps
   the links live when the email lands. On timeout it **still sends**, logging a warning —
   a link that works in a minute beats a notification that never goes out.
4. `POST https://api.resend.com/broadcasts` with
   `{ segment_id, from, subject, html, text, name: "Model release <YYYY-MM-DD>", send: true }`.
   Non-2xx → print the response and exit 1 so the run shows red in Actions.
5. `--dry-run` skips steps 3–4 and prints the subject, the recipients' segment id and the
   text body. `SITE_URL` (default `https://www.waitwhichmodel.fyi`) and `NOTIFY_FROM`
   (default `Wait Which Model? <notify@waitwhichmodel.fyi>`) are overridable for tests.

Idempotency is deliberately not solved: re-running a workflow run by hand would resend.
That is a button nobody needs to press.

## The email

Subject: `NEW model release: Gemini 3.8 Flash, Gemini 3.8 Flash Cyber` — all names, in
models.json order.

Body, one block per model:

- **Name** as a link to `<siteUrl>/models/<id>`
- lab name (from companies.json) · tier (Flagship / Balanced / Fast) · released YYYY-MM-DD
- `availability === "restricted"` → a one-line "Restricted access" note, since a subscriber
  can't go and use it
- the first `strengths[]` item, if any, as the one-line teaser (they are written as
  behavioural fragments and read well alone)

Then "See every model →" linking to the directory, and Resend's unsubscribe link via the
`{{{RESEND_UNSUBSCRIBE_URL}}}` placeholder, which Resend substitutes per recipient. A
plain-text `text` version carries the same content, one model per paragraph.

Inline styles only, light background, system font stack. No images, no tracking pixels
beyond what Resend adds. The HTML is built with a small escape helper; model names and
strengths are data, not markup.

## Configuration

| Where | Name | Used by |
|---|---|---|
| Vercel env (production only) | `RESEND_API_KEY`, `RESEND_SEGMENT_ID` | `/api/subscribe` |
| GitHub repo secrets | `RESEND_API_KEY`, `RESEND_SEGMENT_ID` | the workflow |
| `.env.local` (optional) | same two | local form testing |

The API key is a Resend **Full access** key: creating contacts and broadcasts is not
"sending", which is all a Sending-access key permits. Preview deployments get no key on
purpose (see route step 1).

## Error handling, summarised

| Failure | Behaviour |
|---|---|
| Resend down during sign-up | 502 to the form, "That address didn't work — try again?" |
| Duplicate sign-up | Reported as success |
| Bot fills honeypot | Silent success, no contact created |
| Push with no new ids | Workflow exits 0 after the diff |
| Force-push / unknown before-commit | Workflow exits 0 with a log line, sends nothing |
| Site slow to deploy | Sends after 10 min anyway, with a warning |
| Resend rejects the broadcast | Workflow fails red; nothing sent; Maia sees it in Actions |

## Testing

- `scripts/lib/notify.test.js` under `npm test`: `newModelIds` on identical / added / removed /
  reordered inputs; `buildEmail` subject for one and three models, escaping of `<` in a
  name, restricted-access line present only when `availability !== "general"`, the
  unsubscribe placeholder present in both html and text.
- Dry run against a real range once the script exists:
  `BEFORE_SHA=2c55e20 AFTER_SHA=b6f2a4e node scripts/notify-new-models.js --dry-run`
  (the 09-03 sweep merge, which added three models).
- One live send to a segment containing only Maia's address before the workflow is merged,
  by running the script locally with the real secrets and `AFTER_SHA` at a real addition.
- The form: `npm run dev` with the two vars in `.env.local`, subscribe, confirm the contact
  appears in Resend's dashboard under the segment; then remove the vars and confirm the
  "paused" message.

## Files

| File | Change |
|---|---|
| `components/SubscribeForm.tsx` | new |
| `app/layout.tsx` | render the form in the footer |
| `app/api/subscribe/route.ts` | new |
| `scripts/lib/notify.js`, `scripts/lib/notify.test.js` | new, pure |
| `scripts/notify-new-models.js` | new, the runner |
| `.github/workflows/notify-new-models.yml` | new |
| `AGENTS.md` | one bullet under a new "Notifications" heading: what fires, where the secrets are, how to dry-run |
| `protocols/DAILY_SWEEP_PROTOCOL.md` | one line: merging a sweep PR that adds models triggers a subscriber email |

## Risks, stated plainly

- **A bad merge emails everyone.** If a PR adds a wrong model and is merged, subscribers hear
  about it before it is reverted. Mitigation is the existing one: nothing reaches `main`
  unreviewed. Deleting a model does not notify.
- **Single opt-in means anyone can subscribe any address.** The honeypot and rate limit stop
  bulk abuse, not a single spiteful sign-up. Every email has an unsubscribe link. If this
  becomes a problem, double opt-in is the upgrade path and is additive.
- **In-memory rate limiting resets on cold start.** Accepted; the form is low-value to abuse.
- **The before-commit diff trusts `github.event.before`.** A merge of an old branch that
  re-adds a previously deleted model would notify about it as new. It *is* new to the site.
