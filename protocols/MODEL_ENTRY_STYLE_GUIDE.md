# Model Entry Style Guide

How every record in `data/models.json` is written, so new models added by the release protocol are indistinguishable in style from existing ones. The UI renders these values verbatim — consistency here IS consistency on the page.

## Canonical example

```json
{
  "id": "claude-opus-4-8",
  "name": "Claude Opus 4.8",
  "company": "anthropic",
  "releaseDate": "2026-05-28",
  "status": "frontier",
  "tier": "flagship",
  "modality": "multimodal",
  "contextWindow": 1000000,
  "maxOutput": 128000,
  "pricing": { "inputPerMTok": 5, "outputPerMTok": 25 },
  "openWeights": false,
  "knowledgeCutoff": "2026-01",
  "benchmarks": {
    "mmluPro": null,
    "gpqaDiamond": 93.6,
    "sweBench": 88.6,
    "aime": null,
    "hle": 49.8,
    "lmarenaElo": 1510,
    "arcAgi2": null
  },
  "strengths": ["#1 on LMArena overall and coding at release", "Huge math gains (USAMO 69.3% → 96.7%)", "Proactively flags uncertainty about its own work"],
  "weaknesses": ["GPQA slightly below Opus 4.7 and Gemini 3.1 Pro", "Reviewed as a modest step, not a leap"],
  "notes": "HLE 49.8% no tools / 57.9% with tools."
}
```

## Field-by-field rules

| Field | Format | Examples / notes |
|---|---|---|
| `id` | kebab-case of the name; dots become dashes | `gpt-5-5`, `claude-opus-4-8`, `qwen3-7-max` |
| `name` | The lab's exact marketing name, original capitalization, no company prefix unless part of the name | `GPT-5.5`, `Claude Fable 5`, `DeepSeek-V4`, `o3` (lowercase is correct) |
| `company` | An `id` from `companies.json` | `anthropic`, `google` (not "Google DeepMind") |
| `releaseDate` | `YYYY-MM-DD`, the **announcement** date | preview date if that's when it became usable (see Gemini 3.1 Pro) |
| `status` | Set by the [Frontier Status Protocol](./FRONTIER_STATUS_PROTOCOL.md) script, not by hand — use `"superseded"` as a placeholder on new entries, then run `node scripts/frontier-status.js --apply` | `"deprecated"` remains manual, for models a lab officially retires |
| `tier` | `flagship` (top-of-line), `balanced` (mid cost/capability, e.g. a "Sonnet"/"Medium"-class model), or `fast` (small/cheap/low-latency, e.g. "Haiku"/"Flash"/"Mini"-class) | drives which models it's compared against when computing `status` |
| `modality` | `multimodal` if it accepts images (or more); `text` otherwise | UI capitalizes it |
| `contextWindow` / `maxOutput` | raw token integers, `null` if unpublished | `1000000`, `200000`, `65536` — never strings like "1M" (the UI formats) |
| `pricing` | USD per million tokens, **base API tier**; numbers not strings; `null` if no public API | surcharges (long-context 2x, fast mode) go in `notes` |
| `openWeights` | `true` only if weights are downloadable | license nuances (research-only) go in `notes` or weaknesses |
| `knowledgeCutoff` | `"YYYY-MM"`, `null` if unpublished | never guess from behavior |
| `benchmarks` | numbers with the precision the source reports (typically 1 decimal), `null` if unverified; include ALL seven keys explicitly | percentages as `88.6` not `0.886`; Elo as integer |
| `strengths` | 2–4 items | see voice rules below |
| `weaknesses` | 1–3 items | see voice rules below |
| `notes` | one short sentence or `""` — provenance, caveats, conflicts | `"HLE 64.5% is with tools; GPQA/SWE figures are third-party."` |

## Voice rules for strengths / weaknesses / notes

These render as bullet lists in the model drawer; matching tone matters.

- **Sentence-case fragments, no ending period** on strengths/weaknesses; `notes` is a full sentence with a period
- Each item is one concrete, specific claim — lead with the fact, keep numbers in: *"First model past 80% on SWE-bench Verified"*, not *"Very good at coding"*
- Strengths state what it did **at launch** relative to its era; superlatives must be anchored ("at release", "at launch", "of 2024")
- Weaknesses are factual reception/limitations, not editorializing: pricing position, missing modes, launch controversies, delayed variants
- Parenthesize supporting detail: *"Huge math gains (USAMO 69.3% → 96.7%)"*
- No marketing adjectives ("groundbreaking", "revolutionary"); the register is a neutral analyst's logbook
- Refer to rival models by name where useful — cross-references are welcome

## Presentation checks (how it will look)

- Directory card shows: logo + company, name, released date, context, $ in/out, and chips for SWE/GPQA/HLE — so those three benchmarks are the most valuable to fill
- Drawer shows every field; `null` renders as "—" and `knowledgeCutoff: null` renders as "unpublished" — acceptable, invented data is not
- Compare charts only plot models whose selected benchmark (and price, for the cost chart) is non-null

## Companion news entry

Every new model gets a `release` news item (see `NEWS_SCAN_PROTOCOL.md` schema). Match existing headlines' style: *"{Company} releases/ships/launches {Model}"* + the one defining fact, e.g. *"Anthropic releases Claude Opus 4.8"*.
