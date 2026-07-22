---
description: Quick sweep for frontier-AI-lab news from the past 24 hours only — a lightweight daily companion to the full weekly news-scan protocol.
allowed-tools: WebSearch, WebFetch, Read, Edit, Write, Bash, Grep, Glob
---

Run a narrow news sweep covering **only the past 24 hours** (determine "now" yourself via `date -u`), across all tracked frontier labs (OpenAI, Anthropic, Google DeepMind, Meta, Mistral, xAI, Moonshot AI, DeepSeek, Alibaba/Qwen, Cohere, Amazon, Microsoft, and any others already present in `data/companies.json`).

1. Read `protocols/NEWS_SCAN_PROTOCOL.md` first and follow its category/format/dedup rules exactly (category: release|benchmark|company|research|policy; entry shape `{ id, date, title, summary, category, companies[], modelIds[], sourceName, sourceUrl }`).
2. Scope strictly to items published/announced in the last 24 hours — this is a narrower, faster check than the weekly scan, not a replacement for it. Skip anything older.
3. Cross-check `data/news.json` for existing entries by id/date/title to avoid duplicates.
4. Web-research only — never invent details from memory. If a release is found that isn't yet in `data/models.json`, flag it but don't add the full model entry here (that's the `model-release` agent / weekly routine's job) — just log the news item and mention it needs a model entry.
5. Append new sourced entries to `data/news.json` (never delete existing entries — it's a permanent record).
6. Run the integrity check from `AGENTS.md` after any edit.
7. Report: what was added (or "nothing new in the last 24h"), and any releases spotted that still need a full model-entry pass.
