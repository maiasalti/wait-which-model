---
description: Scan the repo for spots where new data (models/companies/benchmarks) could silently go stale or fail to propagate — hardcoded counts, manual allowlists, copy that duplicates derived data.
allowed-tools: Read, Grep, Glob, Bash, Edit
---

You are auditing this repo (Frontier Observatory — data-driven from JSON in `data/`, see `AGENTS.md`) for **stale-data risk**: places where adding/editing an entry in `data/models.json`, `data/companies.json`, or `data/benchmarks.json` would NOT automatically show up correctly everywhere it should.

Check specifically:

1. **Hardcoded copy** — hero/header text, counts, date ranges, or labels (e.g. "N models from M labs", a hardcoded start year) that should instead be computed from `models.length`, `companies.length`, `Math.min(...releaseDate)`, etc. Grep `app/` for numeric literals near words like "models", "labs", "companies", "frontier".
2. **Manual key lists that gate chart/UI behavior** — e.g. `PCT_KEYS` in `components/charts.tsx` (which benchmark keys render as percentages in the head-to-head bar chart). Confirm these are derived from `data/benchmarks.json` metadata (e.g. the `unit` field) rather than a hand-maintained array that needs a second edit whenever a benchmark key is added.
3. **Hardcoded model/company id arrays** — default selections, allowlists, or filters anywhere in `app/` or `components/` that reference specific ids (e.g. `/compare` page's default comparison picks). Flag these even if non-blocking (they don't hide new data, but silently go stale).
4. **`lib/data.ts`, `lib/filter.ts`, `/compare`, `/news`** — reconfirm these read dynamically from the JSON files with no allowlist (per `AGENTS.md`'s claim). If anything has drifted from that, flag it as a regression.
5. **`lib/logos.ts` (`LOGO_PATHS`)** — new companies without a logo entry degrade gracefully to a color dot; note as cosmetic only, not a hard failure.
6. Anything else in `components/` (Nav, ModelCard, ModelDrawer, FilterRail, FrontierSparkline) that could reference stale ids, counts, or date ranges instead of recomputing from current data.

For each finding, report: file:line, a snippet, whether it's a **hard failure** (new data hidden/broken), **soft staleness** (copy/defaults drift but nothing breaks), or **cosmetic**, and the concrete fix.

If asked to fix (or if the fix is small/obvious and low-risk), make the edit directly, then run the integrity check + `npm run build` from `AGENTS.md` to confirm nothing broke. Otherwise just report findings — don't redesign components or touch data files.
