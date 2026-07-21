# News Scan Protocol

**Trigger:** Maia says "execute news scan protocol" / "news sweep" (optionally with scope, e.g. "…for the last month" or "…Anthropic only").

**Goal:** refresh the News tab with *all* recent frontier-AI news — not just model releases. A company update with no model attached (funding round, leadership change, lawsuit, policy action, research result) absolutely belongs here.

## Steps

### 0. Interview Maia first (before any searching)

Unless her trigger message already answered these, ask via AskUserQuestion — one round, then proceed:

1. **Companies** — all tracked companies, or a subset (multi-select from `data/companies.json`, plus "new/untracked labs too")
2. **Time period** — since the newest entry in `data/news.json` (state that date in the option), last month, last 3 months, or a custom range
3. **Categories** — all, or a subset of release / benchmark / company / research / policy
4. **Depth** — quick pass (headlines from the majors, ~5–8 searches) or thorough sweep (every angle in step 2, 10–15+ searches)

The interview happens in the main conversation. If the scan itself runs via the `news-scan` agent, pass the answers into the agent prompt — the agent cannot ask Maia anything itself. If Maia skips a question, use the defaults: all companies, since-last-entry, all categories, thorough.

### 1. Establish the scan window

From the interview (default: newest `date` in `data/news.json` to today).

### 2. Sweep the news (web, multi-angle)

Run searches across **all** of these angles, not just one:

- **Per company**: one search per company in `data/companies.json` (e.g. "Anthropic news June 2026") — plus a general "new AI lab frontier model" search to catch entrants
- **Releases & model updates**: new models, version bumps, price changes, context/capability upgrades
- **Benchmarks**: new leaderboard leaders, new benchmark suites, saturation announcements
- **Company news**: funding, valuations, IPOs, leadership, partnerships, lawsuits, incidents/outages, safety controversies
- **Research**: notable papers, scientific results achieved with frontier models
- **Policy**: US/EU/China regulation, export controls, executive orders, court rulings touching frontier labs

Prefer primary sources (official blogs, government sites) and reputable outlets. 8–15 searches is typical for a 1–2 month window.

### 3. Curate

Keep items that materially concern frontier models or their labs; drop product-only fluff. For each keeper, write an entry per the schema in `CLAUDE.md`:

- `id`: `YYYY-MM-DD-<short-slug>`; `date`: event date (not article date)
- `category`: one of `release | benchmark | company | research | policy`
- `companies`: ids from `companies.json` where tracked; plain readable names otherwise (the UI renders unknown ids as-is)
- `modelIds`: link any tracked models so drawer cross-links work
- Neutral, specific summaries with the load-bearing numbers; cite the best single source
- **Dedupe rigorously**: before adding an entry, check `data/news.json` for the same event — match on (date ± a few days) + companies + what happened, not just exact title. Same event = update the existing entry (better source, corrected date) rather than adding a second one. Two different events on the same day for the same company are fine

### 4. Cascade

- A **release** discovered here that isn't in `data/models.json` → tell Maia and run the [new model release protocol](./NEW_MODEL_RELEASE_PROTOCOL.md) for it
- News that changes existing model facts (price cut, deprecation, context bump) → update `data/models.json` in the same pass and mention it

### 5. Validate & verify

Run the integrity check + build from step 5 of the release protocol, then `npm run dev` and confirm the News tab renders the new entries under the right month with working source links and category/company filters.

### 6. Report

Summarize: how many entries added per category, notable stories, any model-data updates made, any releases handed off to the release protocol.

## Notes

- Prefer running this via the `news-scan` agent (`.claude/agents/news-scan.md`).
- News entries are permanent record — never delete old entries during a scan; only correct factual errors.
