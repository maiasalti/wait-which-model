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
  "strengths": ["Flags its own uncertainty and asks rather than guessing — far less confident nonsense", "The effort setting genuinely changes token spend, so quick and deep work share one model", "More expressive and varied on creative work than the 4.x releases before it"],
  "weaknesses": ["The extra hedging is friction when you want a confident answer to a low-stakes question", "Can get caught in self-correction loops, re-checking work that was already right"],
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
| `status` | Set by the [Frontier Status Protocol](./FRONTIER_STATUS_PROTOCOL.md) script, not by hand — use `"unknown"` as a placeholder on new entries, then run `node scripts/frontier-status.js --apply` | `"deprecated"` remains manual, for models a lab officially retires; `"unknown"` means "too new/undercovered to judge," not a verdict |
| `tier` | `flagship` (top-of-line), `balanced` (mid cost/capability, e.g. a "Sonnet"/"Medium"-class model), or `fast` (small/cheap/low-latency, e.g. "Haiku"/"Flash"/"Mini"-class) | drives which models it's compared against when computing `status` |
| `modality` | `multimodal` if it accepts images (or more); `text` otherwise | UI capitalizes it |
| `contextWindow` / `maxOutput` | raw token integers, `null` if unpublished | `1000000`, `200000`, `65536` — never strings like "1M" (the UI formats) |
| `pricing` | USD per million tokens, **base API tier**; numbers not strings; `null` if no public API | surcharges (long-context 2x, fast mode) go in `notes` |
| `openWeights` | `true` only if weights are downloadable | license nuances (research-only) go in `notes` or weaknesses |
| `availability` | `general` \| `restricted` \| `self-host` — **can a person actually go and use this today?** `general` = public API, consumer app, or a mainstream host (an OpenRouter/DeepInfra listing counts). `restricted` = preview, waitlist, vetted partners, subscription-only, or an app with no API to build on. `self-host` = weights only, no practical hosted option. Default `general`; justify anything else in `notes` | Never rendered in the UI — it exists so the Which Model Tool stops recommending models a visitor cannot obtain. Not the same as `openWeights`: an open-weights model that any host serves is `general` |
| `knowledgeCutoff` | `"YYYY-MM"`, `null` if unpublished | never guess from behavior |
| `benchmarks` | numbers with the precision the source reports (typically 1 decimal), `null` if unverified; include ALL seven keys explicitly | percentages as `88.6` not `0.886`; Elo as integer |
| `strengths` | 2–4 items | see voice rules below |
| `weaknesses` | 1–3 items | see voice rules below |
| `notes` | one short sentence or `""` — provenance, caveats, conflicts | `"HLE 64.5% is with tools; GPQA/SWE figures are third-party."` |

## Voice rules for strengths / weaknesses / notes

These render as bullet lists in the model drawer, directly under the benchmark bars and the spec grid. **They exist to say what the numbers can't.**

**The rule: no score, price, context length, or leaderboard rank belongs here.** All of that is already on screen a few pixels above, and repeating it wastes the only part of the entry that can describe what the model is actually *like*.

Write about behavior and character — the things a person learns after a week of using it:

| Axis | What to capture |
|---|---|
| Latency & pacing | Slow to first token, streams fast, feels instant, always-on reasoning |
| Verbosity | Writes long even when told not to, terse by default, over-explains |
| Steerability | Literal vs. infers intent, drops multi-part instructions, ignores format rules |
| Long-context behavior | Whether the window is *usable* — recall in the middle, degradation before the limit |
| Agentic stamina | Hours vs. minutes before drift; stops and asks vs. guesses; declares victory early |
| Tool use | Well-formed calls, loops, malformed JSON, recovery after a failed call |
| Failure modes | What it hallucinates, when it hedges, when it over-reaches or refuses |
| Voice | Warm, clinical, blunt, flat creative prose, distinctive style |
| Practicalities | What it takes to actually run (GPUs, quantization, mode selection, licence friction) |

Mechanics:

- **Sentence-case fragments, no ending period** on strengths/weaknesses; `notes` is a full sentence with a period
- Each item is one concrete behavioral claim, specific enough to be falsifiable: *"Cuts long files off mid-function, forcing continuation prompts"*, not *"Sometimes struggles with long output"* and not *"8K max output"*
- Weaknesses are factual observed limitations and reception, not editorializing — and not "scored lower than X"
- An em-dash clause carrying the consequence is the house pattern: *"Keeps working until something stops it — agent loops need explicit stop rules or the cost runs away"*
- No marketing adjectives ("groundbreaking", "revolutionary"); the register is a neutral analyst's logbook
- Compare to the model's own predecessor where it explains the character ("more verbose than K2 did"); avoid rival-vs-rival scoreboarding, which the Compare page already does
- Where a model is too new or too undocumented to characterise, say *that* — "behavior is a moving target, not a fixed release" is a real, useful weakness

Sourcing: these claims need the same web research as the numbers. Hands-on reviews, model cards' limitations sections, prompting guides (they document the quirks you have to work around), and developer reception — never invent a behavioral trait from the benchmark shape.

## Presentation checks (how it will look)

- Directory card shows: logo + company, name, released date, context, $ in/out, and chips for SWE/GPQA/HLE — so those three benchmarks are the most valuable to fill
- Drawer shows every field; `null` renders as "—" and `knowledgeCutoff: null` renders as "unpublished" — acceptable, invented data is not
- Compare charts only plot models whose selected benchmark (and price, for the cost chart) is non-null

## Companion news entry

Every new model gets a `release` news item (see `NEWS_SCAN_PROTOCOL.md` schema). Match existing headlines' style: *"{Company} releases/ships/launches {Model}"* + the one defining fact, e.g. *"Anthropic releases Claude Opus 4.8"*.
