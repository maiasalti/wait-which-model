#!/bin/bash
#
# Daily automated sweep — see protocols/DAILY_SWEEP_PROTOCOL.md and
# docs/superpowers/specs/2026-08-06-daily-sweep-design.md
#
# Researches new models, fills missing stats, checks data health, and opens a
# PULL REQUEST. It never writes to main and never deploys.
#
# Run by launchd weekdays at 10:30 (com.waitwhichmodel.daily-sweep).
# Run by hand any time with:  scripts/daily-sweep.sh --dry-run
#
set -uo pipefail

REPO="/Users/maia/Desktop/Projects/frontier-models-website"
LOG="$REPO/logs/daily-sweep.log"
TODAY="$(date +%Y-%m-%d)"
DOW="$(date +%u)"            # 1=Mon .. 7=Sun
BRANCH="auto/sweep-$TODAY"
CLAUDE="/Users/maia/.local/bin/claude"
TIMEOUT_SECS=3600            # a hung run must not sit there forever
FETCH_ATTEMPTS=5             # ~4 min of retries; see fetch_with_retry below

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

mkdir -p "$(dirname "$LOG")"
log() { printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M')" "$*" >> "$LOG"; }
say() { [ "$DRY_RUN" = 1 ] && echo "$*"; }

cd "$REPO" || { log "FAIL  cannot cd to $REPO"; exit 1; }

# ── Guard 0: already swept today ─────────────────────────────────────────────
# launchd fires a missed StartCalendarInterval job on wake. Without this, a
# laptop opened Monday after a shut weekend would run Friday's job and then
# Monday's back to back.
if [ "$DRY_RUN" = 0 ] && grep -q "^$TODAY " "$LOG" 2>/dev/null; then
  exit 0
fi

# ── Guard 1: weekdays only ───────────────────────────────────────────────────
if [ "$DRY_RUN" = 0 ] && [ "$DOW" -gt 5 ]; then
  exit 0
fi

# ── Guard 2: never clobber work in progress ──────────────────────────────────
if [ -n "$(git status --porcelain)" ]; then
  # Only a real run logs. A --dry-run must touch nothing, and writing a dated
  # line here would trip Guard 0 and silently cancel the day's actual sweep —
  # which is what the two 2026-08-06 SKIP lines in the log turned out to be.
  if [ "$DRY_RUN" = 0 ]; then
    log "SKIP  working tree dirty — refusing to touch a repo with uncommitted work"
  fi
  say  "working tree is dirty; a real run would stop here"
  exit 0
fi

START_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# ── Which jobs run today ─────────────────────────────────────────────────────
# Every weekday: health + new-model scan. Tue/Thu: stats fill. Mon: news sweep.
# Written as explicit ifs rather than `[ ] && x` chains: those return non-zero
# on the false branch, which is a footgun waiting for someone to add `set -e`.
JOBS="health models"
if [ "$DOW" = 2 ] || [ "$DOW" = 4 ]; then JOBS="$JOBS stats"; fi
if [ "$DOW" = 1 ]; then JOBS="$JOBS news"; fi

say "jobs for today (dow=$DOW): $JOBS"
if [ "$DRY_RUN" = 1 ]; then
  say "dry run — stopping before any branch, research, or PR"
  exit 0
fi

# ── Branch from origin/main ──────────────────────────────────────────────────
# launchd fires this job while the laptop is still waking, and Wi-Fi often has
# not reassociated yet — a single attempt dies on "Could not resolve host:
# github.com" and, because Guard 0 counts any dated log line as "handled
# today", nothing retries until tomorrow. That silently cost two sweeps.
# Retry the fetch itself rather than pinging something first: the fetch is both
# the readiness test and the operation that actually has to succeed.
# Explicit ifs, not `[ ] && return`, for the reason given under "Which jobs
# run today" above.
fetch_with_retry() {
  local attempt=1 delay=15
  FETCH_WAITED=0
  while :; do
    if git fetch --quiet origin main 2>/dev/null; then return 0; fi
    if [ "$attempt" -ge "$FETCH_ATTEMPTS" ]; then return 1; fi
    sleep "$delay"
    FETCH_WAITED=$((FETCH_WAITED + delay))
    attempt=$((attempt + 1))
    delay=$((delay * 2))
  done
}

if ! fetch_with_retry; then
  log "FAIL  git fetch failed — no network after $FETCH_ATTEMPTS attempts over ${FETCH_WAITED}s"
  exit 1
fi
git checkout --quiet -B "$BRANCH" origin/main || { log "FAIL  cannot create $BRANCH"; exit 1; }

restore() { git checkout --quiet "$START_BRANCH" 2>/dev/null; }

# ── Build the prompt for today's jobs ────────────────────────────────────────
PROMPT="You are the scheduled daily sweep for this repo. Today is $TODAY.

Read AGENTS.md first, then run ONLY the jobs listed here, following each protocol verbatim:

JOBS TODAY: $JOBS

- health : run the integrity check in AGENTS.md, then 'node scripts/frontier-status.js --apply'
           and 'node scripts/frontier-reigns.js --apply'. Report any status or reign changes.
           Also flag anything that looks internally inconsistent or unsourced.
- models : follow protocols/NEW_MODEL_RELEASE_PROTOCOL.md. Search the tracked companies for
           frontier models released since the newest releaseDate in data/models.json and not
           already tracked. If a model comes from an untracked lab, add the company too, with a
           colour that passes 'node scripts/palette-check.js' and a logo per lib/logos.ts
           conventions. Add nothing you cannot confirm from a primary source.
- stats  : follow protocols/STATS_FILLER_PROTOCOL.md and protocols/MODEL_SPECS_PROTOCOL.md for
           models with null cells. Skip anything already listed in data/stats-gaps.md or
           data/spec-gaps.md.
- news   : follow protocols/NEWS_SCAN_PROTOCOL.md for ALL tracked companies, covering the period
           since the newest date in data/news.json, all categories. Do not interview anyone —
           that scope is fixed for scheduled runs.

ABSOLUTE RULES:
- Never add a figure from memory. Unverifiable cells stay null and are logged to the gap ledgers.
- predecessorId requires an explicit replacement claim in a primary source. Naming order is not evidence.
- status is computed by the script, never hand-assigned.
- Do NOT run any git command. No commit, no branch, no push. The calling script owns all git.
- If you find nothing, change nothing. An empty run is a correct outcome.

When done, write a concise report to /tmp/sweep-report-$TODAY.md with: what changed per file, what
you could NOT verify and what you searched, and any status or reign changes. That file becomes the
pull request body, so write it for a human reviewer."

# ── Research, with a watchdog ────────────────────────────────────────────────
"$CLAUDE" -p "$PROMPT" \
  --permission-mode acceptEdits \
  --disallowedTools "Bash(git push:*)" "Bash(git commit:*)" "Bash(git checkout:*)" \
  > "/tmp/sweep-out-$TODAY.log" 2>&1 &
CLAUDE_PID=$!

( sleep "$TIMEOUT_SECS"; kill -9 "$CLAUDE_PID" 2>/dev/null ) & WATCHDOG=$!
wait "$CLAUDE_PID"; CLAUDE_RC=$?
kill "$WATCHDOG" 2>/dev/null

if [ "$CLAUDE_RC" -ne 0 ]; then
  log "FAIL  research step exited $CLAUDE_RC (see /tmp/sweep-out-$TODAY.log); branch $BRANCH left for inspection"
  restore
  exit 1
fi

# ── Nothing found? Clean up and stay silent ──────────────────────────────────
if [ -z "$(git status --porcelain)" ]; then
  restore
  git branch -q -D "$BRANCH" 2>/dev/null
  log "ok    nothing found ($JOBS)"
  exit 0
fi

# ── Commit to the branch BEFORE validating ───────────────────────────────────
# Validation used to run first, against an uncommitted tree, so a failure left
# the work as uncommitted changes — which `restore`'s checkout then carried
# onto $START_BRANCH, dirtying main and jamming Guard 2 on every later run,
# while the log claimed the branch had been "left for inspection". Committing
# first makes that claim true and leaves the checkout clean either way.
# It also means artefacts from the build below can never land in the commit.
CHANGED="$(git status --porcelain | wc -l | tr -d ' ')"
git add -A
git commit -q -m "Daily sweep $TODAY ($JOBS)

Automated run — see the pull request body for what was found and what could
not be verified. Every figure is researched from primary sources; unverifiable
cells are left null and logged to the gap ledgers.
" || { log "FAIL  commit failed"; restore; exit 1; }

# ── Validate before asking for review ────────────────────────────────────────
FAILED=""
bash -c "$(grep '^node -e' AGENTS.md | head -1)" > /tmp/sweep-integrity.log 2>&1 || FAILED="$FAILED integrity"
npm test  > /tmp/sweep-test.log  2>&1 || FAILED="$FAILED tests"
npm run build > /tmp/sweep-build.log 2>&1 || FAILED="$FAILED build"

if [ -n "$FAILED" ]; then
  log "FAIL  validation failed:$FAILED — no PR opened; work committed on $BRANCH for inspection"
  restore
  exit 1
fi

# ── Push and open the PR ─────────────────────────────────────────────────────
git push -q -u origin "$BRANCH" || { log "FAIL  push failed"; restore; exit 1; }

BODY="/tmp/sweep-report-$TODAY.md"
[ -f "$BODY" ] || echo "Automated sweep. Jobs: $JOBS. (The run produced no report file.)" > "$BODY"
{ echo; echo "---"; echo "Validation: integrity OK · tests OK · build OK"; echo "Jobs run: $JOBS"; } >> "$BODY"

PR_URL="$(gh pr create --base main --head "$BRANCH" \
  --title "Daily sweep $TODAY — $CHANGED file(s) changed" \
  --body-file "$BODY" 2>&1 | tail -1)"

log "ok    $CHANGED file(s) changed ($JOBS) — $PR_URL"
restore
exit 0
