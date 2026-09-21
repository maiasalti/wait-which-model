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
 *  email queues its models in the NOTIFY_PENDING_IDS repository variable
 *  instead of sending; the daily scheduled run flushes the queue as one digest.
 */
const { execFileSync } = require("child_process");
const { newModelIds, isUsableSha, parseModelIds, buildEmail, encodePending, decodePending, mergePending, cooldownActive } = require("./lib/notify.js");

const DRY_RUN = process.argv.includes("--dry-run");
const SITE_URL = (process.env.SITE_URL || "https://www.waitwhichmodel.fyi").replace(/\/$/, "");
const FROM = process.env.NOTIFY_FROM || "Wait Which Model? <notify@waitwhichmodel.fyi>";
const POLL_TIMEOUT_MS = Number(process.env.POLL_TIMEOUT_MS || 10 * 60_000);
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 20_000);
// Merges that land within this window of the last email are queued, not sent;
// the daily scheduled run flushes the queue as one digest. Keeps a burst of
// separate PR merges from turning into a burst of emails.
const COOLDOWN_MS = Number(process.env.NOTIFY_COOLDOWN_HOURS || 20) * 3600_000;
const VAR_PENDING = "NOTIFY_PENDING_IDS";
const VAR_LAST_SENT = "NOTIFY_LAST_SENT_AT";

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

/** Repository variables hold the digest queue and the last send time. The
 *  workflow token needs `actions: write` for the PATCH/POST. */
async function ghVar(name) {
  const { GITHUB_REPOSITORY, GITHUB_TOKEN } = process.env;
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/variables/${name}`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
  });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`GitHub variables GET ${name}: ${res.status} ${await res.text()}`);
  return (await res.json()).value;
}

async function setGhVar(name, value) {
  const { GITHUB_REPOSITORY, GITHUB_TOKEN } = process.env;
  const headers = { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" };
  let res = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/variables/${name}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ name, value }),
  });
  if (res.status === 404) {
    res = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/variables`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, value }),
    });
  }
  if (!res.ok) throw new Error(`GitHub variables set ${name}: ${res.status} ${await res.text()}`);
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

  // What this run itself added. A scheduled flush has no diff base and adds nothing.
  let ids = [];
  if (manualIds.length > 0) {
    for (const id of manualIds) {
      if (!after.some((m) => m.id === id)) throw new Error(`MODEL_IDS: unknown model id ${id}`);
    }
    ids = manualIds;
    log("manual selection:", ids.join(", "));
  } else if (isUsableSha(BEFORE_SHA) && shaExists(BEFORE_SHA)) {
    ids = newModelIds(gitJson(BEFORE_SHA, "data/models.json"), after);
    if (ids.length) log("new models:", ids.join(", "));
    else log("no new models between", BEFORE_SHA, "and", AFTER_SHA);
  } else {
    log(`no usable before-commit (${BEFORE_SHA || "unset"}); checking the digest queue only`);
  }

  // The digest queue: manual selections bypass it (a human asked for exactly this email).
  const manual = manualIds.length > 0;
  const stateAvailable = Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY);
  let pending = ids;
  let lastSentAt;
  if (!manual && stateAvailable) {
    const [storedPending, storedLast] = await Promise.all([ghVar(VAR_PENDING), ghVar(VAR_LAST_SENT)]);
    lastSentAt = storedLast;
    pending = mergePending(storedPending, ids);
    const queued = decodePending(storedPending);
    if (queued.length) log("already queued:", queued.join(", "));
  } else if (!manual) {
    log("no GITHUB_TOKEN/GITHUB_REPOSITORY; digest queue and cooldown disabled for this run");
  }

  if (pending.length === 0) {
    log("nothing to announce");
    return;
  }

  // Ids queued earlier may have been deleted since; announce only what still exists.
  const announce = pending.filter((id) => after.some((m) => m.id === id));
  const dropped = pending.filter((id) => !announce.includes(id));
  if (dropped.length) log("dropped (no longer in models.json):", dropped.join(", "));

  if (!manual && cooldownActive(lastSentAt, Date.now(), COOLDOWN_MS)) {
    log(`last email went out at ${lastSentAt}, inside the ${COOLDOWN_MS / 3600_000}h cooldown; queueing`, announce.join(", "));
    if (!DRY_RUN && stateAvailable) await setGhVar(VAR_PENDING, encodePending(announce));
    return;
  }
  if (announce.length === 0) {
    log("nothing left to announce");
    if (!DRY_RUN && stateAvailable && !manual) await setGhVar(VAR_PENDING, encodePending([]));
    return;
  }

  const added = announce.map((id) => after.find((m) => m.id === id));
  const email = buildEmail(added, companies, SITE_URL);
  const dateLabel = new Date().toISOString().slice(0, 10);

  if (DRY_RUN) {
    log("dry run — would send to segment", process.env.RESEND_SEGMENT_ID || "(unset)", "from", FROM);
    console.log("\nSubject:", email.subject, "\n\n" + email.text);
    return;
  }

  for (const k of ["RESEND_API_KEY", "RESEND_SEGMENT_ID"]) if (!process.env[k]) throw new Error(`${k} is required`);
  // Record the send before making it: a crash after this point can cost one
  // email (re-announce with MODEL_IDS), never produce a duplicate.
  if (stateAvailable && !manual) {
    await setGhVar(VAR_PENDING, encodePending([]));
    await setGhVar(VAR_LAST_SENT, new Date().toISOString());
  }
  await waitForPages(announce);
  const result = await sendBroadcast(email, dateLabel);
  log("broadcast sent:", result.id, "for", announce.join(", "));
}

main().catch((err) => {
  console.error("[notify] FAILED:", err.message);
  process.exit(1);
});
