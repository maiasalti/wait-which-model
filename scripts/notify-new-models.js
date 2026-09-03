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
  log("broadcast sent:", result.id);
}

main().catch((err) => {
  console.error("[notify] FAILED:", err.message);
  process.exit(1);
});
