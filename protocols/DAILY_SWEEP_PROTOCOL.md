# Daily Sweep Protocol

**Trigger:** launchd, weekdays at 09:00 local (`com.waitwhichmodel.daily-sweep`).
**Runner:** `scripts/daily-sweep.sh`.
**Design:** `docs/superpowers/specs/2026-08-06-daily-sweep-design.md`.

An unattended run of the existing protocols that opens a **pull request**. It never writes
to `main` and never deploys.

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
2. **It is a weekend.**
3. **The working tree is dirty.** Maia may have work in progress. A scheduled job must
   never stash, reset, or commit over it. This is the guard most worth preserving.

## What it may and may not do

- It commits **only** on `auto/sweep-YYYY-MM-DD`, branched from `origin/main`.
- The research step runs with `git push`, `git commit` and `git checkout` **disallowed** —
  all git belongs to the script, not the model.
- A PR opens **only** if the integrity check, `npm test` and `npm run build` all pass.
- Found nothing → branch deleted, one log line, no PR.
- Failed → no PR, branch left in place for inspection, `FAIL` in the log.

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
2026-08-07 09:00  ok    nothing found (health models)
2026-08-10 09:00  ok    4 file(s) changed (health models news) — https://github.com/.../pull/14
2026-08-11 09:00  SKIP  working tree dirty — refusing to touch a repo with uncommitted work
2026-08-12 09:00  FAIL  validation failed: tests — no PR opened; branch auto/sweep-2026-08-12 left
```

## Reviewing the PRs

This is a real task, not a formality. The PR gate is the only thing between unattended
research and the live site. Read the "could not verify" section as carefully as the
findings — and check any non-null figure has a source cited.
