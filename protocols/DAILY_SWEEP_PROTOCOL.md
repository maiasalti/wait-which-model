# Daily Sweep Protocol

**Trigger:** launchd, weekdays at 10:30 local (`com.waitwhichmodel.daily-sweep`).
**Runner:** `scripts/daily-sweep.sh`.
**Design:** `docs/superpowers/specs/2026-08-06-daily-sweep-design.md`.

An unattended run of the existing protocols that opens a **pull request**. It never writes
to `main` and never deploys.

Merging a sweep PR that adds models is what triggers the subscriber email (see
`AGENTS.md` → Notifications), so a wrong model merged is a wrong email sent — review the
PR's `models.json` additions before merging.

## Cadence

Weekdays only. The laptop is shut at weekends, so a Saturday job would either never run or
fire late on Monday and collide with Monday's own sweep.

| Day | Jobs |
|---|---|
| Mon | health · models · **news** |
| Tue | health · models · **stats** |
| Wed | health · models |
| Thu | health · models · **stats** |
| Fri | health · models |

## The jobs

| Job | Does | Protocol |
|---|---|---|
| `health` | Integrity check, then `frontier-status.js --apply` and `frontier-reigns.js --apply`. Flags anything inconsistent or unsourced. | `FRONTIER_STATUS_PROTOCOL.md` |
| `models` | Finds frontier models released since the newest `releaseDate` and not yet tracked. Adds the company too if the lab is untracked — colour must pass `palette-check.js`, logo per `lib/logos.ts` conventions. | `NEW_MODEL_RELEASE_PROTOCOL.md` |
| `stats` | Fills null cells, skipping anything already in the gap ledgers. | `STATS_FILLER_PROTOCOL.md`, `MODEL_SPECS_PROTOCOL.md` |
| `news` | All tracked companies, all categories, since the newest date in `news.json`. | `NEWS_SCAN_PROTOCOL.md` |

The news-scan protocol normally interviews Maia for scope. It cannot at 09:00, so the
scheduled scope is fixed as above.

## Guards

The run stops, quietly and without changing anything, when:

1. **It already ran today.** launchd fires missed jobs on wake; this stops a doubled run.
   Note the sharp edge: "ran" means *any* dated line in the log, including a `FAIL`, so a
   failed morning blocks every further attempt that day.
2. **It is a weekend.**
3. **The working tree is dirty.** Maia may have work in progress. A scheduled job must
   never stash, reset, or commit over it. This is the guard most worth preserving.

## Waiting for the network

`git fetch` is retried up to `FETCH_ATTEMPTS` (5) times with doubling backoff — 15s, 30s,
60s, 120s, about four minutes in total — before the run gives up with
`FAIL git fetch failed — no network after N attempts`. The job can fire while the laptop is
still waking, and a single attempt dies on `Could not resolve host: github.com`; combined
with guard 1 above, that failure used to cost the whole day. The retry is why the schedule
can sit at 10:30 rather than needing to be late enough to be safe.

## What it may and may not do

- It commits **only** on `auto/sweep-YYYY-MM-DD`, branched from `origin/main`.
- The research step runs with `git push`, `git commit` and `git checkout` **disallowed** —
  all git belongs to the script, not the model.
- A PR opens **only** if the integrity check, `npm test` and `npm run build` all pass.
- Found nothing → branch deleted, one log line, no PR.
- Failed → no PR, `FAIL` in the log, and the work sits **committed** on
  `auto/sweep-YYYY-MM-DD` for inspection. The commit happens before validation
  precisely so a failure cannot leave uncommitted edits on `main` — which would
  trip guard 3 and stall every later run.

## Rules the research inherits

No special licence because it is unattended — if anything, the opposite. Unattended
research is where a fabricated figure is least likely to be caught, so:

- **Never a figure from memory.** Unverifiable cells stay `null` and go to
  `data/stats-gaps.md` or `data/spec-gaps.md`.
- **`predecessorId` needs an explicit replacement claim** in a primary source. Naming order
  is not evidence.
- **`status` is computed**, never hand-assigned.
- The PR body must state **what could not be verified**, not only what was found.

## Operating it

```bash
scripts/daily-sweep.sh --dry-run     # show today's jobs, touch nothing
tail -20 logs/daily-sweep.log        # what has been happening
launchctl list | grep waitwhichmodel # is it loaded?

# stop / start
launchctl unload ~/Library/LaunchAgents/com.waitwhichmodel.daily-sweep.plist
launchctl load   ~/Library/LaunchAgents/com.waitwhichmodel.daily-sweep.plist
```

Log lines look like:

```
2026-08-07 10:30  ok    nothing found (health models)
2026-08-10 10:30  ok    4 file(s) changed (health models news) — https://github.com/.../pull/14
2026-08-11 10:30  SKIP  working tree dirty — refusing to touch a repo with uncommitted work
2026-08-12 10:30  FAIL  validation failed: tests — no PR opened; branch auto/sweep-2026-08-12 left
2026-08-13 10:34  FAIL  git fetch failed — no network after 5 attempts over 225s
```

## Reviewing the PRs

This is a real task, not a formality. The PR gate is the only thing between unattended
research and the live site. Read the "could not verify" section as carefully as the
findings — and check any non-null figure has a source cited.
