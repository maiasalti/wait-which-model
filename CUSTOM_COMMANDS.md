# Custom slash commands

Project-specific commands in `.claude/commands/`, invoked as `/<name>` in Claude Code.

| Command | Purpose | Notes |
|---|---|---|
| `/stale-data-scanner` | Audits the repo for places new data (models/companies/benchmarks) could silently fail to propagate — hardcoded counts/copy, manual key lists (e.g. chart `PCT_KEYS`), hardcoded id allowlists. Reports findings; fixes small/obvious ones if asked. | Also run periodically by the weekly cloud routine ("Weekly frontier model scan + PR"). |
| `/fact-checker <model name or id>` | Re-verifies every stat on one existing model entry in `data/models.json` against current web sources; reports match/stale/unverifiable per field. Does not edit without confirmation. | Use when a launch-time number looks dated, disputed, or you want a spot-check. |
| `/news-scan-24h` | Lightweight daily companion to the full weekly news scan — sweeps only the last 24 hours across tracked labs and appends sourced entries to `data/news.json`. | Full weekly sweep is still `protocols/NEWS_SCAN_PROTOCOL.md` via the `news-scan` agent. |

See also the existing protocol-driven agents (triggered by phrase, not slash command) documented in `AGENTS.md`: `model-release`, `news-scan`, `stats-filler`.
