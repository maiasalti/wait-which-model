# Daily automated sweep

**Date:** 2026-08-06
**Status:** draft — awaiting approval

> **Amended 2026-08-13.** The 09:00 slot below was wrong in practice: launchd fired the job
> as the laptop woke, before Wi-Fi had reassociated, so `git fetch` died on DNS and — because
> guard 0 counts a `FAIL` as "already ran today" — nothing retried until the next morning.
> Two sweeps were lost that way. The schedule moved to **10:30 local** and the fetch now
> retries with backoff. Every "09:00" below is the original design, not the live config;
> `protocols/DAILY_SWEEP_PROTOCOL.md` is authoritative.

## Problem

Every data update this site has ever had was triggered by hand. There is no schedule
anywhere — no cron, no GitHub Action, no Vercel job, no launchd agent (verified
2026-08-06). So the data is only as fresh as the last time someone remembered.

The cost of that showed up twice this week: Ling-2.6-1T had been out since April and was
missing entirely, and Qwen3.8 Max sat at `status: unknown` for weeks because nobody had
filled its benchmarks. Both were found only because Maia asked.

## Goal

A daily local run that researches, writes the data, and opens a **pull request** — so the
work happens unattended but nothing reaches the live site unreviewed.

## Non-goals

- Pushing to `main`, or deploying. Every change lands as a PR.
- Running in the cloud. Local only, by decision — it will skip days the Mac is asleep.
- Replacing the manual protocols. This runs the same ones, on a timer.

---

## Cadence

One launchd agent fires daily at **09:00 local**; the script decides what to run from the
day of the week. Paced by how fast each thing actually changes:

**Weekdays only (Mon–Fri).** The run only happens when the laptop is open, and Maia uses
Claude Code minimally at weekends — a Saturday job would mostly be a job that silently
never runs, or one that fires late on Monday and collides with Monday's own sweep.

| Job | Frequency | Why |
|---|---|---|
| Data health check | every weekday | Cheap, and catches silent rot |
| New model + new company scan | every weekday | The one with real upside — a launch is only news for a few days |
| Stats / spec fill | Tue + Thu | Benchmarks trickle in over weeks, not hours |
| Full news sweep | Mon | Covers 19 companies; the most expensive job by far. Monday also picks up anything that shipped over the weekend. |

One heavy day and four light ones.

## Flow

```
09:00  launchd fires  →  scripts/daily-sweep.sh
         │
         ├─ 0. GUARD: already swept today?  → exit silently
         │     (launchd fires missed jobs on wake; without this, a laptop
         │      opened Monday after a closed weekend runs twice)
         ├─ 1. GUARD: working tree dirty?  → abort, log, do nothing
         │     (never clobber work in progress)
         ├─ 2. git fetch; branch auto/sweep-YYYY-MM-DD from origin/main
         ├─ 3. run today's jobs via `claude -p` headless
         ├─ 4. VALIDATE: integrity check + npm test + npm run build
         │     any failure → abort, no PR, log FAIL, leave branch for inspection
         ├─ 5. changes?
         │      yes → commit, push branch, gh pr create
         │      no  → delete branch, log "nothing found", stay silent
         └─ 6. append outcome to logs/daily-sweep.log  (always, including failures)
```

## Safety properties

These are the reason the design is shaped this way, and each is testable:

1. **`main` is never written to.** The script only ever commits on a dated branch and
   pushes that branch. No step pushes `main`. The research step runs with
   `Bash(git push:*)` explicitly disallowed, so even a confused agent cannot push — all
   git operations belong to the script, not to the model.
2. **A dirty working tree aborts the run.** Maia may have uncommitted work; a scheduled
   job must never stash, reset, or commit over it.
3. **A PR is only opened if validation passes.** Integrity check, tests and build must all
   be green. Broken data never becomes a review request.
4. **A quiet day is silent.** No PR, no notification, one log line. The signal only fires
   when there is something to look at.
5. **Failures are loud in the log and invisible everywhere else.** No PR is opened on
   failure, and the branch is left in place so the failure can be inspected.
6. **`status` and reigns stay computed.** The health job runs `frontier-status.js` and
   `frontier-reigns.js` with `--apply`, exactly as a manual pass would.

## What the research jobs must obey

The scheduled run gets no special licence. It executes the existing protocols verbatim:

- `protocols/NEW_MODEL_RELEASE_PROTOCOL.md` — including adding a company (with a
  palette-check-passing colour and a logo) when a model comes from an untracked lab
- `protocols/STATS_FILLER_PROTOCOL.md` and `protocols/MODEL_SPECS_PROTOCOL.md`
- `protocols/NEWS_SCAN_PROTOCOL.md`
- `protocols/FRONTIER_STATUS_PROTOCOL.md`

Which means: **never a figure from memory**, unverifiable cells stay `null` and are logged
to the gap ledgers, and `predecessorId` needs an explicit replacement claim. Unattended
research is exactly where fabrication would be least likely to be noticed, so the PR body
must state plainly what could NOT be verified, not only what was found.

The news-scan protocol normally interviews Maia first for scope. Unattended, it cannot —
so the scheduled variant is fixed to: all tracked companies, the period since the newest
entry in `news.json`, all categories.

## The PR

Title: `Daily sweep — <n> models, <n> stats, <n> news`
Body:

- what was added or changed, per file
- **what could not be verified**, and what was searched
- any status or reign changes, with the before/after
- the validation output (integrity / tests / build)
- which jobs ran today, and which were skipped by cadence

One PR per run. Branch `auto/sweep-YYYY-MM-DD`.

## Files

| File | Purpose |
|---|---|
| `scripts/daily-sweep.sh` | The orchestrator: guards, branching, validation, PR, logging |
| `~/Library/LaunchAgents/com.waitwhichmodel.daily-sweep.plist` | launchd schedule, 09:00 daily |
| `logs/daily-sweep.log` | Append-only run log (gitignored) |
| `protocols/DAILY_SWEEP_PROTOCOL.md` | What each job does, and the cadence table |

`AGENTS.md` gains a row for it, so the automation is documented like every other protocol.

## Risks, stated plainly

- **Asleep = delayed, not skipped.** launchd fires a missed `StartCalendarInterval` job on
  next wake, so a closed lid usually delays rather than skips. The once-per-day guard stops
  a delayed run from doubling up with the scheduled one.
- **Token cost is real** and recurring. The Monday news sweep is the bulk of it. If it
  proves expensive, the cadence table is the dial to turn.
- **Unattended research can still be wrong.** The PR gate is the mitigation, not a fix.
  Reviewing these PRs is a real ongoing task, not a formality — this session found genuine
  agent errors (a fabricated-looking lineage claim, a wrong logo precedent, benchmark
  figures conflicting with the lab's own) that only review caught.
- **Stale branches** accumulate if runs fail repeatedly. The script deletes its branch when
  it finds nothing, but leaves failed ones deliberately.
