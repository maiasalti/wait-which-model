#!/usr/bin/env node
/** Sends one Resend broadcast for every model added to data/models.json
 *  between BEFORE_SHA and AFTER_SHA. Run by .github/workflows/notify-new-models.yml
 *  on every push to main; see docs/superpowers/specs/2026-09-03-model-release-notifications-design.md.
 *
 *  Dry run against a real range (the 09-03 sweep merge, three models):
 *    BEFORE_SHA=2c55e20 AFTER_SHA=b6f2a4e node scripts/notify-new-models.js --dry-run
 *
 *  Announce specific models by hand (e.g. re-announce after a failed run);
 *  this bypasses the digest queue and cooldown:
 *    MODEL_IDS=claude-fable-5-1,gemini-3-8-flash AFTER_SHA=origin/main node scripts/notify-new-models.js --dry-run
 *
 *  Cooldown: a merge inside NOTIFY_COOLDOWN_HOURS (default 20) of the last
 *  email (per Resend's broadcast history) sends nothing; the daily scheduled
 *  run then announces everything added since that email as one digest.
 *  Backfills merged with "[skip notify]" in the merge commit are never announced.
 */
const { execFileSync } = require("child_process");
const { newModelIds, isUsableSha, parseModelIds, buildEmail, cooldownActive, lastBroadcastSentAt } = require("./lib/notify.js");

const DRY_RUN = process.argv.includes("--dry-run");
const SITE_URL = (process.env.SITE_URL || "https://www.waitwhichmodel.fyi").replace(/\/$/, "");
const FROM = process.env.NOTIFY_FROM || "Wait Which Model? <notify@waitwhichmodel.fyi>";
const POLL_TIMEOUT_MS = Number(process.env.POLL_TIMEOUT_MS || 10 * 60_000);
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 20_000);
// Merges that land within this window of the last email are not sent; the
// daily scheduled run then announces everything added since that email as one
// digest. Keeps a burst of separate PR merges from turning into a burst of emails.
const COOLDOWN_MS = Number(process.env.NOTIFY_COOLDOWN_HOURS || 20) * 3600_000;

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
        const res = await fetch(`${SITE_URL}/models/${id}`, {
          method: "HEAD",
          redirect: "follow",
          signal: AbortSignal.timeout(10_000),
        });
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

/** When the last email went out, from Resend's own broadcast history. */
async function lastEmailSentAt() {
  const res = await fetch("https://api.resend.com/broadcasts?limit=100", {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  });
  if (!res.ok) throw new Error(`Resend broadcasts list: ${res.status} ${await res.text()}`);
  const body = await res.json();
  return lastBroadcastSentAt(body.data, process.env.RESEND_SEGMENT_ID);
}

/** The commit `ref` pointed at when the last email went out. */
function commitAt(iso, ref) {
  const out = execFileSync("git", ["rev-list", "-1", `--before=${iso}`, ref]).toString().trim();
  return out || null;
}

/** True when the first-parent commit that brought `id` onto `ref` carries the
 *  [skip notify] marker, i.e. it was merged as a backfill. */
function addedWithSkipMarker(id, base, ref) {
  const out = execFileSync("git", [
    "log", "--first-parent", "--format=%H%x00%B%x01", `-S"id": "${id}"`, `${base}..${ref}`, "--", "data/models.json",
  ]).toString();
  const entries = out.split("\x01").map((e) => e.trim()).filter(Boolean);
  const oldest = entries[entries.length - 1];
  return Boolean(oldest && oldest.includes("[skip notify]"));
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
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    throw new Error("Resend returned no broadcast id: " + body);
  }
  if (typeof parsed?.id !== "string" || parsed.id.length === 0) {
    throw new Error("Resend returned no broadcast id: " + body);
  }
  return parsed;
}

async function main() {
  const { BEFORE_SHA, AFTER_SHA, MODEL_IDS } = process.env;
  if (!AFTER_SHA) throw new Error("AFTER_SHA is required");

  const after = gitJson(AFTER_SHA, "data/models.json");
  const companies = gitJson(AFTER_SHA, "data/companies.json");
  const manualIds = parseModelIds(MODEL_IDS);
  const manual = manualIds.length > 0;

  let ids;
  let lastSentAt;
  if (manual) {
    // A human asked for exactly this email: no cooldown, no digest.
    for (const id of manualIds) {
      if (!after.some((m) => m.id === id)) throw new Error(`MODEL_IDS: unknown model id ${id}`);
    }
    ids = manualIds;
    log("manual selection:", ids.join(", "));
  } else if (process.env.RESEND_API_KEY || process.env.LAST_SENT_AT) {
    // Everything added since the last email, minus backfills merged with [skip notify].
    // LAST_SENT_AT is a dry-run hook that stands in for Resend's history.
    lastSentAt = process.env.LAST_SENT_AT || (await lastEmailSentAt());
    const base = lastSentAt ? commitAt(lastSentAt, AFTER_SHA) : null;
    if (!base) {
      log(lastSentAt ? `no commit before ${lastSentAt}` : "no previous broadcast", "— falling back to the push diff");
      ids = isUsableSha(BEFORE_SHA) && shaExists(BEFORE_SHA) ? newModelIds(gitJson(BEFORE_SHA, "data/models.json"), after) : [];
    } else {
      log(`last email ${lastSentAt}; diffing models.json since ${base.slice(0, 7)}`);
      ids = newModelIds(gitJson(base, "data/models.json"), after).filter((id) => {
        const skipped = addedWithSkipMarker(id, base, AFTER_SHA);
        if (skipped) log("skipping backfill:", id);
        return !skipped;
      });
    }
  } else {
    // No Resend key (local dry run): plain push diff, no cooldown.
    if (!isUsableSha(BEFORE_SHA) || !shaExists(BEFORE_SHA)) {
      log(`no usable before-commit (${BEFORE_SHA || "unset"}) and no RESEND_API_KEY; nothing to diff`);
      return;
    }
    ids = newModelIds(gitJson(BEFORE_SHA, "data/models.json"), after);
  }

  if (ids.length === 0) {
    log("nothing to announce");
    return;
  }
  log("to announce:", ids.join(", "));

  if (!manual && cooldownActive(lastSentAt, Date.now(), COOLDOWN_MS)) {
    log(`last email went out at ${lastSentAt}, inside the ${COOLDOWN_MS / 3600_000}h cooldown; the daily scheduled run will send these as one digest`);
    return;
  }

  const added = ids.map((id) => after.find((m) => m.id === id));
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
  log("broadcast sent:", result.id, "for", ids.join(", "));
}

main().catch((err) => {
  console.error("[notify] FAILED:", err.message);
  process.exit(1);
});
