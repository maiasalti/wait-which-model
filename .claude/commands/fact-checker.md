---
description: Fact-check a specific model's entry in data/models.json against current web sources — verifies every stat and flags discrepancies or unverifiable fields.
argument-hint: <model name or id>
allowed-tools: Read, WebSearch, WebFetch, Grep, Edit, Bash
---

Fact-check the model entry for **$ARGUMENTS** in `data/models.json` against authoritative current sources (official model/lab pages, official docs/pricing pages, official benchmark reports — not aggregator blogs unless nothing else exists).

Steps:

1. Find the model's entry in `data/models.json` (match by id or name). If no such model exists, say so and stop — do not create one (that's the `model-release` agent's job).
2. For every field — `releaseDate`, `status`, `modality`, `contextWindow`, `maxOutput`, `pricing.inputPerMTok`, `pricing.outputPerMTok`, `openWeights`, `knowledgeCutoff`, and each `benchmarks.*` score (`mmluPro`, `gpqaDiamond`, `sweBench`, `aime`, `hle`, `lmarenaElo`, `arcAgi2`) — web-research the current authoritative value.
3. Compare against what's currently in the JSON. Classify each field as:
   - **Match** — current source confirms the stored value.
   - **Stale/wrong** — source shows a different value (e.g. price changed, benchmark re-scored, model superseded/deprecated since).
   - **Unverifiable** — no credible source found; if the field is currently non-null, flag it as unsourced rather than silently trusting it.
   - **Correctly null** — genuinely unpublished, no action needed.
4. Follow `protocols/MODEL_ENTRY_STYLE_GUIDE.md` for formatting/tone conventions (`strengths`/`weaknesses`/`notes`) if those need updating too.
5. Do NOT edit `data/models.json` yourself unless the user explicitly confirms after seeing your report — this file is a permanent public record, so present findings first.
6. If asked to apply fixes: make the edits, log any newly-unverifiable cells to `data/stats-gaps.md`, run the integrity check + `npm run build` from `AGENTS.md`, and confirm both pass.

Report format: a table of field → stored value → researched value → verdict → source URL, followed by a one-line summary of what (if anything) needs to change.
